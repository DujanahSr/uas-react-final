package worker

import (
	"context"
	"time"

	"flybook-server/internal/usecase"
	"flybook-server/pkg/logger"

	"go.uber.org/zap"
)

// StartBookingCleanerWorker runs a background ticker to cancel unpaid bookings past 15 mins
func StartBookingCleanerWorker(ctx context.Context, bookingUsecase usecase.BookingUsecase, interval time.Duration) {
	ticker := time.NewTicker(interval)

	go func() {
		logger.Info("⏱️ Starting background booking expiration cleaner worker...",
			zap.Duration("interval", interval),
		)

		for {
			select {
			case <-ctx.Done():
				logger.Info("Stopping booking expiration cleaner worker")
				ticker.Stop()
				return
			case <-ticker.C:
				cancelledCount, err := bookingUsecase.CancelExpiredBookings(context.Background())
				if err != nil {
					logger.Error("Error cancelling expired bookings in worker", zap.Error(err))
				} else if cancelledCount > 0 {
					logger.Info("🔄 Successfully released expired bookings and freed seats", zap.Int("cancelled", cancelledCount))
				}
			}
		}
	}()
}
