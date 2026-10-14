package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"flybook-server/internal/domain"
	"flybook-server/internal/repository/mongo"
	"flybook-server/internal/repository/postgres"
	"flybook-server/internal/repository/redis"
	"flybook-server/pkg/logger"

	"github.com/google/uuid"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

const SeatLockDuration = 15 * time.Minute

type FlightUsecase interface {
	SearchFlights(ctx context.Context, filter domain.FlightFilter) ([]domain.Flight, error)
	GetFlightByID(ctx context.Context, id uuid.UUID) (*domain.Flight, error)
	GetSeatMap(ctx context.Context, flightID uuid.UUID) (*domain.SeatMapResponse, error)
	LockSeat(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) (*domain.SeatDetailWithLock, error)
	UnlockSeat(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) error
}

type flightUsecase struct {
	flightRepo   postgres.FlightRepository
	layoutRepo   mongo.LayoutRepository
	seatLockRepo redis.SeatLockRepository
}

func NewFlightUsecase(
	flightRepo postgres.FlightRepository,
	layoutRepo mongo.LayoutRepository,
	seatLockRepo redis.SeatLockRepository,
) FlightUsecase {
	return &flightUsecase{
		flightRepo:   flightRepo,
		layoutRepo:   layoutRepo,
		seatLockRepo: seatLockRepo,
	}
}

func (u *flightUsecase) SearchFlights(ctx context.Context, filter domain.FlightFilter) ([]domain.Flight, error) {
	return u.flightRepo.SearchFlights(ctx, filter)
}

func (u *flightUsecase) GetFlightByID(ctx context.Context, id uuid.UUID) (*domain.Flight, error) {
	return u.flightRepo.GetFlightByID(ctx, id)
}

func (u *flightUsecase) GetSeatMap(ctx context.Context, flightID uuid.UUID) (*domain.SeatMapResponse, error) {
	flight, err := u.flightRepo.GetFlightByID(ctx, flightID)
	if err != nil {
		return nil, fmt.Errorf("flight not found: %w", err)
	}

	// 1. Fetch Dynamic Aircraft Layout from MongoDB
	var layout *domain.AircraftLayout
	if flight.Airplane.LayoutCode != "" {
		layout, err = u.layoutRepo.GetLayoutByCode(ctx, flight.Airplane.LayoutCode)
		if err != nil {
			logger.Warn("Failed to fetch layout from MongoDB, using standard layout", zap.Error(err))
		}
	}

	// 2. Fetch Seats from PostgreSQL
	dbSeats, err := u.flightRepo.GetSeatsByFlightID(ctx, flightID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch seats: %w", err)
	}

	// 3. Merge with live Redis distributed locks
	seatDetails := make([]domain.SeatDetailWithLock, 0, len(dbSeats))
	availableCount := 0

	for _, s := range dbSeats {
		isLocked, holderID, ttlSec, err := u.seatLockRepo.GetSeatLockInfo(ctx, flightID, s.SeatNumber)
		if err != nil {
			logger.Warn("Error checking redis lock for seat", zap.String("seat", s.SeatNumber), zap.Error(err))
		}

		effectiveStatus := s.Status
		if isLocked && effectiveStatus != domain.SeatStatusBooked {
			effectiveStatus = domain.SeatStatusHeld
		} else if !isLocked && effectiveStatus == domain.SeatStatusHeld {
			// Lock expired in Redis, automatically consider Available
			effectiveStatus = domain.SeatStatusAvailable
		}

		if effectiveStatus == domain.SeatStatusAvailable {
			availableCount++
		}

		calculatedPrice := flight.BasePrice * s.PriceMultiplier

		seatDetails = append(seatDetails, domain.SeatDetailWithLock{
			ID:                   s.ID,
			SeatNumber:           s.SeatNumber,
			ClassType:            s.ClassType,
			PriceMultiplier:      s.PriceMultiplier,
			CalculatedPrice:      calculatedPrice,
			Status:               effectiveStatus,
			IsLocked:             isLocked,
			HeldByUserID:         holderID,
			HeldExpiresInSeconds: ttlSec,
		})
	}

	modelName := "Standard Aircraft"
	if flight.Airplane.Model != "" {
		modelName = flight.Airplane.Model
	}

	return &domain.SeatMapResponse{
		FlightID:       flight.ID,
		FlightNumber:   flight.FlightNumber,
		AircraftModel:  modelName,
		Layout:         layout,
		AvailableCount: availableCount,
		TotalSeats:     len(dbSeats),
		Seats:          seatDetails,
	}, nil
}

