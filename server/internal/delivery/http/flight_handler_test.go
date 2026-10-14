package http

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"flybook-server/internal/domain"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// mockFlightUsecase implements usecase.FlightUsecase for unit testing
type mockFlightUsecase struct {
	searchFlightsFunc func(ctx context.Context, filter domain.FlightFilter) ([]domain.Flight, error)
	getFlightByIDFunc func(ctx context.Context, id uuid.UUID) (*domain.Flight, error)
	getSeatMapFunc    func(ctx context.Context, flightID uuid.UUID) (*domain.SeatMapResponse, error)
	lockSeatFunc      func(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) (*domain.SeatDetailWithLock, error)
	unlockSeatFunc    func(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) error
}

func (m *mockFlightUsecase) SearchFlights(ctx context.Context, filter domain.FlightFilter) ([]domain.Flight, error) {
	if m.searchFlightsFunc != nil {
		return m.searchFlightsFunc(ctx, filter)
	}
	return []domain.Flight{}, nil
}

func (m *mockFlightUsecase) GetFlightByID(ctx context.Context, id uuid.UUID) (*domain.Flight, error) {
	if m.getFlightByIDFunc != nil {
		return m.getFlightByIDFunc(ctx, id)
	}
	return nil, errors.New("not found")
}

func (m *mockFlightUsecase) GetSeatMap(ctx context.Context, flightID uuid.UUID) (*domain.SeatMapResponse, error) {
	if m.getSeatMapFunc != nil {
		return m.getSeatMapFunc(ctx, flightID)
	}
	return &domain.SeatMapResponse{FlightID: flightID}, nil
}

func (m *mockFlightUsecase) LockSeat(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) (*domain.SeatDetailWithLock, error) {
	if m.lockSeatFunc != nil {
		return m.lockSeatFunc(ctx, flightID, seatNumber, userID)
	}
	return &domain.SeatDetailWithLock{SeatNumber: seatNumber, Status: domain.SeatStatusHeld}, nil
}

func (m *mockFlightUsecase) UnlockSeat(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) error {
	if m.unlockSeatFunc != nil {
		return m.unlockSeatFunc(ctx, flightID, seatNumber, userID)
	}
	return nil
}

func setupTestRouter(handler *FlightHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	v1 := r.Group("/api/v1/flights")
	{
		v1.GET("", handler.SearchFlights)
		v1.GET("/:id", handler.GetFlightByID)
		v1.GET("/:id/seats", handler.GetSeatMap)
		v1.POST("/:id/seats/lock", handler.LockSeat)
		v1.POST("/:id/seats/unlock", handler.UnlockSeat)
	}
	return r
}

func TestSearchFlights_Success(t *testing.T) {
	mockUC := &mockFlightUsecase{
		searchFlightsFunc: func(ctx context.Context, filter domain.FlightFilter) ([]domain.Flight, error) {
			return []domain.Flight{
				{
					ID:           uuid.New(),
					FlightNumber: "GA-123",
					BasePrice:    1500000,
					Status:       domain.FlightScheduled,
				},
			}, nil
		},
	}

	handler := NewFlightHandler(mockUC)
	router := setupTestRouter(handler)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/flights?departure_airport=CGK&arrival_airport=DPS", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var res map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &res)
	assert.NoError(t, err)
	assert.Equal(t, "success", res["status"])

	data := res["data"].([]interface{})
	assert.Len(t, data, 1)
}

func TestGetFlightByID_InvalidUUID(t *testing.T) {
	mockUC := &mockFlightUsecase{}
	handler := NewFlightHandler(mockUC)
	router := setupTestRouter(handler)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/flights/invalid-uuid", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetSeatMap_Success(t *testing.T) {
	flightID := uuid.New()
	mockUC := &mockFlightUsecase{
		getSeatMapFunc: func(ctx context.Context, id uuid.UUID) (*domain.SeatMapResponse, error) {
			return &domain.SeatMapResponse{
				FlightID:       flightID,
				FlightNumber:   "GA-123",
				AvailableCount: 150,
				TotalSeats:     180,
				Seats: []domain.SeatDetailWithLock{
					{
						SeatNumber: "14A",
						Status:     domain.SeatStatusAvailable,
					},
				},
			}, nil
		},
	}

	handler := NewFlightHandler(mockUC)
	router := setupTestRouter(handler)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/flights/"+flightID.String()+"/seats", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var res map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &res)
	assert.NoError(t, err)
	assert.Equal(t, "success", res["status"])
}

func TestLockSeat_Conflict(t *testing.T) {
	flightID := uuid.New()
	mockUC := &mockFlightUsecase{
		lockSeatFunc: func(ctx context.Context, fID uuid.UUID, seat string, uID uuid.UUID) (*domain.SeatDetailWithLock, error) {
			return nil, errors.New("kursi ini sedang dipilih oleh calon penumpang lain")
		},
	}

	handler := NewFlightHandler(mockUC)
	router := setupTestRouter(handler)

	body := `{"seat_number":"12A", "user_id":"` + uuid.New().String() + `"}`
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/flights/"+flightID.String()+"/seats/lock", nil)
	req.Header.Set("Content-Type", "application/json")
	// Using buffer for body
	w := httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/flights/"+flightID.String()+"/seats/lock", stringsNewReader(body))
	req.Header.Set("Content-Type", "application/json")

	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusConflict, w.Code)
}

func stringsNewReader(s string) *testingBuffer {
	return &testingBuffer{data: []byte(s)}
}

type testingBuffer struct {
	data []byte
	idx  int
}

func (b *testingBuffer) Read(p []byte) (n int, err error) {
	if b.idx >= len(b.data) {
		return 0, nil
	}
	n = copy(p, b.data[b.idx:])
	b.idx += n
	return n, nil
}

func (b *testingBuffer) Close() error {
	return nil
}

func init() {
	// Silence linter for unused imports if any
	_ = time.Second
}
