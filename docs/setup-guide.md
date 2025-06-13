# Project Setup Guide

## Overview
This guide will help you set up and run the ZPlus Web application locally and in production.

## Prerequisites

Make sure you have the following installed:
- [Go](https://golang.org/dl/) (version 1.21 or higher)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd zplus_web
```

### 2. Start Database Services
```bash
# Start PostgreSQL and Redis using Docker Compose
docker-compose up -d

# Check if services are running
docker-compose ps
```

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Copy environment file and configure
cp .env.example .env
# Edit .env file with your database credentials

# Install dependencies
go mod tidy

# Run database migrations
# The init.sql file will be executed automatically when PostgreSQL starts

# Build the application
go build -o server main.go

# Run the backend server
./server
```

The backend API will be available at `http://localhost:3000`

### 4. Setup Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

## API Testing

You can test the API endpoints using curl or a tool like Postman:

```bash
# Test health check
curl http://localhost:3000/health

# Test blog posts
curl http://localhost:3000/api/v1/blog/posts

# Test admin dashboard stats (will return mock data)
curl http://localhost:3000/api/v1/admin/dashboard/stats
```

## Database Management

### Connect to PostgreSQL
```bash
docker exec -it zplus_postgres psql -U postgres -d zplus_web
```

### Connect to Redis
```bash
docker exec -it zplus_redis redis-cli
```

### Running Custom Migrations
If you need to run additional SQL migrations:

```bash
# Copy your migration file to the container
docker cp migration.sql zplus_postgres:/tmp/

# Execute the migration
docker exec -it zplus_postgres psql -U postgres -d zplus_web -f /tmp/migration.sql
```

## Development Workflow

### Backend Development
```bash
cd backend

# For hot reload (install air first)
go install github.com/cosmtrek/air@latest
air

# Or run normally
go run main.go

# Run tests (when available)
go test ./...

# Format code
go fmt ./...
```

### Frontend Development
```bash
cd frontend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

```
zplus_web/
├── docs/                   # Documentation
│   ├── database-schema.md
│   ├── api-documentation.md
│   ├── system-architecture.md
│   └── setup-guide.md
├── backend/                # Go backend
│   ├── config/            # Configuration management
│   ├── database/          # Database connection
│   ├── handlers/          # HTTP request handlers
│   │   ├── auth/          # Authentication handlers
│   │   ├── admin/         # Admin handlers
│   │   ├── blog/          # Blog handlers
│   │   ├── projects/      # Project handlers (to be implemented)
│   │   ├── products/      # Product handlers (to be implemented)
│   │   ├── customers/     # Customer handlers (to be implemented)
│   │   └── orders/        # Order handlers (to be implemented)
│   ├── models/            # Data models and structs
│   ├── main.go            # Application entry point
│   ├── go.mod             # Go dependencies
│   └── .env.example       # Environment template
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/   # Admin panel routes
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── blog/
│   │   │   │   │   ├── projects/
│   │   │   │   │   ├── products/
│   │   │   │   │   ├── customers/
│   │   │   │   │   └── content/
│   │   │   │   └── layout.tsx
│   │   │   ├── (customer)/ # Customer routes
│   │   │   ├── auth/      # Authentication pages
│   │   │   └── layout.tsx
│   │   └── components/    # Reusable components
│   ├── package.json       # Node.js dependencies
│   ├── next.config.js     # Next.js configuration
│   └── tsconfig.json      # TypeScript configuration
├── docker-compose.yml     # Docker services
├── init.sql              # Database initialization
├── .gitignore            # Git ignore rules
└── README.md             # Project overview
```

## Available API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/v1/ping` - Ping test
- `GET /api/v1/blog/posts` - Get published blog posts
- `GET /api/v1/blog/posts/:slug` - Get single blog post
- `GET /api/v1/blog/categories` - Get blog categories

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Admin Endpoints
- `POST /api/v1/admin/auth/login` - Admin login
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/dashboard/recent-activity` - Recent activity
- `GET /api/v1/admin/blog/posts` - Get all posts (admin)
- `POST /api/v1/admin/blog/posts` - Create blog post
- `PUT /api/v1/admin/blog/posts/:id` - Update blog post
- `DELETE /api/v1/admin/blog/posts/:id` - Delete blog post
- `POST /api/v1/admin/blog/categories` - Create blog category

## Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=zplus_web

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server Configuration
PORT=3000
ENV=development

# JWT Configuration (add these)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Email Configuration (for future implementation)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Make sure Docker is running
   - Check if PostgreSQL container is running: `docker ps`
   - Verify database credentials in `.env` file

2. **Frontend Can't Connect to Backend**
   - Check if backend is running on port 3000
   - Verify CORS settings in main.go
   - Check Next.js proxy configuration in next.config.js

3. **Build Failures**
   - Backend: Run `go mod tidy` to update dependencies
   - Frontend: Delete `node_modules` and run `npm install`

4. **Port Already in Use**
   - Change the PORT in backend `.env` file
   - Update frontend proxy configuration accordingly

### Reset Database
```bash
# Stop services
docker-compose down

# Remove volumes (this will delete all data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

### View Logs
```bash
# Backend logs
docker-compose logs backend

# Database logs
docker-compose logs postgres

# All logs
docker-compose logs -f
```

## Next Steps

After setting up the basic application:

1. **Implement Authentication**
   - Add JWT middleware
   - Implement password hashing
   - Add email verification

2. **Complete CRUD Operations**
   - Finish blog management
   - Add project management
   - Add product management
   - Add customer management

3. **Add Business Logic**
   - Implement payment processing
   - Add file upload functionality
   - Add WordPress integration
   - Add email notifications

4. **Security Enhancements**
   - Add rate limiting
   - Implement proper validation
   - Add HTTPS support
   - Add security headers

5. **Testing**
   - Add unit tests
   - Add integration tests
   - Add end-to-end tests

6. **Deployment**
   - Set up CI/CD pipeline
   - Configure production environment
   - Set up monitoring and logging

## Support

For questions and support:
1. Check the documentation in the `docs/` folder
2. Review the API documentation
3. Check the GitHub issues
4. Contact the development team