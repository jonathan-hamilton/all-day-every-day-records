# All Day Every Day Records - Database Documentation

## Overview

The All Day Every Day Records database is designed to support a comprehensive music release management system. The schema follows 3rd Normal Form (3NF) principles while incorporating strategic denormalization for performance optimization.

## Database Configuration

- **Engine**: InnoDB (for transaction support and foreign keys)
- **Character Set**: utf8mb4 (full Unicode support)
- **Collation**: utf8mb4_unicode_ci (case-insensitive Unicode)
- **SQL Mode**: Strict mode for data integrity

## Entity Relationship Overview

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│   Artists   │ ←──┤  Release_Artists ├──→ │  Releases   │
└─────────────┘    └──────────────────┘    └─────────────┘
                                                   │
                                                   ↓
┌─────────────┐                              ┌─────────────┐
│   Labels    │ ←────────────────────────────┤ Streaming   │
└─────────────┘                              │   Links     │
                                             └─────────────┘
```

## Core Tables

### 1. Artists Table

Stores information about music artists, DJs, and producers.

**Columns:**
- `id` (PRIMARY KEY) - Unique identifier
- `name` - Artist or group name
- `slug` - URL-friendly identifier (unique)
- `bio` - Artist biography/description (TEXT)
- `image_url` - Artist profile image URL
- `website_url` - Official website URL
- `social_media` - Social media links (JSON)
- `created_at` / `updated_at` - Timestamps

**Indexes:**
- Primary key on `id`
- Unique index on `slug`
- Index on `name` for search
- Index on `created_at` for ordering

**Usage Examples:**
```sql
-- Get artist by slug
SELECT * FROM artists WHERE slug = 'artist-name';

-- Search artists by name
SELECT * FROM artists WHERE name LIKE '%search%';
```

### 2. Labels Table

Stores record label information.

**Columns:**
- `id` (PRIMARY KEY) - Unique identifier
- `name` - Label name
- `slug` - URL-friendly identifier (unique)
- `description` - Label description
- `website_url` - Official website
- `logo_url` - Label logo image URL
- `founded_year` - Year established
- `contact_email` - Contact email
- `social_media` - Social media links (JSON)
- `is_active` - Whether currently active
- `created_at` / `updated_at` - Timestamps

**Indexes:**
- Primary key on `id`
- Unique index on `slug`
- Index on `name` for search
- Index on `is_active` for filtering
- Index on `founded_year` for historical queries

### 3. Releases Table

Main table for music releases (singles, EPs, albums, etc.).

**Columns:**
- `id` (PRIMARY KEY) - Unique identifier
- `title` - Release title
- `slug` - URL-friendly identifier (unique)
- `description` - Release description/notes
- `release_date` - Official release date
- `release_type` - Type: single, ep, album, compilation, mixtape, remix
- `catalog_number` - Label catalog number
- `label_id` - Foreign key to labels table
- `cover_image_url` - Release cover art URL
- `bandcamp_url` - Bandcamp release URL
- `bandcamp_id` - Bandcamp release ID
- `duration_seconds` - Total duration in seconds
- `track_count` - Number of tracks
- `is_featured` - Featured on homepage
- `display_order` - Order for display sorting
- `status` - draft, published, archived
- `metadata` - Additional metadata (JSON)
- `created_at` / `updated_at` - Timestamps

**Foreign Keys:**
- `label_id` → `labels(id)` (ON DELETE SET NULL)

**Indexes:**
- Primary key on `id`
- Unique index on `slug`
- Indexes on commonly queried fields: `release_date`, `release_type`, `label_id`, `is_featured`, `status`, `display_order`
- Composite indexes for complex queries

### 4. Release_Artists Table (Junction Table)

Links releases to artists with roles (many-to-many relationship).

**Columns:**
- `id` (PRIMARY KEY) - Unique identifier
- `release_id` - Foreign key to releases
- `artist_id` - Foreign key to artists
- `role` - Artist role: primary, featured, remixer, producer, collaborator
- `display_order` - Order for display purposes
- `created_at` - Timestamp

**Foreign Keys:**
- `release_id` → `releases(id)` (ON DELETE CASCADE)
- `artist_id` → `artists(id)` (ON DELETE CASCADE)

**Constraints:**
- Unique combination of `release_id`, `artist_id`, `role`

**Usage Examples:**
```sql
-- Get all artists for a release
SELECT a.*, ra.role FROM artists a
JOIN release_artists ra ON a.id = ra.artist_id
WHERE ra.release_id = ?
ORDER BY ra.display_order;

