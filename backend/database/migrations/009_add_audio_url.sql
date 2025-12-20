-- Migration 009: Add audio_url column to releases table
-- Purpose: Support audio preview/streaming files for releases
-- Date: December 20, 2025

-- Add audio_url column to releases table
ALTER TABLE releases 
ADD COLUMN audio_url VARCHAR(500) NULL 
COMMENT 'URL or path to audio file (MP3) for release preview/streaming';

-- Add index for query optimization
CREATE INDEX idx_audio_url ON releases(audio_url);

-- Verification query (commented out for production)
-- SELECT COUNT(*) as releases_with_audio FROM releases WHERE audio_url IS NOT NULL;
