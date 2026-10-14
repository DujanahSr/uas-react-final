package middleware

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"flybook-server/pkg/logger"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type CachedResponse struct {
	StatusCode int    `json:"status_code"`
	Body       string `json:"body"`
}

type responseBodyWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (r responseBodyWriter) Write(b []byte) (int, error) {
	r.body.Write(b)
	return r.ResponseWriter.Write(b)
}

// IdempotencyMiddleware ensures endpoints with X-Idempotency-Key header are executed at most once
func IdempotencyMiddleware(rdb *redis.Client, ttl time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		idempotencyKey := c.GetHeader("X-Idempotency-Key")
		if idempotencyKey == "" {
			// If client didn't supply an idempotency key, proceed normally
			c.Next()
			return
		}

		ctx := context.Background()
		redisKey := fmt.Sprintf("idempotency:%s", idempotencyKey)

		// 1. Check if key already exists in Redis
		cachedVal, err := rdb.Get(ctx, redisKey).Result()
		if err == nil {
			if cachedVal == "IN_PROGRESS" {
				c.AbortWithStatusJSON(http.StatusConflict, gin.H{
					"status":  "error",
					"message": "Permintaan yang identik sedang diproses. Mohon tunggu beberapa saat.",
				})
				return
			}

			// Unmarshal and return cached response directly
			var cached CachedResponse
			if err := json.Unmarshal([]byte(cachedVal), &cached); err == nil {
				logger.Info("⚡ Idempotency cache hit, serving cached response", zap.String("key", idempotencyKey))
				c.Header("X-Cache-Lookup", "HIT-IDEMPOTENCY")
				c.Data(cached.StatusCode, "application/json", []byte(cached.Body))
				c.Abort()
				return
			}
		}

		// 2. Set key as IN_PROGRESS with a short lock timeout (e.g. 60 seconds)
		acquired, err := rdb.SetNX(ctx, redisKey, "IN_PROGRESS", 60*time.Second).Result()
		if err != nil || !acquired {
			c.AbortWithStatusJSON(http.StatusConflict, gin.H{
				"status":  "error",
				"message": "Permintaan yang identik sedang diproses.",
			})
			return
		}

		// 3. Hijack Response Writer to record the output
		w := &responseBodyWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = w

		c.Next()

		// 4. Save response to Redis if status is successful (2xx or 4xx)
		if c.Writer.Status() < 500 {
			toCache := CachedResponse{
				StatusCode: c.Writer.Status(),
				Body:       w.body.String(),
			}
			data, _ := json.Marshal(toCache)
			_ = rdb.Set(ctx, redisKey, string(data), ttl).Err()
		} else {
			// If 5xx server error, delete the key so user can retry
			_ = rdb.Del(ctx, redisKey).Err()
		}
	}
}
