# ZPlus Web

Full-stack web application for ZPlus company featuring a Golang backend with Fiber framework and Next.js frontend. This application serves as a comprehensive platform for showcasing company services, managing projects, selling software products, and handling customer relationships.

## 🏗️ Architecture Overview

ZPlus Web is designed as a modern full-stack application with the following key features:

### Admin Panel Features
- **Authentication & Authorization**: Secure admin login with role-based access
- **Blog Management**: Create, edit, and publish blog posts and company news
- **Project Showcase**: Manage and display company projects and portfolio
- **Software Marketplace**: Sell and manage software products with file downloads
- **Customer Management**: Handle user registrations, wallets, and loyalty points
- **Content Sync**: Integration with WordPress/WooCommerce sites
- **Dashboard Analytics**: Real-time statistics and activity monitoring

### Customer-Facing Features
- **Product Browsing**: Browse and purchase software products
- **Blog Reading**: Access company blog and news
- **Project Portfolio**: View company projects and case studies
- **User Accounts**: Registration, profile management, and purchase history
- **Digital Wallet**: Top-up balance and manage payments
- **Download Center**: Access purchased software with secure downloads

## 🚀 Technology Stack

### Backend
- **Framework**: Golang with Fiber (Express-like framework)
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT tokens with bcrypt password hashing
- **API**: RESTful API with comprehensive endpoint coverage

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Rendering**: Server-side rendering (SSR) and static generation
- **Styling**: CSS Modules with responsive design

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Development**: Hot reload for both backend and frontend
- **Database**: Automated migrations and seeding

## 📁 Project Structure

```
zplus_web/
├── docs/                    # 📚 Comprehensive documentation
│   ├── database-schema.md   # Database design and relationships
│   ├── api-documentation.md # Complete API reference
│   ├── system-architecture.md # Architecture and design decisions
│   └── setup-guide.md       # Detailed setup instructions
├── backend/                 # 🔧 Go backend application
│   ├── config/             # Configuration management
│   ├── database/           # Database connection and utilities
│   ├── handlers/           # HTTP request handlers by module
│   │   ├── auth/           # Authentication endpoints
│   │   ├── admin/          # Admin panel endpoints
│   │   ├── blog/           # Blog management
│   │   ├── projects/       # Project management
│   │   ├── products/       # Product/marketplace management
│   │   ├── customers/      # Customer management
│   │   └── orders/         # Order processing
│   ├── models/             # Data models and request/response types
│   ├── middleware/         # HTTP middleware (auth, CORS, etc.)
│   ├── services/           # Business logic layer
│   ├── utils/              # Utility functions
│   └── main.go             # Application entry point
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
