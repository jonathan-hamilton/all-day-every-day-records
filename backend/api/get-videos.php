<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

$db = getDBConnection();

try {
    // Get all videos sorted by artist, then title
    $sql = "SELECT 
                id,
                title,
                youtube_url,
                description,
                artist,
                created_at,
                updated_at
            FROM videos
            ORDER BY artist ASC, title ASC";
    
    $videos = $db->query($sql);
    
    // Return success response
    jsonResponse([
        "success" => true,
        "videos" => $videos
    ]);
    
} catch (Exception $e) {
    logError("Exception in get-videos", ['error' => $e->getMessage()]);
    jsonResponse(["error" => "Failed to fetch videos"], 500);
}
?>
