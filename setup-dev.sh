#!/bin/bash

# ZPlus Web Backend Development Setup Script
# This script helps you setup and run the backend for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ZPlus Web Backend Development Setup${NC}"
echo "======================================"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_error "Go is not installed. Please install Go first."
    exit 1
fi

print_status "Go is installed ($(go version))"

# Check if we're in the right directory
if [ ! -f "backend/main.go" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Created .env file from .env.example"
    else
        print_error ".env.example file not found"
        exit 1
    fi
else
    print_status ".env file exists"
fi

# Create logs directory
mkdir -p logs
print_status "Created logs directory"

# Install/update dependencies
print_info "Installing Go dependencies..."
go mod tidy
print_status "Go dependencies installed"

# Check if database services are needed
echo -e "\n${BLUE}🔍 Checking database services...${NC}"

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; then
    print_warning "PostgreSQL is not running on localhost:5432"
    print_info "You can start PostgreSQL with Docker:"
    echo "  docker run -d --name zplus_postgres \\"
    echo "    -e POSTGRES_DB=zplus_web \\"
    echo "    -e POSTGRES_USER=postgres \\"
    echo "    -e POSTGRES_PASSWORD=password \\"
    echo "    -p 5432:5432 \\"
    echo "    postgres:15-alpine"
    echo ""
    print_info "Or start only database services:"
    echo "  cd .. && docker-compose up -d postgres redis"
else
    print_status "PostgreSQL is running"
fi

# Check if Redis is running
if ! redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
    print_warning "Redis is not running on localhost:6379"
    print_info "You can start Redis with Docker:"
    echo "  docker run -d --name zplus_redis \\"
    echo "    -p 6379:6379 \\"
    echo "    redis:7-alpine"
else
    print_status "Redis is running"
fi

echo -e "\n${GREEN}🎉 Development setup completed!${NC}"
echo "=================================="
echo "To start the backend server:"
echo "  ${GREEN}go run main.go${NC}"
echo ""
echo "Or use air for hot reload (install with: go install github.com/cosmtrek/air@latest):"
echo "  ${GREEN}air${NC}"
echo ""
echo "Backend will run on:"
echo "  📊 Backend API: http://localhost:3000"
echo ""
echo "API endpoints:"
echo "  🏠 Health check: http://localhost:3000/health"
echo "  📊 API status: http://localhost:3000/api/v1/ping"
echo "  📖 Main endpoint: http://localhost:3000/"
echo ""
echo "Database connections:"
echo "  🗄️  PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379"
