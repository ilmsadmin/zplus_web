# System Architecture

## Overview
ZPlus Web is a full-stack web application designed to showcase a software company's services, manage projects, sell software products, and handle customer relationships. The system is built with modern technologies focusing on scalability, performance, and maintainability.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend       │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Go Fiber)    │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │              ┌─────────────────┐
         │                       │              │                 │
         │                       └─────────────►│   Cache         │
         │                                      │   (Redis)       │
         │                                      │                 │
         │                                      └─────────────────┘
         │
         │              ┌─────────────────┐
         │              │                 │
         └─────────────►│   File Storage  │
                        │   (Local/Cloud) │
                        │                 │
                        └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules / Tailwind CSS (to be added)
- **State Management**: React Context / Zustand (to be added)
- **Form Handling**: React Hook Form (to be added)
- **HTTP Client**: Native fetch / Axios (to be added)

### Backend
- **Framework**: Go Fiber (Express-like framework for Go)
- **Language**: Go 1.24
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt
- **File Upload**: Multipart form handling
- **Validation**: Custom validators
- **Logging**: Structured logging with logrus (to be added)

### Database
- **Primary Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Migration Tool**: Custom Go migrations
- **Connection Pooling**: Built-in Go database/sql pooling

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Fiber built-in server
- **File Storage**: Local filesystem (with cloud storage option)
- **Environment Management**: dotenv

## Application Layers

### 1. Presentation Layer (Frontend)
```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin panel routes
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── blog/
│   │   │   ├── projects/
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   └── content/
│   │   └── layout.tsx
│   ├── (customer)/        # Customer-facing routes
│   │   ├── products/
│   │   ├── blog/
│   │   ├── projects/
│   │   ├── profile/
│   │   └── checkout/
│   ├── auth/              # Authentication pages
│   ├── globals.css
│   └── layout.tsx
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   ├── admin/            # Admin-specific components
│   └── customer/         # Customer-specific components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
└── stores/               # State management
```

### 2. API Layer (Backend)
```
backend/
├── main.go               # Application entry point
├── config/               # Configuration management
├── database/             # Database connection and migrations
├── handlers/             # HTTP request handlers
│   ├── auth/
│   ├── blog/
│   ├── projects/
│   ├── products/
│   ├── customers/
│   ├── orders/
│   └── admin/
├── middleware/           # HTTP middleware
│   ├── auth.go
│   ├── cors.go
│   ├── logging.go
│   └── ratelimit.go
├── models/               # Data models and structs
├── services/             # Business logic layer
│   ├── auth/
│   ├── blog/
│   ├── projects/
│   ├── products/
│   ├── customers/
│   ├── orders/
│   └── wordpress/
├── utils/                # Utility functions
├── validators/           # Input validation
└── routes/               # Route definitions
```

