-- Migration: Add Social Media URL fields to releases table
-- Story: S8.3 - Social Media Links on Release Details
-- Date: 2025-12-14
-- Description: Adds Instagram, Facebook, TikTok, and Twitter/X URL fields to releases table

-- Add social media URL columns
ALTER TABLE releases
ADD COLUMN instagram_url VARCHAR(500) DEFAULT NULL COMMENT 'Instagram profile or page URL',
ADD COLUMN facebook_url VARCHAR(500) DEFAULT NULL COMMENT 'Facebook profile or page URL',
ADD COLUMN tiktok_url VARCHAR(500) DEFAULT NULL COMMENT 'TikTok profile URL',
ADD COLUMN twitter_url VARCHAR(500) DEFAULT NULL COMMENT 'Twitter/X profile URL';

-- Add indexes for potential future queries
CREATE INDEX idx_instagram_url ON releases(instagram_url(255));
CREATE INDEX idx_facebook_url ON releases(facebook_url(255));
CREATE INDEX idx_tiktok_url ON releases(tiktok_url(255));
CREATE INDEX idx_twitter_url ON releases(twitter_url(255));
