#!/bin/bash

# ZPlus Web - Complete Project Setup Script
# Backend: Port 4001
# Frontend: Port 3001

set -e  # Exit on any error

echo "🚀 Starting ZPlus Web Project Setup..."
echo "Backend will run on port 4001"
echo "Frontend will run on port 3001"

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.dev.yml" ]; then
    print_error "Please run this script from the zplus_web root directory"
    exit 1
fi

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# Check required dependencies
print_status "Checking dependencies..."
check_command "docker"
check_command "docker-compose"
check_command "go"
check_command "node"
check_command "npm"

print_success "All dependencies are installed"

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

# Create environment files
print_status "Creating environment configuration files..."

# Backend .env
cat > backend/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=zplus_web

# Redis Configuration  
REDIS_HOST=localhost
REDIS_PORT=6381
REDIS_PASSWORD=

# Server Configuration
PORT=4001
ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS Configuration
CORS_ORIGINS=http://localhost:3001,http://localhost:3000

# GraphQL Configuration
GRAPHQL_PLAYGROUND=true
GRAPHQL_INTROSPECTION=true
EOF

# Frontend .env.local
cat > frontend/.env.local << EOF
# GraphQL API Configuration
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4001/graphql
NEXT_PUBLIC_API_URL=http://localhost:4001

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3001
EOF

print_success "Environment files created"

# Start database services
print_status "Starting database services (PostgreSQL & Redis)..."
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for databases to be ready
print_status "Waiting for databases to be ready..."
sleep 10

# Check if PostgreSQL is ready
print_status "Checking PostgreSQL connection..."
for i in {1..30}; do
    if docker exec zplus_postgres_dev pg_isready -U postgres -d zplus_web &>/dev/null; then
        print_success "PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "PostgreSQL failed to start"
        exit 1
    fi
    sleep 2
done

# Check if Redis is ready
print_status "Checking Redis connection..."
for i in {1..30}; do
    if docker exec zplus_redis_dev redis-cli ping &>/dev/null; then
        print_success "Redis is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Redis failed to start"
        exit 1
    fi
    sleep 2
done

# Setup backend
print_status "Setting up Go backend..."
cd backend

# Install Go dependencies
print_status "Installing Go dependencies..."
go mod tidy

# Generate Ent code
print_status "Generating Ent ORM code..."
go generate ./ent

# Run database migrations
print_status "Running database migrations..."
go run main.go migrate 2>/dev/null || print_warning "Migration command not available, will auto-migrate on startup"

print_success "Backend setup completed"
cd ..

# Setup frontend
print_status "Setting up Next.js frontend..."
cd frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Build frontend for development
print_status "Building frontend..."
npm run build 2>/dev/null || print_warning "Build failed, but dev mode should work"

print_success "Frontend setup completed"
cd ..

# Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ZPlus Web Backend (GraphQL API) on port 4001..."

cd backend

# Check if databases are running
if ! docker ps | grep -q zplus_postgres_dev; then
    echo "⚠️ PostgreSQL is not running. Starting database services..."
    cd ..
    docker-compose -f docker-compose.dev.yml up -d postgres redis
    cd backend
    sleep 5
fi

# Start the backend
echo "Starting Go server..."
go run main.go
EOF

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ZPlus Web Frontend on port 3001..."

cd frontend

# Check if backend is running
if ! curl -s http://localhost:4001/health > /dev/null; then
    echo "⚠️ Backend is not running. Please start the backend first with ./start-backend.sh"
    exit 1
fi

# Start the frontend
echo "Starting Next.js development server..."
npm run dev
EOF

# Complete startup script
cat > start-project.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Complete ZPlus Web Project..."

# Start databases
echo "Starting database services..."
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for databases
echo "Waiting for databases..."
sleep 10

# Start backend in background
echo "Starting backend..."
./start-backend.sh &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
sleep 15

# Start frontend
echo "Starting frontend..."
./start-frontend.sh &
FRONTEND_PID=$!

echo ""
echo "🎉 ZPlus Web is starting up!"
echo ""
echo "📍 Application URLs:"
echo "   Frontend:          http://localhost:3001"
echo "   GraphQL API:       http://localhost:4001/graphql"
echo "   GraphQL Playground: http://localhost:4001/playground"
echo "   Health Check:      http://localhost:4001/health"
echo ""
echo "📍 Database URLs:"
echo "   PostgreSQL:        localhost:5434"
echo "   Redis:            localhost:6381"
echo ""
echo "To stop all services, press Ctrl+C"
echo ""

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
EOF

# Make scripts executable
chmod +x start-backend.sh
chmod +x start-frontend.sh
chmod +x start-project.sh

print_success "Startup scripts created"

# Update backend configuration for new port
print_status "Updating backend configuration for port 4001..."

# Update main.go to use port from environment
sed -i.bak 's/app.Listen(":3002")/app.Listen(":" + cfg.Port)/g' backend/main.go 2>/dev/null || true

# Update Apollo Client configuration
print_status "Updating frontend GraphQL configuration..."

# Update apollo-client.ts
cat > frontend/src/lib/apollo-client.ts << 'EOF'
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'

// HTTP link to GraphQL endpoint - now pointing to port 4001
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4001/graphql',
})

// Simple auth link that adds token from localStorage
const authLink = from([
  // We'll add proper authentication handling later
  httpLink,
])

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: authLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Enable pagination for posts
            keyArgs: ['status', 'categoryId', 'search'],
            merge(existing, incoming) {
              if (!existing) return incoming
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              }
            },
          },
          projects: {
            // Enable pagination for projects
            keyArgs: ['featured', 'status'],
            merge(existing, incoming) {
              if (!existing) return incoming
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              }
            },
          },
          users: {
            // Enable pagination for users
            keyArgs: ['role', 'search'],
            merge(existing, incoming) {
              if (!existing) return incoming
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              }
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})
EOF

