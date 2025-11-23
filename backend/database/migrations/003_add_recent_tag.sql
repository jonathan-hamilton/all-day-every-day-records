-- =============================================================================
-- Migration: Add 'Recent' tag to releases table
-- Created: 2025-11-23
-- Description: Adds 'Recent' as a new tag option for release management
-- =============================================================================

USE all_day_every_day_records;

-- Add 'Recent' to the tag ENUM
ALTER TABLE releases 
MODIFY COLUMN tag ENUM('None', 'Featured', 'New', 'Recent', 'Removed') 
DEFAULT 'None' 
COMMENT 'Release tag for admin management';

-- Verify the change
DESCRIBE releases;
