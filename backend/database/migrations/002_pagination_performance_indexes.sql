-- Database indexes for S3.10 Release Pagination and Advanced Filtering System
-- These indexes optimize the query performance for pagination and filtering operations

-- Index for artist name filtering (partial matching with LIKE queries)
CREATE INDEX IF NOT EXISTS idx_releases_artist_lower ON releases (LOWER(artist));

-- Index for title filtering (partial matching with LIKE queries)  
CREATE INDEX IF NOT EXISTS idx_releases_title_lower ON releases (LOWER(title));

-- Composite index for combined search across artist and title
CREATE INDEX IF NOT EXISTS idx_releases_search ON releases (LOWER(artist), LOWER(title));

-- Index for tag filtering (used in public view WHERE clauses)
CREATE INDEX IF NOT EXISTS idx_releases_tag ON releases (tag);

-- Composite index for pagination with tag filtering (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_releases_pagination_public ON releases (tag, release_date DESC, id);

-- Composite index for admin pagination (includes all releases)
CREATE INDEX IF NOT EXISTS idx_releases_pagination_admin ON releases (created_at DESC, id);

-- Composite index for filtered pagination (when multiple filters are applied)
CREATE INDEX IF NOT EXISTS idx_releases_filtered_pagination ON releases (tag, LOWER(artist), LOWER(title), release_date DESC);

-- Query performance analysis queries (for monitoring)
-- Use these to check query performance after index creation:

/*
-- Test pagination query performance (public view)
EXPLAIN ANALYZE SELECT id, title, artist, description, release_date, format, cover_image_url, 
                      spotify_url, apple_music_url, amazon_music_url, youtube_url, tag
FROM releases 
WHERE tag != 'Removed' 
ORDER BY CASE tag WHEN 'Featured' THEN 1 WHEN 'New' THEN 2 ELSE 3 END, release_date DESC 
LIMIT 20 OFFSET 0;

-- Test artist filter query performance
EXPLAIN ANALYZE SELECT COUNT(*) as total FROM releases 
WHERE tag != 'Removed' AND LOWER(artist) LIKE LOWER('%eminem%');

-- Test combined filter query performance
EXPLAIN ANALYZE SELECT COUNT(*) as total FROM releases 
WHERE tag != 'Removed' 
  AND LOWER(artist) LIKE LOWER('%young%') 
  AND LOWER(title) LIKE LOWER('%east%');

-- Test search query performance
EXPLAIN ANALYZE SELECT COUNT(*) as total FROM releases 
WHERE tag != 'Removed' 
  AND (LOWER(artist) LIKE LOWER('%trav%') OR LOWER(title) LIKE LOWER('%trav%'));
*/

-- Index maintenance (run periodically for optimal performance)
-- ANALYZE TABLE releases;
-- OPTIMIZE TABLE releases;

-- Performance monitoring queries
/*
-- Check index usage
SELECT DISTINCT
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    COLLATION
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'releases'
ORDER BY TABLE_NAME, INDEX_NAME;

-- Check query cache performance
SHOW STATUS LIKE 'Qcache%';
*/