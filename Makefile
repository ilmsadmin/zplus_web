# Makefile for ZPlus Web Backend Docker Management

.PHONY: help build up down logs restart clean rebuild

# Default target
help:
	@echo "Available commands:"
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - Show logs for all services"
	@echo "  make logs-backend - Show logs for backend service only"
	@echo "  make restart   - Restart all services"
	@echo "  make clean     - Remove all containers and volumes"
	@echo "  make rebuild   - Clean, build and start all services"
	@echo "  make shell-backend - Access backend container shell"
	@echo "  make db-shell  - Access PostgreSQL shell"

# Build all Docker images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Show logs for all services
logs:
	docker-compose logs -f

# Show logs for backend service only
logs-backend:
	docker-compose logs -f backend

# Restart all services
restart:
	docker-compose restart

# Remove all containers and volumes
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Clean, build and start all services
rebuild: clean build up

# Access backend container shell
shell-backend:
	docker-compose exec backend sh

# Access PostgreSQL shell
db-shell:
	docker-compose exec postgres psql -U postgres -d zplus_web

# Check service status
status:
	docker-compose ps

# Pull latest images
pull:
	docker-compose pull

# Run backend tests (when available)
test:
	docker-compose exec backend go test ./...

# View backend container stats
stats:
	docker stats zplus_backend zplus_postgres zplus_redis
