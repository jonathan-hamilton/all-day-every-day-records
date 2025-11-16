# All Day Every Day Records - Docker Setup

This setup provides a complete development environment with:
- **Frontend**: React app with Vite dev server
- **Backend**: PHP 8.3 with Apache
- **Database**: MySQL 8.0
- **Hot Reload**: File changes reflect immediately

## Quick Start

```bash
# Clone and navigate to project
cd all-day-every-day-records

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:3306
- **phpMyAdmin**: http://localhost:8081

## Development

Files are mounted from your local filesystem, so changes appear immediately:
- Frontend hot reload works automatically
- Backend PHP files update on refresh
- Database persists in Docker volume

## Environment Variables

Copy `.env.example` to `.env` and modify as needed for your local setup.