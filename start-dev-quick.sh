#!/bin/bash

# Quick Development Start Script
# This script starts the development environment quickly

set -e

echo "🚀 ZPlus Web - Quick Dev Start"
echo "Backend: http://localhost:4001"
echo "Frontend: http://localhost:3001"
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start databases if not already running
if ! docker ps | grep -q zplus_postgres; then
    echo "📦 Starting database services..."
    docker-compose -f docker-compose.dev.yml up -d postgres redis
    echo "⏳ Waiting for databases to be ready..."
    sleep 10
else
    echo "✅ Databases are already running"
fi

# Check if backend is running
if curl -s http://localhost:4001/health >/dev/null 2>&1; then
    echo "✅ Backend is already running on port 4001"
else
    echo "🚀 Starting backend..."
    cd backend
    go run main.go &
    BACKEND_PID=$!
    cd ..
    
    echo "⏳ Waiting for backend to start..."
    sleep 10
    
    # Verify backend is running
    if curl -s http://localhost:4001/health >/dev/null 2>&1; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Backend failed to start"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
fi

# Check if frontend is running
if curl -s http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Frontend is already running on port 3001"
else
    echo "🚀 Starting frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo "⏳ Waiting for frontend to start..."
    sleep 15
    
    # Verify frontend is running
    if curl -s http://localhost:3001 >/dev/null 2>&1; then
        echo "✅ Frontend started successfully"
    else
        echo "❌ Frontend failed to start"
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
fi

echo ""
echo "🎉 ZPlus Web Development Environment is Ready!"
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
echo "   curl -X POST http://localhost:4001/graphql -H 'Content-Type: application/json' -d '{\"query\": \"query { users { id username email } }\"}'"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user input
wait
