# ZPlus Web

Full-stack web application for ZPlus company featuring a modern Golang backend with GraphQL API, Ent ORM, and Next.js frontend. This application serves as a comprehensive platform for showcasing company services, managing projects, selling software products, and handling customer relationships.

## 🏗️ Architecture Overview

ZPlus Web is designed as a modern full-stack application with the following key features:

### Admin Panel Features
- **Authentication & Authorization**: Secure admin login with JWT-based role access
- **Blog Management**: Create, edit, and publish blog posts with rich content
- **Project Showcase**: Manage and display company projects and portfolio
- **Software Marketplace**: Sell and manage software products with secure downloads
- **User Management**: Handle user accounts, wallets, and loyalty points system
- **Content Sync**: Integration with WordPress/WooCommerce sites
- **Dashboard Analytics**: Real-time statistics and activity monitoring

### Customer-Facing Features
- **Product Browsing**: Browse and purchase software products
- **Blog Reading**: Access company blog and news with search functionality
- **Project Portfolio**: View detailed company projects and case studies
- **User Accounts**: Registration, profile management, and purchase history
- **Digital Wallet**: Top-up balance and manage secure payments
- **Download Center**: Access purchased software with secure download links

## 🚀 Technology Stack

### Backend
- **Framework**: Golang with Fiber v2 (High-performance web framework)
- **API**: GraphQL with custom resolvers for flexible data fetching
- **ORM**: Ent ORM with code generation and type safety
- **Database**: PostgreSQL 15+ with Redis for caching and sessions
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Local file system with upload management

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for full type safety
- **Rendering**: Server-side rendering (SSR) and static generation
- **Styling**: CSS Modules with responsive design
- **State Management**: React hooks with GraphQL client integration

### Infrastructure
- **Containerization**: Docker and Docker Compose for development
- **Development**: Hot reload for both backend and frontend
- **Database**: Automated migrations with Ent schema management
- **Monitoring**: Health checks and request logging

## 📁 Project Structure

```
zplus_web/
├── docs/                    # 📚 Comprehensive documentation
│   ├── database-schema.md   # Database design and Ent schemas
│   ├── api-documentation.md # GraphQL API reference
│   ├── system-architecture.md # Architecture and design decisions
│   └── setup-guide.md       # Detailed setup instructions
├── backend/                 # 🔧 Go backend application
│   ├── config/             # Configuration management
│   ├── database/           # Database connection and utilities
│   ├── ent/                # Ent ORM generated code and schemas
│   │   ├── schema/         # Entity schemas (User, BlogPost, Project, etc.)
│   │   ├── migrate/        # Database migration files
│   │   └── *.go            # Generated ORM code
│   ├── graph/              # GraphQL implementation
│   │   ├── schema.graphql  # GraphQL schema definition
│   │   └── resolvers/      # GraphQL resolvers
│   ├── handlers/           # HTTP request handlers (legacy REST)
│   │   ├── auth/           # Authentication endpoints
│   │   ├── admin/          # Admin panel endpoints
│   │   ├── blog/           # Blog management
│   │   ├── project/        # Project management
│   │   ├── payment/        # Payment processing
│   │   ├── upload/         # File upload handling
│   │   └── wordpress/      # WordPress integration
│   ├── models/             # Legacy data models (being replaced by Ent)
│   ├── middleware/         # HTTP middleware (auth, CORS, logging)
│   ├── services/           # Business logic layer
│   ├── utils/              # Utility functions (JWT, encryption, etc.)
│   ├── uploads/            # File storage directory
│   ├── main_graphql.go     # GraphQL server entry point
│   ├── main_ent.go         # Ent ORM test server
│   └── main.go             # Original REST server
├── frontend/               # 🖥️ Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/    # Admin panel routes
│   │   │   │   └── admin/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── blog/
│   │   │   │       ├── projects/
│   │   │   │       ├── products/
│   │   │   │       ├── customers/
│   │   │   │       └── content/
│   │   │   ├── (customer)/ # Customer-facing routes
│   │   │   │   ├── products/
│   │   │   │   ├── blog/
│   │   │   │   ├── projects/
│   │   │   │   ├── profile/
│   │   │   │   └── checkout/
│   │   │   ├── auth/       # Authentication pages
│   │   │   └── layout.tsx  # Root layout
│   │   └── components/     # Reusable UI components
│   │       ├── ui/         # Basic UI components
│   │       ├── admin/      # Admin-specific components
│   │       └── customer/   # Customer-specific components
├── docker-compose.yml      # 🐳 Multi-service development environment
├── init.sql                # 🗄️ Database schema and initial data
└── README.md               # This file
```

## ⚡ Quick Start

