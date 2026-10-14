package config

import (
	"context"
	"fmt"
	"time"

	"flybook-server/pkg/logger"

	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

type DatabaseManager struct {
	Postgres    *gorm.DB
	MongoClient *mongo.Client
	MongoDB     *mongo.Database
	Redis       *redis.Client
}

// InitPostgres connects to PostgreSQL with production connection pooling
func InitPostgres(cfg *Config) (*gorm.DB, error) {
	var gormLogLevel gormlogger.LogLevel
	if cfg.AppEnv == "production" {
		gormLogLevel = gormlogger.Error
	} else {
		gormLogLevel = gormlogger.Info
	}

	db, err := gorm.Open(postgres.Open(cfg.PostgresURL), &gorm.Config{
		Logger: gormlogger.Default.LogMode(gormLogLevel),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get generic database object: %w", err)
	}

	// Connection Pooling
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(50)
	sqlDB.SetConnMaxLifetime(1 * time.Hour)

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping PostgreSQL: %w", err)
	}

	logger.Info("✅ PostgreSQL connection established", zap.String("db", "flybook_db"))
	return db, nil
}

// InitMongoDB connects to MongoDB using the official driver v2
func InitMongoDB(cfg *Config) (*mongo.Client, *mongo.Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(cfg.MongoURI)
	client, err := mongo.Connect(clientOptions)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return nil, nil, fmt.Errorf("failed to ping MongoDB: %w", err)
	}

	db := client.Database(cfg.MongoDBName)
	logger.Info("✅ MongoDB connection established", zap.String("db", cfg.MongoDBName))
	return client, db, nil
}

// InitRedis connects to Redis
func InitRedis(cfg *Config) (*redis.Client, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password: cfg.RedisPassword,
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to ping Redis: %w", err)
	}

	logger.Info("✅ Redis connection established", zap.String("addr", fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort)))
	return rdb, nil
}

// InitAllDatabases initializes PostgreSQL, MongoDB, and Redis concurrently
func InitAllDatabases(cfg *Config) (*DatabaseManager, error) {
	pg, err := InitPostgres(cfg)
	if err != nil {
		return nil, err
	}

	mClient, mDB, err := InitMongoDB(cfg)
	if err != nil {
		return nil, err
	}

	rdb, err := InitRedis(cfg)
	if err != nil {
		return nil, err
	}

	return &DatabaseManager{
		Postgres:    pg,
		MongoClient: mClient,
		MongoDB:     mDB,
		Redis:       rdb,
	}, nil
}
