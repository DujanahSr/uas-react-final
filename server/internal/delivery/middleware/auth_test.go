package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"flybook-server/internal/domain"
	"flybook-server/pkg/token"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func setupAuthTestRouter(jwtSecret string) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	protected := r.Group("/protected")
	protected.Use(JWTAuthMiddleware(jwtSecret))
	{
		protected.GET("/user", func(c *gin.Context) {
			userID, _ := c.Get(CtxUserIDKey)
			c.JSON(http.StatusOK, gin.H{"user_id": userID})
		})

		protected.GET("/admin-only", RequireRole(domain.RoleSuperAdmin), func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "welcome admin"})
		})
	}

	return r
}

func TestJWTAuthMiddleware_MissingToken(t *testing.T) {
	router := setupAuthTestRouter("secret")
	req, _ := http.NewRequest(http.MethodGet, "/protected/user", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestJWTAuthMiddleware_ValidToken(t *testing.T) {
	secret := "secret-key-at-least-32-chars-long"
	router := setupAuthTestRouter(secret)

	testUserID := uuid.New()
	validToken, err := token.GenerateJWT(testUserID, "test@example.com", domain.RoleCustomer, secret, time.Hour)
	assert.NoError(t, err)

	req, _ := http.NewRequest(http.MethodGet, "/protected/user", nil)
	req.Header.Set("Authorization", "Bearer "+validToken)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestRequireRole_ForbiddenForCustomer(t *testing.T) {
	secret := "secret-key-at-least-32-chars-long"
	router := setupAuthTestRouter(secret)

	customerToken, _ := token.GenerateJWT(uuid.New(), "customer@example.com", domain.RoleCustomer, secret, time.Hour)

	req, _ := http.NewRequest(http.MethodGet, "/protected/admin-only", nil)
	req.Header.Set("Authorization", "Bearer "+customerToken)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusForbidden, w.Code)
}

func TestRequireRole_SuccessForAdmin(t *testing.T) {
	secret := "secret-key-at-least-32-chars-long"
	router := setupAuthTestRouter(secret)

	adminToken, _ := token.GenerateJWT(uuid.New(), "admin@example.com", domain.RoleSuperAdmin, secret, time.Hour)

	req, _ := http.NewRequest(http.MethodGet, "/protected/admin-only", nil)
	req.Header.Set("Authorization", "Bearer "+adminToken)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}
