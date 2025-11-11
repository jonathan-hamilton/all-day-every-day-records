# Simplified API Structure

## Overview

This simplified approach follows the **Nickel & Dime Records pattern** - straightforward, effective, and easy to maintain. No complex classes, no over-engineering, just clean PHP that gets the job done.

## Core Philosophy

✅ **Simple over Complex** - Individual endpoint files instead of routing systems  
✅ **Functional over OOP** - Helper functions instead of class hierarchies  
✅ **Pragmatic over Perfect** - Solves the actual problems without over-engineering  
✅ **N&D Pattern** - Proven approach that worked well for Nickel & Dime  

## File Structure

```
backend/api/
├── config.php              # Simple configuration with .env support
├── database.php             # Basic Database class (no singletons)
├── security.php             # Common functions (CORS, auth, JSON responses)
├── .env                     # Environment configuration
│
├── get-releases.php         # Get all releases (public + admin)
├── get-releases-by-id.php   # Get single release with details
├── upsert-release.php       # Create or update release
├── delete-release.php       # Remove release (soft delete)
├── login.php               # Authentication endpoint
├── health.php              # Simple health check
│
└── test-simplified.php     # Syntax validation test
```

## Key Components

### 1. config.php
- Loads environment variables from .env
- Provides `$config` array with all settings
- Handles CORS automatically
- Simple error reporting setup

### 2. database.php
**Simple Database class** (no singleton complexity):
```php
$db = new Database($config['database']);
$releases = $db->query('SELECT * FROM releases');
$release = $db->queryOne('SELECT * FROM releases WHERE id = ?', [$id]);
$count = $db->queryValue('SELECT COUNT(*) FROM releases');
$db->execute('INSERT INTO releases (title) VALUES (?)', [$title]);
```

### 3. security.php
**Helper functions following N&D pattern**:
- `handleCORS()` - Handle cross-origin requests
- `getDBConnection()` - Get database instance
- `requireAuth()` - Authentication middleware
- `jsonResponse($data, $code)` - Consistent JSON responses
- `validateUpload($file)` - File validation
- `sanitizeInput($data)` - Input sanitization

### 4. Individual Endpoints
Each endpoint follows the same pattern:
```php
<?php
require_once __DIR__ . '/security.php';

handleCORS();
$db = getDBConnection();

// Handle authentication if needed
if (isAdminRequest()) {
    requireAuth();
}

try {
    // Your logic here
    $result = $db->query('SELECT * FROM releases');
    jsonResponse(['success' => true, 'data' => $result]);
    
} catch (Exception $e) {
    logError('Error message', ['context' => 'details']);
    jsonResponse(['error' => 'Something went wrong'], 500);
}
?>
```

## Database Schema Integration

Works with the database schema we already created:
- `releases` - Main releases table
- `artists` - Artist information
- `release_artists` - Many-to-many relationships
- `labels` - Record label information
- `streaming_links` - Platform streaming links

## Authentication

**Development Mode** (APP_DEBUG=true):
- Hardcoded credentials: `admin/admin123`, `dev/dev123`
- Sessions work for localhost testing

**Production Mode**:
- Checks against `users` table in database
- Password hashing with `password_verify()`
- Secure session settings

## Environment Configuration

Simple `.env` file:
```bash
# Application
APP_ENV=development
APP_DEBUG=true

# Database  
DATABASE_HOST=localhost
DATABASE_NAME=alldayeveryday_records
DATABASE_USERNAME=root
DATABASE_PASSWORD=

# CORS
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## API Endpoints

### Public Endpoints
- `GET /get-releases.php` - List all releases
- `GET /get-releases-by-id.php?id=123` - Single release with details
- `POST /login.php` - User authentication
- `GET /health.php` - Health check

### Admin Endpoints (require authentication)
- `GET /get-releases.php?admin=true` - Admin view (includes removed)
- `POST /upsert-release.php` - Create/update release
- `POST /delete-release.php` - Remove release

## What We Removed

❌ **Complex Router class** → Individual endpoint files  
❌ **Singleton patterns** → Simple instantiation  
❌ **HealthService class** → Simple health.php endpoint  
❌ **Multiple config classes** → Single config.php  
❌ **Migration system** → Direct SQL files  
❌ **Exception hierarchies** → Simple error handling  
❌ **Extensive documentation** → This simple guide  

## Benefits

🚀 **Faster Development** - No need to understand complex architecture  
🔧 **Easier Maintenance** - Each endpoint is self-contained  
🐛 **Simpler Debugging** - Clear, linear code flow  
📈 **Better Performance** - Less overhead, direct execution  
👥 **Team Friendly** - Any PHP developer can understand it immediately  

## Testing

Run syntax validation:
```bash
php test-simplified.php
```

Test endpoints with curl:
```bash
curl http://localhost/api/health.php
curl http://localhost/api/get-releases.php
```

## Migration from Complex System

If needed, the old complex system files are still there in:
- `backend/api/core/` (complex classes)
- `backend/api/services/` (enterprise services)
- `backend/api/controllers/` (heavy controllers)

These can be removed once the simplified system is confirmed working.

## Perfect for ADEDR

This approach is ideal for All Day Every Day Records because:
- **Small catalog** - No need for enterprise-scale architecture
- **Low/medium traffic** - Simple approach handles this perfectly
- **Limited complexity** - Straightforward CRUD operations
- **Future flexibility** - Easy to extend when actually needed

**Bottom line**: Sometimes simple is better. This gives you all the functionality you need without the complexity you don't.