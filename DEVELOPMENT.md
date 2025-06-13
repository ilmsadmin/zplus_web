# ZPlus Web Development Guide

## Quick Start

### 1. Setup Development Environment

```bash
# Run the setup script
./start-dev.sh
```

Hoặc setup thủ công:

```bash
# 1. Start database services
make -f Makefile.dev db-only

# 2. Check if databases are ready
make -f Makefile.dev check-db

# 3. Start backend
cd backend && go run main.go
```

### 2. Development Commands

```bash
# Start backend với go run
make -f Makefile.dev run

# Start backend với hot reload (air)
make -f Makefile.dev air

# Install dependencies
make -f Makefile.dev deps

# Build binary
make -f Makefile.dev build

# Run tests
make -f Makefile.dev test
```

### 3. Database Management

```bash
# Start database services only
make -f Makefile.dev db-only

# Stop database services
make -f Makefile.dev stop-db

# View database logs
make -f Makefile.dev db-logs

# Check database status
make -f Makefile.dev check-db
```

### 4. Database Access

```bash
# PostgreSQL shell
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d zplus_web

# Redis shell
docker-compose -f docker-compose.dev.yml exec redis redis-cli
```

## Configuration

### Environment Variables (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=zplus_web

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server Configuration
PORT=3000
ENV=development
```

### Database Services

- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### API Endpoints

- **Health Check**: http://localhost:3000/health
- **API Ping**: http://localhost:3000/api/v1/ping
- **Main**: http://localhost:3000/

## Development Workflow

1. **Start Development**:
   ```bash
   ./start-dev.sh
   ```

2. **Start Backend với Hot Reload**:
   ```bash
   make -f Makefile.dev air
   ```

3. **Make Changes**: Edit your Go code and it will automatically reload

4. **Test API**: Use Postman, curl, or your frontend to test the API

5. **Stop Development**:
   ```bash
   make -f Makefile.dev stop-db
   ```

## Troubleshooting

### Database Connection Issues

1. Check if Docker is running:
   ```bash
   docker info
   ```

2. Check if database services are running:
   ```bash
   make -f Makefile.dev check-db
   ```

3. Restart database services:
   ```bash
   make -f Makefile.dev stop-db
   make -f Makefile.dev db-only
   ```

### Backend Issues

1. Check Go version:
   ```bash
   go version
   ```

2. Install dependencies:
   ```bash
   make -f Makefile.dev deps
   ```

3. Check .env file exists:
   ```bash
   ls -la backend/.env
   ```

### Hot Reload Issues

1. Install air if not installed:
   ```bash
   go install github.com/cosmtrek/air@latest
   ```

2. Check air configuration:
   ```bash
   cat backend/.air.toml
   ```

## Production vs Development

- **Development**: Database services in Docker, backend with `go run`
- **Production**: All services in Docker containers

Use `docker-compose.yml` for production and `docker-compose.dev.yml` for development.
