package domain

import (
	"github.com/google/uuid"
)

type PassengerInput struct {
	SeatNumber    string `json:"seat_number" binding:"required"`
	PassengerName string `json:"passenger_name" binding:"required"`
	IDType        string `json:"id_type" binding:"required"` // KTP / PASSPORT
	IDNumber      string `json:"id_number" binding:"required"`
	DateOfBirth   string `json:"date_of_birth" binding:"required"`
}

type CreateBookingRequest struct {
	FlightID      uuid.UUID        `json:"flight_id" binding:"required"`
	Passengers    []PassengerInput `json:"passengers" binding:"required,min=1"`
	PaymentMethod string           `json:"payment_method" binding:"required"` // QRIS, BCA_VA, CREDIT_CARD
}

type PaymentWebhookRequest struct {
	OrderID           string `json:"order_id" binding:"required"` // booking_code
	TransactionID     string `json:"transaction_id" binding:"required"`
	TransactionStatus string `json:"transaction_status" binding:"required"` // settlement, capture, expire, cancel, deny
	PaymentType       string `json:"payment_type"`
	GrossAmount       string `json:"gross_amount"`
}
