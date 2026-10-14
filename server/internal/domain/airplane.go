package domain

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Airplane struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	AirlineID    uuid.UUID `gorm:"type:uuid;not null;index" json:"airline_id"`
	Airline      Airline   `gorm:"foreignKey:AirlineID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"airline,omitempty"`
	Model        string    `gorm:"type:varchar(100);not null" json:"model"`       // e.g. Boeing 737-800, Airbus A320
	SeatCapacity int       `gorm:"not null" json:"seat_capacity"`                 // e.g. 180
	LayoutCode   string    `gorm:"type:varchar(50);not null" json:"layout_code"`  // Relates to MongoDB AircraftLayout
}

func (ap *Airplane) BeforeCreate(tx *gorm.DB) error {
	if ap.ID == uuid.Nil {
		ap.ID = uuid.New()
	}
	return nil
}
