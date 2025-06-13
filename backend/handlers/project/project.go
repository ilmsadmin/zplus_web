package project

import (
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"zplus_web/backend/models"
	"zplus_web/backend/services"
)

type ProjectHandler struct {
	projectService *services.ProjectService
	validator      *validator.Validate
}

func NewProjectHandler(projectService *services.ProjectService) *ProjectHandler {
	return &ProjectHandler{
		projectService: projectService,
		validator:      validator.New(),
	}
}

// Public Project Endpoints

// GET /projects - Get all projects (public)
func (h *ProjectHandler) GetProjects(c *fiber.Ctx) error {
	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	status := c.Query("status")
	featured := c.Query("featured")
	search := c.Query("search")

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get projects from database
	projects, total, err := h.projectService.GetProjects(page, limit, status, featured, search)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve projects",
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
		Message: "Projects retrieved successfully",
		Data: map[string]interface{}{
			"projects": projects,
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

// GET /projects/:slug - Get single project by slug
func (h *ProjectHandler) GetProject(c *fiber.Ctx) error {
	slug := c.Params("slug")

	if slug == "" {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Project slug is required",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Slug parameter is missing",
			},
		})
	}

	// Get project from database
	project, err := h.projectService.GetProjectBySlug(slug)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.Status(404).JSON(models.ApiResponse{
				Success: false,
				Message: "Project not found",
				Error: &models.ApiError{
					Code:    "NOT_FOUND",
					Details: "No project found with this slug",
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve project",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Project retrieved successfully",
		Data:    project,
	})
}

// Admin Project Endpoints

// GET /admin/projects - Get all projects for admin
func (h *ProjectHandler) AdminGetProjects(c *fiber.Ctx) error {
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

	// Get projects from database
	projects, total, err := h.projectService.AdminGetProjects(page, limit)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to retrieve projects",
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
		Message: "Admin projects retrieved successfully",
		Data: map[string]interface{}{
			"projects": projects,
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

// POST /admin/projects - Create new project
func (h *ProjectHandler) AdminCreateProject(c *fiber.Ctx) error {
	type CreateProjectRequest struct {
		Name             string         `json:"name" validate:"required,max=255"`
		Slug             string         `json:"slug" validate:"required,max=255"`
		Description      string         `json:"description" validate:"required"`
		ShortDescription *string        `json:"short_description,omitempty"`
		FeaturedImage    *string        `json:"featured_image,omitempty"`
		GalleryImages    pq.StringArray `json:"gallery_images,omitempty"`
		Technologies     pq.StringArray `json:"technologies,omitempty"`
		ProjectURL       *string        `json:"project_url,omitempty"`
		GithubURL        *string        `json:"github_url,omitempty"`
		DemoURL          *string        `json:"demo_url,omitempty"`
		Status           string         `json:"status" validate:"required,oneof=planning development completed maintenance"`
		StartDate        *time.Time     `json:"start_date,omitempty"`
		EndDate          *time.Time     `json:"end_date,omitempty"`
		IsFeatured       bool           `json:"is_featured"`
		SortOrder        int            `json:"sort_order"`
	}

	var req CreateProjectRequest
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

	// Create project model
	project := models.Project{
		Name:             req.Name,
		Slug:             req.Slug,
		Description:      req.Description,
		ShortDescription: req.ShortDescription,
		FeaturedImage:    req.FeaturedImage,
		GalleryImages:    req.GalleryImages,
		Technologies:     req.Technologies,
		ProjectURL:       req.ProjectURL,
		GithubURL:        req.GithubURL,
		DemoURL:          req.DemoURL,
		Status:           req.Status,
		StartDate:        req.StartDate,
		EndDate:          req.EndDate,
		IsFeatured:       req.IsFeatured,
		SortOrder:        req.SortOrder,
	}

	// Create project
	createdProject, err := h.projectService.CreateProject(project)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") {
			return c.Status(409).JSON(models.ApiResponse{
				Success: false,
				Message: "Project with this slug already exists",
				Error: &models.ApiError{
					Code:    "ALREADY_EXISTS",
					Details: err.Error(),
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to create project",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Project created successfully",
		Data:    createdProject,
	})
}

// PUT /admin/projects/:id - Update project
func (h *ProjectHandler) AdminUpdateProject(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid project ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Project ID must be a number",
			},
		})
	}

	type UpdateProjectRequest struct {
		Name             string         `json:"name" validate:"required,max=255"`
		Slug             string         `json:"slug" validate:"required,max=255"`
		Description      string         `json:"description" validate:"required"`
		ShortDescription *string        `json:"short_description,omitempty"`
		FeaturedImage    *string        `json:"featured_image,omitempty"`
		GalleryImages    pq.StringArray `json:"gallery_images,omitempty"`
		Technologies     pq.StringArray `json:"technologies,omitempty"`
		ProjectURL       *string        `json:"project_url,omitempty"`
		GithubURL        *string        `json:"github_url,omitempty"`
		DemoURL          *string        `json:"demo_url,omitempty"`
		Status           string         `json:"status" validate:"required,oneof=planning development completed maintenance"`
		StartDate        *time.Time     `json:"start_date,omitempty"`
		EndDate          *time.Time     `json:"end_date,omitempty"`
		IsFeatured       bool           `json:"is_featured"`
		SortOrder        int            `json:"sort_order"`
	}

	var req UpdateProjectRequest
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

	// Create project model
	project := models.Project{
		Name:             req.Name,
		Slug:             req.Slug,
		Description:      req.Description,
		ShortDescription: req.ShortDescription,
		FeaturedImage:    req.FeaturedImage,
		GalleryImages:    req.GalleryImages,
		Technologies:     req.Technologies,
		ProjectURL:       req.ProjectURL,
		GithubURL:        req.GithubURL,
		DemoURL:          req.DemoURL,
		Status:           req.Status,
		StartDate:        req.StartDate,
		EndDate:          req.EndDate,
		IsFeatured:       req.IsFeatured,
		SortOrder:        req.SortOrder,
	}

	// Update project
	updatedProject, err := h.projectService.UpdateProject(id, project)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.Status(404).JSON(models.ApiResponse{
				Success: false,
				Message: "Project not found",
				Error: &models.ApiError{
					Code:    "NOT_FOUND",
					Details: err.Error(),
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to update project",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Project updated successfully",
		Data:    updatedProject,
	})
}

// DELETE /admin/projects/:id - Delete project
func (h *ProjectHandler) AdminDeleteProject(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid project ID",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Project ID must be a number",
			},
		})
	}

	// Delete project
	err = h.projectService.DeleteProject(id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.Status(404).JSON(models.ApiResponse{
				Success: false,
				Message: "Project not found",
				Error: &models.ApiError{
					Code:    "NOT_FOUND",
					Details: err.Error(),
				},
			})
		}
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to delete project",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Project deleted successfully",
	})
}