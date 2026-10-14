package http

import (
	"net/http"

	"flybook-server/internal/domain"
	"flybook-server/internal/usecase"
	"flybook-server/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type FlightHandler struct {
	flightUsecase usecase.FlightUsecase
}

func NewFlightHandler(flightUsecase usecase.FlightUsecase) *FlightHandler {
	return &FlightHandler{flightUsecase: flightUsecase}
}

// SearchFlights handles GET /api/v1/flights
func (h *FlightHandler) SearchFlights(c *gin.Context) {
	var filter domain.FlightFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.BadRequest(c, "Format query pencarian tidak valid", err.Error())
		return
	}

	flights, err := h.flightUsecase.SearchFlights(c.Request.Context(), filter)
	if err != nil {
		response.InternalServerError(c, "Gagal mengambil data penerbangan", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Berhasil mengambil daftar penerbangan", flights)
}

// GetFlightByID handles GET /api/v1/flights/:id
func (h *FlightHandler) GetFlightByID(c *gin.Context) {
	idStr := c.Param("id")
	flightID, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "ID penerbangan tidak valid (wajib UUID)", nil)
		return
	}

	flight, err := h.flightUsecase.GetFlightByID(c.Request.Context(), flightID)
	if err != nil {
		response.NotFound(c, "Penerbangan tidak ditemukan")
		return
	}

	response.Success(c, http.StatusOK, "Detail penerbangan berhasil ditemukan", flight)
}

// GetSeatMap handles GET /api/v1/flights/:id/seats
func (h *FlightHandler) GetSeatMap(c *gin.Context) {
	idStr := c.Param("id")
	flightID, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "ID penerbangan tidak valid", nil)
		return
	}

	seatMap, err := h.flightUsecase.GetSeatMap(c.Request.Context(), flightID)
	if err != nil {
		response.InternalServerError(c, "Gagal mengambil denah kursi penerbangan", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Denah kursi berhasil dimuat", seatMap)
}

// LockSeat handles POST /api/v1/flights/:id/seats/lock
func (h *FlightHandler) LockSeat(c *gin.Context) {
	idStr := c.Param("id")
	flightID, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "ID penerbangan tidak valid", nil)
		return
	}

	var req domain.LockSeatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Body request tidak valid (seat_number dan user_id wajib diisi)", err.Error())
		return
	}

	lockedSeat, err := h.flightUsecase.LockSeat(c.Request.Context(), flightID, req.SeatNumber, req.UserID)
	if err != nil {
		response.Conflict(c, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "Kursi berhasil dikunci selama 15 menit untuk Anda", lockedSeat)
}

// UnlockSeat handles POST /api/v1/flights/:id/seats/unlock
func (h *FlightHandler) UnlockSeat(c *gin.Context) {
	idStr := c.Param("id")
	flightID, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "ID penerbangan tidak valid", nil)
		return
	}

	var req domain.UnlockSeatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Body request tidak valid", err.Error())
		return
	}

	if err := h.flightUsecase.UnlockSeat(c.Request.Context(), flightID, req.SeatNumber, req.UserID); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "Kursi berhasil dilepas kembali", nil)
}
