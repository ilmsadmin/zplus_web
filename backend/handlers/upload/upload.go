package upload

import (
	"crypto/sha256"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"zplus_web/backend/middleware"
	"zplus_web/backend/models"
)

type UploadHandler struct {
	uploadDir string
	maxSize   int64
}

func NewUploadHandler() *UploadHandler {
	uploadDir := "./uploads"
	// Create uploads directory if it doesn't exist
	os.MkdirAll(uploadDir, 0755)
	
	return &UploadHandler{
		uploadDir: uploadDir,
		maxSize:   10 * 1024 * 1024, // 10MB default
	}
}

type UploadResponse struct {
	FileName     string `json:"file_name"`
	OriginalName string `json:"original_name"`
	Size         int64  `json:"size"`
	MimeType     string `json:"mime_type"`
	URL          string `json:"url"`
	Hash         string `json:"hash"`
	UploadedAt   string `json:"uploaded_at"`
}

// POST /upload/image - Upload single image file
func (h *UploadHandler) UploadImage(c *fiber.Ctx) error {
	// Check authentication
	currentUser := middleware.GetCurrentUser(c)
	if currentUser["id"] == nil {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Authentication required",
			Error: &models.ApiError{
				Code:    "AUTH_REQUIRED",
				Details: "User must be authenticated to upload files",
			},
		})
	}

	// Parse multipart form
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "No file provided",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "File field is required",
			},
		})
	}

	// Validate file
	if err := h.validateImageFile(file); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid file",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Save file
	uploadResult, err := h.saveFile(file, "images")
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to save file",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Image uploaded successfully",
		Data:    uploadResult,
	})
}

// POST /upload/file - Upload general file
func (h *UploadHandler) UploadFile(c *fiber.Ctx) error {
	// Check authentication
	currentUser := middleware.GetCurrentUser(c)
	if currentUser["id"] == nil {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Authentication required",
			Error: &models.ApiError{
				Code:    "AUTH_REQUIRED",
				Details: "User must be authenticated to upload files",
			},
		})
	}

	// Parse multipart form
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "No file provided",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "File field is required",
			},
		})
	}

	// Validate file
	if err := h.validateFile(file); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid file",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Save file
	uploadResult, err := h.saveFile(file, "files")
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to save file",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "File uploaded successfully",
		Data:    uploadResult,
	})
}

// POST /upload/multiple - Upload multiple files
func (h *UploadHandler) UploadMultiple(c *fiber.Ctx) error {
	// Check authentication
	currentUser := middleware.GetCurrentUser(c)
	if currentUser["id"] == nil {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Authentication required",
			Error: &models.ApiError{
				Code:    "AUTH_REQUIRED",
				Details: "User must be authenticated to upload files",
			},
		})
	}

	// Parse multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid multipart form",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	files := form.File["files"]
	if len(files) == 0 {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "No files provided",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "At least one file is required",
			},
		})
	}

	// Limit number of files
	if len(files) > 10 {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Too many files",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: "Maximum 10 files allowed per upload",
			},
		})
	}

	var results []UploadResponse
	var errors []string

	for _, file := range files {
		// Validate file
		if err := h.validateFile(file); err != nil {
			errors = append(errors, fmt.Sprintf("%s: %s", file.Filename, err.Error()))
			continue
		}

		// Save file
		result, err := h.saveFile(file, "files")
		if err != nil {
			errors = append(errors, fmt.Sprintf("%s: %s", file.Filename, err.Error()))
			continue
		}

		results = append(results, *result)
	}

	response := map[string]interface{}{
		"uploaded": results,
		"count":    len(results),
	}

	if len(errors) > 0 {
		response["errors"] = errors
		response["error_count"] = len(errors)
	}

	return c.JSON(models.ApiResponse{
		Success: len(results) > 0,
		Message: fmt.Sprintf("Uploaded %d of %d files", len(results), len(files)),
		Data:    response,
	})
}

// GET /uploads/:category/:filename - Serve uploaded files
func (h *UploadHandler) ServeFile(c *fiber.Ctx) error {
	category := c.Params("category")
	filename := c.Params("filename")

	// Validate category
	allowedCategories := []string{"images", "files", "products"}
	isValidCategory := false
	for _, cat := range allowedCategories {
		if cat == category {
			isValidCategory = true
			break
		}
	}

	if !isValidCategory {
		return c.Status(404).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid file category",
			Error: &models.ApiError{
				Code:    "NOT_FOUND",
				Details: "File category not found",
			},
		})
	}

	// Construct file path
	filePath := filepath.Join(h.uploadDir, category, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return c.Status(404).JSON(models.ApiResponse{
			Success: false,
			Message: "File not found",
			Error: &models.ApiError{
				Code:    "NOT_FOUND",
				Details: "The requested file does not exist",
			},
		})
	}

	// Serve file
	return c.SendFile(filePath)
}

// Helper methods

func (h *UploadHandler) validateImageFile(file *multipart.FileHeader) error {
	// Check file size
	if file.Size > h.maxSize {
		return fmt.Errorf("file size exceeds maximum allowed size of %d bytes", h.maxSize)
	}

	// Check file extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExts := []string{".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
	isValidExt := false
	for _, allowedExt := range allowedExts {
		if ext == allowedExt {
			isValidExt = true
			break
		}
	}

	if !isValidExt {
		return fmt.Errorf("unsupported file type: %s. Allowed types: jpg, jpeg, png, gif, webp, svg", ext)
	}

	return nil
}

func (h *UploadHandler) validateFile(file *multipart.FileHeader) error {
	// Check file size
	if file.Size > h.maxSize {
		return fmt.Errorf("file size exceeds maximum allowed size of %d bytes", h.maxSize)
	}

	// Check file extension (blacklist dangerous files)
	ext := strings.ToLower(filepath.Ext(file.Filename))
	dangerousExts := []string{".exe", ".bat", ".cmd", ".sh", ".php", ".jsp", ".asp", ".js", ".vbs", ".scr"}
	for _, dangerousExt := range dangerousExts {
		if ext == dangerousExt {
			return fmt.Errorf("file type not allowed: %s", ext)
		}
	}

	return nil
}

func (h *UploadHandler) saveFile(file *multipart.FileHeader, category string) (*UploadResponse, error) {
	// Open uploaded file
	src, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	fileName := fmt.Sprintf("%s%s", uuid.New().String(), ext)

	// Create category directory
	categoryDir := filepath.Join(h.uploadDir, category)
	os.MkdirAll(categoryDir, 0755)

	// Create destination file
	destPath := filepath.Join(categoryDir, fileName)
	dest, err := os.Create(destPath)
	if err != nil {
		return nil, fmt.Errorf("failed to create destination file: %w", err)
	}
	defer dest.Close()

	// Copy file content and calculate hash
	hasher := sha256.New()
	writer := io.MultiWriter(dest, hasher)
	
	_, err = io.Copy(writer, src)
	if err != nil {
		os.Remove(destPath) // Clean up on error
		return nil, fmt.Errorf("failed to save file: %w", err)
	}

	// Create response
	result := &UploadResponse{
		FileName:     fileName,
		OriginalName: file.Filename,
		Size:         file.Size,
		MimeType:     file.Header.Get("Content-Type"),
		URL:          fmt.Sprintf("/uploads/%s/%s", category, fileName),
		Hash:         fmt.Sprintf("%x", hasher.Sum(nil)),
		UploadedAt:   time.Now().Format(time.RFC3339),
	}

	return result, nil
}