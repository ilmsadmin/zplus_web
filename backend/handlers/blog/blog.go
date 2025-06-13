package blog

import (
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"zplus_web/backend/middleware"
	"zplus_web/backend/models"
	"zplus_web/backend/services"
)

type BlogHandler struct {
	blogService *services.BlogService
	validator   *validator.Validate
}

func NewBlogHandler(blogService *services.BlogService) *BlogHandler {
	return &BlogHandler{
		blogService: blogService,
		validator:   validator.New(),
	}
}

// GET /blog/posts - Get published blog posts (public)
func (h *BlogHandler) GetPosts(c *fiber.Ctx) error {
	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	category := c.Query("category")
	featured := c.Query("featured")
	search := c.Query("search")

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get posts from database
	posts, total, err := h.blogService.GetPosts(page, limit, category, featured, search)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve blog posts",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Calculate pagination info
	totalPages := (total + limit - 1) / limit
	hasNext := page < totalPages
	hasPrev := page > 1

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Blog posts retrieved successfully",
		Data: map[string]interface{}{
			"posts": posts,
			"pagination": map[string]interface{}{
				"current_page": page,
				"total_pages":  totalPages,
				"total_items":  total,
				"items_per_page": limit,
				"has_next":     hasNext,
				"has_prev":     hasPrev,
			},
		},
	})
}

// GET /blog/posts/:slug - Get single blog post by slug
func (h *BlogHandler) GetPost(c *fiber.Ctx) error {
	slug := c.Params("slug")

	if slug == "" {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Post slug is required",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Slug parameter is missing",
			},
		})
	}

	// Get post from database
	post, err := h.blogService.GetPostBySlug(slug)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.Status(404).JSON(models.ApiResponse{
				Success: false,
				Message: "Blog post not found",
				Error: &models.ApiError{
					Code:    "NOT_FOUND",
					Details: "No published post found with this slug",
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve blog post",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Blog post retrieved successfully",
		Data:    post,
	})
}

// GET /blog/categories - Get all blog categories
func (h *BlogHandler) GetCategories(c *fiber.Ctx) error {
	// Get categories from database
	categories, err := h.blogService.GetCategories()
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve blog categories",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Blog categories retrieved successfully",
		Data:    categories,
	})
}

// Admin Blog Endpoints

// GET /admin/blog/posts - Get all blog posts for admin
func (h *BlogHandler) AdminGetPosts(c *fiber.Ctx) error {
	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get posts from database
	posts, total, err := h.blogService.AdminGetPosts(page, limit)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve blog posts",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Calculate pagination info
	totalPages := (total + limit - 1) / limit
	hasNext := page < totalPages
	hasPrev := page > 1

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Admin blog posts retrieved successfully",
		Data: map[string]interface{}{
			"posts": posts,
			"pagination": map[string]interface{}{
				"current_page": page,
				"total_pages":  totalPages,
				"total_items":  total,
				"items_per_page": limit,
				"has_next":     hasNext,
				"has_prev":     hasPrev,
			},
		},
	})
}

// POST /admin/blog/posts - Create new blog post
func (h *BlogHandler) AdminCreatePost(c *fiber.Ctx) error {
	type CreatePostRequest struct {
		Title         string   `json:"title" validate:"required,max=255"`
		Slug          string   `json:"slug" validate:"required,max=255"`
		Content       string   `json:"content" validate:"required"`
		Excerpt       string   `json:"excerpt,omitempty"`
		FeaturedImage string   `json:"featured_image,omitempty"`
		Status        string   `json:"status" validate:"required,oneof=draft published private"`
		IsFeatured    bool     `json:"is_featured"`
		Categories    []int    `json:"categories"`
	}

	var req CreatePostRequest
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

	// Get current user from context
	currentUser := middleware.GetCurrentUser(c)
	authorID, ok := currentUser["id"].(int)
	if !ok {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Unable to get user information",
			Error: &models.ApiError{
				Code:    "AUTH_INVALID",
				Details: "User ID not found in token",
			},
		})
	}

	// Create post
	post, err := h.blogService.CreatePost(
		authorID,
		req.Title,
		req.Slug,
		req.Content,
		req.Excerpt,
		req.FeaturedImage,
		req.Status,
		req.IsFeatured,
	)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
			return c.Status(409).JSON(models.ApiResponse{
				Success: false,
				Message: "Post with this slug already exists",
				Error: &models.ApiError{
					Code:    "ALREADY_EXISTS",
					Details: err.Error(),
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to create blog post",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Blog post created successfully",
		Data:    post,
	})
}

// PUT /admin/blog/posts/:id - Update blog post
func (h *BlogHandler) AdminUpdatePost(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid post ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Post ID must be a number",
			},
		})
	}

	type UpdatePostRequest struct {
		Title         string `json:"title" validate:"required,max=255"`
		Slug          string `json:"slug" validate:"required,max=255"`
		Content       string `json:"content" validate:"required"`
		Excerpt       string `json:"excerpt,omitempty"`
		FeaturedImage string `json:"featured_image,omitempty"`
		Status        string `json:"status" validate:"required,oneof=draft published private"`
		IsFeatured    bool   `json:"is_featured"`
	}

	var req UpdatePostRequest
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

	// Update post
	post, err := h.blogService.UpdatePost(
		id,
		req.Title,
		req.Slug,
		req.Content,
		req.Excerpt,
		req.FeaturedImage,
		req.Status,
		req.IsFeatured,
	)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.Status(404).JSON(models.ApiResponse{
				Success: false,
				Message: "Blog post not found",
				Error: &models.ApiError{
					Code:    "NOT_FOUND",
					Details: err.Error(),
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to update blog post",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Blog post updated successfully",
		Data:    post,
	})
}

// DELETE /admin/blog/posts/:id - Delete blog post
func (h *BlogHandler) AdminDeletePost(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid post ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Post ID must be a number",
			},
		})
	}

	// Delete post
	err = h.blogService.DeletePost(id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.Status(404).JSON(models.ApiResponse{
				Success: false,
				Message: "Blog post not found",
				Error: &models.ApiError{
					Code:    "NOT_FOUND",
					Details: err.Error(),
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to delete blog post",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Blog post deleted successfully",
	})
}

// POST /admin/blog/categories - Create blog category
func (h *BlogHandler) AdminCreateCategory(c *fiber.Ctx) error {
	type CreateCategoryRequest struct {
		Name        string `json:"name" validate:"required,max=100"`
		Slug        string `json:"slug" validate:"required,max=100"`
		Description string `json:"description,omitempty"`
	}

	var req CreateCategoryRequest
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

	// Create category
	category, err := h.blogService.CreateCategory(req.Name, req.Slug, req.Description)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
			return c.Status(409).JSON(models.ApiResponse{
				Success: false,
				Message: "Category with this slug already exists",
				Error: &models.ApiError{
					Code:    "ALREADY_EXISTS",
					Details: err.Error(),
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to create blog category",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Blog category created successfully",
		Data:    category,
	})
}