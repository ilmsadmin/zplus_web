package services

import (
	"database/sql"
	"fmt"
	"strings"

	"zplus_web/backend/models"
)

type ProjectService struct {
	db *sql.DB
}

func NewProjectService(db *sql.DB) *ProjectService {
	return &ProjectService{db: db}
}

// GetProjects retrieves active projects with optional filtering
func (s *ProjectService) GetProjects(page, limit int, status, featured, search string) ([]models.Project, int, error) {
	offset := (page - 1) * limit
	
	// Build query conditions
	conditions := []string{}
	args := []interface{}{}
	argCount := 0

	if status != "" {
		argCount++
		conditions = append(conditions, fmt.Sprintf("status = $%d", argCount))
		args = append(args, status)
	}

	if featured == "true" {
		conditions = append(conditions, "is_featured = true")
	}

	if search != "" {
		argCount++
		conditions = append(conditions, fmt.Sprintf("(name ILIKE $%d OR description ILIKE $%d)", argCount, argCount))
		args = append(args, "%"+search+"%")
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Get total count
	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM projects %s", whereClause)
	err := s.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count projects: %w", err)
	}

	// Get projects with pagination
	args = append(args, limit, offset)
	query := fmt.Sprintf(`
		SELECT id, name, slug, description, short_description, featured_image, 
		       gallery_images, technologies, project_url, github_url, demo_url,
		       status, start_date, end_date, is_featured, sort_order, created_at, updated_at
		FROM projects %s
		ORDER BY sort_order ASC, created_at DESC
		LIMIT $%d OFFSET $%d`, whereClause, len(args)-1, len(args))

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get projects: %w", err)
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var project models.Project
		err := rows.Scan(
			&project.ID, &project.Name, &project.Slug, &project.Description, &project.ShortDescription,
			&project.FeaturedImage, &project.GalleryImages, &project.Technologies, &project.ProjectURL,
			&project.GithubURL, &project.DemoURL, &project.Status, &project.StartDate, &project.EndDate,
			&project.IsFeatured, &project.SortOrder, &project.CreatedAt, &project.UpdatedAt)
		
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan project: %w", err)
		}

		projects = append(projects, project)
	}

	return projects, total, nil
}

// GetProjectBySlug retrieves a single project by slug
func (s *ProjectService) GetProjectBySlug(slug string) (*models.Project, error) {
	var project models.Project
	
	err := s.db.QueryRow(`
		SELECT id, name, slug, description, short_description, featured_image, 
		       gallery_images, technologies, project_url, github_url, demo_url,
		       status, start_date, end_date, is_featured, sort_order, created_at, updated_at
		FROM projects WHERE slug = $1`, slug).Scan(
		&project.ID, &project.Name, &project.Slug, &project.Description, &project.ShortDescription,
		&project.FeaturedImage, &project.GalleryImages, &project.Technologies, &project.ProjectURL,
		&project.GithubURL, &project.DemoURL, &project.Status, &project.StartDate, &project.EndDate,
		&project.IsFeatured, &project.SortOrder, &project.CreatedAt, &project.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("project not found")
	} else if err != nil {
		return nil, fmt.Errorf("failed to get project: %w", err)
	}

	return &project, nil
}

// Admin methods

// AdminGetProjects retrieves all projects for admin
func (s *ProjectService) AdminGetProjects(page, limit int) ([]models.Project, int, error) {
	offset := (page - 1) * limit

	// Get total count
	var total int
	err := s.db.QueryRow("SELECT COUNT(*) FROM projects").Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count projects: %w", err)
	}

	// Get projects with pagination
	rows, err := s.db.Query(`
		SELECT id, name, slug, description, short_description, featured_image, 
		       gallery_images, technologies, project_url, github_url, demo_url,
		       status, start_date, end_date, is_featured, sort_order, created_at, updated_at
		FROM projects
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2`, limit, offset)

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get projects: %w", err)
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var project models.Project
		err := rows.Scan(
			&project.ID, &project.Name, &project.Slug, &project.Description, &project.ShortDescription,
			&project.FeaturedImage, &project.GalleryImages, &project.Technologies, &project.ProjectURL,
			&project.GithubURL, &project.DemoURL, &project.Status, &project.StartDate, &project.EndDate,
			&project.IsFeatured, &project.SortOrder, &project.CreatedAt, &project.UpdatedAt)
		
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan project: %w", err)
		}

		projects = append(projects, project)
	}

	return projects, total, nil
}

// CreateProject creates a new project
func (s *ProjectService) CreateProject(req models.Project) (*models.Project, error) {
	var project models.Project

	err := s.db.QueryRow(`
		INSERT INTO projects (name, slug, description, short_description, featured_image, 
		                     gallery_images, technologies, project_url, github_url, demo_url,
		                     status, start_date, end_date, is_featured, sort_order, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, name, slug, description, short_description, featured_image, 
		          gallery_images, technologies, project_url, github_url, demo_url,
		          status, start_date, end_date, is_featured, sort_order, created_at, updated_at`,
		req.Name, req.Slug, req.Description, req.ShortDescription, req.FeaturedImage,
		req.GalleryImages, req.Technologies, req.ProjectURL, req.GithubURL, req.DemoURL,
		req.Status, req.StartDate, req.EndDate, req.IsFeatured, req.SortOrder).Scan(
		&project.ID, &project.Name, &project.Slug, &project.Description, &project.ShortDescription,
		&project.FeaturedImage, &project.GalleryImages, &project.Technologies, &project.ProjectURL,
		&project.GithubURL, &project.DemoURL, &project.Status, &project.StartDate, &project.EndDate,
		&project.IsFeatured, &project.SortOrder, &project.CreatedAt, &project.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create project: %w", err)
	}

	return &project, nil
}

// UpdateProject updates an existing project
func (s *ProjectService) UpdateProject(id int, req models.Project) (*models.Project, error) {
	var project models.Project

	err := s.db.QueryRow(`
		UPDATE projects 
		SET name = $1, slug = $2, description = $3, short_description = $4, featured_image = $5,
		    gallery_images = $6, technologies = $7, project_url = $8, github_url = $9, demo_url = $10,
		    status = $11, start_date = $12, end_date = $13, is_featured = $14, sort_order = $15,
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $16
		RETURNING id, name, slug, description, short_description, featured_image, 
		          gallery_images, technologies, project_url, github_url, demo_url,
		          status, start_date, end_date, is_featured, sort_order, created_at, updated_at`,
		req.Name, req.Slug, req.Description, req.ShortDescription, req.FeaturedImage,
		req.GalleryImages, req.Technologies, req.ProjectURL, req.GithubURL, req.DemoURL,
		req.Status, req.StartDate, req.EndDate, req.IsFeatured, req.SortOrder, id).Scan(
		&project.ID, &project.Name, &project.Slug, &project.Description, &project.ShortDescription,
		&project.FeaturedImage, &project.GalleryImages, &project.Technologies, &project.ProjectURL,
		&project.GithubURL, &project.DemoURL, &project.Status, &project.StartDate, &project.EndDate,
		&project.IsFeatured, &project.SortOrder, &project.CreatedAt, &project.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("project not found")
		}
		return nil, fmt.Errorf("failed to update project: %w", err)
	}

	return &project, nil
}

// DeleteProject deletes a project
func (s *ProjectService) DeleteProject(id int) error {
	result, err := s.db.Exec("DELETE FROM projects WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete project: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("project not found")
	}

	return nil
}