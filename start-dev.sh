#!/bin/bash

# ZPlus Web Development Setup Script
# This script sets up the development environment with databases on Docker
# and backend running with go run main.go

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ZPlus Web Development Setup${NC}"
echo "====================================="

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi
print_status "Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_status "Docker Compose is available"

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_error "Go is not installed. Please install Go first."
    exit 1
fi
print_status "Go is installed ($(go version))"

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        print_status "Created .env file from .env.example"
    else
        print_error ".env.example file not found"
        exit 1
    fi
else
    print_status ".env file exists"
fi

# Create logs directory
mkdir -p backend/logs
print_status "Created logs directory"

# Install Go dependencies
echo -e "\n${BLUE}📦 Installing Go dependencies...${NC}"
cd backend
go mod tidy
go mod download
cd ..
print_status "Go dependencies installed"

# Start database services
echo -e "\n${BLUE}🗄️ Starting database services...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo -e "\n${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo -e "\n${BLUE}🔍 Checking service health...${NC}"

# Check PostgreSQL
if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    print_status "PostgreSQL is ready"
else
    print_error "PostgreSQL is not ready"
fi

# Check Redis
if docker-compose -f docker-compose.dev.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "Redis is ready"
else
    print_error "Redis is not ready"
fi

echo -e "\n${GREEN}🎉 Development environment setup completed!${NC}"
echo "=============================================="
echo "Database services are running on:"
echo "  🗄️  PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379"
echo ""
echo "Now you can start the backend:"
echo "  🚀 Start backend: ${YELLOW}make -f Makefile.dev run${NC}"
echo "  🔥 Start with hot reload: ${YELLOW}make -f Makefile.dev air${NC}"
echo "  🏃 Or directly: ${YELLOW}cd backend && go run main.go${NC}"
echo ""
echo "Other useful commands:"
echo "  📜 View database logs: ${YELLOW}make -f Makefile.dev db-logs${NC}"
echo "  🛑 Stop databases: ${YELLOW}make -f Makefile.dev stop-db${NC}"
echo "  🔍 Check database status: ${YELLOW}make -f Makefile.dev check-db${NC}"
echo ""
echo "Backend will be available at: ${YELLOW}http://localhost:3000${NC}"
