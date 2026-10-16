package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"flybook-server/internal/config"
	httpDelivery "flybook-server/internal/delivery/http"
	"flybook-server/internal/delivery/middleware"
	mongoRepo "flybook-server/internal/repository/mongo"
	"flybook-server/internal/repository/postgres"
	redisRepo "flybook-server/internal/repository/redis"
	"flybook-server/internal/usecase"
	"flybook-server/internal/worker"
	"flybook-server/pkg/logger"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
)

func main() {
	cfg := config.LoadConfig()
	logger.InitLogger(cfg.AppEnv)

	logger.Info("🛫 Starting FlyBook Enterprise Server...",
		zap.String("env", cfg.AppEnv),
		zap.String("port", cfg.AppPort),
	)

	// 1. Initialize Databases (Postgres, MongoDB, Redis)
	dbManager, err := config.InitAllDatabases(cfg)
	if err != nil {
		logger.Fatal("❌ Database initialization failed", zap.Error(err))
	}

	// 2. Run Database Auto-Migrations
	if err := postgres.AutoMigrate(dbManager.Postgres); err != nil {
		logger.Fatal("❌ Auto-migration failed", zap.Error(err))
	}

	// 3. Seed Initial Data
	if err := postgres.SeedInitialData(dbManager.Postgres, dbManager.MongoDB); err != nil {
		logger.Error("⚠️ Seeder failed", zap.Error(err))
	}

	// 4. Initialize Repositories
	userRepo := postgres.NewUserRepository(dbManager.Postgres)
	flightRepo := postgres.NewFlightRepository(dbManager.Postgres)
	bookingRepo := postgres.NewBookingRepository(dbManager.Postgres)
	layoutRepo := mongoRepo.NewLayoutRepository(dbManager.MongoDB)
	seatLockRepo := redisRepo.NewSeatLockRepository(dbManager.Redis)

	// 5. Initialize Usecases
	authUsecase := usecase.NewAuthUsecase(userRepo, cfg.JWTSecret)
	flightUsecase := usecase.NewFlightUsecase(flightRepo, layoutRepo, seatLockRepo)
	bookingUsecase := usecase.NewBookingUsecase(bookingRepo, flightRepo, seatLockRepo)

	// 6. Initialize HTTP Handlers
	authHandler := httpDelivery.NewAuthHandler(authUsecase)
	flightHandler := httpDelivery.NewFlightHandler(flightUsecase)
	bookingHandler := httpDelivery.NewBookingHandler(bookingUsecase)

	// 7. Start Background Asynchronous Worker (Ticket Auto-Cancellation)
	worker.StartBookingCleanerWorker(context.Background(), bookingUsecase, 30*time.Second)

	// 8. Setup Gin HTTP Engine
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.New()
	router.Use(gin.Recovery())

	// Custom Prometheus & Traffic Metrics Middleware
	router.Use(middleware.PrometheusMetricsMiddleware())

	// Global CORS Middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Idempotency-Key")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// 9. Prometheus Metrics Endpoint
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API Info / Index Handler
	apiIndexHandler := func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"name":    "FlyBook Enterprise API",
			"version": "1.0.0",
			"message": "Welcome to FlyBook Enterprise Flight Booking Backend API",
			"endpoints": gin.H{
				"health":      "/api/v1/health",
				"metrics":     "/metrics",
				"flights":     "/api/v1/flights",
				"auth_login":  "/api/v1/auth/login",
				"auth_reg":    "/api/v1/auth/register",
				"my_bookings": "/api/v1/bookings/my",
			},
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	}
	router.GET("/", apiIndexHandler)

	// 10. Base API v1 Routes
	v1 := router.Group("/api/v1")
	{
		v1.GET("", apiIndexHandler)
		v1.GET("/", apiIndexHandler)

		// Health Check
		v1.GET("/health", func(c *gin.Context) {
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			defer cancel()

			sqlDB, _ := dbManager.Postgres.DB()
			pgStatus := "healthy"
			if err := sqlDB.Ping(); err != nil {
				pgStatus = "unreachable: " + err.Error()
			}

			mongoStatus := "healthy"
			if err := dbManager.MongoClient.Ping(ctx, nil); err != nil {
				mongoStatus = "unreachable: " + err.Error()
			}

			redisStatus := "healthy"
			if err := dbManager.Redis.Ping(ctx).Err(); err != nil {
				redisStatus = "unreachable: " + err.Error()
			}

			c.JSON(http.StatusOK, gin.H{
				"status":  "success",
				"message": "FlyBook Enterprise API is running",
				"version": "1.0.0",
				"databases": gin.H{
					"postgres": pgStatus,
					"mongodb":  mongoStatus,
					"redis":    redisStatus,
				},
				"timestamp": time.Now().UTC().Format(time.RFC3339),
			})
		})

		// Authentication Routes
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/register", authHandler.Register)
			authGroup.POST("/login", authHandler.Login)
			authGroup.GET("/me", middleware.JWTAuthMiddleware(cfg.JWTSecret), authHandler.GetMe)
		}

		// Flights & Seat Map Endpoints
		flightsGroup := v1.Group("/flights")
		{
			flightsGroup.GET("", flightHandler.SearchFlights)
			flightsGroup.GET("/:id", flightHandler.GetFlightByID)
			flightsGroup.GET("/:id/seats", flightHandler.GetSeatMap)

			// Idempotent Seat Locking (15-Minute Redis Distributed Lock)
			flightsGroup.POST("/:id/seats/lock",
				middleware.IdempotencyMiddleware(dbManager.Redis, 15*time.Minute),
				flightHandler.LockSeat,
			)

			// Seat Release / Unlock
			flightsGroup.POST("/:id/seats/unlock", flightHandler.UnlockSeat)
		}

		// Bookings Endpoints (Protected with JWT)
		bookingsGroup := v1.Group("/bookings")
		bookingsGroup.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
		{
			bookingsGroup.POST("",
				middleware.IdempotencyMiddleware(dbManager.Redis, 15*time.Minute),
				bookingHandler.CreateBooking,
			)
			bookingsGroup.GET("/my", bookingHandler.GetMyBookings)
			bookingsGroup.GET("/:id", bookingHandler.GetBookingDetail)
		}

		// Payment Webhook (Public Callback)
		v1.POST("/payments/webhook", bookingHandler.PaymentWebhook)
	}

	addr := fmt.Sprintf(":%s", cfg.AppPort)
	logger.Info(fmt.Sprintf("🚀 Server successfully listening at http://localhost%s", addr))

	if err := router.Run(addr); err != nil {
		logger.Fatal("Server encountered fatal error", zap.Error(err))
		os.Exit(1)
	}
}
