package domain

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SeatClass string

const (
	SeatClassEconomy  SeatClass = "ECONOMY"
	SeatClassBusiness SeatClass = "BUSINESS"
	SeatClassFirst    SeatClass = "FIRST"
)

type SeatStatus string

const (
	SeatStatusAvailable SeatStatus = "AVAILABLE"
	SeatStatusHeld      SeatStatus = "HELD"   // Locked in Redis for 15 mins during checkout
	SeatStatusBooked    SeatStatus = "BOOKED" // Paid and confirmed
)

type FlightSeat struct {
	ID              uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	FlightID        uuid.UUID  `gorm:"type:uuid;not null;index:idx_flight_seat,unique" json:"flight_id"`
	SeatNumber      string     `gorm:"type:varchar(10);not null;index:idx_flight_seat,unique" json:"seat_number"` // e.g. 14A, 14B
	ClassType       SeatClass  `gorm:"type:varchar(20);not null;default:'ECONOMY'" json:"class_type"`
	PriceMultiplier float64    `gorm:"type:decimal(4,2);not null;default:1.00" json:"price_multiplier"`
	Status          SeatStatus `gorm:"type:varchar(20);not null;default:'AVAILABLE'" json:"status"`
}

func (fs *FlightSeat) BeforeCreate(tx *gorm.DB) error {
	if fs.ID == uuid.Nil {
		fs.ID = uuid.New()
	}
	return nil
}
