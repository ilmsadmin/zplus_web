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
	token, err := utils.GenerateJWTWithDetails(user.ID, user.Email, user.Role, user.Username)
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

// GET /admin/users - Get all users with pagination
func (h *AdminHandler) GetUsers(c *fiber.Ctx) error {
	// TODO: Implement pagination and filtering
	users, err := h.userService.GetAllUsers()
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve users",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Users retrieved successfully",
		Data:    users,
	})
}

// GET /admin/users/:id - Get user by ID
func (h *AdminHandler) GetUser(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "User ID must be a valid integer",
			},
		})
	}

	user, err := h.userService.GetUserByID(userID)
	if err != nil {
		return c.Status(404).JSON(models.ApiResponse{
			Success: false,
			Message: "User not found",
			Error: &models.ApiError{
				Code:    "NOT_FOUND",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "User retrieved successfully",
		Data:    user,
	})
}

// POST /admin/users - Create new user
func (h *AdminHandler) CreateUser(c *fiber.Ctx) error {
	var req models.RegisterRequest
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

	user, err := h.userService.CreateUser(req)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to create user",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "User created successfully",
		Data:    user,
	})
}

// PUT /admin/users/:id - Update user
func (h *AdminHandler) UpdateUser(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "User ID must be a valid integer",
			},
		})
	}

	var req models.UpdateProfileRequest
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

	user, err := h.userService.UpdateUser(userID, req)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to update user",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "User updated successfully",
		Data:    user,
	})
}

// DELETE /admin/users/:id - Delete user
func (h *AdminHandler) DeleteUser(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "User ID must be a valid integer",
			},
		})
	}

	// Check if trying to delete self
	currentUserID := c.Locals("user_id")
	if currentUserID == userID {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Cannot delete your own account",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "You cannot delete your own user account",
			},
		})
	}

	err = h.userService.DeleteUser(userID)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to delete user",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "User deleted successfully",
	})
}

// PUT /admin/users/:id/role - Update user role
func (h *AdminHandler) UpdateUserRole(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "User ID must be a valid integer",
			},
		})
	}

	var req struct {
		Role string `json:"role" validate:"required,oneof=admin user"`
	}

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

	// Check if trying to change own role
	currentUserID := c.Locals("user_id")
	if currentUserID == userID {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Cannot change your own role",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "You cannot change your own role",
			},
		})
	}

	err = h.userService.UpdateUserRole(userID, req.Role)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to update user role",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "User role updated successfully",
	})
}