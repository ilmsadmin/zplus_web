#!/bin/bash

# Quick script to run backend in development mode
# Prerequisites: Database services should be running

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting ZPlus Web Backend (Development)${NC}"
echo "============================================="

# Check if database services are running
echo -e "${BLUE}🔍 Checking database services...${NC}"

# Check PostgreSQL
if ! docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
    echo -e "${YELLOW}💡 Run: make -f Makefile.dev db-only${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is ready${NC}"

# Check Redis
if ! docker-compose -f docker-compose.dev.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${RED}❌ Redis is not running${NC}"
    echo -e "${YELLOW}💡 Run: make -f Makefile.dev db-only${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Redis is ready${NC}"

# Check .env file
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo -e "${YELLOW}💡 Run: cp backend/.env.example backend/.env${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Environment file exists${NC}"

# Change to backend directory and run
cd backend

echo -e "\n${BLUE}🏃 Starting backend with go run main.go...${NC}"
echo -e "${YELLOW}Backend will be available at: http://localhost:3000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

go run main.go
