package postgres

import (
	"context"
	"time"

	"flybook-server/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type FlightRepository interface {
	SearchFlights(ctx context.Context, filter domain.FlightFilter) ([]domain.Flight, error)
	GetFlightByID(ctx context.Context, id uuid.UUID) (*domain.Flight, error)
	GetSeatsByFlightID(ctx context.Context, flightID uuid.UUID) ([]domain.FlightSeat, error)
	GetSeatByNumber(ctx context.Context, flightID uuid.UUID, seatNumber string) (*domain.FlightSeat, error)
	GetSeatForUpdate(ctx context.Context, tx *gorm.DB, flightID uuid.UUID, seatNumber string) (*domain.FlightSeat, error)
	UpdateSeatStatus(ctx context.Context, tx *gorm.DB, seatID uuid.UUID, status domain.SeatStatus) error
	GetDB() *gorm.DB
}

type flightRepository struct {
	db *gorm.DB
}

func NewFlightRepository(db *gorm.DB) FlightRepository {
	return &flightRepository{db: db}
}

func (r *flightRepository) GetDB() *gorm.DB {
	return r.db
}

func (r *flightRepository) SearchFlights(ctx context.Context, filter domain.FlightFilter) ([]domain.Flight, error) {
	var flights []domain.Flight
	query := r.db.WithContext(ctx).
		Preload("Airline").
		Preload("Airplane").
		Preload("DepartureAirport").
		Preload("ArrivalAirport")

	if filter.DepartureAirport != "" {
		query = query.Where("departure_airport_id = ?", filter.DepartureAirport)
	}

	if filter.ArrivalAirport != "" {
		query = query.Where("arrival_airport_id = ?", filter.ArrivalAirport)
	}

	if filter.AirlineID != "" {
		query = query.Where("airline_id = ?", filter.AirlineID)
	}

	if filter.Date != "" {
		parsedDate, err := time.Parse("2006-01-02", filter.Date)
		if err == nil {
			startOfDay := parsedDate.Truncate(24 * time.Hour)
			endOfDay := startOfDay.Add(24 * time.Hour)
			query = query.Where("departure_time >= ? AND departure_time < ?", startOfDay, endOfDay)
		}
	}

	if filter.MaxPrice > 0 {
		query = query.Where("base_price <= ?", filter.MaxPrice)
	}

	// Sorting
	switch filter.SortBy {
	case "cheapest":
		query = query.Order("base_price ASC")
	case "fastest":
		query = query.Order("duration_minutes ASC")
	case "earliest":
		query = query.Order("departure_time ASC")
	default:
		query = query.Order("departure_time ASC")
	}

	if err := query.Find(&flights).Error; err != nil {
		return nil, err
	}

	return flights, nil
}

func (r *flightRepository) GetFlightByID(ctx context.Context, id uuid.UUID) (*domain.Flight, error) {
	var flight domain.Flight
	err := r.db.WithContext(ctx).
		Preload("Airline").
		Preload("Airplane").
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		First(&flight, "id = ?", id).Error

	if err != nil {
		return nil, err
	}
	return &flight, nil
}

func (r *flightRepository) GetSeatsByFlightID(ctx context.Context, flightID uuid.UUID) ([]domain.FlightSeat, error) {
	var seats []domain.FlightSeat
	err := r.db.WithContext(ctx).
		Where("flight_id = ?", flightID).
		Order("seat_number ASC").
		Find(&seats).Error

	if err != nil {
		return nil, err
	}
	return seats, nil
}

func (r *flightRepository) GetSeatByNumber(ctx context.Context, flightID uuid.UUID, seatNumber string) (*domain.FlightSeat, error) {
	var seat domain.FlightSeat
	err := r.db.WithContext(ctx).
		Where("flight_id = ? AND seat_number = ?", flightID, seatNumber).
		First(&seat).Error

	if err != nil {
		return nil, err
	}
	return &seat, nil
}

// GetSeatForUpdate acquires a pessimistic row-lock (SELECT ... FOR UPDATE) on the seat
func (r *flightRepository) GetSeatForUpdate(ctx context.Context, tx *gorm.DB, flightID uuid.UUID, seatNumber string) (*domain.FlightSeat, error) {
	var seat domain.FlightSeat
	err := tx.WithContext(ctx).
		Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("flight_id = ? AND seat_number = ?", flightID, seatNumber).
		First(&seat).Error

	if err != nil {
		return nil, err
	}
	return &seat, nil
}

func (r *flightRepository) UpdateSeatStatus(ctx context.Context, tx *gorm.DB, seatID uuid.UUID, status domain.SeatStatus) error {
	runner := r.db
	if tx != nil {
		runner = tx
	}

	return runner.WithContext(ctx).
		Model(&domain.FlightSeat{}).
		Where("id = ?", seatID).
		Update("status", status).Error
}
