package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	
	"zplus_web/backend/handlers/auth"
	"zplus_web/backend/handlers/admin"
	"zplus_web/backend/handlers/blog"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "ZPlus Web API v1.0.0",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to ZPlus Web API",
			"status":  "running",
			"version": "v1.0.0",
		})
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "healthy",
			"service": "zplus-web-api",
		})
	})

	// API routes group
	api := app.Group("/api/v1")
	
	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "pong",
		})
	})

	// Initialize handlers
	authHandler := auth.NewAuthHandler()
	adminHandler := admin.NewAdminHandler()
	blogHandler := blog.NewBlogHandler()

	// Authentication routes
	authGroup := api.Group("/auth")
	authGroup.Post("/register", authHandler.Register)
	authGroup.Post("/login", authHandler.Login)
	authGroup.Post("/logout", authHandler.Logout)
	authGroup.Post("/forgot-password", authHandler.ForgotPassword)
	authGroup.Post("/reset-password", authHandler.ResetPassword)

	// Public blog routes
	blogGroup := api.Group("/blog")
	blogGroup.Get("/posts", blogHandler.GetPosts)
	blogGroup.Get("/posts/:slug", blogHandler.GetPost)
	blogGroup.Get("/categories", blogHandler.GetCategories)

	// Admin routes
	adminAuthGroup := api.Group("/admin/auth")
	adminAuthGroup.Post("/login", adminHandler.Login)

	adminDashboardGroup := api.Group("/admin/dashboard")
	// TODO: Add authentication middleware here
	adminDashboardGroup.Get("/stats", adminHandler.GetDashboardStats)
	adminDashboardGroup.Get("/recent-activity", adminHandler.GetRecentActivity)

	adminBlogGroup := api.Group("/admin/blog")
	// TODO: Add authentication middleware here
	adminBlogGroup.Get("/posts", blogHandler.AdminGetPosts)
	adminBlogGroup.Post("/posts", blogHandler.AdminCreatePost)
	adminBlogGroup.Put("/posts/:id", blogHandler.AdminUpdatePost)
	adminBlogGroup.Delete("/posts/:id", blogHandler.AdminDeletePost)
	adminBlogGroup.Post("/categories", blogHandler.AdminCreateCategory)

	// TODO: Add more route groups for:
	// - Projects (/projects, /admin/projects)
	// - Products (/products, /admin/products)
	// - Orders (/orders)
	// - Customers (/admin/customers)
	// - WordPress integration (/admin/content)
	// - File uploads (/upload)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("API Documentation: http://localhost:%s/api/v1", port)
	log.Fatal(app.Listen(":" + port))
}