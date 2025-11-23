-- =============================================================================
-- Migration: Add youtube2_url field to releases table
-- Created: 2025-11-23
-- Description: Adds youtube2_url field for displaying a second YouTube video on release detail pages
-- =============================================================================

USE all_day_every_day_records;

-- Add youtube2_url column to releases table
ALTER TABLE releases 
ADD COLUMN youtube2_url VARCHAR(500) DEFAULT NULL COMMENT 'Second YouTube video URL for release detail page' 
AFTER youtube_url;

-- Verify the change
DESCRIBE releases;
