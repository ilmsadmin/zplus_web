#!/bin/bash

# ZPlus Web - GraphQL Server Startup Script
# This script starts the GraphQL server with Ent ORM integration

echo "🚀 Starting ZPlus Web GraphQL Server..."

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if database is running
if ! nc -z localhost 5434 2>/dev/null; then
    echo "⚠️  Database not detected on port 5434"
    echo "📦 Starting development database services..."
    cd ..
    docker-compose -f docker-compose.dev.yml up -d
    cd backend
    echo "⏳ Waiting for database to be ready..."
    sleep 5
fi

# Start the server
echo "🎯 Starting GraphQL API server..."
echo "📍 GraphQL Endpoint: http://localhost:3002/graphql"
echo "🎮 GraphQL Playground: http://localhost:3002/playground"
echo "❤️  Health Check: http://localhost:3002/health"
echo ""

# Run the GraphQL server
go run main.go
