# ZPlus Web

Full-stack web application for ZPlus company featuring a Golang backend with Fiber framework and Next.js frontend.

## Technology Stack

### Backend
- **Golang** with Fiber framework
- **PostgreSQL** database
- **Redis** for caching
- **RESTful API** architecture

### Frontend
- **Next.js** with React
- **TypeScript** for type safety
- **Server-side rendering** (SSR)

## Prerequisites

Make sure you have the following installed:
- [Go](https://golang.org/dl/) (version 1.21 or higher)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd zplus_web
```

### 2. Start the database services
```bash
# Start PostgreSQL and Redis using Docker Compose
docker-compose up -d

# Check if services are running
docker-compose ps
```

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
go mod tidy

# Build the application
go build -o server main.go

# Run the backend server
./server
```

The backend API will be available at `http://localhost:3000`

### 4. Setup Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running
- `GET /` - Welcome message
- `GET /api/v1/ping` - Ping endpoint

### Available Routes
The API provides the following endpoints:
- Health check and status endpoints
- User management (planned)
- Authentication (planned)

## Development

### Backend Development
```bash
cd backend

# Run with hot reload (install air first: go install github.com/cosmtrek/air@latest)
air

# Or run normally
go run main.go
```

### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Management

```bash
# Connect to PostgreSQL
docker exec -it zplus_postgres psql -U postgres -d zplus_web

# Connect to Redis
docker exec -it zplus_redis redis-cli
```

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=zplus_web

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

PORT=3000
ENV=development
```

## Project Structure

```
zplus_web/
├── backend/
│   ├── config/         # Configuration files
│   ├── database/       # Database connection
│   ├── handlers/       # HTTP handlers
│   ├── models/         # Data models
│   ├── main.go         # Entry point
│   ├── go.mod          # Go dependencies
│   └── .env.example    # Environment template
├── frontend/
│   ├── src/
│   │   ├── app/        # Next.js app directory
│   │   ├── components/ # React components
│   │   └── utils/      # Utility functions
│   ├── package.json    # Node.js dependencies
│   ├── next.config.js  # Next.js configuration
│   └── tsconfig.json   # TypeScript configuration
├── docker-compose.yml  # Docker services
├── init.sql           # Database initialization
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
