package middleware

import (
	"net/http"
	"strings"

	"flybook-server/internal/domain"
	"flybook-server/pkg/token"

	"github.com/gin-gonic/gin"
)

const (
	CtxUserIDKey = "ctx_user_id"
	CtxEmailKey  = "ctx_email"
	CtxRoleKey   = "ctx_role"
)

// JWTAuthMiddleware verifies the Bearer JWT token in the Authorization header
func JWTAuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Token otentikasi tidak ditemukan. Silakan login terlebih dahulu.",
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Format header Authorization tidak valid. Wajib: Bearer <token>",
			})
			return
		}

		claims, err := token.ValidateJWT(parts[1], jwtSecret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Token tidak valid atau telah kadaluarsa: " + err.Error(),
			})
			return
		}

		// Store user identity in context for downstream handlers
		c.Set(CtxUserIDKey, claims.UserID)
		c.Set(CtxEmailKey, claims.Email)
		c.Set(CtxRoleKey, claims.Role)

		c.Next()
	}
}

// RequireRole ensures that the authenticated user possesses one of the allowed roles
func RequireRole(allowedRoles ...domain.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get(CtxRoleKey)
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Sesi pengguna tidak valid",
			})
			return
		}

		userRole, ok := roleVal.(domain.UserRole)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Tipe data peran pengguna tidak valid",
			})
			return
		}

		for _, allowed := range allowedRoles {
			if userRole == allowed {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"status":  "error",
			"message": "Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.",
		})
	}
}
