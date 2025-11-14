-- =============================================================================
-- All Day Every Day Records - Database Schema
-- =============================================================================
-- Complete database schema for the All Day Every Day Records platform.
-- Simplified design with 3 tables: releases, users, homepage_videos
-- =============================================================================

-- Set database configuration for consistency
SET sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- =============================================================================
-- MAIN TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Releases Table
-- -----------------------------------------------------------------------------
-- Main table for music releases with artist name directly included
CREATE TABLE releases (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Release title',
    artist VARCHAR(255) NOT NULL COMMENT 'Artist name',
    slug VARCHAR(255) UNIQUE NOT NULL COMMENT 'URL-friendly identifier',
    description TEXT DEFAULT NULL COMMENT 'Release description/notes',
    release_date DATE DEFAULT NULL COMMENT 'Official release date',
    release_type ENUM('single', 'ep', 'album', 'mixtape', 'remix') 
        NOT NULL DEFAULT 'single' COMMENT 'Type of release',
    cover_image_url VARCHAR(500) NOT NULL COMMENT 'Release cover art URL (mandatory)',
    
    -- Streaming platform URLs (all optional)
    spotify_url VARCHAR(500) DEFAULT NULL COMMENT 'Spotify streaming URL',
    apple_music_url VARCHAR(500) DEFAULT NULL COMMENT 'Apple Music streaming URL',
    amazon_music_url VARCHAR(500) DEFAULT NULL COMMENT 'Amazon Music streaming URL',
    youtube_url VARCHAR(500) DEFAULT NULL COMMENT 'YouTube video URL for embedding',
    
    -- Admin management fields
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Featured on homepage',
    is_new BOOLEAN DEFAULT FALSE COMMENT 'Mark as new release for highlighting',
    status ENUM('draft', 'published', 'archived') DEFAULT 'published' COMMENT 'Publication status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_slug (slug),
    INDEX idx_artist (artist),
    INDEX idx_release_date (release_date),
    INDEX idx_release_type (release_type),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_new (is_new),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    
    -- Composite indexes for common queries
    INDEX idx_status_featured (status, is_featured),
    INDEX idx_status_new (status, is_new),
    INDEX idx_artist_status (artist, status),
    INDEX idx_featured_new_status (is_featured, is_new, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Music releases with artist names';

-- -----------------------------------------------------------------------------
-- Users Table
-- -----------------------------------------------------------------------------
-- Admin users for authentication and content management
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL COMMENT 'Unique username for login',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'User email address (required)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed password for security',
    is_admin BOOLEAN DEFAULT FALSE COMMENT 'Admin privileges flag',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_admin (is_admin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System users with admin authentication';

-- -----------------------------------------------------------------------------
-- Homepage Videos Table
-- -----------------------------------------------------------------------------
-- YouTube videos displayed on the homepage (4 video grid)
CREATE TABLE homepage_videos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    youtube_id VARCHAR(50) NOT NULL COMMENT 'YouTube video ID extracted from URL',
    url VARCHAR(500) NOT NULL COMMENT 'Full YouTube video URL',
    position TINYINT UNSIGNED NOT NULL COMMENT 'Display position (1-4)',
    is_enabled BOOLEAN DEFAULT TRUE COMMENT 'Whether video is currently displayed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ensure unique positions
    UNIQUE KEY unique_position (position),
    
    -- Indexes for performance
    INDEX idx_position (position),
    INDEX idx_is_enabled (is_enabled),
    INDEX idx_youtube_id (youtube_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Homepage YouTube video grid (4 videos max)';

-- =============================================================================
-- INITIAL DATA SETUP
-- =============================================================================

-- Create default admin user (password: ADE_Records_2025! - change in production!)
-- Note: This password hash is for 'ADE_Records_2025!' using PHP password_hash()
INSERT INTO users (username, email, password_hash, is_admin) VALUES 
('admin', 'admin@alldayeverydayrecords.com', '$2y$10$xGZvGYm8H.aULXx/1R7Mhu7n5k4QoQJ3zN2tM6rA9cP8vK5dF2sWe', TRUE);

-- Insert default homepage videos (using placeholder YouTube IDs)
-- These should be updated via the admin interface
INSERT INTO homepage_videos (youtube_id, url, position, is_enabled) VALUES 
('dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, TRUE),
('jNQXAC9IVRw', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 2, TRUE),
('L_jWHffIx5E', 'https://www.youtube.com/watch?v=L_jWHffIx5E', 3, TRUE),
('fJ9rUzIMcZQ', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', 4, TRUE);

-- =============================================================================
-- STORED PROCEDURES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Get Release Details with Related Releases by Artist
-- -----------------------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE GetReleaseDetails(IN release_slug VARCHAR(255))
BEGIN
    -- Main release information
    SELECT 
        id,
        title,
        artist,
        slug,
        description,
        release_date,
        release_type,
        cover_image_url,
        spotify_url,
        apple_music_url,
        amazon_music_url,
        youtube_url,
        is_featured,
        is_new,
        status,
        created_at,
        updated_at
    FROM releases 
    WHERE slug = release_slug AND status = 'published';
    
    -- Related releases by the same artist
    SELECT 
        id,
        title,
        slug,
        release_date,
        release_type,
        cover_image_url
    FROM releases 
    WHERE artist = (SELECT artist FROM releases WHERE slug = release_slug)
    AND slug != release_slug 
    AND status = 'published'
    ORDER BY release_date DESC
    LIMIT 10;
END //
DELIMITER ;

-- -----------------------------------------------------------------------------
-- Get Homepage Videos
-- -----------------------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE GetHomepageVideos()
BEGIN
    SELECT 
        id,
        youtube_id,
        url,
        position,
        is_enabled,
        updated_at
    FROM homepage_videos
    WHERE is_enabled = TRUE
    ORDER BY position;
END //
DELIMITER ;

-- -----------------------------------------------------------------------------
-- Update Homepage Video
-- -----------------------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE UpdateHomepageVideo(
    IN video_position TINYINT,
    IN video_url VARCHAR(500),
    IN video_youtube_id VARCHAR(50)
)
BEGIN
    INSERT INTO homepage_videos (position, url, youtube_id, is_enabled)
    VALUES (video_position, video_url, video_youtube_id, TRUE)
    ON DUPLICATE KEY UPDATE
        url = VALUES(url),
        youtube_id = VALUES(youtube_id),
        is_enabled = TRUE,
        updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- -----------------------------------------------------------------------------
-- Authenticate User
-- -----------------------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE AuthenticateUser(IN input_username VARCHAR(100))
BEGIN
    SELECT 
        id,
        username,
        email,
        password_hash,
        is_admin
    FROM users 
    WHERE username = input_username AND is_admin = TRUE
    LIMIT 1;
END //
DELIMITER ;

-- -----------------------------------------------------------------------------
-- Get Releases for Admin Management
-- -----------------------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE GetReleasesAdmin()
BEGIN
    SELECT 
        id,
        title,
        artist,
        slug,
        release_date,
        release_type,
        cover_image_url,
        is_featured,
        is_new,
        status,
        created_at,
        updated_at
    FROM releases 
    ORDER BY created_at DESC;
END //
DELIMITER ;

-- -----------------------------------------------------------------------------
-- Get Featured Releases for Homepage
-- -----------------------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE GetFeaturedReleases()
BEGIN
    SELECT 
        id,
        title,
        artist,
        slug,
        release_date,
        release_type,
        cover_image_url,
        spotify_url,
        apple_music_url,
        amazon_music_url,
        youtube_url
    FROM releases 
    WHERE status = 'published' AND is_featured = TRUE
    ORDER BY release_date DESC;
END //
DELIMITER ;

-- =============================================================================
-- TRIGGERS AND VALIDATION
-- =============================================================================

-- Trigger to validate release data consistency
DELIMITER //
CREATE TRIGGER validate_release_data
BEFORE INSERT ON releases
FOR EACH ROW
BEGIN
    -- Ensure slug is lowercase and URL-safe
    SET NEW.slug = LOWER(REPLACE(REPLACE(NEW.slug, ' ', '-'), '_', '-'));
    
    -- Ensure artist name is trimmed
    SET NEW.artist = TRIM(NEW.artist);
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
    
    -- Ensure artist name is trimmed
    SET NEW.artist = TRIM(NEW.artist);
END //
DELIMITER ;

-- Trigger to validate homepage video positions (1-4 only)
DELIMITER //
CREATE TRIGGER validate_homepage_video_position
BEFORE INSERT ON homepage_videos
FOR EACH ROW
BEGIN
    IF NEW.position NOT BETWEEN 1 AND 4 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Homepage video position must be between 1 and 4';
    END IF;
END //
DELIMITER ;

-- Similar trigger for updates
DELIMITER //
CREATE TRIGGER validate_homepage_video_position_update
BEFORE UPDATE ON homepage_videos
FOR EACH ROW
BEGIN
    IF NEW.position NOT BETWEEN 1 AND 4 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Homepage video position must be between 1 and 4';
    END IF;
END //
DELIMITER ;

-- =============================================================================
-- SCHEMA DOCUMENTATION
-- =============================================================================

/*
All Day Every Day Records - Simplified Schema

TABLES:
1. releases - Music releases with artist name directly included
2. users - Admin authentication only
3. homepage_videos - YouTube video management for homepage grid

KEY FEATURES:

RELEASES TABLE:
- Artist name stored directly in releases table
- Streaming URLs: Spotify, Apple Music, Amazon Music, YouTube
- Admin flags: is_featured, is_new, status
- Mandatory cover image URL

RELATED RELEASES:
- Simple query by artist name for "other releases by this artist"
- No complex junction tables needed

ADMIN FUNCTIONALITY:
- Single users table with is_admin flag
- Homepage video management (4 positions)
- Release CRUD operations
- Tagging and status management

STREAMING INTEGRATION:
- Individual URL fields for each platform
- YouTube URL for video embedding
- All streaming URLs optional

IMAGE STORAGE:
- Cover images stored in /assets/images/releases/
- Mandatory cover_image_url field

QUERY EXAMPLES:

-- Get release details with related releases
CALL GetReleaseDetails('release-slug');

-- Get all releases by artist
SELECT * FROM releases WHERE artist = 'Artist Name' AND status = 'published';

-- Get featured releases for homepage
CALL GetFeaturedReleases();

-- Admin: Get all releases
CALL GetReleasesAdmin();
*/