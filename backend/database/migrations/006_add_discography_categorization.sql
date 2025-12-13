-- Migration 006: Add Discography Categorization to Releases Table
-- Sprint 6, Story S6.1
-- Date: December 13, 2025
--
-- Purpose: Enable dual categorization of releases for Releases and Discography sections
-- This allows releases to appear in:
--   - Releases page only (show_in_releases=TRUE, show_in_discography=FALSE)
--   - Discography page only (show_in_releases=FALSE, show_in_discography=TRUE)
--   - Both pages (show_in_releases=TRUE, show_in_discography=TRUE)
--   - Neither page (show_in_releases=FALSE, show_in_discography=FALSE)

-- Add categorization columns with appropriate defaults
ALTER TABLE releases 
ADD COLUMN show_in_releases BOOLEAN DEFAULT TRUE COMMENT 'Display on Releases page',
ADD COLUMN show_in_discography BOOLEAN DEFAULT FALSE COMMENT 'Display on Discography page';

-- Create composite index for efficient category filtering
-- This index optimizes queries that filter by categorization flags
CREATE INDEX idx_releases_categorization 
ON releases(show_in_releases, show_in_discography);

-- Update existing releases to maintain current behavior (Releases page only)
-- This ensures backward compatibility - all existing releases appear in Releases section only
UPDATE releases 
SET show_in_releases = TRUE, 
    show_in_discography = FALSE 
WHERE show_in_releases IS NULL OR show_in_discography IS NULL;

-- Verification queries (comment out after running migration)
-- DESCRIBE releases;
-- SHOW INDEX FROM releases WHERE Key_name = 'idx_releases_categorization';
-- SELECT id, title, show_in_releases, show_in_discography FROM releases LIMIT 10;