-- Get all releases by an artist
SELECT r.* FROM releases r
JOIN release_artists ra ON r.id = ra.release_id
WHERE ra.artist_id = ?;
```

### 5. Streaming_Links Table

Stores streaming platform URLs for each release.

**Columns:**
- `id` (PRIMARY KEY) - Unique identifier
- `release_id` - Foreign key to releases
- `platform` - Streaming platform name
- `url` - Platform-specific URL
- `platform_release_id` - Platform internal ID
- `platform_data` - Platform-specific metadata (JSON)
- `is_active` - Whether link is currently active
- `verified_at` - Last verification timestamp
- `created_at` / `updated_at` - Timestamps

**Foreign Keys:**
- `release_id` → `releases(id)` (ON DELETE CASCADE)

**Indexes:**
- Primary key on `id`
- Index on `release_id`
- Index on `platform`
- Index on `is_active`
- Composite indexes for common queries

## System Tables

### 6. Migrations Table

Tracks database migration history for schema versioning.

**Columns:**
- `id` (PRIMARY KEY) - Unique identifier
- `migration` - Migration filename (unique)
- `batch` - Batch number for rollback grouping
- `executed_at` - Execution timestamp

## Views

### Release_Overview View

Provides a consolidated view of releases with artist and label information.

```sql
CREATE VIEW release_overview AS
SELECT 
    r.id,
    r.title,
    r.slug,
    -- ... other release fields
    l.name as label_name,
    GROUP_CONCAT(DISTINCT CONCAT(a.name, ':', ra.role)) as artists_with_roles,
    GROUP_CONCAT(DISTINCT sl.platform) as available_platforms
FROM releases r
LEFT JOIN labels l ON r.label_id = l.id
LEFT JOIN release_artists ra ON r.id = ra.release_id
LEFT JOIN artists a ON ra.artist_id = a.id
LEFT JOIN streaming_links sl ON r.id = sl.release_id
WHERE r.status = 'published'
GROUP BY r.id;
```

## Stored Procedures

### GetReleaseDetails(release_slug)

Returns complete release information including artists and streaming links.

```sql
CALL GetReleaseDetails('release-slug-name');
```

Returns three result sets:
1. Release information with label details
2. Artists with roles and display order
3. Active streaming links

## JSON Field Structures

### Social Media (artists.social_media, labels.social_media)
```json
{
  "instagram": "https://instagram.com/username",
  "twitter": "https://twitter.com/username",
  "facebook": "https://facebook.com/username",
  "soundcloud": "https://soundcloud.com/username",
  "bandcamp": "https://username.bandcamp.com"
}
```

### Platform Data (streaming_links.platform_data)
```json
{
  "artwork_url": "https://platform.com/artwork.jpg",
  "embed_url": "https://platform.com/embed/12345",
  "track_id": "12345",
  "last_updated": "2025-01-01T00:00:00Z"
}
```

### Release Metadata (releases.metadata)
```json
{
  "genres": ["Electronic", "House"],
  "moods": ["Energetic", "Uplifting"],
  "bpm": 128,
  "key": "C major",
  "mastered_by": "Engineer Name",
  "recorded_at": "Studio Name"
}
```

## Performance Optimization

### Indexing Strategy

**Single Column Indexes:**
- Primary keys (automatic)
- Foreign keys for join performance
- Slug fields for URL lookups
- Status fields for filtering
- Date fields for chronological ordering

**Composite Indexes:**
- `(status, is_featured)` - Homepage featured releases
- `(status, release_date)` - Published releases by date
- `(release_type, status)` - Releases by type and status
- `(release_id, platform)` - Streaming links lookup

### Query Optimization Tips

1. **Use Indexes Effectively:**
```sql
-- Good: Uses index on status
SELECT * FROM releases WHERE status = 'published';

