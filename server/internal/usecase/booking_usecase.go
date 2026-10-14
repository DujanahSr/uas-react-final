package usecase

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"flybook-server/internal/domain"
	"flybook-server/internal/repository/postgres"
	"flybook-server/internal/repository/redis"
	"flybook-server/pkg/logger"

	"github.com/google/uuid"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type BookingUsecase interface {
	CreateBooking(ctx context.Context, userID uuid.UUID, req domain.CreateBookingRequest) (*domain.Booking, error)
	GetMyBookings(ctx context.Context, userID uuid.UUID) ([]domain.Booking, error)
	GetBookingDetail(ctx context.Context, bookingID uuid.UUID, userID uuid.UUID, userRole domain.UserRole) (*domain.Booking, error)
	ProcessPaymentWebhook(ctx context.Context, req domain.PaymentWebhookRequest) error
	CancelExpiredBookings(ctx context.Context) (int, error)
}

type bookingUsecase struct {
	bookingRepo  postgres.BookingRepository
	flightRepo   postgres.FlightRepository
	seatLockRepo redis.SeatLockRepository
}

func NewBookingUsecase(
	bookingRepo postgres.BookingRepository,
	flightRepo postgres.FlightRepository,
	seatLockRepo redis.SeatLockRepository,
) BookingUsecase {
	return &bookingUsecase{
		bookingRepo:  bookingRepo,
		flightRepo:   flightRepo,
		seatLockRepo: seatLockRepo,
	}
}

func generateBookingCode() string {
	dateStr := time.Now().Format("20060102")
	const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	b := make([]byte, 5)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return fmt.Sprintf("FB-%s-%s", dateStr, string(b))
}

func (u *bookingUsecase) CreateBooking(ctx context.Context, userID uuid.UUID, req domain.CreateBookingRequest) (*domain.Booking, error) {
	db := u.bookingRepo.GetDB()

	flight, err := u.flightRepo.GetFlightByID(ctx, req.FlightID)
	if err != nil {
		return nil, errors.New("penerbangan tidak ditemukan")
	}

	var createdBooking *domain.Booking

	err = db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		totalAmount := 0.0
		passengers := make([]domain.Passenger, 0, len(req.Passengers))

		bookingID := uuid.New()
		bookingCode := generateBookingCode()

		for _, pInput := range req.Passengers {
			// 1. Pessimistic lock on seat
			seat, err := u.flightRepo.GetSeatForUpdate(ctx, tx, req.FlightID, pInput.SeatNumber)
			if err != nil {
				return fmt.Errorf("kursi %s tidak ditemukan pada penerbangan ini", pInput.SeatNumber)
			}

			if seat.Status == domain.SeatStatusBooked {
				return fmt.Errorf("kursi %s sudah dibooking oleh penumpang lain", pInput.SeatNumber)
			}

			// Verify if locked by this user (or available)
			isLocked, holderID, _, _ := u.seatLockRepo.GetSeatLockInfo(ctx, req.FlightID, pInput.SeatNumber)
			if isLocked && holderID != nil && *holderID != userID {
				return fmt.Errorf("kursi %s sedang dikunci oleh penumpang lain", pInput.SeatNumber)
			}

			// 2. Mark seat as BOOKED
			if err := u.flightRepo.UpdateSeatStatus(ctx, tx, seat.ID, domain.SeatStatusBooked); err != nil {
				return err
			}

			seatPrice := flight.BasePrice * seat.PriceMultiplier
			totalAmount += seatPrice

			ticketCode := fmt.Sprintf("TKT-%s-%s", bookingCode, pInput.SeatNumber)
			passengers = append(passengers, domain.Passenger{
				ID:             uuid.New(),
				BookingID:      bookingID,
				FlightSeatID:   seat.ID,
				PassengerName:  pInput.PassengerName,
				IDType:         pInput.IDType,
				IDNumber:       pInput.IDNumber,
				DateOfBirth:    pInput.DateOfBirth,
				TicketCode:     ticketCode,
				QRCodeHash:     fmt.Sprintf("QR-%s", ticketCode),
				BoardingStatus: "NOT_BOARDED",
			})

			// Release Redis temporary lock as seat is now formally recorded in DB transaction
			_, _ = u.seatLockRepo.ReleaseSeatLock(ctx, req.FlightID, pInput.SeatNumber, userID)
		}

		expiresAt := time.Now().Add(15 * time.Minute)

		booking := &domain.Booking{
			ID:          bookingID,
			BookingCode: bookingCode,
			UserID:      userID,
			FlightID:    req.FlightID,
			TotalAmount: totalAmount,
			Status:      domain.BookingPendingPayment,
			ExpiresAt:   expiresAt,
			Passengers:  passengers,
		}

		if err := u.bookingRepo.CreateBookingWithTx(ctx, tx, booking); err != nil {
			return err
		}

		createdBooking = booking
		return nil
	})

	if err != nil {
		return nil, err
	}

	logger.Info("🎟️ New Booking created successfully",
		zap.String("booking_code", createdBooking.BookingCode),
		zap.Float64("total", createdBooking.TotalAmount),
		zap.String("user_id", userID.String()),
	)

	return createdBooking, nil
}

