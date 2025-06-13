package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"zplus_web/backend/config"

	"github.com/go-redis/redis/v8"
	_ "github.com/lib/pq"
)

type Database struct {
	PostgreSQL *sql.DB
	Redis      *redis.Client
}

func NewDatabase(cfg *config.Config) (*Database, error) {
	db := &Database{}

	// PostgreSQL connection with retry logic
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	var err error
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		db.PostgreSQL, err = sql.Open("postgres", psqlInfo)
		if err != nil {
			log.Printf("Attempt %d: Failed to connect to PostgreSQL: %v", i+1, err)
			time.Sleep(time.Second * 2)
			continue
		}

		if err = db.PostgreSQL.Ping(); err != nil {
			log.Printf("Attempt %d: Failed to ping PostgreSQL: %v", i+1, err)
			time.Sleep(time.Second * 2)
			continue
		}

		break
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL after %d attempts: %w", maxRetries, err)
	}

	// Set connection pool settings
	db.PostgreSQL.SetMaxOpenConns(25)
	db.PostgreSQL.SetMaxIdleConns(25)
	db.PostgreSQL.SetConnMaxLifetime(5 * time.Minute)

	log.Println("Connected to PostgreSQL successfully")

	// Redis connection
	db.Redis = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password: cfg.RedisPassword,
		DB:       0,
	})

	// Test Redis connection
	ctx := context.Background()
	_, err = db.Redis.Ping(ctx).Result()
	if err != nil {
		log.Printf("Warning: Failed to connect to Redis: %v", err)
		log.Println("Redis features will be disabled")
	} else {
		log.Println("Connected to Redis successfully")
	}

	return db, nil
}

func (db *Database) Close() {
	if db.PostgreSQL != nil {
		db.PostgreSQL.Close()
	}
	if db.Redis != nil {
		db.Redis.Close()
	}
}
