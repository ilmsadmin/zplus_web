package models

import (
	"time"
	"github.com/lib/pq"
)

// User represents a user in the system (both admin and customer)
type User struct {
	ID            int       `json:"id" db:"id"`
	Username      string    `json:"username" db:"username"`
	Email         string    `json:"email" db:"email"`
	PasswordHash  string    `json:"-" db:"password_hash"`
	Role          string    `json:"role" db:"role"`
	FullName      *string   `json:"full_name,omitempty" db:"full_name"`
	Phone         *string   `json:"phone,omitempty" db:"phone"`
	AvatarURL     *string   `json:"avatar_url,omitempty" db:"avatar_url"`
	IsActive      bool      `json:"is_active" db:"is_active"`
	EmailVerified bool      `json:"email_verified" db:"email_verified"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

// UserSession represents a user login session
type UserSession struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// BlogCategory represents a blog post category
type BlogCategory struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Slug        string    `json:"slug" db:"slug"`
	Description *string   `json:"description,omitempty" db:"description"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

// BlogPost represents a blog post
type BlogPost struct {
	ID            int            `json:"id" db:"id"`
	Title         string         `json:"title" db:"title"`
	Slug          string         `json:"slug" db:"slug"`
	Content       string         `json:"content" db:"content"`
	Excerpt       *string        `json:"excerpt,omitempty" db:"excerpt"`
	FeaturedImage *string        `json:"featured_image,omitempty" db:"featured_image"`
	AuthorID      *int           `json:"author_id,omitempty" db:"author_id"`
	Status        string         `json:"status" db:"status"`
	IsFeatured    bool           `json:"is_featured" db:"is_featured"`
	ViewCount     int            `json:"view_count" db:"view_count"`
	PublishedAt   *time.Time     `json:"published_at,omitempty" db:"published_at"`
	CreatedAt     time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at" db:"updated_at"`
	
	// Relations
	Author     *User           `json:"author,omitempty"`
	Categories []BlogCategory  `json:"categories,omitempty"`
}

// Project represents a company project
type Project struct {
	ID               int            `json:"id" db:"id"`
	Name             string         `json:"name" db:"name"`
	Slug             string         `json:"slug" db:"slug"`
	Description      string         `json:"description" db:"description"`
	ShortDescription *string        `json:"short_description,omitempty" db:"short_description"`
	FeaturedImage    *string        `json:"featured_image,omitempty" db:"featured_image"`
	GalleryImages    pq.StringArray `json:"gallery_images,omitempty" db:"gallery_images"`
	Technologies     pq.StringArray `json:"technologies,omitempty" db:"technologies"`
	ProjectURL       *string        `json:"project_url,omitempty" db:"project_url"`
	GithubURL        *string        `json:"github_url,omitempty" db:"github_url"`
	DemoURL          *string        `json:"demo_url,omitempty" db:"demo_url"`
	Status           string         `json:"status" db:"status"`
	StartDate        *time.Time     `json:"start_date,omitempty" db:"start_date"`
	EndDate          *time.Time     `json:"end_date,omitempty" db:"end_date"`
	IsFeatured       bool           `json:"is_featured" db:"is_featured"`
	SortOrder        int            `json:"sort_order" db:"sort_order"`
	CreatedAt        time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at" db:"updated_at"`
}

// ProductCategory represents a software product category
type ProductCategory struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Slug        string    `json:"slug" db:"slug"`
	Description *string   `json:"description,omitempty" db:"description"`
	ParentID    *int      `json:"parent_id,omitempty" db:"parent_id"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

// SoftwareProduct represents a software product for sale
type SoftwareProduct struct {
	ID               int            `json:"id" db:"id"`
	Name             string         `json:"name" db:"name"`
	Slug             string         `json:"slug" db:"slug"`
	Description      string         `json:"description" db:"description"`
	ShortDescription *string        `json:"short_description,omitempty" db:"short_description"`
	FeaturedImage    *string        `json:"featured_image,omitempty" db:"featured_image"`
	GalleryImages    pq.StringArray `json:"gallery_images,omitempty" db:"gallery_images"`
	Price            float64        `json:"price" db:"price"`
	DiscountPrice    *float64       `json:"discount_price,omitempty" db:"discount_price"`
	Version          *string        `json:"version,omitempty" db:"version"`
	Requirements     *string        `json:"requirements,omitempty" db:"requirements"`
	Features         pq.StringArray `json:"features,omitempty" db:"features"`
	CategoryID       *int           `json:"category_id,omitempty" db:"category_id"`
	DownloadURL      *string        `json:"download_url,omitempty" db:"download_url"`
	FileSize         *int64         `json:"file_size,omitempty" db:"file_size"`
	DownloadCount    int            `json:"download_count" db:"download_count"`
	IsActive         bool           `json:"is_active" db:"is_active"`
	IsFeatured       bool           `json:"is_featured" db:"is_featured"`
	CreatedAt        time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at" db:"updated_at"`
	
	// Relations
	Category *ProductCategory `json:"category,omitempty"`
}