-- Bad: Cannot use index effectively
SELECT * FROM releases WHERE YEAR(release_date) = 2025;

-- Good: Can use index
SELECT * FROM releases WHERE release_date >= '2025-01-01' AND release_date < '2026-01-01';
```

2. **Limit Result Sets:**
```sql
-- Always use LIMIT for pagination
SELECT * FROM releases ORDER BY release_date DESC LIMIT 20 OFFSET 0;
```

3. **Use Prepared Statements:**
```php
$stmt = $pdo->prepare("SELECT * FROM releases WHERE slug = ?");
$stmt->execute([$slug]);
```

## Security Considerations

### Data Protection
- All user input must be sanitized
- Use prepared statements to prevent SQL injection
- Foreign key constraints prevent orphaned records
- Triggers validate data consistency

### Access Control
- Database user should have minimal required privileges
- Separate read-only user for reporting queries
- Regular security updates for database server

## Backup and Maintenance

### Backup Strategy
```bash
# Full backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Schema only backup
mysqldump -u username -p --no-data database_name > schema_backup.sql

# Data only backup
mysqldump -u username -p --no-create-info database_name > data_backup.sql
```

### Maintenance Tasks
- Regular ANALYZE TABLE for query optimization
- Monitor slow query log
- Check for unused indexes
- Archive old data if needed

### Migration Management
```bash
# Apply pending migrations
php scripts/migrate.php up

# Rollback last migration batch
php scripts/migrate.php rollback

# Check migration status
php scripts/migrate.php status
```

## Development Guidelines

### Naming Conventions
- **Tables**: snake_case, plural nouns (e.g., `streaming_links`)
- **Columns**: snake_case (e.g., `created_at`)
- **Indexes**: `idx_` prefix followed by column names
- **Foreign Keys**: `fk_` prefix with table and column names

### Data Types
- **IDs**: INT UNSIGNED AUTO_INCREMENT
- **Strings**: VARCHAR with appropriate length
- **Text**: TEXT for long content
- **Booleans**: BOOLEAN (stored as TINYINT(1))
- **Timestamps**: TIMESTAMP with timezone awareness
- **JSON**: JSON for flexible metadata

### Schema Changes
1. Create migration file
2. Test on development database
3. Review with team
4. Apply to staging environment
5. Deploy to production with backup plan

## Troubleshooting

### Common Issues

**Foreign Key Constraint Errors:**
```sql
-- Check constraint details
SHOW CREATE TABLE table_name;

-- Disable checks temporarily (use carefully)
SET FOREIGN_KEY_CHECKS = 0;
-- Your operations here
SET FOREIGN_KEY_CHECKS = 1;
```

**Character Set Issues:**
```sql
-- Check current character set
SHOW CREATE DATABASE database_name;

-- Convert if needed
ALTER DATABASE database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Performance Issues:**
```sql
-- Analyze slow queries
SHOW PROCESSLIST;

-- Check index usage
EXPLAIN SELECT * FROM releases WHERE condition;

-- Update table statistics
ANALYZE TABLE table_name;
```

### Connection Issues
- Verify database server is running
- Check connection parameters in .env file
- Ensure database user has proper privileges
- Test connection with mysql command line client

## Future Considerations

### Potential Enhancements
1. **Full-text search** on release titles and descriptions
2. **Partitioning** by release date for large datasets
3. **Read replicas** for improved query performance
4. **Audit logging** for data change tracking
5. **Soft deletes** for data recovery capabilities

### Scalability Options
1. **Horizontal partitioning** by date ranges
2. **Caching layer** with Redis/Memcached
3. **Read-only replicas** for reporting
4. **Connection pooling** for high traffic

This database schema provides a solid foundation for the All Day Every Day Records platform while remaining flexible for future enhancements.