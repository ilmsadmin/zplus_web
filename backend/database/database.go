package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/go-redis/redis/v8"
	_ "github.com/lib/pq"
	"zplus_web/backend/config"
)

type Database struct {
	PostgreSQL *sql.DB
	Redis      *redis.Client
}

func NewDatabase(cfg *config.Config) (*Database, error) {
	db := &Database{}

	// PostgreSQL connection
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	var err error
	db.PostgreSQL, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	if err = db.PostgreSQL.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping PostgreSQL: %w", err)
	}

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