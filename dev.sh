#!/bin/bash

# Quick development start script
echo "🚀 Starting ZPlus Web Backend Development..."

# Check if we're in the right directory
if [ ! -f "backend/main.go" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file..."
    cp backend/.env.example backend/.env
fi

# Create logs directory
mkdir -p backend/logs

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
go mod tidy

echo "✅ Setup complete!"
echo ""
echo "🔍 Checking database services..."

# Check PostgreSQL
if pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL is running"
else
    echo "⚠️  PostgreSQL is not running"
    echo "💡 Start with: docker-compose up -d postgres redis"
fi

# Check Redis
if redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "⚠️  Redis is not running"
    echo "💡 Start with: docker-compose up -d postgres redis"
fi

echo ""
echo "🏃 Starting backend server..."
echo "📊 Backend will be available at: http://localhost:3000"
echo ""

# Start the backend
go run main.go