// ProductFile represents a file associated with a software product
type ProductFile struct {
	ID               int       `json:"id" db:"id"`
	ProductID        int       `json:"product_id" db:"product_id"`
	Filename         string    `json:"filename" db:"filename"`
	OriginalFilename string    `json:"original_filename" db:"original_filename"`
	FilePath         string    `json:"file_path" db:"file_path"`
	FileSize         int64     `json:"file_size" db:"file_size"`
	FileType         *string   `json:"file_type,omitempty" db:"file_type"`
	IsMain           bool      `json:"is_main" db:"is_main"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}

// CustomerWallet represents a customer's wallet
type CustomerWallet struct {
	ID             int       `json:"id" db:"id"`
	UserID         int       `json:"user_id" db:"user_id"`
	Balance        float64   `json:"balance" db:"balance"`
	TotalDeposited float64   `json:"total_deposited" db:"total_deposited"`
	TotalSpent     float64   `json:"total_spent" db:"total_spent"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

// WalletTransaction represents a wallet transaction
type WalletTransaction struct {
	ID              int       `json:"id" db:"id"`
	UserID          int       `json:"user_id" db:"user_id"`
	TransactionType string    `json:"transaction_type" db:"transaction_type"`
	Amount          float64   `json:"amount" db:"amount"`
	BalanceAfter    float64   `json:"balance_after" db:"balance_after"`
	Description     *string   `json:"description,omitempty" db:"description"`
	ReferenceID     *string   `json:"reference_id,omitempty" db:"reference_id"`
	Status          string    `json:"status" db:"status"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
}

// CustomerPoints represents customer loyalty points
type CustomerPoints struct {
	ID              int       `json:"id" db:"id"`
	UserID          int       `json:"user_id" db:"user_id"`
	TotalPoints     int       `json:"total_points" db:"total_points"`
	AvailablePoints int       `json:"available_points" db:"available_points"`
	UsedPoints      int       `json:"used_points" db:"used_points"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

// PointTransaction represents a point transaction
type PointTransaction struct {
	ID              int        `json:"id" db:"id"`
	UserID          int        `json:"user_id" db:"user_id"`
	Points          int        `json:"points" db:"points"`
	TransactionType string     `json:"transaction_type" db:"transaction_type"`
	Reason          *string    `json:"reason,omitempty" db:"reason"`
	ReferenceID     *string    `json:"reference_id,omitempty" db:"reference_id"`
	ExpiresAt       *time.Time `json:"expires_at,omitempty" db:"expires_at"`
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
}

// Order represents a customer order
type Order struct {
	ID             int       `json:"id" db:"id"`
	OrderNumber    string    `json:"order_number" db:"order_number"`
	UserID         *int      `json:"user_id,omitempty" db:"user_id"`
	TotalAmount    float64   `json:"total_amount" db:"total_amount"`
	DiscountAmount float64   `json:"discount_amount" db:"discount_amount"`
	FinalAmount    float64   `json:"final_amount" db:"final_amount"`
	PaymentMethod  *string   `json:"payment_method,omitempty" db:"payment_method"`
	PaymentStatus  string    `json:"payment_status" db:"payment_status"`
	OrderStatus    string    `json:"order_status" db:"order_status"`
	Notes          *string   `json:"notes,omitempty" db:"notes"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
	
	// Relations
	Items []OrderItem `json:"items,omitempty"`
	User  *User       `json:"user,omitempty"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ID          int       `json:"id" db:"id"`
	OrderID     int       `json:"order_id" db:"order_id"`
	ProductID   *int      `json:"product_id,omitempty" db:"product_id"`
	ProductName string    `json:"product_name" db:"product_name"`
	Price       float64   `json:"price" db:"price"`
	Quantity    int       `json:"quantity" db:"quantity"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	
	// Relations
	Product *SoftwareProduct `json:"product,omitempty"`
}

// CustomerDownload represents a customer's download access
type CustomerDownload struct {
	ID                int        `json:"id" db:"id"`
	UserID            int        `json:"user_id" db:"user_id"`
	ProductID         int        `json:"product_id" db:"product_id"`
	OrderID           *int       `json:"order_id,omitempty" db:"order_id"`
	DownloadToken     string     `json:"download_token" db:"download_token"`
	DownloadCount     int        `json:"download_count" db:"download_count"`
	MaxDownloads      int        `json:"max_downloads" db:"max_downloads"`
	ExpiresAt         *time.Time `json:"expires_at,omitempty" db:"expires_at"`
	LastDownloadedAt  *time.Time `json:"last_downloaded_at,omitempty" db:"last_downloaded_at"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	
	// Relations
	Product *SoftwareProduct `json:"product,omitempty"`
	Order   *Order           `json:"order,omitempty"`
}

// WordPressSite represents a connected WordPress site
type WordPressSite struct {
	ID                  int        `json:"id" db:"id"`
	Name                string     `json:"name" db:"name"`
	URL                 string     `json:"url" db:"url"`
	APIEndpoint         string     `json:"api_endpoint" db:"api_endpoint"`
	Username            *string    `json:"username,omitempty" db:"username"`
	ApplicationPassword *string    `json:"-" db:"application_password"`
	IsActive            bool       `json:"is_active" db:"is_active"`
	LastSyncAt          *time.Time `json:"last_sync_at,omitempty" db:"last_sync_at"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at" db:"updated_at"`
}

// ContentSyncLog represents a content synchronization log
type ContentSyncLog struct {
	ID              int       `json:"id" db:"id"`
	SiteID          int       `json:"site_id" db:"site_id"`
	SyncType        string    `json:"sync_type" db:"sync_type"`
	LocalContentID  *int      `json:"local_content_id,omitempty" db:"local_content_id"`
	RemoteContentID *int      `json:"remote_content_id,omitempty" db:"remote_content_id"`
	Status          string    `json:"status" db:"status"`
	ErrorMessage    *string   `json:"error_message,omitempty" db:"error_message"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
}

// API Response types
type ApiResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
	Error   *ApiError   `json:"error,omitempty"`
}

type ApiError struct {
	Code    string `json:"code"`
	Details string `json:"details"`
}

// Request types
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type RegisterRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	FullName string `json:"full_name" validate:"required,max=100"`
	Phone    string `json:"phone,omitempty" validate:"max=20"`
}

type UpdateProfileRequest struct {
	FullName  string `json:"full_name" validate:"required,max=100"`
	Phone     string `json:"phone,omitempty" validate:"max=20"`
	AvatarURL string `json:"avatar_url,omitempty" validate:"url"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required,min=6"`
}

// Dashboard statistics
type DashboardStats struct {
	UsersCount     int     `json:"users_count"`
	OrdersCount    int     `json:"orders_count"`
	Revenue        float64 `json:"revenue"`
	ProductsCount  int     `json:"products_count"`
	BlogPostsCount int     `json:"blog_posts_count"`
	ProjectsCount  int     `json:"projects_count"`
}