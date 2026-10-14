package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FlightStatus string

const (
	FlightScheduled FlightStatus = "SCHEDULED"
	FlightDelayed   FlightStatus = "DELAYED"
	FlightDeparted  FlightStatus = "DEPARTED"
	FlightCancelled FlightStatus = "CANCELLED"
)

type Flight struct {
	ID                 uuid.UUID    `gorm:"type:uuid;primaryKey" json:"id"`
	FlightNumber       string       `gorm:"type:varchar(20);not null;index" json:"flight_number"` // e.g. GA-123
	AirlineID          uuid.UUID    `gorm:"type:uuid;not null;index" json:"airline_id"`
	Airline            Airline      `gorm:"foreignKey:AirlineID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"airline,omitempty"`
	AirplaneID         uuid.UUID    `gorm:"type:uuid;not null;index" json:"airplane_id"`
	Airplane           Airplane     `gorm:"foreignKey:AirplaneID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"airplane,omitempty"`
	DepartureAirportID string       `gorm:"type:varchar(3);not null;index" json:"departure_airport_id"`
	DepartureAirport   Airport      `gorm:"foreignKey:DepartureAirportID;references:Code" json:"departure_airport,omitempty"`
	ArrivalAirportID   string       `gorm:"type:varchar(3);not null;index" json:"arrival_airport_id"`
	ArrivalAirport     Airport      `gorm:"foreignKey:ArrivalAirportID;references:Code" json:"arrival_airport,omitempty"`
	DepartureTime      time.Time    `gorm:"not null;index" json:"departure_time"`
	ArrivalTime        time.Time    `gorm:"not null" json:"arrival_time"`
	DurationMinutes    int          `gorm:"not null" json:"duration_minutes"`
	BasePrice          float64      `gorm:"type:decimal(12,2);not null" json:"base_price"`
	Status             FlightStatus `gorm:"type:varchar(20);not null;default:'SCHEDULED'" json:"status"`
	CreatedAt          time.Time    `json:"created_at"`
	UpdatedAt          time.Time    `json:"updated_at"`

	Seats []FlightSeat `gorm:"foreignKey:FlightID" json:"seats,omitempty"`
}

func (f *Flight) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}
	return nil
}