### 3. Data Layer
```
Database Tables:
├── Authentication & Users
│   ├── users
│   └── user_sessions
├── Content Management
│   ├── blog_posts
│   ├── blog_categories
│   ├── blog_post_categories
│   ├── projects
│   ├── wordpress_sites
│   └── content_sync_logs
├── E-commerce
│   ├── software_products
│   ├── product_categories
│   ├── product_files
│   ├── orders
│   ├── order_items
│   └── customer_downloads
└── Customer Management
    ├── customer_wallets
    ├── wallet_transactions
    ├── customer_points
    └── point_transactions
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Role-Based Access**: Admin and Customer roles with different permissions
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Token blacklisting for logout functionality

### API Security
- **CORS Configuration**: Configurable allowed origins
- **Rate Limiting**: Per-IP and per-user rate limiting
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization and output encoding

### File Security
- **Upload Validation**: File type and size restrictions
- **Secure File Names**: UUID-based file naming
- **Access Control**: Authenticated downloads for paid products
- **Virus Scanning**: Optional integration with antivirus APIs

## Performance Optimization

### Caching Strategy
- **Redis Cache**: Session storage and frequently accessed data
- **Database Indexing**: Optimized queries with proper indexes
- **Static File Caching**: CDN integration for assets
- **API Response Caching**: Cache-Control headers for appropriate endpoints

### Database Optimization
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Indexed queries and query analysis
- **Read Replicas**: Separate read/write operations (future enhancement)
- **Pagination**: Efficient data loading with cursor-based pagination

### Frontend Optimization
- **Server-Side Rendering**: Next.js SSR for SEO and performance
- **Static Generation**: Pre-built pages where possible
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component with optimization

## Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: JWT-based authentication enables multiple server instances
- **Load Balancing**: NGINX or cloud load balancer configuration
- **Database Clustering**: PostgreSQL clustering for high availability
- **Microservices**: Future migration path for service separation

### Vertical Scaling
- **Resource Monitoring**: CPU, memory, and disk usage tracking
- **Database Optimization**: Query performance and index tuning
- **Caching Layers**: Multi-level caching implementation
- **Connection Pooling**: Optimized database connection management

## Integration Points

### WordPress Integration
- **REST API**: WordPress REST API for content synchronization
- **Authentication**: Application passwords for secure API access
- **Webhook Support**: Real-time content updates from WordPress
- **Bidirectional Sync**: Content creation and updates in both systems

### Payment Integration
- **Payment Gateways**: Stripe, PayPal integration (to be implemented)
- **Wallet System**: Internal credit system for purchases
- **Transaction Logging**: Comprehensive transaction audit trail
- **Refund Processing**: Automated and manual refund capabilities

### External Services
- **Email Service**: SMTP or service like SendGrid for notifications
- **File Storage**: AWS S3, Google Cloud Storage integration options
- **CDN**: CloudFlare or AWS CloudFront for static assets
- **Monitoring**: Application performance monitoring integration

## Deployment Architecture

### Development Environment
- **Docker Compose**: Local development with all services
- **Hot Reload**: Air for backend, Next.js dev server for frontend
- **Database Seeding**: Sample data for development and testing
- **Environment Variables**: Local .env configuration

### Production Environment
- **Container Orchestration**: Docker Swarm or Kubernetes
- **Reverse Proxy**: NGINX for SSL termination and load balancing
- **Database**: Managed PostgreSQL service (AWS RDS, Google Cloud SQL)
- **Cache**: Managed Redis service (AWS ElastiCache, Google Memorystore)
- **File Storage**: Cloud storage with CDN
- **SSL/TLS**: Let's Encrypt or cloud-managed certificates

## Monitoring & Logging

### Application Monitoring
- **Health Checks**: Endpoint monitoring for service availability
- **Performance Metrics**: Response time, throughput, error rates
- **Resource Usage**: CPU, memory, disk, network utilization
- **Database Monitoring**: Query performance, connection pool status

### Logging Strategy
- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: Debug, Info, Warning, Error categorization
- **Request Logging**: All API requests with timing and status
- **Error Tracking**: Comprehensive error logging with stack traces
- **Audit Logging**: User actions and system changes

### Alerting
- **Service Downtime**: Immediate alerts for critical service failures
- **Performance Degradation**: Alerts for response time increases
- **Error Rate Thresholds**: Notifications for unusual error patterns
- **Resource Exhaustion**: Warnings for high resource usage

## Backup & Recovery

### Database Backup
- **Automated Backups**: Daily database dumps
- **Point-in-Time Recovery**: Transaction log backups
- **Cross-Region Replication**: Disaster recovery preparation
- **Backup Testing**: Regular restore testing procedures

### File Backup
- **Uploaded Files**: Regular backup to cloud storage
- **Application Code**: Git repository with proper branching
- **Configuration**: Infrastructure as code for reproducibility
- **Documentation**: Version-controlled documentation

## Future Enhancements

### Phase 2 Features
- **Mobile App**: React Native or Flutter mobile application
- **Advanced Analytics**: User behavior tracking and business intelligence
- **AI Integration**: Chatbot support and recommendation system
- **Multi-language**: Internationalization support
- **Advanced CMS**: Rich text editor and media management

### Performance Improvements
- **GraphQL API**: More efficient data fetching
- **Microservices**: Service decomposition for better scalability
- **Event-Driven Architecture**: Asynchronous processing with message queues
- **Edge Computing**: CDN-based dynamic content delivery

### Integration Expansions
- **CRM Integration**: Customer relationship management systems
- **Marketing Automation**: Email marketing and lead nurturing
- **Social Media**: Automated social media posting and engagement
- **Third-party Marketplaces**: Integration with software marketplaces