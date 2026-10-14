package postgres

import (
	"context"
	"time"

	"flybook-server/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BookingRepository interface {
	CreateBookingWithTx(ctx context.Context, tx *gorm.DB, booking *domain.Booking) error
	GetBookingByID(ctx context.Context, id uuid.UUID) (*domain.Booking, error)
	GetBookingByCode(ctx context.Context, code string) (*domain.Booking, error)
	GetBookingsByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Booking, error)
	UpdateBookingStatus(ctx context.Context, bookingID uuid.UUID, status domain.BookingStatus) error
	CreatePaymentRecord(ctx context.Context, payment *domain.Payment) error
	GetExpiredBookings(ctx context.Context, now time.Time) ([]domain.Booking, error)
	GetDB() *gorm.DB
}

type bookingRepository struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) BookingRepository {
	return &bookingRepository{db: db}
}

func (r *bookingRepository) GetDB() *gorm.DB {
	return r.db
}

func (r *bookingRepository) CreateBookingWithTx(ctx context.Context, tx *gorm.DB, booking *domain.Booking) error {
	return tx.WithContext(ctx).Create(booking).Error
}

func (r *bookingRepository) GetBookingByID(ctx context.Context, id uuid.UUID) (*domain.Booking, error) {
	var booking domain.Booking
	err := r.db.WithContext(ctx).
		Preload("Flight").
		Preload("Flight.Airline").
		Preload("Flight.Airplane").
		Preload("Flight.DepartureAirport").
		Preload("Flight.ArrivalAirport").
		Preload("Passengers").
		Preload("Passengers.FlightSeat").
		Preload("Payment").
		First(&booking, "id = ?", id).Error

	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *bookingRepository) GetBookingByCode(ctx context.Context, code string) (*domain.Booking, error) {
	var booking domain.Booking
	err := r.db.WithContext(ctx).
		Preload("Flight").
		Preload("Passengers").
		Preload("Payment").
		First(&booking, "booking_code = ?", code).Error

	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (r *bookingRepository) GetBookingsByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Booking, error) {
	var bookings []domain.Booking
	err := r.db.WithContext(ctx).
		Preload("Flight").
		Preload("Flight.Airline").
		Preload("Flight.DepartureAirport").
		Preload("Flight.ArrivalAirport").
		Preload("Passengers").
		Preload("Passengers.FlightSeat").
		Preload("Payment").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&bookings).Error

	if err != nil {
		return nil, err
	}
	return bookings, nil
}

func (r *bookingRepository) UpdateBookingStatus(ctx context.Context, bookingID uuid.UUID, status domain.BookingStatus) error {
	return r.db.WithContext(ctx).
		Model(&domain.Booking{}).
		Where("id = ?", bookingID).
		Update("status", status).Error
}

func (r *bookingRepository) CreatePaymentRecord(ctx context.Context, payment *domain.Payment) error {
	return r.db.WithContext(ctx).Create(payment).Error
}

func (r *bookingRepository) GetExpiredBookings(ctx context.Context, now time.Time) ([]domain.Booking, error) {
	var bookings []domain.Booking
	err := r.db.WithContext(ctx).
		Preload("Passengers").
		Where("status = ? AND expires_at < ?", domain.BookingPendingPayment, now).
		Find(&bookings).Error

	if err != nil {
		return nil, err
	}
	return bookings, nil
}
