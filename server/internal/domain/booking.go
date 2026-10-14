package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BookingStatus string

const (
	BookingPendingPayment BookingStatus = "PENDING_PAYMENT"
	BookingPaid           BookingStatus = "PAID"
	BookingCancelled      BookingStatus = "CANCELLED"
	BookingExpired        BookingStatus = "EXPIRED"
	BookingRefunded       BookingStatus = "REFUNDED"
)

type Booking struct {
	ID          uuid.UUID     `gorm:"type:uuid;primaryKey" json:"id"`
	BookingCode string        `gorm:"type:varchar(30);uniqueIndex;not null" json:"booking_code"` // e.g. FB-20261014-XXXX
	UserID      uuid.UUID     `gorm:"type:uuid;not null;index" json:"user_id"`
	User        User          `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"user,omitempty"`
	FlightID    uuid.UUID     `gorm:"type:uuid;not null;index" json:"flight_id"`
	Flight      Flight        `gorm:"foreignKey:FlightID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"flight,omitempty"`
	TotalAmount float64       `gorm:"type:decimal(12,2);not null" json:"total_amount"`
	Status      BookingStatus `gorm:"type:varchar(25);not null;default:'PENDING_PAYMENT'" json:"status"`
	ExpiresAt   time.Time     `gorm:"not null" json:"expires_at"` // 15 mins countdown for payment
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`

	Passengers []Passenger `gorm:"foreignKey:BookingID" json:"passengers,omitempty"`
	Payment    *Payment    `gorm:"foreignKey:BookingID" json:"payment,omitempty"`
}

func (b *Booking) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}
