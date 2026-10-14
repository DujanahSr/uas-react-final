package domain

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Airline struct {
	ID      uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Code    string    `gorm:"type:varchar(5);uniqueIndex;not null" json:"code"` // e.g. GA, QZ, JT
	Name    string    `gorm:"type:varchar(100);not null" json:"name"`
	LogoURL string    `gorm:"type:text" json:"logo_url"`
}

func (a *Airline) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}
