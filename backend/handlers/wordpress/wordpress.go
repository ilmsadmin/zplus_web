package wordpress

import (
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"zplus_web/backend/models"
	"zplus_web/backend/services"
)

type WordPressHandler struct {
	wordpressService *services.WordPressService
	blogService      *services.BlogService
	validator        *validator.Validate
}

func NewWordPressHandler(wordpressService *services.WordPressService, blogService *services.BlogService) *WordPressHandler {
	return &WordPressHandler{
		wordpressService: wordpressService,
		blogService:      blogService,
		validator:        validator.New(),
	}
}

// GET /admin/wordpress/sites - Get all WordPress sites
func (h *WordPressHandler) GetSites(c *fiber.Ctx) error {
	sites, err := h.wordpressService.GetWordPressSites()
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to get WordPress sites",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "WordPress sites retrieved successfully",
		Data:    sites,
	})
}

// POST /admin/wordpress/sites - Create new WordPress site
func (h *WordPressHandler) CreateSite(c *fiber.Ctx) error {
	type CreateSiteRequest struct {
		Name                string  `json:"name" validate:"required,max=255"`
		URL                 string  `json:"url" validate:"required,url"`
		APIEndpoint         string  `json:"api_endpoint" validate:"required,url"`
		Username            *string `json:"username,omitempty"`
		ApplicationPassword *string `json:"application_password,omitempty"`
		IsActive            bool    `json:"is_active"`
	}

	var req CreateSiteRequest
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

	// Create site model
	site := models.WordPressSite{
		Name:                req.Name,
		URL:                 req.URL,
		APIEndpoint:         req.APIEndpoint,
		Username:            req.Username,
		ApplicationPassword: req.ApplicationPassword,
		IsActive:            req.IsActive,
	}

	// Test connection before creating
	if err := h.wordpressService.TestWordPressConnection(site); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to connect to WordPress site",
			Error: &models.ApiError{
				Code:    "CONNECTION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Create site
	createdSite, err := h.wordpressService.CreateWordPressSite(site)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to create WordPress site",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "WordPress site created successfully",
		Data:    createdSite,
	})
}

// POST /admin/wordpress/sites/:id/test - Test WordPress connection
func (h *WordPressHandler) TestConnection(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid site ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Site ID must be a number",
			},
		})
	}

	sites, err := h.wordpressService.GetWordPressSites()
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to get WordPress site",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	var site *models.WordPressSite
	for _, s := range sites {
		if s.ID == id {
			site = &s
			break
		}
	}

	if site == nil {
		return c.Status(404).JSON(models.ApiResponse{
			Success: false,
			Message: "WordPress site not found",
			Error: &models.ApiError{
				Code:    "NOT_FOUND",
				Details: "Site not found",
			},
		})
	}

	err = h.wordpressService.TestWordPressConnection(*site)
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "WordPress connection failed",
			Error: &models.ApiError{
				Code:    "CONNECTION_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "WordPress connection successful",
	})
}

// POST /admin/wordpress/sites/:id/sync - Sync content from WordPress
func (h *WordPressHandler) SyncFromWordPress(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid site ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Site ID must be a number",
			},
		})
	}

	err = h.wordpressService.SyncPostsFromWordPress(id, h.blogService)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "WordPress sync failed",
			Error: &models.ApiError{
				Code:    "SYNC_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "WordPress content synchronized successfully",
	})
}

// POST /admin/wordpress/sites/:id/publish/:post_id - Publish post to WordPress
func (h *WordPressHandler) PublishToWordPress(c *fiber.Ctx) error {
	siteID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid site ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Site ID must be a number",
			},
		})
	}

	postID, err := strconv.Atoi(c.Params("post_id"))
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

	err = h.wordpressService.SyncPostToWordPress(siteID, postID)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to publish post to WordPress",
			Error: &models.ApiError{
				Code:    "SYNC_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Post published to WordPress successfully",
	})
}

// GET /admin/wordpress/sites/:id/logs - Get sync logs
func (h *WordPressHandler) GetSyncLogs(c *fiber.Ctx) error {
	siteID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid site ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Site ID must be a number",
			},
		})
	}

	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "50"))

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 50
	}

	logs, total, err := h.wordpressService.GetSyncLogs(siteID, page, limit)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to get sync logs",
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
		Message: "Sync logs retrieved successfully",
		Data: map[string]interface{}{
			"logs": logs,
			"pagination": map[string]interface{}{
				"current_page":   page,
				"total_pages":    totalPages,
				"total_items":    total,
				"items_per_page": limit,
				"has_next":       hasNext,
				"has_prev":       hasPrev,
			},
		},
	})
}

// POST /admin/wordpress/webhook - Handle WordPress webhook
func (h *WordPressHandler) HandleWebhook(c *fiber.Ctx) error {
	// TODO: Implement WordPress webhook handling for real-time content sync
	// This would handle incoming webhooks from WordPress when content is updated
	
	type WebhookPayload struct {
		Action string                 `json:"action"`
		PostID int                    `json:"post_id"`
		Post   map[string]interface{} `json:"post"`
	}

	var payload WebhookPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid webhook payload",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Process webhook based on action
	switch payload.Action {
	case "post_updated", "post_published":
		// TODO: Sync specific post from WordPress
		// For now, just log the webhook
		return c.JSON(models.ApiResponse{
			Success: true,
			Message: "Webhook received and queued for processing",
		})
	case "post_deleted":
		// TODO: Handle post deletion
		return c.JSON(models.ApiResponse{
			Success: true,
			Message: "Post deletion webhook received",
		})
	default:
		return c.JSON(models.ApiResponse{
			Success: true,
			Message: "Webhook received but action not supported",
		})
	}
}