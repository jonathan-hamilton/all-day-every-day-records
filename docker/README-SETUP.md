# 🐳 Docker Setup Guide

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Git](https://git-scm.com/) installed

## Quick Start (Development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd all-day-every-day-records
```

### 2. Start Development Environment
```bash
# On Windows
docker\start-dev.bat

# On macOS/Linux  
chmod +x docker/start-dev.sh
./docker/start-dev.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Database Admin**: http://localhost:8081

## Manual Setup

### 1. Environment Configuration
```bash
# The .env file is already configured with your DreamHost database credentials
# No additional setup needed!
```

### 2. Build and Start Services
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Deployment

### 1. Production Environment
```bash
# Copy production environment template
cp .env.production .env

# Edit .env with secure production values
nano .env
```

### 2. Deploy with Production Settings
```bash
# Start with production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Development Workflow

### File Changes
- **Frontend**: Files auto-reload via Vite hot module replacement
- **Backend**: PHP files update on page refresh (no restart needed)
- **Database**: Changes persist in Docker volume

### Common Commands
```bash
# View service status
docker-compose ps

# Follow logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db

# Restart a specific service
docker-compose restart backend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Database access
docker-compose exec db mysql -u root -p all_day_records
```

### Database Management
- **phpMyAdmin**: http://localhost:8081
- **Credentials**: root/root (development)
- **Database**: all_day_records

## Troubleshooting

### Port Conflicts
If you get port binding errors:
```bash
# Check what's using the ports
netstat -tulpn | grep :5173
netstat -tulpn | grep :8080

# Stop conflicting services or change ports in docker-compose.yml
```

### CORS Issues (Fixed!)
The Docker setup includes proper CORS headers for React 19:
- `Cache-Control`, `Pragma`, `Expires` headers are now allowed
- Frontend cache-busting headers work correctly

### File Permission Issues (Linux/macOS)
```bash
# Fix permissions if needed
sudo chown -R $USER:$USER backend/uploads
chmod -R 755 backend/uploads
```

### Database Connection Issues
```bash
# Check database logs
docker-compose logs db

# Verify database is running
docker-compose exec db mysql -u root -p -e "SHOW DATABASES;"
```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove images (optional)
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## Architecture

### Services
- **frontend**: React 19 + Vite + TypeScript (Port 5173)
- **backend**: PHP 8.3 + Apache (Port 8080)
- **db**: MySQL 8.0 (Port 3306)
- **phpmyadmin**: Database management (Port 8081)

### Volumes
- `mysql_data`: Persistent database storage
- Bind mounts for source code (enables live editing)

### Network
- All services communicate via `aeder-network` bridge
- Services can reference each other by service name (e.g., `http://backend/api`)

## VS Code Integration

### Recommended Extensions
- Docker
- PHP Intelephense
- ES7+ React/Redux/React-Native snippets

### Dev Container (Optional)
The setup works great with VS Code's Remote-Container extension for containerized development.

## Next Steps

1. **✅ CORS Issue Resolved**: React 19 cache-busting headers now work
2. **✅ Hot Reload**: Frontend and backend changes reflect immediately
3. **✅ Database Seeding**: Schema and seed data load automatically
4. **✅ Development Tools**: phpMyAdmin available for database management

Your original issue with `get-homepage-videos.php` failing due to CORS should now be resolved in the Docker environment!