// LockSeat implements double-booking prevention using Pessimistic Row Locking + Redis TTL Lock
func (u *flightUsecase) LockSeat(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) (*domain.SeatDetailWithLock, error) {
	db := u.flightRepo.GetDB()

	var updatedDetail domain.SeatDetailWithLock

	// Start Database Transaction
	err := db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 1. Pessimistic Row-Locking on the seat record
		seat, err := u.flightRepo.GetSeatForUpdate(ctx, tx, flightID, seatNumber)
		if err != nil {
			return fmt.Errorf("seat %s not found on this flight", seatNumber)
		}

		if seat.Status == domain.SeatStatusBooked {
			return errors.New("kursi ini sudah dipesan dan dibayar oleh penumpang lain")
		}

		// 2. Atomically Acquire Redis Distributed Lock (15-Minute TTL)
		acquired, err := u.seatLockRepo.AcquireSeatLock(ctx, flightID, seatNumber, userID, SeatLockDuration)
		if err != nil {
			return fmt.Errorf("gagal mengunci kursi di sistem antrian: %w", err)
		}

		if !acquired {
			// Check if already locked by the same user
			_, holderID, _, _ := u.seatLockRepo.GetSeatLockInfo(ctx, flightID, seatNumber)
			if holderID == nil || *holderID != userID {
				return errors.New("kursi ini sedang dipilih oleh calon penumpang lain, silakan pilih kursi lain")
			}
		}

		// 3. Mark Seat as HELD in PostgreSQL
		if err := u.flightRepo.UpdateSeatStatus(ctx, tx, seat.ID, domain.SeatStatusHeld); err != nil {
			// Rollback Redis lock if DB update fails
			_, _ = u.seatLockRepo.ReleaseSeatLock(ctx, flightID, seatNumber, userID)
			return err
		}

		updatedDetail = domain.SeatDetailWithLock{
			ID:                   seat.ID,
			SeatNumber:           seat.SeatNumber,
			ClassType:            seat.ClassType,
			PriceMultiplier:      seat.PriceMultiplier,
			Status:               domain.SeatStatusHeld,
			IsLocked:             true,
			HeldByUserID:         &userID,
			HeldExpiresInSeconds: int64(SeatLockDuration.Seconds()),
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	logger.Info("🔒 Seat successfully locked for 15 minutes",
		zap.String("flight_id", flightID.String()),
		zap.String("seat", seatNumber),
		zap.String("user_id", userID.String()),
	)

	return &updatedDetail, nil
}

// UnlockSeat manually releases a held seat
func (u *flightUsecase) UnlockSeat(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) error {
	db := u.flightRepo.GetDB()

	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		seat, err := u.flightRepo.GetSeatForUpdate(ctx, tx, flightID, seatNumber)
		if err != nil {
			return fmt.Errorf("kursi %s tidak ditemukan", seatNumber)
		}

		if seat.Status == domain.SeatStatusBooked {
			return errors.New("kursi yang sudah dibayar tidak dapat dilepas lewat endpoint ini")
		}

		// Release Redis Lock
		_, err = u.seatLockRepo.ReleaseSeatLock(ctx, flightID, seatNumber, userID)
		if err != nil {
			logger.Warn("Failed to release Redis lock", zap.Error(err))
		}

		// Update PostgreSQL status back to AVAILABLE
		return u.flightRepo.UpdateSeatStatus(ctx, tx, seat.ID, domain.SeatStatusAvailable)
	})
}
