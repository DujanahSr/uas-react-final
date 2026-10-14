package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"flybook-server/internal/config"
	"flybook-server/internal/delivery/middleware"
	"flybook-server/internal/repository/postgres"
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

	// 4. Setup Gin HTTP Engine
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.New()
	router.Use(gin.Recovery())

	// Custom Prometheus & Traffic Metrics Middleware
	router.Use(middleware.PrometheusMetricsMiddleware())

	// CORS Middleware
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

	// 5. Expose Metrics for Prometheus
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// 6. Comprehensive Health Check Endpoint
	router.GET("/api/v1/health", func(c *gin.Context) {
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

	addr := fmt.Sprintf(":%s", cfg.AppPort)
	logger.Info(fmt.Sprintf("🚀 Server successfully listening at http://localhost%s", addr))

	if err := router.Run(addr); err != nil {
		logger.Fatal("Server encountered fatal error", zap.Error(err))
		os.Exit(1)
	}
}
