package domain

import (
	"time"
)

type CabinClass struct {
	Class      SeatClass `bson:"class" json:"class"`
	RowStart   int       `bson:"row_start" json:"row_start"`
	RowEnd     int       `bson:"row_end" json:"row_end"`
	SeatPitch  string    `bson:"seat_pitch" json:"seat_pitch"`   // e.g. "32 inch"
	HasPower   bool      `bson:"has_power" json:"has_power"`
	HasWifi    bool      `bson:"has_wifi" json:"has_wifi"`
}

// AircraftLayout represents a flexible document stored in MongoDB
type AircraftLayout struct {
	LayoutCode     string       `bson:"layout_code" json:"layout_code"`         // e.g. B737-800-STD
	AircraftModel  string       `bson:"aircraft_model" json:"aircraft_model"`   // e.g. Boeing 737-800
	TotalRows      int          `bson:"total_rows" json:"total_rows"`
	Columns        []string     `bson:"columns" json:"columns"`                 // e.g. ["A", "B", "C", "D", "E", "F"]
	AisleIndices   []int        `bson:"aisle_indices" json:"aisle_indices"`     // Index after which an aisle is placed (e.g. [3])
	ExitRows       []int        `bson:"exit_rows" json:"exit_rows"`             // e.g. [14, 15]
	CabinClasses   []CabinClass `bson:"cabin_classes" json:"cabin_classes"`
	CreatedAt      time.Time    `bson:"created_at" json:"created_at"`
}
