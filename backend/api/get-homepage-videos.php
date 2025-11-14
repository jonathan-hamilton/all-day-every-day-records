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
    
    // Query to get the 4 homepage video URLs from database
    $videos = $db->query("
        SELECT url, position 
        FROM homepage_videos 
        WHERE is_enabled = 1 
        ORDER BY position ASC 
        LIMIT 4
    ");
    
    // Extract just the URLs in order
    $video_urls = [];
    if ($videos && is_array($videos)) {
        foreach ($videos as $video) {
            $video_urls[] = $video['url'];
        }
    }
    
    // If no videos found or less than 4, provide fallback demo URLs
    $fallback_urls = [
        'https://youtu.be/Wd2Pt37uKmA?si=13TmJqp0qAo5Mt8p',
        'https://youtu.be/t7ZV-6mG8_4?si=2YA_0xUsZvOigvkG',
        'https://youtu.be/7hrhmgNMzKI?si=VYFN3MSGLzsZrPH9',
        'https://youtu.be/neVgHSVPPjc?si=uJShPYpcrj-QH8eX'
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
        'https://youtu.be/Wd2Pt37uKmA?si=13TmJqp0qAo5Mt8p',
        'https://youtu.be/t7ZV-6mG8_4?si=2YA_0xUsZvOigvkG',
        'https://youtu.be/7hrhmgNMzKI?si=VYFN3MSGLzsZrPH9',
        'https://youtu.be/neVgHSVPPjc?si=uJShPYpcrj-QH8eX'
    ]);
}
?>