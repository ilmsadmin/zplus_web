package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"zplus_web/backend/config"
	"zplus_web/backend/handlers/admin"
	"zplus_web/backend/handlers/auth"
	"zplus_web/backend/middleware"
	"zplus_web/backend/services"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Load configuration
	cfg := config.Load()

	log.Println("Database connecting...")

	// Initialize SQL database connection pool for services
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to open database connection pool: %v", err)
	}
	defer db.Close()

	// Test the connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// Initialize services
	userService := services.NewUserService(db)

	// Initialize handlers
	authHandler := auth.NewAuthHandler(userService)
	adminHandler := admin.NewAdminHandler(userService)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "ZPlus Web GraphQL API v1.0.0",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "*",
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":   "ok",
			"database": "connected",
			"version":  "1.0.0",
		})
	})

	// API Routes
	api := app.Group("/api/v1")

	// Auth routes
	authRoutes := api.Group("/auth")
	authRoutes.Post("/register", authHandler.Register)
	authRoutes.Post("/login", authHandler.Login)
	authRoutes.Post("/logout", middleware.AuthRequired(), authHandler.Logout)
	authRoutes.Get("/me", middleware.AuthRequired(), authHandler.Me)
	authRoutes.Post("/forgot-password", authHandler.ForgotPassword)
	authRoutes.Post("/reset-password", authHandler.ResetPassword)

	// Admin routes
	adminRoutes := api.Group("/admin")
	adminRoutes.Post("/auth/login", adminHandler.Login)
	
	// Protected admin routes
	adminProtected := adminRoutes.Group("", middleware.AuthRequired(), middleware.AdminRequired())
	adminProtected.Get("/dashboard/stats", adminHandler.GetDashboardStats)
	adminProtected.Get("/dashboard/recent-activity", adminHandler.GetRecentActivity)
	
	// User management routes
	adminProtected.Get("/users", adminHandler.GetUsers)
	adminProtected.Get("/users/:id", adminHandler.GetUser)
	adminProtected.Post("/users", adminHandler.CreateUser)
	adminProtected.Put("/users/:id", adminHandler.UpdateUser)
	adminProtected.Delete("/users/:id", adminHandler.DeleteUser)
	adminProtected.Put("/users/:id/role", adminHandler.UpdateUserRole)

	// API documentation
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "ZPlus Web REST API",
			"version": "1.0.0",
			"endpoints": fiber.Map{
				"auth":   "/api/v1/auth",
				"admin":  "/api/v1/admin",
				"health": "/health",
			},
		})
	})

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("REST API: http://localhost:%s/", port)
	log.Printf("Health check: http://localhost:%s/health", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

