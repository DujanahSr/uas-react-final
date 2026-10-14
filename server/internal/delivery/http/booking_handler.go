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

type BookingHandler struct {
	bookingUsecase usecase.BookingUsecase
}

func NewBookingHandler(bookingUsecase usecase.BookingUsecase) *BookingHandler {
	return &BookingHandler{bookingUsecase: bookingUsecase}
}

// CreateBooking handles POST /api/v1/bookings
func (h *BookingHandler) CreateBooking(c *gin.Context) {
	userIDVal, exists := c.Get(middleware.CtxUserIDKey)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Sesi tidak valid", nil)
		return
	}
	userID := userIDVal.(uuid.UUID)

	var req domain.CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data pemesanan tiket tidak lengkap atau tidak valid", err.Error())
		return
	}

	booking, err := h.bookingUsecase.CreateBooking(c.Request.Context(), userID, req)
	if err != nil {
		response.Conflict(c, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusCreated, "Pemesanan tiket berhasil dibuat, silakan selesaikan pembayaran dalam 15 menit", booking)
}

// GetMyBookings handles GET /api/v1/bookings/my
func (h *BookingHandler) GetMyBookings(c *gin.Context) {
	userIDVal, exists := c.Get(middleware.CtxUserIDKey)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Sesi tidak valid", nil)
		return
	}
	userID := userIDVal.(uuid.UUID)

	bookings, err := h.bookingUsecase.GetMyBookings(c.Request.Context(), userID)
	if err != nil {
		response.InternalServerError(c, "Gagal mengambil daftar riwayat pemesanan", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Daftar pemesanan Anda berhasil diambil", bookings)
}

// GetBookingDetail handles GET /api/v1/bookings/:id
func (h *BookingHandler) GetBookingDetail(c *gin.Context) {
	userIDVal, exists := c.Get(middleware.CtxUserIDKey)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Sesi tidak valid", nil)
		return
	}
	userID := userIDVal.(uuid.UUID)

	roleVal, _ := c.Get(middleware.CtxRoleKey)
	userRole := roleVal.(domain.UserRole)

	idStr := c.Param("id")
	bookingID, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "ID pesanan tidak valid", nil)
		return
	}

	booking, err := h.bookingUsecase.GetBookingDetail(c.Request.Context(), bookingID, userID, userRole)
	if err != nil {
		response.NotFound(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Detail pesanan berhasil ditemukan", booking)
}

// PaymentWebhook handles POST /api/v1/payments/webhook
func (h *BookingHandler) PaymentWebhook(c *gin.Context) {
	var req domain.PaymentWebhookRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Format payload webhook tidak valid", err.Error())
		return
	}

	if err := h.bookingUsecase.ProcessPaymentWebhook(c.Request.Context(), req); err != nil {
		response.InternalServerError(c, "Gagal memproses webhook pembayaran", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Webhook pembayaran berhasil diproses secara idempotent", nil)
}
