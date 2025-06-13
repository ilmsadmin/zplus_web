package admin

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"zplus_web/backend/models"
	"zplus_web/backend/services"
	"zplus_web/backend/utils"
)

type AdminHandler struct {
	userService *services.UserService
	validator   *validator.Validate
}

func NewAdminHandler(userService *services.UserService) *AdminHandler {
	return &AdminHandler{
		userService: userService,
		validator:   validator.New(),
	}
}

// POST /admin/auth/login - Admin login
func (h *AdminHandler) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid request body",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Validate request
	if err := h.validator.Struct(req); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Validation failed",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Authenticate user
	user, err := h.userService.AuthenticateUser(req.Email, req.Password)
	if err != nil {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid credentials",
			Error: &models.ApiError{
				Code:    "AUTH_INVALID",
				Details: "Invalid email or password",
			},
		})
	}

	// Check if user has admin role
	if user.Role != "admin" {
		return c.Status(403).JSON(models.ApiResponse{
			Success: false,
			Message: "Admin access required",
			Error: &models.ApiError{
				Code:    "PERMISSION_DENIED",
				Details: "Admin role required to access this resource",
			},
		})
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID, user.Email, user.Role, user.Username)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to generate token",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Admin login successful",
		Data: map[string]interface{}{
			"token": token,
			"user": map[string]interface{}{
				"id":       user.ID,
				"username": user.Username,
				"email":    user.Email,
				"role":     user.Role,
				"full_name": user.FullName,
			},
		},
	})
}

// GET /admin/dashboard/stats - Get dashboard statistics
func (h *AdminHandler) GetDashboardStats(c *fiber.Ctx) error {
	// TODO: Implement dashboard stats logic
	// - Get user count
	// - Get order count and revenue
	// - Get product count
	// - Get blog post count
	// - Get project count

	stats := models.DashboardStats{
		UsersCount:     150,
		OrdersCount:    45,
		Revenue:        5000.00,
		ProductsCount:  12,
		BlogPostsCount: 25,
		ProjectsCount:  8,
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Dashboard stats retrieved successfully",
		Data:    stats,
	})
}

// GET /admin/dashboard/recent-activity - Get recent system activity
func (h *AdminHandler) GetRecentActivity(c *fiber.Ctx) error {
	// TODO: Implement recent activity logic
	// - Get recent orders
	// - Get recent user registrations
	// - Get recent blog posts
	// - Get recent downloads

	activities := []map[string]interface{}{
		{
			"type":        "order",
			"description": "New order #12345 placed",
			"user":        "john@example.com",
			"timestamp":   "2024-01-15T10:30:00Z",
		},
		{
			"type":        "user",
			"description": "New user registered",
			"user":        "jane@example.com",
			"timestamp":   "2024-01-15T09:15:00Z",
		},
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Recent activity retrieved successfully",
		Data:    activities,
	})
}