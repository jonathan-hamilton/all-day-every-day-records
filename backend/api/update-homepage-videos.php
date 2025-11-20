<?php
/**
 * Update Homepage Videos Endpoint
 * 
 * Admin-only endpoint for updating the 4 YouTube URLs displayed on the homepage.
 * Requires authentication and validates YouTube URLs before saving.
 */

require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Check if admin request and require authentication
$isAdmin = isAdminRequest();
if (!$isAdmin) {
    jsonResponse(['error' => 'Admin access required'], 403);
    exit;
}

// Require authentication for admin requests
requireAuth();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Basic debugging output
error_log("Update Homepage Videos - Input received: " . json_encode($input));

// Validate input structure
if (!isset($input['videos']) || !is_array($input['videos'])) {
    jsonResponse(['error' => 'Invalid input format. Expected videos array.'], 400);
    exit;
}

$videos = $input['videos'];

// Ensure we have exactly 4 video URLs
if (count($videos) !== 4) {
    jsonResponse(['error' => 'Exactly 4 video URLs required'], 400);
    exit;
}

// YouTube URL validation function and ID extraction
function isValidYouTubeUrl($url) {
    if (empty(trim($url))) {
        return true; // Empty URLs are allowed
    }
    
    $patterns = [
        '/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/',
        '/^https?:\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/',
        '/^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/'
    ];
    
    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $url)) {
            return true;
        }
    }
    
    return false;
}

// Extract YouTube ID from URL
function extractYouTubeId($url) {
    if (empty(trim($url))) {
        return '';
    }
    
    $patterns = [
        '/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/',
        '/youtu\.be\/([a-zA-Z0-9_-]+)/',
        '/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/'
    ];
    
    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }
    }
    
    return '';
}

// Validate all YouTube URLs
foreach ($videos as $index => $url) {
    if (!isValidYouTubeUrl($url)) {
        jsonResponse([
            'error' => "Invalid YouTube URL at position " . ($index + 1) . ": " . $url
        ], 400);
        exit;
    }
}

try {
    $db = getDBConnection();
    
    // Debug: Check if table exists
    try {
        $tableCheck = $db->query("DESCRIBE homepage_videos");
        logError("Table structure check passed", ['columns' => count($tableCheck)]);
    } catch (Exception $e) {
        logError("Table does not exist, creating it", ['error' => $e->getMessage()]);
        
        // Create the table
        $createSQL = "
        CREATE TABLE homepage_videos (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            youtube_id VARCHAR(50) NOT NULL COMMENT 'YouTube video ID extracted from URL',
            url VARCHAR(500) NOT NULL COMMENT 'Full YouTube video URL',
            position TINYINT UNSIGNED NOT NULL COMMENT 'Display position (1-4)',
            is_enabled BOOLEAN DEFAULT TRUE COMMENT 'Whether video is currently displayed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            UNIQUE KEY unique_position (position),
            INDEX idx_position (position),
            INDEX idx_is_enabled (is_enabled),
            INDEX idx_youtube_id (youtube_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->execute($createSQL);
        logError("Table created successfully");
    }
    
    // Start transaction for atomic updates
    $db->beginTransaction();
    
    // Clear existing videos using Database class execute method
    $db->execute("DELETE FROM homepage_videos");
    logError("Deleted existing videos");
    
    // Insert new videos with youtube_id field
    for ($i = 0; $i < 4; $i++) {
        $url = trim($videos[$i]);
        $position = $i + 1;
        
        // Only insert non-empty URLs
        if (!empty($url)) {
            $youtube_id = extractYouTubeId($url);
            logError("Inserting video", ['position' => $position, 'url' => $url, 'youtube_id' => $youtube_id]);
            
            $db->execute("
                INSERT INTO homepage_videos (youtube_id, url, position, is_enabled, created_at, updated_at) 
                VALUES (?, ?, ?, 1, NOW(), NOW())
            ", [$youtube_id, $url, $position]);
        }
    }
    
    // Commit transaction
    $db->commit();
    error_log("Transaction committed successfully");
    
    // Log the update
    error_log("Homepage videos updated by admin: " . ($_SESSION['user_email'] ?? 'unknown'));
    error_log("Debug log completed");
    
    // Return success with updated video list
    try {
        $updatedVideos = $db->query("
            SELECT url, position 
            FROM homepage_videos 
            WHERE is_enabled = 1 
            ORDER BY position ASC
        ");
        error_log("Post-commit query completed successfully");
    } catch (Exception $e) {
        error_log("Post-commit query error: " . $e->getMessage());
        $updatedVideos = [];
    }
    
    $videoUrls = [];
    if ($updatedVideos && is_array($updatedVideos)) {
        foreach ($updatedVideos as $video) {
            $videoUrls[] = $video['url'];
        }
    }
    
    // Ensure we return exactly 4 URLs (fill with empty strings if needed)
    while (count($videoUrls) < 4) {
        $videoUrls[] = '';
    }
    
    jsonResponse([
        'success' => true,
        'message' => 'Homepage videos updated successfully',
        'videos' => array_slice($videoUrls, 0, 4)
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    if ($db) {
        try {
            $db->rollback();
        } catch (Exception $rollbackException) {
            // Ignore rollback errors
        }
    }
    
    logError("Update Homepage Videos Error", [
        'error' => $e->getMessage(),
        'line' => $e->getLine(),
        'file' => $e->getFile(),
        'trace' => $e->getTraceAsString(),
        'admin_user' => $_SESSION['user_email'] ?? 'unknown'
    ]);
    
    jsonResponse([
        'error' => 'Failed to update homepage videos: ' . $e->getMessage()
    ], 500);
}
?>