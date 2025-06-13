package services

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"zplus_web/backend/models"
)

type WordPressService struct {
	db *sql.DB
}

func NewWordPressService(db *sql.DB) *WordPressService {
	return &WordPressService{db: db}
}

// WordPress API structures
type WordPressPost struct {
	ID      int    `json:"id"`
	Title   struct {
		Rendered string `json:"rendered"`
	} `json:"title"`
	Content struct {
		Rendered string `json:"rendered"`
	} `json:"content"`
	Excerpt struct {
		Rendered string `json:"rendered"`
	} `json:"excerpt"`
	Status      string    `json:"status"`
	Date        time.Time `json:"date"`
	Modified    time.Time `json:"modified"`
	Slug        string    `json:"slug"`
	FeaturedMedia int     `json:"featured_media"`
}

// GetWordPressSites retrieves all configured WordPress sites
func (s *WordPressService) GetWordPressSites() ([]models.WordPressSite, error) {
	rows, err := s.db.Query(`
		SELECT id, name, url, api_endpoint, username, is_active, last_sync_at, created_at, updated_at
		FROM wordpress_sites
		WHERE is_active = true
		ORDER BY name`)

	if err != nil {
		return nil, fmt.Errorf("failed to get WordPress sites: %w", err)
	}
	defer rows.Close()

	var sites []models.WordPressSite
	for rows.Next() {
		var site models.WordPressSite
		err := rows.Scan(
			&site.ID, &site.Name, &site.URL, &site.APIEndpoint, &site.Username,
			&site.IsActive, &site.LastSyncAt, &site.CreatedAt, &site.UpdatedAt)

		if err != nil {
			return nil, fmt.Errorf("failed to scan WordPress site: %w", err)
		}

		sites = append(sites, site)
	}

	return sites, nil
}

// CreateWordPressSite creates a new WordPress site configuration
func (s *WordPressService) CreateWordPressSite(site models.WordPressSite) (*models.WordPressSite, error) {
	var created models.WordPressSite

	err := s.db.QueryRow(`
		INSERT INTO wordpress_sites (name, url, api_endpoint, username, application_password, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, name, url, api_endpoint, username, is_active, last_sync_at, created_at, updated_at`,
		site.Name, site.URL, site.APIEndpoint, site.Username, site.ApplicationPassword, site.IsActive).Scan(
		&created.ID, &created.Name, &created.URL, &created.APIEndpoint, &created.Username,
		&created.IsActive, &created.LastSyncAt, &created.CreatedAt, &created.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create WordPress site: %w", err)
	}

	return &created, nil
}

// SyncPostsFromWordPress syncs posts from WordPress to local blog
func (s *WordPressService) SyncPostsFromWordPress(siteID int, blogService *BlogService) error {
	// Get site configuration
	site, err := s.getWordPressSite(siteID)
	if err != nil {
		return fmt.Errorf("failed to get WordPress site: %w", err)
	}

	// Fetch posts from WordPress API
	posts, err := s.fetchWordPressPosts(site)
	if err != nil {
		return fmt.Errorf("failed to fetch WordPress posts: %w", err)
	}

	// Process each post
	for _, wpPost := range posts {
		err := s.syncSinglePost(siteID, wpPost, blogService)
		if err != nil {
			// Log error but continue with other posts
			s.logSyncError(siteID, "post_sync", &wpPost.ID, nil, err.Error())
			continue
		}
	}

	// Update last sync time
	s.updateLastSyncTime(siteID)

	return nil
}

// SyncPostToWordPress syncs a local blog post to WordPress
func (s *WordPressService) SyncPostToWordPress(siteID, postID int) error {
	// Get site configuration
	site, err := s.getWordPressSite(siteID)
	if err != nil {
		return fmt.Errorf("failed to get WordPress site: %w", err)
	}

	// Get local post
	post, err := s.getLocalPost(postID)
	if err != nil {
		return fmt.Errorf("failed to get local post: %w", err)
	}

	// Convert to WordPress format
	wpPost := s.convertToWordPressPost(post)

	// Send to WordPress
	err = s.sendPostToWordPress(site, wpPost)
	if err != nil {
		s.logSyncError(siteID, "post_create", &postID, nil, err.Error())
		return fmt.Errorf("failed to sync post to WordPress: %w", err)
	}

	// Log successful sync
	s.logSyncSuccess(siteID, "post_create", &postID, nil)

	return nil
}

// TestWordPressConnection tests connection to a WordPress site
func (s *WordPressService) TestWordPressConnection(site models.WordPressSite) error {
	client := &http.Client{Timeout: 10 * time.Second}

	// Test API endpoint
	req, err := http.NewRequest("GET", site.APIEndpoint+"/posts?per_page=1", nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Add authentication if provided
	if site.Username != nil && site.ApplicationPassword != nil {
		req.SetBasicAuth(*site.Username, *site.ApplicationPassword)
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to connect to WordPress: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("WordPress API returned status %d", resp.StatusCode)
	}

	return nil
}

// GetSyncLogs retrieves synchronization logs
func (s *WordPressService) GetSyncLogs(siteID int, page, limit int) ([]models.ContentSyncLog, int, error) {
	offset := (page - 1) * limit

	// Get total count
	var total int
	err := s.db.QueryRow("SELECT COUNT(*) FROM content_sync_logs WHERE site_id = $1", siteID).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count sync logs: %w", err)
	}

	// Get logs with pagination
	rows, err := s.db.Query(`
		SELECT id, site_id, sync_type, local_content_id, remote_content_id, status, error_message, created_at
		FROM content_sync_logs
		WHERE site_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`, siteID, limit, offset)

	if err != nil {
		return nil, 0, fmt.Errorf("failed to get sync logs: %w", err)
	}
	defer rows.Close()

	var logs []models.ContentSyncLog
	for rows.Next() {
		var log models.ContentSyncLog
		err := rows.Scan(
			&log.ID, &log.SiteID, &log.SyncType, &log.LocalContentID, &log.RemoteContentID,
			&log.Status, &log.ErrorMessage, &log.CreatedAt)

		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan sync log: %w", err)
		}

		logs = append(logs, log)
	}

	return logs, total, nil
}

