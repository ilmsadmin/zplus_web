# ZPlus Web Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Go**: Version 1.21 or higher
- **Node.js**: Version 18 or higher  
- **Docker**: Latest version with Docker Compose
- **PostgreSQL**: Version 15+ (via Docker)
- **Redis**: Version 7+ (via Docker)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd zplus_web

# Make scripts executable
chmod +x *.sh

# Setup development environment
./setup-dev.sh
```

### 2. Start Development Services
```bash
# Start PostgreSQL and Redis containers
./start-dev.sh

# This will start:
# - PostgreSQL on port 5434
# - Redis on port 6381
# - pgAdmin on port 5050 (optional)
```

### 3. Start Backend (GraphQL API)
```bash
# Option 1: Use the startup script
./start-graphql.sh

# Option 2: Manual start
cd backend
go run main_graphql.go
```

### 4. Verify Setup
```bash
# Check API health
curl http://localhost:3002/health

# Open GraphQL Playground
open http://localhost:3002/playground
```

## 🐳 Development Environment

### Docker Services
The development environment uses Docker Compose with the following services:

**Database Services (`docker-compose.dev.yml`):**
```yaml
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5434:5432"  # Custom port to avoid conflicts
    environment:
      POSTGRES_DB: zplus_db
      POSTGRES_USER: zplus_user
      POSTGRES_PASSWORD: zplus_password

  redis:
    image: redis:7-alpine
    ports:
      - "6381:6379"  # Custom port to avoid conflicts
```

### Environment Configuration
**Backend Environment (`.env`):**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5434
DB_USER=zplus_user
DB_PASSWORD=zplus_password
DB_NAME=zplus_db

# Redis Configuration  
REDIS_HOST=localhost
REDIS_PORT=6381
REDIS_PASSWORD=

# Server Configuration
PORT=3002
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Development Settings
GO_ENV=development
LOG_LEVEL=debug
```

## 🔧 Backend Architecture

### Technology Stack
- **Framework**: Go with Fiber v2
- **API**: Custom GraphQL implementation
- **ORM**: Ent (Facebook's entity framework)
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with bcrypt password hashing

### Project Structure
```
backend/
├── config/              # Configuration management
├── database/            # Database utilities  
├── ent/                 # Ent ORM code and schemas
│   ├── schema/          # Entity definitions
│   └── migrate/         # Database migrations
├── graph/               # GraphQL implementation
│   └── schema.graphql   # GraphQL schema
├── handlers/            # Legacy REST handlers
├── middleware/          # HTTP middleware
├── services/            # Business logic
├── utils/               # Utility functions
├── main_graphql.go      # GraphQL server (primary)
├── main_ent.go          # Ent test server
└── main.go              # Legacy REST server
```

### Database Schema Management
The backend uses **Ent ORM** for type-safe database operations:

```bash
# Generate Ent code from schemas
cd backend && go generate ./ent

# Auto-migrate database (done automatically on server start)
cd backend && go run main_graphql.go
```

### Available Servers
1. **GraphQL Server** (recommended): `main_graphql.go`
   - Port: 3002
   - Features: GraphQL API, Playground, Authentication
   - Use: `./start-graphql.sh` or `go run main_graphql.go`

2. **Ent Test Server**: `main_ent.go`  
   - Port: 3001
   - Features: Database testing, Ent ORM validation
   - Use: `go run main_ent.go`

3. **Legacy REST Server**: `main.go`
   - Port: 3000  
   - Features: Original REST API (being phased out)
   - Use: `go run main.go`

## 📊 Database Setup

### Ent Schema Entities
Current entities defined in `ent/schema/`:

- **User** (`user.go`): Authentication and user management
- **BlogPost** (`blogpost.go`): Content management  
- **BlogCategory** (`blogcategory.go`): Blog categorization
- **Project** (`project.go`): Portfolio management
- **Order** (`order.go`): E-commerce orders
- **OrderItem** (`orderitem.go`): Order line items
- **Payment** (`payment.go`): Payment processing
- **Product** (`product.go`): Software products
- **WordPressSite** (`wordpresssite.go`): WordPress integration

### Database Commands
```bash
# Check database connection
cd backend && go run main_simple.go

# View database schema
docker exec -it zplus_postgres psql -U zplus_user -d zplus_db -c "\dt"

# Access database directly
docker exec -it zplus_postgres psql -U zplus_user -d zplus_db
```

## 🔌 API Testing

### GraphQL Playground
1. Start the GraphQL server: `./start-graphql.sh`
2. Open: `http://localhost:3002/playground`
3. Test queries and mutations interactively

### Sample API Calls

**User Registration:**
```graphql
mutation {
  register(input: {
    email: "test@example.com"
    username: "testuser"
    password: "password123"
    firstName: "Test"
    lastName: "User"
  }) {
    token
    user {
      id
      email
      username
      role
    }
    expiresAt
  }
}
```

**User Login:**
```graphql
mutation {
  login(input: {
    email: "test@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
      username
    }
  }
}
```

**Get Current User (Authenticated):**
```graphql
# Add Authorization header: Bearer <token>
query {
  me {
    id
    email
    username
    firstName
    lastName
    role
  }
}
```

## 🛠️ Development Workflow

### 1. Making Schema Changes
```bash
# 1. Modify entity schemas in ent/schema/
# 2. Regenerate Ent code
cd backend && go generate ./ent

# 3. Restart server (auto-migration)
./start-graphql.sh
```

### 2. Adding GraphQL Operations
1. Update `graph/schema.graphql` (if using gqlgen)
2. Implement resolvers in GraphQL handler functions
3. Test in Playground

### 3. Testing Changes
```bash
# Test database operations
cd backend && go run main_ent.go

# Test GraphQL API  
cd backend && go run main_graphql.go

# Run tests (if available)
cd backend && go test ./...
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check if database is running
docker ps | grep postgres

# Restart database services
./start-dev.sh

# Check connection manually
docker exec -it zplus_postgres pg_isready
```

**Port Already in Use:**
```bash
# Check what's using the port
lsof -i :3002
lsof -i :5434

# Kill process or change port in .env
```

**Ent Code Generation Errors:**
```bash
# Clean and regenerate
cd backend
rm -rf ent/generated
go generate ./ent
```

**GraphQL Server Won't Start:**
```bash
# Check for syntax errors
cd backend
go build main_graphql.go

# Check logs for specific errors
go run main_graphql.go 2>&1 | grep -i error
```

### Database Reset
```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Remove volumes (WARNING: deletes all data)
docker-compose -f docker-compose.dev.yml down -v

# Restart clean
./start-dev.sh
```

### Logs and Debugging
```bash
# View database logs
docker logs zplus_postgres -f

# View Redis logs  
docker logs zplus_redis -f

# Backend logs (built-in logging middleware)
# Logs appear in terminal when running the server
```

## 🌐 Frontend Setup (Future)

The frontend will be added in a future phase:

```bash
# Future commands (not yet implemented)
cd frontend
npm install
npm run dev
```

## 📚 Additional Resources

- **Ent Documentation**: https://entgo.io/docs/getting-started
- **Fiber Documentation**: https://docs.gofiber.io/
- **GraphQL Specification**: https://spec.graphql.org/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

## 🔐 Security Notes

### Development Environment
- Uses non-standard ports (5434, 6381) to avoid conflicts
- Default passwords for development only
- JWT secret should be changed for production

### Production Considerations
- Use environment-specific configuration
- Implement proper HTTPS/TLS
- Set up database connection pooling
- Add rate limiting and input validation
- Regular security updates for dependencies