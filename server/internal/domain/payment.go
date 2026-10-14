package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Payment struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	BookingID     uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"booking_id"`
	PaymentMethod string    `gorm:"type:varchar(50);not null" json:"payment_method"` // e.g. QRIS, BCA_VA, CREDIT_CARD
	TransactionID string    `gorm:"type:varchar(100);index" json:"transaction_id"`   // Midtrans transaction ID
	GrossAmount   float64   `gorm:"type:decimal(12,2);not null" json:"gross_amount"`
	PaymentStatus string    `gorm:"type:varchar(30);not null;default:'PENDING'" json:"payment_status"` // PENDING, SETTLEMENT, EXPIRE, DENY
	PaidAt        *time.Time `json:"paid_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

func (p *Payment) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}
