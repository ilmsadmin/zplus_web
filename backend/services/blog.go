package services

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"zplus_web/backend/models"
)

type BlogService struct {
	db *sql.DB
}

func NewBlogService(db *sql.DB) *BlogService {
	return &BlogService{db: db}
}

// GetPosts retrieves published blog posts with optional filtering
func (s *BlogService) GetPosts(page, limit int, category, featured, search string) ([]models.BlogPost, int, error) {
	offset := (page - 1) * limit
	
	// Build query conditions
	conditions := []string{"status = 'published'"}
	args := []interface{}{}
	argCount := 0

	if category != "" {
		argCount++
		conditions = append(conditions, fmt.Sprintf("id IN (SELECT post_id FROM blog_post_categories bpc JOIN blog_categories bc ON bpc.category_id = bc.id WHERE bc.slug = $%d)", argCount))
		args = append(args, category)
	}

	if featured == "true" {
		conditions = append(conditions, "is_featured = true")
	}

	if search != "" {
		argCount++
		conditions = append(conditions, fmt.Sprintf("(title ILIKE $%d OR content ILIKE $%d)", argCount, argCount))
		args = append(args, "%"+search+"%")
	}

	whereClause := strings.Join(conditions, " AND ")

	// Get total count
	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM blog_posts WHERE %s", whereClause)
	err := s.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count posts: %w", err)
	}

	// Get posts with pagination
	args = append(args, limit, offset)
	query := fmt.Sprintf(`
		SELECT p.id, p.title, p.slug, p.content, p.excerpt, p.featured_image, 
		       p.author_id, p.status, p.is_featured, p.view_count, 
		       p.published_at, p.created_at, p.updated_at,
		       u.username, u.full_name
		FROM blog_posts p
		LEFT JOIN users u ON p.author_id = u.id
		WHERE %s
		ORDER BY p.published_at DESC
		LIMIT $%d OFFSET $%d`, whereClause, len(args)-1, len(args))

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get posts: %w", err)
	}
	defer rows.Close()

	var posts []models.BlogPost
	for rows.Next() {
		var post models.BlogPost
		var author models.User
		err := rows.Scan(
			&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt, &post.FeaturedImage,
			&post.AuthorID, &post.Status, &post.IsFeatured, &post.ViewCount,
			&post.PublishedAt, &post.CreatedAt, &post.UpdatedAt,
			&author.Username, &author.FullName)
		
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan post: %w", err)
		}

		if post.AuthorID != nil {
			author.ID = *post.AuthorID
			post.Author = &author
		}

		posts = append(posts, post)
	}

	return posts, total, nil
}

// GetPostBySlug retrieves a single blog post by slug
func (s *BlogService) GetPostBySlug(slug string) (*models.BlogPost, error) {
	var post models.BlogPost
	var author models.User
	
	err := s.db.QueryRow(`
		SELECT p.id, p.title, p.slug, p.content, p.excerpt, p.featured_image, 
		       p.author_id, p.status, p.is_featured, p.view_count, 
		       p.published_at, p.created_at, p.updated_at,
		       u.username, u.full_name
		FROM blog_posts p
		LEFT JOIN users u ON p.author_id = u.id
		WHERE p.slug = $1 AND p.status = 'published'`, slug).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt, &post.FeaturedImage,
		&post.AuthorID, &post.Status, &post.IsFeatured, &post.ViewCount,
		&post.PublishedAt, &post.CreatedAt, &post.UpdatedAt,
		&author.Username, &author.FullName)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("post not found")
	} else if err != nil {
		return nil, fmt.Errorf("failed to get post: %w", err)
	}

	if post.AuthorID != nil {
		author.ID = *post.AuthorID
		post.Author = &author
	}

	// Increment view count
	s.db.Exec("UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1", post.ID)

	// Get categories
	categories, err := s.getPostCategories(post.ID)
	if err == nil {
		post.Categories = categories
	}

	return &post, nil
}

// GetCategories retrieves all blog categories
func (s *BlogService) GetCategories() ([]models.BlogCategory, error) {
	rows, err := s.db.Query(`
		SELECT id, name, slug, description, created_at
		FROM blog_categories
		ORDER BY name`)
	
	if err != nil {
		return nil, fmt.Errorf("failed to get categories: %w", err)
	}
	defer rows.Close()

	var categories []models.BlogCategory
	for rows.Next() {
		var category models.BlogCategory
		err := rows.Scan(&category.ID, &category.Name, &category.Slug, &category.Description, &category.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan category: %w", err)
		}
		categories = append(categories, category)
	}

	return categories, nil
}

// Admin methods

