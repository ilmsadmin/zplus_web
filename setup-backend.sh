#!/bin/bash

# ZPlus Web Backend Docker Setup Script
# This script helps you setup and run the backend on Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ZPlus Web Backend Docker Setup${NC}"
echo "=================================="

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

# Build and start services
echo -e "\n${BLUE}🔨 Building Docker images...${NC}"
docker-compose build

echo -e "\n${BLUE}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "\n${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo -e "\n${BLUE}🔍 Checking service health...${NC}"

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    print_status "PostgreSQL is ready"
else
    print_error "PostgreSQL is not ready"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "Redis is ready"
else
    print_error "Redis is not ready"
fi

# Check Backend API
if [ "$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)" = "200" ]; then
    print_status "Backend API is ready"
else
    print_warning "Backend API might still be starting up..."
fi

echo -e "\n${GREEN}🎉 Setup completed!${NC}"
echo "=================================="
echo "Services are running on:"
echo "  📊 Backend API: http://localhost:3000"
echo "  🗄️  PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379"
echo ""
echo "Useful commands:"
echo "  📜 View logs: make logs"
echo "  📜 View backend logs: make logs-backend"
echo "  🛑 Stop services: make down"
echo "  🔄 Restart services: make restart"
echo "  🗑️  Clean up: make clean"
echo ""
echo "API endpoints:"
echo "  🏠 Health check: http://localhost:3000/health"
echo "  📊 API status: http://localhost:3000/api/v1/ping"
echo "  📖 Main endpoint: http://localhost:3000/"
