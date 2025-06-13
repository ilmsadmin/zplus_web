package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"zplus_web/backend/models"
	"zplus_web/backend/utils"
)

// AuthRequired middleware to check for valid JWT token
func AuthRequired() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(401).JSON(models.ApiResponse{
				Success: false,
				Message: "Authorization header required",
				Error: &models.ApiError{
					Code:    "AUTH_REQUIRED",
					Details: "Authorization header is missing",
				},
			})
		}

		// Check if header starts with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(401).JSON(models.ApiResponse{
				Success: false,
				Message: "Invalid authorization header format",
				Error: &models.ApiError{
					Code:    "AUTH_INVALID",
					Details: "Authorization header must start with 'Bearer '",
				},
			})
		}

		// Extract the token
		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ValidateJWT(token)
		if err != nil {
			return c.Status(401).JSON(models.ApiResponse{
				Success: false,
				Message: "Invalid or expired token",
				Error: &models.ApiError{
					Code:    "AUTH_INVALID",
					Details: err.Error(),
				},
			})
		}

		// Store user info in context
		c.Locals("user_id", claims.UserID)
		c.Locals("user_email", claims.Email)
		c.Locals("user_role", claims.Role)
		c.Locals("user_username", claims.Username)

		return c.Next()
	}
}

// AdminRequired middleware to check for admin role
func AdminRequired() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole := c.Locals("user_role")
		if userRole == nil || userRole.(string) != "admin" {
			return c.Status(403).JSON(models.ApiResponse{
				Success: false,
				Message: "Admin access required",
				Error: &models.ApiError{
					Code:    "PERMISSION_DENIED",
					Details: "Admin role required to access this resource",
				},
			})
		}
		return c.Next()
	}
}

// GetCurrentUser returns current user info from context
func GetCurrentUser(c *fiber.Ctx) map[string]interface{} {
	return map[string]interface{}{
		"id":       c.Locals("user_id"),
		"email":    c.Locals("user_email"),
		"role":     c.Locals("user_role"),
		"username": c.Locals("user_username"),
	}
}