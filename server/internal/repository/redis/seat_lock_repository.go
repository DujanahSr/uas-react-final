package redis

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type SeatLockRepository interface {
	AcquireSeatLock(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID, ttl time.Duration) (bool, error)
	ReleaseSeatLock(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) (bool, error)
	GetSeatLockInfo(ctx context.Context, flightID uuid.UUID, seatNumber string) (isLocked bool, holderID *uuid.UUID, ttlSeconds int64, err error)
}

type seatLockRepository struct {
	client *redis.Client
}

func NewSeatLockRepository(client *redis.Client) SeatLockRepository {
	return &seatLockRepository{client: client}
}

func formatSeatKey(flightID uuid.UUID, seatNumber string) string {
	return fmt.Sprintf("seat:lock:%s:%s", flightID.String(), seatNumber)
}

// AcquireSeatLock atomically locks the seat using Redis SET NX EX (15 minutes)
func (r *seatLockRepository) AcquireSeatLock(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID, ttl time.Duration) (bool, error) {
	key := formatSeatKey(flightID, seatNumber)
	// SET key userID NX EX ttl
	success, err := r.client.SetNX(ctx, key, userID.String(), ttl).Result()
	if err != nil {
		return false, err
	}
	return success, nil
}

// ReleaseSeatLock atomically verifies that the user is the lock owner before releasing via Lua script
func (r *seatLockRepository) ReleaseSeatLock(ctx context.Context, flightID uuid.UUID, seatNumber string, userID uuid.UUID) (bool, error) {
	key := formatSeatKey(flightID, seatNumber)

	// Lua script: if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end
	luaScript := `
		if redis.call("get", KEYS[1]) == ARGV[1] then
			return redis.call("del", KEYS[1])
		else
			return 0
		end
	`

	res, err := r.client.Eval(ctx, luaScript, []string{key}, userID.String()).Result()
	if err != nil {
		return false, err
	}

	deleted, ok := res.(int64)
	return ok && deleted > 0, nil
}

// GetSeatLockInfo checks if the seat has an active TTL lock in Redis
func (r *seatLockRepository) GetSeatLockInfo(ctx context.Context, flightID uuid.UUID, seatNumber string) (bool, *uuid.UUID, int64, error) {
	key := formatSeatKey(flightID, seatNumber)

	pipe := r.client.Pipeline()
	getCmd := pipe.Get(ctx, key)
	ttlCmd := pipe.TTL(ctx, key)

	_, err := pipe.Exec(ctx)
	if err != nil && err != redis.Nil {
		return false, nil, 0, err
	}

	val, err := getCmd.Result()
	if err == redis.Nil {
		return false, nil, 0, nil
	} else if err != nil {
		return false, nil, 0, err
	}

	ttlVal, _ := ttlCmd.Result()

	parsedUUID, err := uuid.Parse(val)
	if err != nil {
		return true, nil, int64(ttlVal.Seconds()), nil
	}

	return true, &parsedUUID, int64(ttlVal.Seconds()), nil
}
