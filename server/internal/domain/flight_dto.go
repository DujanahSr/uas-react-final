package domain

import (
	"github.com/google/uuid"
)

// FlightFilter defines search and filter parameters for flights
type FlightFilter struct {
	DepartureAirport string  `form:"departure_airport"`
	ArrivalAirport   string  `form:"arrival_airport"`
	Date             string  `form:"date"` // YYYY-MM-DD
	AirlineID        string  `form:"airline_id"`
	ClassType        string  `form:"class_type"` // ECONOMY, BUSINESS, FIRST
	MaxPrice         float64 `form:"max_price"`
	SortBy           string  `form:"sort_by"` // cheapest, fastest, earliest
}

// LockSeatRequest payload for locking a seat for 15 minutes
type LockSeatRequest struct {
	SeatNumber string    `json:"seat_number" binding:"required"`
	UserID     uuid.UUID `json:"user_id" binding:"required"`
}

// UnlockSeatRequest payload for manually releasing a held seat
type UnlockSeatRequest struct {
	SeatNumber string    `json:"seat_number" binding:"required"`
	UserID     uuid.UUID `json:"user_id" binding:"required"`
}

// SeatDetailWithLock represents a single seat with live locking status
type SeatDetailWithLock struct {
	ID                   uuid.UUID  `json:"id"`
	SeatNumber           string     `json:"seat_number"`
	ClassType            SeatClass  `json:"class_type"`
	PriceMultiplier      float64    `json:"price_multiplier"`
	CalculatedPrice      float64    `json:"calculated_price"`
	Status               SeatStatus `json:"status"` // AVAILABLE, HELD, BOOKED
	IsLocked             bool       `json:"is_locked"`
	HeldByUserID         *uuid.UUID `json:"held_by_user_id,omitempty"`
	HeldExpiresInSeconds int64      `json:"held_expires_in_seconds,omitempty"`
}

// SeatMapResponse combines MongoDB layout and PostgreSQL live seat states
type SeatMapResponse struct {
	FlightID       uuid.UUID            `json:"flight_id"`
	FlightNumber   string               `json:"flight_number"`
	AircraftModel  string               `json:"aircraft_model"`
	Layout         *AircraftLayout      `json:"layout"` // From MongoDB
	AvailableCount int                  `json:"available_count"`
	TotalSeats     int                  `json:"total_seats"`
	Seats          []SeatDetailWithLock `json:"seats"` // From PostgreSQL & Redis
}
