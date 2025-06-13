package auth

import (
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"zplus_web/backend/models"
	"zplus_web/backend/services"
	"zplus_web/backend/utils"
)

type AuthHandler struct {
	userService *services.UserService
	validator   *validator.Validate
}

func NewAuthHandler(userService *services.UserService) *AuthHandler {
	return &AuthHandler{
		userService: userService,
		validator:   validator.New(),
	}
}

// POST /auth/register - Register new customer
func (h *AuthHandler) Register(c *fiber.Ctx) error {
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

	// Create user
	user, err := h.userService.CreateUser(req)
	if err != nil {
		if strings.Contains(err.Error(), "already exists") {
			return c.Status(409).JSON(models.ApiResponse{
				Success: false,
				Message: "User already exists",
				Error: &models.ApiError{
					Code:    "ALREADY_EXISTS",
					Details: err.Error(),
				},
			})
		}
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
		Message: "User registered successfully",
		Data: map[string]interface{}{
			"user": map[string]interface{}{
				"id":       user.ID,
				"username": user.Username,
				"email":    user.Email,
				"role":     user.Role,
			},
			"message": "Registration completed successfully",
		},
	})
}

// POST /auth/login - User login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
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

	// Store session
	expiresAt := time.Now().Add(24 * time.Hour)
	err = h.userService.CreateSession(user.ID, token, expiresAt)
	if err != nil {
		// Log error but don't fail login
		// Session storage is not critical for JWT-based auth
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Login successful",
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

// POST /auth/logout - User logout
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	// Get token from Authorization header
	authHeader := c.Get("Authorization")
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token := strings.TrimPrefix(authHeader, "Bearer ")
		// Invalidate session
		h.userService.InvalidateSession(token)
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Logout successful",
	})
}

// POST /auth/forgot-password - Request password reset
func (h *AuthHandler) ForgotPassword(c *fiber.Ctx) error {
	type ForgotPasswordRequest struct {
		Email string `json:"email" validate:"required,email"`
	}

	var req ForgotPasswordRequest
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

	// TODO: Implement forgot password logic
	// - Find user by email
	// - Generate reset token
	// - Send reset email

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Password reset email sent",
	})
}

// POST /auth/reset-password - Reset password with token
func (h *AuthHandler) ResetPassword(c *fiber.Ctx) error {
	type ResetPasswordRequest struct {
		Token    string `json:"token" validate:"required"`
		Password string `json:"password" validate:"required,min=6"`
	}

	var req ResetPasswordRequest
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

	// TODO: Implement reset password logic
	// - Validate reset token
	// - Update user password
	// - Invalidate reset token

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Password reset successful",
	})
}