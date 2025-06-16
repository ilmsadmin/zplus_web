package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"

	"zplus_web/backend/config"
	"zplus_web/backend/ent"
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

	// Initialize Ent client
	client, err := ent.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName))
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer client.Close()

	// Run migrations
	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("Failed to create schema: %v", err)
	}

	log.Println("Database connected and schema created successfully")

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

	// GraphQL endpoint
	app.Post("/graphql", func(c *fiber.Ctx) error {
		var request struct {
			Query     string                 `json:"query"`
			Variables map[string]interface{} `json:"variables"`
		}

		if err := c.BodyParser(&request); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"errors": []fiber.Map{
					{"message": "Invalid request body"},
				},
			})
		}

		// Handle users query
		if strings.Contains(request.Query, "users") && strings.Contains(request.Query, "query") {
			users, err := client.User.Query().All(c.Context())
			if err != nil {
				return c.Status(500).JSON(fiber.Map{
					"errors": []fiber.Map{
						{"message": "Failed to fetch users"},
					},
				})
			}

			var userList []fiber.Map
			for _, user := range users {
				userList = append(userList, fiber.Map{
					"id":       user.ID.String(),
					"email":    user.Email,
					"username": user.Username,
					"role":     user.Role,
				})
			}

			return c.JSON(fiber.Map{
				"data": fiber.Map{
					"users": userList,
				},
			})
		}

		// Handle me query
		if strings.Contains(request.Query, "me") && strings.Contains(request.Query, "query") {
			return c.JSON(fiber.Map{
				"data": fiber.Map{
					"me": fiber.Map{
						"id":       "550e8400-e29b-41d4-a716-446655440000",
						"email":    "admin@example.com",
						"username": "admin",
						"role":     "admin",
					},
				},
			})
		}

		// Handle create user mutation
		if strings.Contains(request.Query, "createUser") && strings.Contains(request.Query, "mutation") {
			email, emailOk := request.Variables["email"].(string)
			username, usernameOk := request.Variables["username"].(string)
			password, passwordOk := request.Variables["password"].(string)

			if !emailOk || !usernameOk || !passwordOk {
				return c.Status(400).JSON(fiber.Map{
					"errors": []fiber.Map{
						{"message": "Missing required variables: email, username, password"},
					},
				})
			}

			// Hash password
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{
					"errors": []fiber.Map{
						{"message": "Failed to hash password"},
					},
				})
			}

			user, err := client.User.Create().
				SetEmail(email).
				SetUsername(username).
				SetPasswordHash(string(hashedPassword)).
				SetRole("user").
				SetEmailVerified(false).
				SetPoints(0).
				SetWalletBalance(0.0).
				Save(c.Context())

			if err != nil {
				return c.Status(500).JSON(fiber.Map{
					"errors": []fiber.Map{
						{"message": "Failed to create user: " + err.Error()},
					},
				})
			}

			return c.JSON(fiber.Map{
				"data": fiber.Map{
					"createUser": fiber.Map{
						"id":       user.ID.String(),
						"email":    user.Email,
						"username": user.Username,
						"role":     user.Role,
					},
				},
			})
		}

		return c.Status(400).JSON(fiber.Map{
			"errors": []fiber.Map{
				{"message": "Unsupported query: " + request.Query},
			},
		})
	})

	// API documentation
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "ZPlus Web GraphQL API",
			"version": "1.0.0",
			"endpoints": fiber.Map{
				"graphql":    "/graphql",
				"playground": "/playground",
				"health":     "/health",
			},
		})
	})

	// GraphQL playground
	app.Get("/playground", func(c *fiber.Ctx) error {
		html := `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GraphQL Playground - ZPlus Web</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      font-family: 'Open Sans', sans-serif;
      background-color: #1a1a1a;
      color: #fff;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 1px solid #444;
      padding-bottom: 20px;
    }
    .query-box {
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .query-title {
      color: #61dafb;
      margin-bottom: 15px;
      font-weight: bold;
      font-size: 18px;
    }
    pre {
      background: #1e1e1e;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      border: 1px solid #444;
      margin: 10px 0;
    }
    code {
      color: #9cdcfe;
    }
    .button {
      background: #61dafb;
      color: #000;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      margin: 8px;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .button:hover {
      background: #4fa8c5;
    }
    .button.success {
      background: #28a745;
      color: white;
    }
    .button.danger {
      background: #dc3545;
      color: white;
    }
    #result {
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 4px;
      padding: 15px;
      margin-top: 15px;
      min-height: 100px;
    }
    .endpoint-info {
      background: #333;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
    }
    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .status.online {
      background: #28a745;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 ZPlus Web GraphQL API</h1>
      <p>Interactive GraphQL Playground</p>
      <div class="endpoint-info">
        <strong>GraphQL Endpoint:</strong> <code>POST /graphql</code>
        <span class="status online">ONLINE</span>
      </div>
    </div>

    <div class="query-box">
      <div class="query-title">📋 Available Queries</div>
      <p><strong>Get all users:</strong></p>
      <pre><code>query {
  users {
    id
    email
    username
    role
  }
}</code></pre>
      
      <p><strong>Get current user (mock):</strong></p>
      <pre><code>query {
  me {
    id
    email
    username
    role
  }
}</code></pre>
    </div>

    <div class="query-box">
      <div class="query-title">✏️ Available Mutations</div>
      <p><strong>Create a new user:</strong></p>
      <pre><code>mutation createUser($email: String!, $username: String!, $password: String!) {
  createUser(email: $email, username: $username, password: $password) {
    id
    email
    username
    role
  }
}</code></pre>
      <p><strong>Variables:</strong></p>
      <pre><code>{
  "email": "user@example.com",
  "username": "newuser",
  "password": "password123"
}</code></pre>
    </div>

    <div class="query-box">
      <div class="query-title">🔧 Test Operations</div>
      
      <button class="button" onclick="testUsers()">📊 Query Users</button>
      <button class="button" onclick="testMe()">👤 Query Me</button>
      <button class="button success" onclick="testCreateUser()">➕ Create User</button>
      <button class="button danger" onclick="clearResult()">🗑️ Clear</button>
      
      <div id="result">
        <p><em>Click a button above to test GraphQL operations...</em></p>
      </div>
    </div>

    <div class="query-box">
      <div class="query-title">📚 Usage Examples</div>
      <p><strong>Using curl:</strong></p>
      <pre><code>curl -X POST http://localhost:3002/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { users { id email username } }"}'</code></pre>
      
      <p><strong>Using JavaScript fetch:</strong></p>
      <pre><code>fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'query { users { id email username } }'
  })
}).then(res => res.json())</code></pre>
    </div>
  </div>

  <script>
    async function makeGraphQLRequest(query, variables = {}) {
      try {
        const startTime = Date.now();
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            variables: variables
          })
        });
        const data = await response.json();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        document.getElementById('result').innerHTML = 
          '<div style="color: #61dafb; font-size: 14px; margin-bottom: 10px;">Response (' + duration + 'ms):</div>' +
          '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch (error) {
        document.getElementById('result').innerHTML = 
          '<div style="color: #dc3545; font-size: 14px; margin-bottom: 10px;">Error:</div>' +
          '<pre style="color: #ff6b6b;">' + error.message + '</pre>';
      }
    }

    function testUsers() {
      makeGraphQLRequest('query { users { id email username role } }');
    }

    function testMe() {
      makeGraphQLRequest('query { me { id email username role } }');
    }

    function testCreateUser() {
      const randomNum = Math.floor(Math.random() * 1000);
      makeGraphQLRequest(
        ` + "`" + `mutation createUser($email: String!, $username: String!, $password: String!) {
          createUser(email: $email, username: $username, password: $password) {
            id
            email
            username
            role
          }
        }` + "`" + `,
        {
          email: ` + "`user${randomNum}@example.com`" + `,
          username: ` + "`user${randomNum}`" + `,
          password: "password123"
        }
      );
    }

    function clearResult() {
      document.getElementById('result').innerHTML = '<p><em>Results cleared...</em></p>';
    }

    // Test connection on page load
    window.onload = function() {
      fetch('/health').then(res => res.json()).then(data => {
        console.log('API Status:', data);
      });
    };
  </script>
</body>
</html>`
		c.Set("Content-Type", "text/html")
		return c.SendString(html)
	})

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "3003"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("GraphQL API: http://localhost:%s/", port)
	log.Printf("Health check: http://localhost:%s/health", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
