# 🚀 ZPlus Web Backend - Development Setup

## Quick Start (3 bước)

### 1. Setup & Start Database Services
```bash
./start-dev.sh
```

### 2. Start Backend
```bash
# Option 1: Direct run
cd backend && go run main.go

# Option 2: Using script
./run-backend.sh

# Option 3: Hot reload (recommended)
make -f Makefile.dev air
```

### 3. Test API
```bash
curl http://localhost:3000/health
```

## Services

- **Backend**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Commands

```bash
# Database management
make -f Makefile.dev db-only    # Start databases
make -f Makefile.dev stop-db    # Stop databases
make -f Makefile.dev check-db   # Check status

# Backend development
make -f Makefile.dev run        # Run backend
make -f Makefile.dev air        # Hot reload
make -f Makefile.dev test       # Run tests
```

## Configuration

Environment file: `backend/.env`
```env
DB_HOST=localhost
DB_PORT=5432
PORT=3000
ENV=development
```

---

📖 Detailed guide: [DEVELOPMENT.md](DEVELOPMENT.md)