### Prerequisites
- [Go](https://golang.org/dl/) (version 1.21+)
- [Node.js](https://nodejs.org/) (version 18+)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd zplus_web
chmod +x *.sh
```

### 2. Start Development Environment
```bash
# Start PostgreSQL and Redis services
./start-dev.sh

# Start GraphQL API server
./start-graphql.sh
```

### 3. Test the API
```bash
# Check API health
curl http://localhost:3002/health

# Open GraphQL Playground
open http://localhost:3002/playground
```

## 🎯 Current Implementation Status

### ✅ Completed Features
- **Database Architecture**: PostgreSQL with Ent ORM integration
- **GraphQL API**: Custom GraphQL server with authentication
- **User Management**: Registration, login, JWT authentication
- **Database Schemas**: Complete entity definitions (User, BlogPost, Project, etc.)
- **Development Environment**: Docker setup with custom ports
- **API Documentation**: Comprehensive GraphQL documentation
- **Health Monitoring**: API health checks and logging

### 🔄 In Progress
- **Frontend Development**: Next.js frontend implementation
- **Blog Management**: CRUD operations for blog content
- **Project Portfolio**: Company project showcase system
- **File Upload System**: Secure file management

### 📋 Planned Features
- **E-commerce**: Product catalog and order management
- **Payment Integration**: Digital wallet and payment processing
- **WordPress Sync**: Content synchronization with WordPress sites
- **Admin Dashboard**: Comprehensive admin panel
- **Real-time Features**: GraphQL subscriptions and live updates

## 🚀 Technology Highlights

### Modern Backend Stack
- **GraphQL API**: Flexible, type-safe API with interactive playground
- **Ent ORM**: Facebook's entity framework with automatic code generation
- **Fiber Framework**: High-performance Go web framework
- **PostgreSQL 15**: Robust relational database with advanced features
- **Redis**: High-performance caching and session management

### Development Features
- **Hot Reload**: Automatic server restart during development
- **Type Safety**: End-to-end type safety with Go and Ent
- **Auto Migration**: Automatic database schema management
- **Docker Integration**: Containerized development environment
- **GraphQL Playground**: Interactive API testing interface

## 🔧 Available Servers

The backend includes multiple server implementations:

1. **GraphQL Server** (Primary) - `main_graphql.go`
   - **Port**: 3002
   - **Features**: GraphQL API, Playground, Authentication
   - **Start**: `./start-graphql.sh`

2. **Ent Test Server** - `main_ent.go`
   - **Port**: 3001
   - **Features**: Database testing, Ent ORM validation
   - **Start**: `cd backend && go run main_ent.go`

3. **Legacy REST Server** - `main.go`
   - **Port**: 3000
   - **Features**: Original REST API (being phased out)
   - **Start**: `cd backend && go run main.go`
```bash
git clone <repository-url>
cd zplus_web

# Start database services
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend

# Configure environment
cp .env.example .env
# Edit .env with your preferences

# Install dependencies and build
go mod tidy
go build -o server main.go

# Start the server
./server
```

**Backend runs on**: `http://localhost:3000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs on**: `http://localhost:3001`

## 📖 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Setup Guide](docs/setup-guide.md)**: Detailed installation and configuration
- **[API Documentation](docs/api-documentation.md)**: Complete API reference with examples
- **[Database Schema](docs/database-schema.md)**: Database design and relationships
- **[System Architecture](docs/system-architecture.md)**: Technical architecture and design decisions

## 🔗 API Endpoints

### Health & Status
- `GET /health` - Service health check
- `GET /api/v1/ping` - API connectivity test

### Public Access
- `GET /api/v1/blog/posts` - Published blog posts
- `GET /api/v1/blog/posts/:slug` - Individual blog post
- `GET /api/v1/projects` - Company projects
- `GET /api/v1/products` - Software products

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/admin/auth/login` - Admin login

### Admin Panel
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `POST /api/v1/admin/blog/posts` - Create blog post
- `GET /api/v1/admin/blog/posts` - Manage blog posts
- `POST /api/v1/admin/products` - Add software products

*See [API Documentation](docs/api-documentation.md) for complete endpoint reference*

## 🛠️ Development

### Backend Development
```bash
cd backend

# Hot reload development (install air first)
go install github.com/cosmtrek/air@latest
air

# Manual restart
go run main.go
```

### Frontend Development
```bash
cd frontend

# Development with hot reload
npm run dev

# Production build
npm run build && npm start
```

### Database Management
```bash
# PostgreSQL access
docker exec -it zplus_postgres psql -U postgres -d zplus_web

# Redis access
docker exec -it zplus_redis redis-cli

# View logs
docker-compose logs -f
```

## 🔧 Environment Configuration

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=zplus_web

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3000
ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Admin and customer accounts with role-based access
- **Blog**: Posts, categories, and content management
- **Projects**: Company portfolio and project showcase
- **Products**: Software marketplace with files and downloads
- **Orders**: Purchase processing and customer transactions
- **Wallet**: Customer balance and transaction history
- **WordPress Integration**: Content synchronization capabilities

*See [Database Schema](docs/database-schema.md) for detailed table structure*

## 🚀 Features Roadmap

### Phase 1 (Current)
- [x] Project structure and documentation
- [x] Database schema design
- [x] Basic API endpoints
- [x] Admin panel layout
- [x] Authentication framework

### Phase 2 (Next)
- [ ] Complete authentication implementation
- [ ] Full CRUD operations for all modules
- [ ] File upload and management
- [ ] Payment processing integration
- [ ] WordPress content synchronization

### Phase 3 (Future)
- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] Third-party integrations
- [ ] Multi-language support
- [ ] Advanced security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**ZPlus Web** - Empowering software companies with modern web solutions
