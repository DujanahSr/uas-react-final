package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env if present
	_ = godotenv.Load()

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	appEnv := os.Getenv("APP_ENV")
	if appEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// Global CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// Base Health Check Route
	router.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "FlyBook Enterprise Backend API (Golang) is up and running!",
			"version": "1.0.0",
		})
	})

	fmt.Printf("🚀 FlyBook Server running on port %s (env: %s)\n", port, appEnv)
	if err := router.Run(":" + port); err != nil {
		fmt.Printf("❌ Failed to start server: %v\n", err)
	}
}
