<?php
/**
 * Get Homepage Videos Endpoint
 * 
 * Returns the 4 YouTube URLs configured for the homepage video grid.
 * These URLs are configurable via the admin interface.
 */

require_once 'config.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse('Method not allowed', null, 405);
    exit;
}

try {
    $db = getDatabase();
    
    // Simple query to get the 4 homepage video URLs
    // For now, we'll create a simple config table approach
    $videos = $db->query("
        SELECT video_url, display_order 
        FROM homepage_videos 
        WHERE is_active = 1 
        ORDER BY display_order ASC 
        LIMIT 4
    ");
    
    // Extract just the URLs in order
    $video_urls = [];
    if ($videos && is_array($videos)) {
        foreach ($videos as $video) {
            $video_urls[] = $video['video_url'];
        }
    }
    
    // If no videos found or less than 4, provide fallback demo URLs
    $fallback_urls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        'https://www.youtube.com/watch?v=9bZkp7q19f0',
        'https://www.youtube.com/watch?v=K4TOrB7at0Y'
    ];
    
    // Use fallback URLs if needed
    for ($i = count($video_urls); $i < 4; $i++) {
        $video_urls[] = $fallback_urls[$i] ?? '';
    }
    
    // Return exactly 4 URLs
    jsonResponse(array_slice($video_urls, 0, 4));
    
} catch (Exception $e) {
    error_log("Homepage Videos API Error: " . $e->getMessage());
    
    // Return fallback URLs on error - frontend will handle gracefully
    jsonResponse([
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        'https://www.youtube.com/watch?v=9bZkp7q19f0',
        'https://www.youtube.com/watch?v=K4TOrB7at0Y'
    ]);
}
?>