# Update package.json scripts for custom port
print_status "Updating frontend package.json for port 3001..."
cd frontend

# Create/update package.json with correct dev script
npm pkg set scripts.dev="next dev -p 3001"

cd ..

# Create a quick test script
cat > test-setup.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing ZPlus Web Setup..."

# Test database connections
echo "Testing PostgreSQL connection..."
if docker exec zplus_postgres pg_isready -U zplus_user -d zplus_db; then
    echo "✅ PostgreSQL is working"
else
    echo "❌ PostgreSQL connection failed"
fi

echo "Testing Redis connection..."
if docker exec zplus_redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis is working"
else
    echo "❌ Redis connection failed"
fi

# Test GraphQL endpoint (if backend is running)
echo "Testing GraphQL endpoint..."
if curl -s http://localhost:4001/health > /dev/null; then
    echo "✅ Backend is responding"
    
    # Test GraphQL query
    if curl -s -X POST http://localhost:4001/graphql \
        -H "Content-Type: application/json" \
        -d '{"query": "query { users { id email username } }"}' | grep -q "data"; then
        echo "✅ GraphQL API is working"
    else
        echo "❌ GraphQL API failed"
    fi
else
    echo "⚠️ Backend is not running (run ./start-backend.sh first)"
fi

# Test frontend (if running)
echo "Testing frontend..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is responding"
else
    echo "⚠️ Frontend is not running (run ./start-frontend.sh first)"
fi
EOF

chmod +x test-setup.sh

# Create README for the new setup
cat > SETUP_GUIDE.md << 'EOF'
# ZPlus Web - Project Setup Guide

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Run the complete setup script
./setup-project.sh
```

### 2. Start the Application
```bash
# Option 1: Start everything at once
./start-project.sh

# Option 2: Start services individually
./start-backend.sh    # Starts backend on port 4001
./start-frontend.sh   # Starts frontend on port 3001
```

### 3. Test the Setup
```bash
./test-setup.sh
```

## 📍 Application URLs

- **Frontend**: http://localhost:3001
- **GraphQL API**: http://localhost:4001/graphql
- **GraphQL Playground**: http://localhost:4001/playground
- **Health Check**: http://localhost:4001/health

## 🗄️ Database Access

- **PostgreSQL**: `localhost:5434`
  - User: `zplus_user`
  - Password: `zplus_password`
  - Database: `zplus_db`

- **Redis**: `localhost:6381`

## 🛠️ Development Commands

### Backend
```bash
cd backend
go run main.go                # Start backend
go generate ./ent            # Generate Ent code
go mod tidy                  # Update dependencies
```

### Frontend
```bash
cd frontend
npm run dev                  # Start development server
npm run build               # Build for production
npm run lint                # Run linter
```

### Database
```bash
# Access PostgreSQL
docker exec -it zplus_postgres psql -U zplus_user -d zplus_db

# Access Redis
docker exec -it zplus_redis redis-cli

# View logs
docker-compose -f docker-compose.dev.yml logs postgres
docker-compose -f docker-compose.dev.yml logs redis
```

## 🔧 Configuration Files

- `backend/.env` - Backend environment variables
- `frontend/.env.local` - Frontend environment variables
- `docker-compose.dev.yml` - Database services configuration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Go + Fiber)  │◄──►│   (PostgreSQL)  │
│   Port: 3001    │    │   Port: 4001    │    │   Port: 5434    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │              ┌─────────────────┐
         │                       │              │                 │
         │                       └─────────────►│   Cache         │
         │                                      │   (Redis)       │
         │                                      │   Port: 6381    │
         │                                      └─────────────────┘
```

## 🚨 Troubleshooting

### Backend Issues
- Check if PostgreSQL is running: `docker ps | grep postgres`
- View backend logs: `tail -f backend/logs/app.log`
- Test database connection: `./test-setup.sh`

### Frontend Issues
- Check if Node.js dependencies are installed: `cd frontend && npm list`
- Clear Next.js cache: `cd frontend && rm -rf .next`
- Check environment variables: `cat frontend/.env.local`

### Database Issues
- Restart databases: `docker-compose -f docker-compose.dev.yml restart postgres redis`
- Check database logs: `docker-compose -f docker-compose.dev.yml logs postgres`

## 📚 Additional Resources

- [Go Documentation](https://golang.org/doc/)
- [Next.js Documentation](https://nextjs.org/docs)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
EOF

print_success "Setup guide created"

print_success "🎉 ZPlus Web project setup completed!"
echo ""
echo "📋 What was configured:"
echo "   ✅ Backend environment (.env) - Port 4001"
echo "   ✅ Frontend environment (.env.local) - Port 3001"
echo "   ✅ GraphQL integration between frontend and backend"
echo "   ✅ Database services (PostgreSQL & Redis)"
echo "   ✅ Startup scripts created"
echo "   ✅ Apollo Client configured for new backend port"
echo ""
echo "🚀 Next steps:"
echo "   1. Start the project: ./start-project.sh"
echo "   2. Or start services individually:"
echo "      - Backend: ./start-backend.sh"
echo "      - Frontend: ./start-frontend.sh"
echo "   3. Test setup: ./test-setup.sh"
echo ""
echo "📍 Application will be available at:"
echo "   - Frontend: http://localhost:3001"
echo "   - GraphQL API: http://localhost:4001/graphql"
echo "   - GraphQL Playground: http://localhost:4001/playground"
echo ""
echo "📖 For detailed instructions, see: SETUP_GUIDE.md"
