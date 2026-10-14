package postgres

import (
	"context"
	"fmt"
	"time"

	"flybook-server/internal/domain"
	"flybook-server/pkg/logger"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedInitialData populates PostgreSQL and MongoDB with initial airports, airlines, flights, and demo users
func SeedInitialData(db *gorm.DB, mongoDB *mongo.Database) error {
	var airportCount int64
	db.Model(&domain.Airport{}).Count(&airportCount)
	if airportCount > 0 {
		logger.Info("ℹ️ Initial database already seeded, skipping seeder")
		return nil
	}

	logger.Info("🌱 Seeding initial database data...")

	// 1. Seed Airports
	airports := []domain.Airport{
		{Code: "CGK", Name: "Soekarno-Hatta International Airport", City: "Jakarta", Country: "Indonesia", Timezone: "Asia/Jakarta"},
		{Code: "DPS", Name: "I Gusti Ngurah Rai International Airport", City: "Denpasar (Bali)", Country: "Indonesia", Timezone: "Asia/Makassar"},
		{Code: "SUB", Name: "Juanda International Airport", City: "Surabaya", Country: "Indonesia", Timezone: "Asia/Jakarta"},
		{Code: "KNO", Name: "Kualanamu International Airport", City: "Medan", Country: "Indonesia", Timezone: "Asia/Jakarta"},
		{Code: "JOG", Name: "Yogyakarta International Airport", City: "Yogyakarta", Country: "Indonesia", Timezone: "Asia/Jakarta"},
		{Code: "SIN", Name: "Singapore Changi Airport", City: "Singapore", Country: "Singapore", Timezone: "Asia/Singapore"},
		{Code: "KUL", Name: "Kuala Lumpur International Airport", City: "Kuala Lumpur", Country: "Malaysia", Timezone: "Asia/Kuala_Lumpur"},
	}
	if err := db.Create(&airports).Error; err != nil {
		return fmt.Errorf("failed to seed airports: %w", err)
	}

	// 2. Seed Airlines
	garudaID := uuid.New()
	lionID := uuid.New()
	airasiaID := uuid.New()
	citilinkID := uuid.New()

	airlines := []domain.Airline{
		{ID: garudaID, Code: "GA", Name: "Garuda Indonesia", LogoURL: "https://images.unsplash.com/photo-1540339832862-474599807836?w=100"},
		{ID: lionID, Code: "JT", Name: "Lion Air", LogoURL: "https://images.unsplash.com/photo-1540339832862-474599807836?w=100"},
		{ID: airasiaID, Code: "QZ", Name: "AirAsia", LogoURL: "https://images.unsplash.com/photo-1540339832862-474599807836?w=100"},
		{ID: citilinkID, Code: "QG", Name: "Citilink", LogoURL: "https://images.unsplash.com/photo-1540339832862-474599807836?w=100"},
	}
	if err := db.Create(&airlines).Error; err != nil {
		return fmt.Errorf("failed to seed airlines: %w", err)
	}

	// 3. Seed Airplanes
	planeGA := domain.Airplane{
		ID:           uuid.New(),
		AirlineID:    garudaID,
		Model:        "Boeing 737-800",
		SeatCapacity: 162,
		LayoutCode:   "B737-800-STD",
	}
	planeJT := domain.Airplane{
		ID:           uuid.New(),
		AirlineID:    lionID,
		Model:        "Boeing 737-900ER",
		SeatCapacity: 215,
		LayoutCode:   "B737-900-STD",
	}
	planeQZ := domain.Airplane{
		ID:           uuid.New(),
		AirlineID:    airasiaID,
		Model:        "Airbus A320-200",
		SeatCapacity: 180,
		LayoutCode:   "A320-200-STD",
	}
	planeQG := domain.Airplane{
		ID:           uuid.New(),
		AirlineID:    citilinkID,
		Model:        "Airbus A320neo",
		SeatCapacity: 180,
		LayoutCode:   "A320-200-STD",
	}
	planes := []domain.Airplane{planeGA, planeJT, planeQZ, planeQG}
	if err := db.Create(&planes).Error; err != nil {
		return fmt.Errorf("failed to seed airplanes: %w", err)
	}

	// 4. Seed MongoDB Aircraft Layouts
	layoutCollection := mongoDB.Collection("aircraft_layouts")
	b737Layout := domain.AircraftLayout{
		LayoutCode:    "B737-800-STD",
		AircraftModel: "Boeing 737-800",
		TotalRows:     27,
		Columns:       []string{"A", "B", "C", "D", "E", "F"},
		AisleIndices:  []int{3},
		ExitRows:      []int{14, 15},
		CabinClasses: []domain.CabinClass{
			{Class: domain.SeatClassBusiness, RowStart: 1, RowEnd: 3, SeatPitch: "38 inch", HasPower: true, HasWifi: true},
			{Class: domain.SeatClassEconomy, RowStart: 4, RowEnd: 27, SeatPitch: "31 inch", HasPower: true, HasWifi: false},
		},
		CreatedAt: time.Now(),
	}
	a320Layout := domain.AircraftLayout{
		LayoutCode:    "A320-200-STD",
		AircraftModel: "Airbus A320-200",
		TotalRows:     30,
		Columns:       []string{"A", "B", "C", "D", "E", "F"},
		AisleIndices:  []int{3},
		ExitRows:      []int{12, 13},
		CabinClasses: []domain.CabinClass{
			{Class: domain.SeatClassEconomy, RowStart: 1, RowEnd: 30, SeatPitch: "29 inch", HasPower: false, HasWifi: false},
		},
		CreatedAt: time.Now(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Use ReplaceOne with upsert to prevent duplication
	_, _ = layoutCollection.ReplaceOne(ctx, bson.M{"layout_code": b737Layout.LayoutCode}, b737Layout, nil)
	_, _ = layoutCollection.ReplaceOne(ctx, bson.M{"layout_code": a320Layout.LayoutCode}, a320Layout, nil)
	logger.Info("✅ MongoDB Aircraft Layouts seeded successfully")

	// 5. Seed Users (Matching default accounts from your project README)
	adminPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	userPassword, _ := bcrypt.GenerateFromPassword([]byte("user123"), bcrypt.DefaultCost)

	users := []domain.User{
		{
			ID:           uuid.New(),
			Name:         "Super Administrator",
			Email:        "admin@gmail.com",
			PasswordHash: string(adminPassword),
			Phone:        "081234567890",
			Role:         domain.RoleSuperAdmin,
		},
		{
			ID:           uuid.New(),
			Name:         "Demo Passenger",
			Email:        "user@example.com",
			PasswordHash: string(userPassword),
			Phone:        "081298765432",
			Role:         domain.RoleCustomer,
		},
	}
	if err := db.Create(&users).Error; err != nil {
		return fmt.Errorf("failed to seed users: %w", err)
	}

	// 6. Seed Flights with Real Schedules (Matching React mock flights)
	now := time.Now()
	flights := []domain.Flight{
		{
			ID:                 uuid.New(),
			FlightNumber:       "GA-123",
			AirlineID:          garudaID,
			AirplaneID:         planeGA.ID,
			DepartureAirportID: "CGK",
			ArrivalAirportID:   "DPS",
			DepartureTime:      now.AddDate(0, 0, 1).Truncate(24 * time.Hour).Add(8 * time.Hour), // Tomorrow 08:00
			ArrivalTime:        now.AddDate(0, 0, 1).Truncate(24 * time.Hour).Add(10*time.Hour + 50*time.Minute),
			DurationMinutes:    110,
			BasePrice:          1450000,
			Status:             domain.FlightScheduled,
		},
		{
			ID:                 uuid.New(),
			FlightNumber:       "QG-456",
			AirlineID:          citilinkID,
			AirplaneID:         planeQG.ID,
			DepartureAirportID: "CGK",
			ArrivalAirportID:   "SUB",
			DepartureTime:      now.AddDate(0, 0, 1).Truncate(24 * time.Hour).Add(10 * time.Hour),
			ArrivalTime:        now.AddDate(0, 0, 1).Truncate(24 * time.Hour).Add(11*time.Hour + 30*time.Minute),
			DurationMinutes:    90,
			BasePrice:          850000,
			Status:             domain.FlightScheduled,
		},
		{
			ID:                 uuid.New(),
			FlightNumber:       "QZ-789",
			AirlineID:          airasiaID,
			AirplaneID:         planeQZ.ID,
			DepartureAirportID: "CGK",
			ArrivalAirportID:   "SIN",
			DepartureTime:      now.AddDate(0, 0, 2).Truncate(24 * time.Hour).Add(14 * time.Hour),
			ArrivalTime:        now.AddDate(0, 0, 2).Truncate(24 * time.Hour).Add(16*time.Hour + 45*time.Minute),
			DurationMinutes:    105,
			BasePrice:          950000,
			Status:             domain.FlightScheduled,
		},
		{
			ID:                 uuid.New(),
			FlightNumber:       "JT-234",
			AirlineID:          lionID,
			AirplaneID:         planeJT.ID,
			DepartureAirportID: "DPS",
			ArrivalAirportID:   "CGK",
			DepartureTime:      now.AddDate(0, 0, 2).Truncate(24 * time.Hour).Add(16 * time.Hour),
			ArrivalTime:        now.AddDate(0, 0, 2).Truncate(24 * time.Hour).Add(17*time.Hour + 50*time.Minute),
			DurationMinutes:    110,
			BasePrice:          1200000,
			Status:             domain.FlightScheduled,
		},
	}
	if err := db.Create(&flights).Error; err != nil {
		return fmt.Errorf("failed to seed flights: %w", err)
	}

	// 7. Seed Seats for the first flight (Rows 1 to 10 for demonstration)
	var seats []domain.FlightSeat
	for _, f := range flights {
		columns := []string{"A", "B", "C", "D", "E", "F"}
		for row := 1; row <= 15; row++ {
			class := domain.SeatClassEconomy
			multiplier := 1.00
			if row <= 2 {
				class = domain.SeatClassBusiness
				multiplier = 1.75
			}
			for _, col := range columns {
				seats = append(seats, domain.FlightSeat{
					ID:              uuid.New(),
					FlightID:        f.ID,
					SeatNumber:      fmt.Sprintf("%d%s", row, col),
					ClassType:       class,
					PriceMultiplier: multiplier,
					Status:          domain.SeatStatusAvailable,
				})
			}
		}
	}
	if err := db.CreateInBatches(seats, 100).Error; err != nil {
		return fmt.Errorf("failed to seed seats: %w", err)
	}

	logger.Info("✅ Database seeding completed successfully!",
		zap.Int("airports", len(airports)),
		zap.Int("airlines", len(airlines)),
		zap.Int("flights", len(flights)),
		zap.Int("seats", len(seats)),
	)
	return nil
}