// Helper methods

func (s *WordPressService) getWordPressSite(siteID int) (*models.WordPressSite, error) {
	var site models.WordPressSite

	err := s.db.QueryRow(`
		SELECT id, name, url, api_endpoint, username, application_password, is_active, last_sync_at, created_at, updated_at
		FROM wordpress_sites WHERE id = $1`, siteID).Scan(
		&site.ID, &site.Name, &site.URL, &site.APIEndpoint, &site.Username, &site.ApplicationPassword,
		&site.IsActive, &site.LastSyncAt, &site.CreatedAt, &site.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &site, nil
}

func (s *WordPressService) fetchWordPressPosts(site *models.WordPressSite) ([]WordPressPost, error) {
	client := &http.Client{Timeout: 30 * time.Second}

	req, err := http.NewRequest("GET", site.APIEndpoint+"/posts?per_page=100", nil)
	if err != nil {
		return nil, err
	}

	// Add authentication if provided
	if site.Username != nil && site.ApplicationPassword != nil {
		req.SetBasicAuth(*site.Username, *site.ApplicationPassword)
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("WordPress API returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var posts []WordPressPost
	err = json.Unmarshal(body, &posts)
	if err != nil {
		return nil, err
	}

	return posts, nil
}

func (s *WordPressService) syncSinglePost(siteID int, wpPost WordPressPost, blogService *BlogService) error {
	// Check if post already exists locally
	existingPost, _ := blogService.GetPostBySlug(wpPost.Slug)

	if existingPost != nil {
		// Update existing post
		_, err := blogService.UpdatePost(
			existingPost.ID,
			wpPost.Title.Rendered,
			wpPost.Slug,
			wpPost.Content.Rendered,
			wpPost.Excerpt.Rendered,
			"", // featured_image placeholder
			wpPost.Status,
			false, // is_featured
		)
		if err != nil {
			return err
		}

		// Log successful sync
		s.logSyncSuccess(siteID, "post_update", &existingPost.ID, &wpPost.ID)
	} else {
		// Create new post (need author ID - use system user or first admin)
		authorID := 1 // Default to first user/admin

		_, err := blogService.CreatePost(
			authorID,
			wpPost.Title.Rendered,
			wpPost.Slug,
			wpPost.Content.Rendered,
			wpPost.Excerpt.Rendered,
			"", // featured_image placeholder
			wpPost.Status,
			false, // is_featured
		)
		if err != nil {
			return err
		}

		// Log successful sync
		s.logSyncSuccess(siteID, "post_create", nil, &wpPost.ID)
	}

	return nil
}

func (s *WordPressService) getLocalPost(postID int) (*models.BlogPost, error) {
	var post models.BlogPost

	err := s.db.QueryRow(`
		SELECT id, title, slug, content, excerpt, featured_image, author_id, status, is_featured, view_count, published_at, created_at, updated_at
		FROM blog_posts WHERE id = $1`, postID).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Content, &post.Excerpt, &post.FeaturedImage,
		&post.AuthorID, &post.Status, &post.IsFeatured, &post.ViewCount,
		&post.PublishedAt, &post.CreatedAt, &post.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (s *WordPressService) convertToWordPressPost(post *models.BlogPost) map[string]interface{} {
	wpPost := map[string]interface{}{
		"title":   post.Title,
		"content": post.Content,
		"status":  post.Status,
		"slug":    post.Slug,
	}

	if post.Excerpt != nil {
		wpPost["excerpt"] = *post.Excerpt
	}

	return wpPost
}

func (s *WordPressService) sendPostToWordPress(site *models.WordPressSite, wpPost map[string]interface{}) error {
	client := &http.Client{Timeout: 30 * time.Second}

	postData, err := json.Marshal(wpPost)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", site.APIEndpoint+"/posts", bytes.NewBuffer(postData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	// Add authentication if provided
	if site.Username != nil && site.ApplicationPassword != nil {
		req.SetBasicAuth(*site.Username, *site.ApplicationPassword)
	}

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("WordPress API returned status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}

func (s *WordPressService) updateLastSyncTime(siteID int) {
	s.db.Exec("UPDATE wordpress_sites SET last_sync_at = CURRENT_TIMESTAMP WHERE id = $1", siteID)
}

func (s *WordPressService) logSyncSuccess(siteID int, syncType string, localContentID, remoteContentID *int) {
	s.db.Exec(`
		INSERT INTO content_sync_logs (site_id, sync_type, local_content_id, remote_content_id, status, created_at)
		VALUES ($1, $2, $3, $4, 'success', CURRENT_TIMESTAMP)`,
		siteID, syncType, localContentID, remoteContentID)
}

func (s *WordPressService) logSyncError(siteID int, syncType string, localContentID, remoteContentID *int, errorMsg string) {
	s.db.Exec(`
		INSERT INTO content_sync_logs (site_id, sync_type, local_content_id, remote_content_id, status, error_message, created_at)
		VALUES ($1, $2, $3, $4, 'failed', $5, CURRENT_TIMESTAMP)`,
		siteID, syncType, localContentID, remoteContentID, errorMsg)
}