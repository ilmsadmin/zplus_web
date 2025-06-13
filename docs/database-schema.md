# Database Schema Documentation

## 🗄️ Database Design Overview

ZPlus Web uses **PostgreSQL** as the primary database with **Ent ORM** for type-safe database operations and automatic code generation. The database is designed with a comprehensive schema supporting user management, content management, e-commerce functionality, and WordPress integration.

## 🏗️ Architecture

### ORM Technology
- **Ent ORM**: Facebook's entity framework for Go
- **Code Generation**: Automatic generation of type-safe CRUD operations
- **Schema-First**: Database schema defined in Go structs
- **Migration Management**: Automatic migration generation and execution

### Database Configuration
- **Primary Database**: PostgreSQL 15+
- **Caching Layer**: Redis for session management and caching
- **Connection Pooling**: Optimized connection management
- **Development Port**: 5434 (to avoid conflicts)
- **Production Port**: 5432

## Tables

### 1. Authentication & Users

#### users
Core user table for both administrators and customers.
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- 'admin', 'customer'
    full_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### user_sessions
Track user login sessions.
```sql
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Blog Management

#### blog_posts
Store blog articles and company activity posts.
```sql
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'private'
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### blog_categories
Categorize blog posts.
```sql
CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### blog_post_categories
Many-to-many relationship between posts and categories.
```sql
CREATE TABLE blog_post_categories (
    post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);
```

### 3. Project Management

#### projects
Company projects and portfolio.
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    featured_image VARCHAR(255),
    gallery_images TEXT[], -- Array of image URLs
    technologies TEXT[], -- Array of technology names
    project_url VARCHAR(255),
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'development', -- 'planning', 'development', 'completed', 'maintenance'
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Market & Software Sales

#### software_products
Software products for sale.
```sql
CREATE TABLE software_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    featured_image VARCHAR(255),
    gallery_images TEXT[],
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    version VARCHAR(50),
    requirements TEXT,
    features TEXT[],
    category_id INTEGER REFERENCES product_categories(id),
    download_url VARCHAR(255),
    file_size BIGINT, -- in bytes
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### product_categories
Categories for software products.
```sql
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES product_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### product_files
Files associated with software products.
```sql
CREATE TABLE product_files (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES software_products(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50),
    is_main BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Customer Management

#### customer_wallets
Customer wallet for money management.
```sql
CREATE TABLE customer_wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    total_deposited DECIMAL(10,2) DEFAULT 0.00,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### wallet_transactions
Track all wallet transactions.
```sql
CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- 'deposit', 'purchase', 'refund'
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_id VARCHAR(100), -- order_id, payment_id, etc.
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### customer_points
Customer loyalty points system.
```sql
CREATE TABLE customer_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    used_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### point_transactions
Track point transactions.
```sql
CREATE TABLE point_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'earned', 'used', 'expired'
    reason VARCHAR(255),
    reference_id VARCHAR(100),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Orders & Payments

#### orders
Customer orders for software products.
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    order_status VARCHAR(20) DEFAULT 'processing', -- 'processing', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### order_items
Items in each order.
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES software_products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### customer_downloads
Track customer downloads of purchased software.
```sql
CREATE TABLE customer_downloads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES software_products(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    download_token VARCHAR(255) UNIQUE NOT NULL,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 5,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Content Management (WordPress Integration)

#### wordpress_sites
Connected WordPress/WooCommerce sites.
```sql
CREATE TABLE wordpress_sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    application_password VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### content_sync_logs
Track content synchronization with WordPress sites.
```sql
CREATE TABLE content_sync_logs (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES wordpress_sites(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL, -- 'post_create', 'post_update', 'post_delete'
    local_content_id INTEGER,
    remote_content_id INTEGER,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_software_products_active ON software_products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
```

## Initial Data

```sql
-- Insert default admin user
INSERT INTO users (username, email, password_hash, role, full_name, is_active, email_verified) 
VALUES ('admin', 'admin@zplus.com', '$2a$10$example.hash.here', 'admin', 'System Administrator', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Company News', 'company-news', 'News and updates about ZPlus'),
('Technology', 'technology', 'Technical articles and insights'),
('Projects', 'projects', 'Project showcases and case studies')
ON CONFLICT (slug) DO NOTHING;

-- Insert default product categories
INSERT INTO product_categories (name, slug, description) VALUES
('Web Applications', 'web-applications', 'Web-based software solutions'),
('Mobile Apps', 'mobile-apps', 'Mobile application solutions'),
('Desktop Software', 'desktop-software', 'Desktop application solutions')
ON CONFLICT (slug) DO NOTHING;
```