-- =============================================================================
-- All Day Every Day Records - Database Schema
-- =============================================================================
-- This file contains the complete database schema for the All Day Every Day
-- Records platform. The schema supports music releases, artists, labels,
-- and streaming platform integration.
--
-- Schema Design Philosophy:
-- - 3rd Normal Form (3NF) for core entities to eliminate redundancy
-- - Denormalization where needed for performance
-- - Foreign key constraints for data integrity
-- - Strategic indexing for common query patterns
-- =============================================================================

-- Set database configuration for consistency
SET sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- =============================================================================
-- CORE ENTITY TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Artists Table
-- -----------------------------------------------------------------------------
-- Stores information about music artists, DJs, and producers
CREATE TABLE artists (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Artist or group name',
    slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly identifier',
    bio TEXT DEFAULT NULL COMMENT 'Artist biography/description',
    image_url VARCHAR(500) DEFAULT NULL COMMENT 'Artist profile image URL',
    website_url VARCHAR(500) DEFAULT NULL COMMENT 'Official website URL',
    social_media JSON DEFAULT NULL COMMENT 'Social media links as JSON object',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_slug (slug),
    INDEX idx_name (name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Music artists, DJs, and producers information';

-- -----------------------------------------------------------------------------
-- Labels Table
-- -----------------------------------------------------------------------------
-- Stores record label information
CREATE TABLE labels (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Label name',
    slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly identifier',
    description TEXT DEFAULT NULL COMMENT 'Label description',
    website_url VARCHAR(500) DEFAULT NULL COMMENT 'Official label website',
    logo_url VARCHAR(500) DEFAULT NULL COMMENT 'Label logo image URL',
    founded_year YEAR DEFAULT NULL COMMENT 'Year the label was founded',
    contact_email VARCHAR(255) DEFAULT NULL COMMENT 'Label contact email',
    social_media JSON DEFAULT NULL COMMENT 'Social media links as JSON object',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether the label is currently active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_slug (slug),
    INDEX idx_name (name),
    INDEX idx_is_active (is_active),
    INDEX idx_founded_year (founded_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Record label information';

-- -----------------------------------------------------------------------------
-- Releases Table
-- -----------------------------------------------------------------------------
-- Main table for music releases (singles, EPs, albums, etc.)
CREATE TABLE releases (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Release title',
    slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly identifier',
    description TEXT DEFAULT NULL COMMENT 'Release description/notes',
    release_date DATE DEFAULT NULL COMMENT 'Official release date',
    release_type ENUM('single', 'ep', 'album', 'compilation', 'mixtape', 'remix') 
        NOT NULL DEFAULT 'single' COMMENT 'Type of release',
    catalog_number VARCHAR(100) DEFAULT NULL COMMENT 'Label catalog number',
    label_id INT UNSIGNED DEFAULT NULL COMMENT 'Associated record label',
    cover_image_url VARCHAR(500) DEFAULT NULL COMMENT 'Release cover art URL',
    bandcamp_url VARCHAR(500) DEFAULT NULL COMMENT 'Bandcamp release URL',
    bandcamp_id VARCHAR(100) DEFAULT NULL COMMENT 'Bandcamp release ID',
    duration_seconds INT UNSIGNED DEFAULT NULL COMMENT 'Total duration in seconds',
    track_count INT UNSIGNED DEFAULT 1 COMMENT 'Number of tracks',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Featured on homepage',
    display_order INT DEFAULT 0 COMMENT 'Order for display sorting',
    status ENUM('draft', 'published', 'archived') DEFAULT 'published' COMMENT 'Publication status',
    metadata JSON DEFAULT NULL COMMENT 'Additional metadata as JSON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_slug (slug),
    INDEX idx_release_date (release_date),
    INDEX idx_release_type (release_type),
    INDEX idx_label_id (label_id),
    INDEX idx_is_featured (is_featured),
    INDEX idx_status (status),
    INDEX idx_display_order (display_order),
    INDEX idx_created_at (created_at),
    
    -- Composite indexes for common queries
    INDEX idx_status_featured (status, is_featured),
    INDEX idx_status_date (status, release_date),
    INDEX idx_type_status (release_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Music releases (singles, EPs, albums, etc.)';

-- =============================================================================
-- RELATIONSHIP TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Release Artists Table (Many-to-Many)
-- -----------------------------------------------------------------------------
-- Links releases to artists with roles (primary, featured, remixer, etc.)
CREATE TABLE release_artists (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    release_id INT UNSIGNED NOT NULL COMMENT 'Release reference',
    artist_id INT UNSIGNED NOT NULL COMMENT 'Artist reference',
    role ENUM('primary', 'featured', 'remixer', 'producer', 'collaborator') 
        DEFAULT 'primary' COMMENT 'Artist role on this release',
    display_order INT DEFAULT 0 COMMENT 'Order for display purposes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Ensure unique combinations per role
    UNIQUE KEY unique_release_artist_role (release_id, artist_id, role),
    
    -- Indexes for performance
    INDEX idx_release_id (release_id),
    INDEX idx_artist_id (artist_id),
    INDEX idx_role (role),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Many-to-many relationship between releases and artists';

-- -----------------------------------------------------------------------------
-- Streaming Links Table
-- -----------------------------------------------------------------------------
-- Stores streaming platform URLs for each release
CREATE TABLE streaming_links (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    release_id INT UNSIGNED NOT NULL COMMENT 'Release reference',
    platform VARCHAR(50) NOT NULL COMMENT 'Streaming platform name',
    url VARCHAR(500) NOT NULL COMMENT 'Platform-specific URL',
    platform_release_id VARCHAR(255) DEFAULT NULL COMMENT 'Platform internal ID',
    platform_data JSON DEFAULT NULL COMMENT 'Platform-specific metadata',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether link is currently active',
    verified_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Last verification timestamp',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes for performance
    INDEX idx_release_id (release_id),
    INDEX idx_platform (platform),
    INDEX idx_is_active (is_active),
    INDEX idx_verified_at (verified_at),
    
    -- Composite indexes for common queries
    INDEX idx_release_platform (release_id, platform),
    INDEX idx_platform_active (platform, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Streaming platform links for releases';

-- =============================================================================
-- SYSTEM TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Database Migrations Table
-- -----------------------------------------------------------------------------
-- Tracks database migration history for schema versioning
CREATE TABLE migrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    migration VARCHAR(255) NOT NULL COMMENT 'Migration filename',
    batch INT NOT NULL COMMENT 'Batch number for rollback grouping',
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique migration names
    UNIQUE KEY unique_migration (migration),
    
    -- Indexes for performance
    INDEX idx_batch (batch),
    INDEX idx_executed_at (executed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Database migration tracking';

-- =============================================================================
-- INITIAL DATA SETUP
-- =============================================================================

-- Create default "Independent" label for releases without a specific label
INSERT INTO labels (name, slug, description, is_active) VALUES 
('Independent', 'independent', 'Independent releases without a specific label', TRUE);

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Release Overview View
-- -----------------------------------------------------------------------------
-- Provides a consolidated view of releases with artist and label information
CREATE VIEW release_overview AS
SELECT 
    r.id,
    r.title,
    r.slug,
    r.description,
    r.release_date,
    r.release_type,
    r.catalog_number,
    r.cover_image_url,
    r.bandcamp_url,
    r.duration_seconds,
    r.track_count,
    r.is_featured,
    r.display_order,
    r.status,
    r.created_at,
    r.updated_at,
    l.name as label_name,
    l.slug as label_slug,
    GROUP_CONCAT(
        DISTINCT CONCAT(a.name, ':', ra.role)
        ORDER BY ra.display_order, ra.role
        SEPARATOR '|'
    ) as artists_with_roles,
    GROUP_CONCAT(
        DISTINCT sl.platform
        ORDER BY sl.platform
        SEPARATOR ','
    ) as available_platforms
FROM releases r
LEFT JOIN labels l ON r.label_id = l.id
LEFT JOIN release_artists ra ON r.id = ra.release_id
LEFT JOIN artists a ON ra.artist_id = a.id
LEFT JOIN streaming_links sl ON r.id = sl.release_id AND sl.is_active = TRUE
WHERE r.status = 'published'
GROUP BY r.id;

-- =============================================================================
-- STORED PROCEDURES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Get Release with Full Details
-- -----------------------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE GetReleaseDetails(IN release_slug VARCHAR(255))
BEGIN
    -- Main release information
    SELECT 
        r.*,
        l.name as label_name,
        l.slug as label_slug,
        l.website_url as label_website
    FROM releases r
    LEFT JOIN labels l ON r.label_id = l.id
    WHERE r.slug = release_slug AND r.status = 'published';
    
    -- Artists information
    SELECT 
        a.id,
        a.name,
        a.slug,
        a.image_url,
        ra.role,
        ra.display_order
    FROM release_artists ra
    JOIN artists a ON ra.artist_id = a.id
    JOIN releases r ON ra.release_id = r.id
    WHERE r.slug = release_slug
    ORDER BY ra.display_order, ra.role;
    
    -- Streaming links
    SELECT 
        platform,
        url,
        platform_release_id,
        verified_at
    FROM streaming_links sl
    JOIN releases r ON sl.release_id = r.id
    WHERE r.slug = release_slug AND sl.is_active = TRUE
    ORDER BY sl.platform;
END //
DELIMITER ;

-- =============================================================================
-- PERFORMANCE OPTIMIZATION
-- =============================================================================

-- Additional indexes for complex queries that may be added later
-- These are commented out but ready for implementation if needed

-- For artist discography queries:
-- CREATE INDEX idx_artist_release_date ON release_artists (artist_id, release_id);

-- For label catalog queries:
-- CREATE INDEX idx_label_release_date ON releases (label_id, release_date);

-- For search functionality (full-text search):
-- ALTER TABLE releases ADD FULLTEXT(title, description);
-- ALTER TABLE artists ADD FULLTEXT(name, bio);

-- =============================================================================
-- DATABASE CONSTRAINTS AND TRIGGERS
-- =============================================================================

-- Trigger to automatically update the updated_at timestamp
-- (Already handled by ON UPDATE CURRENT_TIMESTAMP in column definitions)

-- Trigger to validate release data consistency
DELIMITER //
CREATE TRIGGER validate_release_data
BEFORE INSERT ON releases
FOR EACH ROW
BEGIN
    -- Ensure slug is lowercase and URL-safe
    SET NEW.slug = LOWER(REPLACE(REPLACE(NEW.slug, ' ', '-'), '_', '-'));
    
    -- Set default display_order if not provided
    IF NEW.display_order = 0 AND NEW.is_featured = TRUE THEN
        SET NEW.display_order = (
            SELECT COALESCE(MAX(display_order), 0) + 10 
            FROM releases 
            WHERE is_featured = TRUE
        );
    END IF;
END //
DELIMITER ;

-- Similar trigger for updates
DELIMITER //
CREATE TRIGGER validate_release_data_update
BEFORE UPDATE ON releases
FOR EACH ROW
BEGIN
    -- Ensure slug is lowercase and URL-safe
    SET NEW.slug = LOWER(REPLACE(REPLACE(NEW.slug, ' ', '-'), '_', '-'));
END //
DELIMITER ;

-- =============================================================================
-- SCHEMA DOCUMENTATION
-- =============================================================================

/*
Entity Relationships Summary:

1. Artists (1) ←→ (M) ReleaseArtists (M) ←→ (1) Releases
   - Many-to-many with roles (primary, featured, remixer, etc.)
   
2. Labels (1) ←→ (M) Releases
   - One-to-many (a label can have many releases)
   
3. Releases (1) ←→ (M) StreamingLinks
   - One-to-many (a release can be on multiple platforms)

Key Design Decisions:

1. **Normalized Structure**: Reduces redundancy and maintains data integrity
2. **Flexible Artist Roles**: Supports complex collaborations and remixes
3. **JSON Fields**: For flexible metadata storage without schema changes
4. **Soft Constraints**: Foreign keys with SET NULL to handle data deletion gracefully
5. **Performance Indexes**: Strategic indexing for common query patterns
6. **UTF8MB4**: Full Unicode support for international artist names

Query Performance Considerations:

1. **Composite Indexes**: For multi-column WHERE clauses
2. **Covering Indexes**: Include frequently selected columns
3. **View Optimization**: Pre-computed joins for common queries
4. **Stored Procedures**: For complex multi-table operations

Scalability Considerations:

1. **Partitioning Ready**: Tables designed for future date-based partitioning
2. **Caching Friendly**: Immutable IDs and slugs for cache keys
3. **Read Optimization**: Denormalized data in JSON fields where appropriate
4. **Connection Pooling**: Schema supports connection pooling implementations
*/