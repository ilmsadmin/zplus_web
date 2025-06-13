# API Documentation

## Overview
This document describes the REST API endpoints for the ZPlus Web application.

## Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.zplus.com/api/v1`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## Endpoints

### 1. Authentication

#### POST /auth/register
Register a new customer account.
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

#### POST /auth/login
Login to get JWT token.
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### POST /auth/logout
Logout and invalidate token.

#### POST /auth/forgot-password
Request password reset.
```json
{
  "email": "john@example.com"
}
```

#### POST /auth/reset-password
Reset password with token.
```json
{
  "token": "reset_token",
  "password": "newpassword"
}
```

### 2. Admin Authentication

#### POST /admin/auth/login
Admin login endpoint.
```json
{
  "email": "admin@zplus.com",
  "password": "adminpassword"
}
```

### 3. User Management

#### GET /users/profile
Get current user profile.

#### PUT /users/profile
Update current user profile.
```json
{
  "full_name": "John Doe Updated",
  "phone": "+1234567890",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

#### PUT /users/change-password
Change user password.
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

### 4. Blog Management

#### GET /blog/posts
Get published blog posts (public).
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category slug
- `featured`: Filter featured posts (true/false)
- `search`: Search in title and content

#### GET /blog/posts/:slug
Get single blog post by slug.

#### GET /blog/categories
Get all blog categories.

#### Admin Blog Endpoints (require admin role):

#### GET /admin/blog/posts
Get all blog posts for admin.

#### POST /admin/blog/posts
Create new blog post.
```json
{
  "title": "Post Title",
  "slug": "post-title",
  "content": "Post content...",
  "excerpt": "Short description",
  "featured_image": "https://example.com/image.jpg",
  "status": "published",
  "is_featured": false,
  "categories": [1, 2]
}
```

#### PUT /admin/blog/posts/:id
Update blog post.

#### DELETE /admin/blog/posts/:id
Delete blog post.

#### POST /admin/blog/categories
Create blog category.
```json
{
  "name": "Category Name",
  "slug": "category-name",
  "description": "Category description"
}
```

### 5. Project Management

#### GET /projects
Get all published projects (public).
Query parameters:
- `page`, `limit`, `featured`, `status`

#### GET /projects/:slug
Get single project by slug.

#### Admin Project Endpoints:

#### GET /admin/projects
Get all projects for admin.

#### POST /admin/projects
Create new project.
```json
{
  "name": "Project Name",
  "slug": "project-name",
  "description": "Full project description",
  "short_description": "Brief description",
  "featured_image": "https://example.com/image.jpg",
  "gallery_images": ["url1", "url2"],
  "technologies": ["React", "Node.js", "PostgreSQL"],
  "project_url": "https://project.com",
  "github_url": "https://github.com/user/repo",
  "demo_url": "https://demo.project.com",
  "status": "completed",
  "start_date": "2024-01-01",
  "end_date": "2024-06-01",
  "is_featured": true
}
```

#### PUT /admin/projects/:id
Update project.

#### DELETE /admin/projects/:id
Delete project.

### 6. Software Products & Market

#### GET /products
Get all active software products (public).
Query parameters:
- `page`, `limit`, `category`, `featured`, `search`

#### GET /products/:slug
Get single product by slug.

#### GET /products/categories
Get product categories.

#### Admin Product Endpoints:

#### GET /admin/products
Get all products for admin.

#### POST /admin/products
Create new product.
```json
{
  "name": "Software Name",
  "slug": "software-name",
  "description": "Full description",
  "short_description": "Brief description",
  "featured_image": "https://example.com/image.jpg",
  "gallery_images": ["url1", "url2"],
  "price": 99.99,
  "discount_price": 79.99,
  "version": "1.0.0",
  "requirements": "System requirements",
  "features": ["Feature 1", "Feature 2"],
  "category_id": 1,
  "is_active": true,
  "is_featured": false
}
```

#### PUT /admin/products/:id
Update product.

#### DELETE /admin/products/:id
Delete product.

#### POST /admin/products/:id/files
Upload product files.

#### GET /admin/products/:id/files
Get product files.

#### DELETE /admin/products/:id/files/:file_id
Delete product file.

### 7. Customer Wallet & Points

#### GET /wallet
Get current user's wallet information.

#### GET /wallet/transactions
Get wallet transaction history.
Query parameters: `page`, `limit`, `type`

#### POST /wallet/deposit
Request wallet deposit (redirect to payment gateway).
```json
{
  "amount": 100.00,
  "payment_method": "credit_card"
}
```

#### GET /points
Get current user's points information.

#### GET /points/transactions
Get points transaction history.

### 8. Orders & Purchases

#### GET /orders
Get current user's orders.

#### GET /orders/:id
Get single order details.

#### POST /orders
Create new order (purchase products).
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 1
    }
  ],
  "payment_method": "wallet"
}
```

#### GET /downloads
Get user's available downloads.

#### GET /downloads/:token
Download purchased software file.

### 9. Content Management (WordPress Integration)

#### Admin Content Endpoints:

#### GET /admin/content/sites
Get connected WordPress sites.

#### POST /admin/content/sites
Add WordPress site.
```json
{
  "name": "Site Name",
  "url": "https://wordpress-site.com",
  "api_endpoint": "https://wordpress-site.com/wp-json/wp/v2",
  "username": "api_user",
  "application_password": "app_password"
}
```

#### PUT /admin/content/sites/:id
Update WordPress site.

#### DELETE /admin/content/sites/:id
Remove WordPress site.

#### POST /admin/content/sync/:site_id
Sync content with WordPress site.
```json
{
  "content_type": "post",
  "content_id": 1,
  "action": "create"
}
```

#### GET /admin/content/sync-logs
Get content sync logs.

### 10. Admin Dashboard

#### GET /admin/dashboard/stats
Get dashboard statistics.
Response:
```json
{
  "users_count": 150,
  "orders_count": 45,
  "revenue": 5000.00,
  "products_count": 12,
  "blog_posts_count": 25,
  "projects_count": 8
}
```

#### GET /admin/dashboard/recent-activity
Get recent system activity.

### 11. File Upload

#### POST /upload
Upload file (images, documents).
Form data with file field.

#### DELETE /upload/:filename
Delete uploaded file.

## Error Codes

- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid authentication token
- `AUTH_EXPIRED`: Authentication token expired
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Resource not found
- `ALREADY_EXISTS`: Resource already exists
- `INSUFFICIENT_FUNDS`: Not enough wallet balance
- `PRODUCT_INACTIVE`: Product is not active
- `ORDER_INVALID`: Invalid order state
- `DOWNLOAD_EXPIRED`: Download token expired
- `DOWNLOAD_LIMIT_EXCEEDED`: Download limit exceeded
- `EXTERNAL_API_ERROR`: WordPress API error

## Rate Limiting

API requests are rate limited:
- Authenticated users: 1000 requests per hour
- Unauthenticated users: 100 requests per hour
- Admin users: 5000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```