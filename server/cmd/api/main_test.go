package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/stretchr/testify/assert"
)

// setupRouter creates a test router instance
func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	router.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "FlyBook Enterprise Backend API (Golang) is up and running!",
			"version": "1.0.0",
		})
	})

	return router
}

func TestHealthCheckEndpoint(t *testing.T) {
	// Arrange
	router := setupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert (Using Testify - Equivalent to JUnit 5 Assertions)
	assert.Equal(t, http.StatusOK, w.Code, "Expected HTTP Status 200 OK")

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err, "Response body should be valid JSON")
	assert.Equal(t, "success", response["status"])
	assert.Equal(t, "1.0.0", response["version"])
	assert.Contains(t, response["message"], "FlyBook")
}

func TestPrometheusMetricsEndpoint(t *testing.T) {
	router := setupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/metrics", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code, "Expected HTTP Status 200 OK for /metrics")
	assert.Contains(t, w.Body.String(), "go_goroutines", "Prometheus should export Go runtime metrics")
}
