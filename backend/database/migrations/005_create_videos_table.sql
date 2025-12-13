-- =============================================================================
-- Migration: Create videos table for standalone Videos system
-- Created: 2025-12-13
-- Description: Creates separate videos table for independent video content management,
--              distinct from homepage_videos table. Enables full CRUD video management.
-- =============================================================================

USE all_day_every_day;

-- Drop table if it exists for clean recreation
DROP TABLE IF EXISTS videos;

-- Create videos table
CREATE TABLE videos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Video title',
    youtube_url VARCHAR(500) NOT NULL COMMENT 'Full YouTube video URL',
    description TEXT DEFAULT NULL COMMENT 'Video description',
    artist VARCHAR(255) NOT NULL COMMENT 'Artist name',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_artist (artist),
    INDEX idx_created_at (created_at),
    
    -- Composite index for common queries (artist-based sorting and filtering)
    INDEX idx_artist_title (artist, title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Video content separate from homepage videos for independent management';

-- Verify the table was created
DESCRIBE videos;

-- Show indexes
SHOW INDEX FROM videos;