// AdminGetPosts retrieves all posts for admin (including drafts)
func (s *BlogService) AdminGetPosts(page, limit int) ([]models.BlogPost, int, error) {
	offset := (page - 1) * limit

	// Get total count
	var total int
	err := s.db.QueryRow("SELECT COUNT(*) FROM blog_posts").Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count posts: %w", err)
	}

	// Get posts with pagination
	rows, err := s.db.Query(`
		SELECT p.id, p.title, p.slug, p.content, p.excerpt, p.featured_image, 
		       p.author_id, p.status, p.is_featured, p.view_count, 
		       p.published_at, p.created_at, p.updated_at,
		       u.username, u.full_name
		FROM blog_posts p
		LEFT JOIN users u ON p.author_id = u.id
		ORDER BY p.created_at DESC
		LIMIT $1 OFFSET $2`, limit, offset)

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get posts: %w", err)
	}
	defer rows.Close()

	var posts []models.BlogPost
	for rows.Next() {
		var post models.BlogPost
		var author models.User
		err := rows.Scan(
			&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt, &post.FeaturedImage,
			&post.AuthorID, &post.Status, &post.IsFeatured, &post.ViewCount,
			&post.PublishedAt, &post.CreatedAt, &post.UpdatedAt,
			&author.Username, &author.FullName)
		
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan post: %w", err)
		}

		if post.AuthorID != nil {
			author.ID = *post.AuthorID
			post.Author = &author
		}

		posts = append(posts, post)
	}

	return posts, total, nil
}

// CreatePost creates a new blog post
func (s *BlogService) CreatePost(authorID int, title, slug, content, excerpt, featuredImage, status string, isFeatured bool) (*models.BlogPost, error) {
	var post models.BlogPost
	var publishedAt *time.Time
	
	if status == "published" {
		now := time.Now()
		publishedAt = &now
	}

	err := s.db.QueryRow(`
		INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author_id, status, is_featured, published_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, title, slug, content, excerpt, featured_image, author_id, status, is_featured, view_count, published_at, created_at, updated_at`,
		title, slug, content, excerpt, featuredImage, authorID, status, isFeatured, publishedAt).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt, &post.FeaturedImage,
		&post.AuthorID, &post.Status, &post.IsFeatured, &post.ViewCount,
		&post.PublishedAt, &post.CreatedAt, &post.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create post: %w", err)
	}

	return &post, nil
}

// UpdatePost updates an existing blog post
func (s *BlogService) UpdatePost(id int, title, slug, content, excerpt, featuredImage, status string, isFeatured bool) (*models.BlogPost, error) {
	var post models.BlogPost
	var publishedAt *time.Time
	
	if status == "published" {
		// Check if post was previously published
		var currentStatus string
		s.db.QueryRow("SELECT status FROM blog_posts WHERE id = $1", id).Scan(&currentStatus)
		
		if currentStatus != "published" {
			now := time.Now()
			publishedAt = &now
		}
	}

	query := `
		UPDATE blog_posts 
		SET title = $1, slug = $2, content = $3, excerpt = $4, featured_image = $5, 
		    status = $6, is_featured = $7, updated_at = CURRENT_TIMESTAMP`
	args := []interface{}{title, slug, content, excerpt, featuredImage, status, isFeatured}
	
	if publishedAt != nil {
		query += ", published_at = $8 WHERE id = $9"
		args = append(args, publishedAt, id)
	} else {
		query += " WHERE id = $8"
		args = append(args, id)
	}
	
	query += ` RETURNING id, title, slug, content, excerpt, featured_image, author_id, status, is_featured, view_count, published_at, created_at, updated_at`

	err := s.db.QueryRow(query, args...).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt, &post.FeaturedImage,
		&post.AuthorID, &post.Status, &post.IsFeatured, &post.ViewCount,
		&post.PublishedAt, &post.CreatedAt, &post.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to update post: %w", err)
	}

	return &post, nil
}

// DeletePost deletes a blog post
func (s *BlogService) DeletePost(id int) error {
	result, err := s.db.Exec("DELETE FROM blog_posts WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete post: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("post not found")
	}

	return nil
}

// CreateCategory creates a new blog category
func (s *BlogService) CreateCategory(name, slug, description string) (*models.BlogCategory, error) {
	var category models.BlogCategory
	
	err := s.db.QueryRow(`
		INSERT INTO blog_categories (name, slug, description, created_at)
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
		RETURNING id, name, slug, description, created_at`,
		name, slug, description).Scan(
		&category.ID, &category.Name, &category.Slug, &category.Description, &category.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create category: %w", err)
	}

	return &category, nil
}

// Helper function to get post categories
func (s *BlogService) getPostCategories(postID int) ([]models.BlogCategory, error) {
	rows, err := s.db.Query(`
		SELECT bc.id, bc.name, bc.slug, bc.description, bc.created_at
		FROM blog_categories bc
		JOIN blog_post_categories bpc ON bc.id = bpc.category_id
		WHERE bpc.post_id = $1`, postID)
	
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []models.BlogCategory
	for rows.Next() {
		var category models.BlogCategory
		err := rows.Scan(&category.ID, &category.Name, &category.Slug, &category.Description, &category.CreatedAt)
		if err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	return categories, nil
}