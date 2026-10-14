package domain

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Passenger struct {
	ID             uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	BookingID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"booking_id"`
	FlightSeatID   uuid.UUID  `gorm:"type:uuid;not null;index" json:"flight_seat_id"`
	FlightSeat     FlightSeat `gorm:"foreignKey:FlightSeatID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"flight_seat,omitempty"`
	PassengerName  string     `gorm:"type:varchar(100);not null" json:"passenger_name"`
	IDType         string     `gorm:"type:varchar(20);not null" json:"id_type"` // KTP / PASSPORT
	IDNumber       string     `gorm:"type:varchar(50);not null" json:"id_number"`
	DateOfBirth    string     `gorm:"type:varchar(20);not null" json:"date_of_birth"`
	TicketCode     string     `gorm:"type:varchar(50);uniqueIndex;not null" json:"ticket_code"`
	QRCodeHash     string     `gorm:"type:text" json:"qr_code_hash"`
	BoardingStatus string     `gorm:"type:varchar(20);not null;default:'NOT_BOARDED'" json:"boarding_status"` // NOT_BOARDED, BOARDED
}

func (p *Passenger) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}
