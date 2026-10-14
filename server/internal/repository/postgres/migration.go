package postgres

import (
	"fmt"

	"flybook-server/internal/domain"
	"flybook-server/pkg/logger"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

// AutoMigrate applies schema migrations for all PostgreSQL entities
func AutoMigrate(db *gorm.DB) error {
	logger.Info("🔄 Running PostgreSQL auto-migrations...")

	err := db.AutoMigrate(
		&domain.Airport{},
		&domain.Airline{},
		&domain.Airplane{},
		&domain.Flight{},
		&domain.FlightSeat{},
		&domain.User{},
		&domain.Booking{},
		&domain.Passenger{},
		&domain.Payment{},
	)

	if err != nil {
		return fmt.Errorf("auto-migration failed: %w", err)
	}

	logger.Info("✅ PostgreSQL auto-migrations completed successfully", zap.Int("tables", 9))
	return nil
}
