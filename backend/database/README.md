# Database Setup for All Day Every Day Records

This directory contains the complete database schema and setup scripts for the All Day Every Day Records platform.

## Files Overview

- **`schema.sql`** - Main database schema with all core tables
- **`schema_additions.sql`** - Sprint 3 additions (users, homepage videos, release updates)
- **`setup.sh`** - Linux/Mac setup script
- **`setup.bat`** - Windows setup script

## Quick Setup

### Prerequisites
- MySQL 8.0+ or MariaDB 10.3+
- MySQL client tools installed

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
cd backend/database
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
cd backend\database
setup.bat
```

### Option 2: Manual Setup

1. **Create Database:**
```sql
CREATE DATABASE all_day_every_day_records 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Run Main Schema:**
```bash
mysql -u your_user -p all_day_every_day_records < schema.sql
```

3. **Run Sprint 3 Additions:**
```bash
mysql -u your_user -p all_day_every_day_records < schema_additions.sql
```

## Database Structure

### Core Tables (Original Schema)
- **`artists`** - Music artists, DJs, and producers
- **`labels`** - Record label information
- **`releases`** - Music releases (singles, EPs, albums)
- **`release_artists`** - Many-to-many artist relationships
- **`streaming_links`** - Platform URLs for releases
- **`migrations`** - Schema version tracking

### Sprint 3 Additions
- **`users`** - Admin authentication with is_admin flag
- **`homepage_videos`** - YouTube video management (4-position grid)

### Release Table Updates
- Added `is_new` column for highlighting new releases
- Made `cover_image_url` mandatory (NOT NULL)
- Enhanced indexing for admin queries

## Default Data

### Admin User
- **Username:** admin
- **Email:** admin@alldayeverydayrecords.com
- **Password:** admin123
- **🚨 IMPORTANT:** Change this password immediately after setup!

### Homepage Videos
- 4 placeholder YouTube videos are inserted
- Update these via the admin interface

## Configuration

### Database Connection
Update your PHP configuration files with the database credentials:

```php
// config.php
$db_config = [
    'host' => 'localhost',
    'database' => 'all_day_every_day_records',
    'username' => 'your_db_user',
    'password' => 'your_db_password',
    'charset' => 'utf8mb4'
];
```

### Image Storage
- **Base Path:** `/assets/images/`
- **Release Covers:** `/assets/images/releases/`
- **Other Images:** `/assets/images/[category]/`

Ensure the web server has read/write permissions to the assets directory.

---

**Next Steps:** After successful database setup, configure your PHP backend to connect to the database and test the admin authentication system.