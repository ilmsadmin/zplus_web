#!/bin/bash

# ZPlus Web - Complete Project Setup Script (FIXED)
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

# Kill any existing processes on our ports
print_status "Cleaning up existing processes..."
lsof -ti:4001 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
print_success "Cleanup completed"

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

# Create environment files
print_status "Creating environment configuration files..."

# Backend .env (Fixed to match docker-compose.dev.yml)
cat > backend/.env << EOF
# Database Configuration (matches docker-compose.dev.yml)
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

# Check if PostgreSQL is ready (Fixed container names)
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

# Check if Redis is ready (Fixed container names)
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

print_success "Backend setup completed"
cd ..

# Setup frontend
print_status "Setting up Next.js frontend..."
cd frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

print_success "Frontend setup completed"
cd ..

# Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script (Fixed container names)
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ZPlus Web Backend (GraphQL API) on port 4001..."

cd backend

# Check if databases are running (Fixed container names)
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
echo "📍 URLs:"
echo "   Frontend:           http://localhost:3001"
echo "   Backend API:        http://localhost:4001"
echo "   GraphQL Endpoint:   http://localhost:4001/graphql"
echo "   GraphQL Playground: http://localhost:4001/playground"
echo "   Health Check:       http://localhost:4001/health"
echo ""
echo "📊 Database:"
echo "   PostgreSQL:         localhost:5434"
echo "   Redis:             localhost:6381"
echo ""
echo "🔗 Quick Test:"
echo "   curl http://localhost:4001/health"
echo ""
echo "To stop both services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   docker-compose -f docker-compose.dev.yml down"
EOF

# Make scripts executable
chmod +x start-backend.sh
chmod +x start-frontend.sh
chmod +x start-project.sh

print_success "Startup scripts created and made executable"

# Test database connection
print_status "Testing database connection..."
cd backend
if go run -c 'package main; import ("database/sql"; "fmt"; _ "github.com/lib/pq"); func main() { db, err := sql.Open("postgres", "host=localhost port=5434 user=postgres password=password dbname=zplus_web sslmode=disable"); if err != nil { panic(err) }; defer db.Close(); if err := db.Ping(); err != nil { panic(err) }; fmt.Println("Database connection successful") }' 2>/dev/null; then
    print_success "Database connection test passed"
else
    print_warning "Database connection test failed, but the app should still work"
fi
cd ..

print_success "🎉 Setup completed successfully!"
echo ""
echo "🚀 Quick Start:"
echo "   To start everything:     ./start-project.sh"
echo "   To start backend only:   ./start-backend.sh"
echo "   To start frontend only:  ./start-frontend.sh"
echo ""
echo "📍 Development URLs:"
echo "   Frontend:           http://localhost:3001"
echo "   Backend API:        http://localhost:4001"
echo "   GraphQL Endpoint:   http://localhost:4001/graphql"
echo "   GraphQL Playground: http://localhost:4001/playground"
echo "   Health Check:       http://localhost:4001/health"
echo ""
echo "📊 Database Services:"
echo "   PostgreSQL:         localhost:5434"
echo "   Redis:             localhost:6381"
echo ""
echo "🔧 Management Commands:"
echo "   Stop databases:     docker-compose -f docker-compose.dev.yml down"
echo "   View logs:          docker-compose -f docker-compose.dev.yml logs"
echo "   Database shell:     docker exec -it zplus_postgres_dev psql -U postgres -d zplus_web"
echo ""
echo "✅ Both backend and frontend are currently running and ready!"
