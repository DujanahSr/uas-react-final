package http

import (
	"net/http"

	"flybook-server/internal/delivery/middleware"
	"flybook-server/internal/domain"
	"flybook-server/internal/usecase"
	"flybook-server/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuthHandler struct {
	authUsecase usecase.AuthUsecase
}

func NewAuthHandler(authUsecase usecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{authUsecase: authUsecase}
}

// Register handles POST /api/v1/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req domain.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data pendaftaran tidak valid", err.Error())
		return
	}

	authRes, err := h.authUsecase.Register(c.Request.Context(), req)
	if err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusCreated, "Pendaftaran akun berhasil", authRes)
}

// Login handles POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Email dan password wajib diisi", err.Error())
		return
	}

	authRes, err := h.authUsecase.Login(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "Login berhasil", authRes)
}

// GetMe handles GET /api/v1/auth/me
func (h *AuthHandler) GetMe(c *gin.Context) {
	userIDVal, exists := c.Get(middleware.CtxUserIDKey)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Sesi tidak valid", nil)
		return
	}

	userID := userIDVal.(uuid.UUID)
	profile, err := h.authUsecase.GetProfile(c.Request.Context(), userID)
	if err != nil {
		response.NotFound(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Profil pengguna berhasil diambil", profile)
}