func (u *bookingUsecase) GetMyBookings(ctx context.Context, userID uuid.UUID) ([]domain.Booking, error) {
	return u.bookingRepo.GetBookingsByUserID(ctx, userID)
}

func (u *bookingUsecase) GetBookingDetail(ctx context.Context, bookingID uuid.UUID, userID uuid.UUID, userRole domain.UserRole) (*domain.Booking, error) {
	booking, err := u.bookingRepo.GetBookingByID(ctx, bookingID)
	if err != nil {
		return nil, errors.New("pesanan tidak ditemukan")
	}

	// Customer can only view their own bookings; Staff/Admin can view any
	if userRole == domain.RoleCustomer && booking.UserID != userID {
		return nil, errors.New("akses ditolak, Anda tidak berhak melihat pesanan ini")
	}

	return booking, nil
}

func (u *bookingUsecase) ProcessPaymentWebhook(ctx context.Context, req domain.PaymentWebhookRequest) error {
	booking, err := u.bookingRepo.GetBookingByCode(ctx, req.OrderID)
	if err != nil {
		return fmt.Errorf("pesanan dengan kode %s tidak ditemukan", req.OrderID)
	}

	if booking.Status == domain.BookingPaid {
		logger.Info("Payment webhook already processed previously (Idempotent)", zap.String("order_id", req.OrderID))
		return nil
	}

	statusLower := strings.ToLower(req.TransactionStatus)
	now := time.Now()

	amount, _ := strconv.ParseFloat(req.GrossAmount, 64)
	if amount == 0 {
		amount = booking.TotalAmount
	}

	if statusLower == "settlement" || statusLower == "capture" {
		// Update booking status to PAID
		if err := u.bookingRepo.UpdateBookingStatus(ctx, booking.ID, domain.BookingPaid); err != nil {
			return err
		}

		payment := &domain.Payment{
			ID:            uuid.New(),
			BookingID:     booking.ID,
			PaymentMethod: req.PaymentType,
			TransactionID: req.TransactionID,
			GrossAmount:   amount,
			PaymentStatus: "SETTLEMENT",
			PaidAt:        &now,
		}
		_ = u.bookingRepo.CreatePaymentRecord(ctx, payment)

		logger.Info("💰 Payment settled successfully via Webhook",
			zap.String("order_id", req.OrderID),
			zap.String("transaction_id", req.TransactionID),
		)
	} else if statusLower == "expire" || statusLower == "cancel" {
		_ = u.bookingRepo.UpdateBookingStatus(ctx, booking.ID, domain.BookingCancelled)
		// Release seats back
		for _, p := range booking.Passengers {
			_ = u.flightRepo.UpdateSeatStatus(ctx, nil, p.FlightSeatID, domain.SeatStatusAvailable)
		}
	}

	return nil
}

// CancelExpiredBookings cancels bookings that passed 15 mins without payment
func (u *bookingUsecase) CancelExpiredBookings(ctx context.Context) (int, error) {
	now := time.Now()
	expiredBookings, err := u.bookingRepo.GetExpiredBookings(ctx, now)
	if err != nil {
		return 0, err
	}

	cancelledCount := 0
	for _, b := range expiredBookings {
		if err := u.bookingRepo.UpdateBookingStatus(ctx, b.ID, domain.BookingExpired); err == nil {
			for _, p := range b.Passengers {
				_ = u.flightRepo.UpdateSeatStatus(ctx, nil, p.FlightSeatID, domain.SeatStatusAvailable)
			}
			cancelledCount++
		}
	}

	if cancelledCount > 0 {
		logger.Info("⏱️ Expired bookings auto-cancelled by cleaner worker", zap.Int("count", cancelledCount))
	}

	return cancelledCount, nil
}
