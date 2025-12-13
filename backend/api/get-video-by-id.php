<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

$db = getDBConnection();

// Get the video ID from query parameter
$videoId = $_GET['id'] ?? null;

if (!$videoId) {
    jsonResponse(["error" => "Video ID is required"], 400);
}

try {
    // Get video data
    $sql = "SELECT 
                id,
                title,
                youtube_url,
                description,
                artist,
                created_at,
                updated_at
            FROM videos 
            WHERE id = ?";
    
    $video = $db->queryOne($sql, [$videoId]);
    
    if (!$video) {
        jsonResponse(["error" => "Video not found"], 404);
    }
    
    // Get related videos by same artist (exclude current video)
    $relatedSql = "SELECT 
                        id,
                        title,
                        youtube_url,
                        description,
                        artist,
                        created_at,
                        updated_at
                    FROM videos 
                    WHERE artist = ? AND id != ?
                    ORDER BY title ASC";
    
    $relatedVideos = $db->query($relatedSql, [$video['artist'], $videoId]);
    
    jsonResponse([
        "success" => true,
        "video" => $video,
        "relatedVideos" => $relatedVideos
    ]);
    
} catch (Exception $e) {
    logError("Exception in get-video-by-id", ['error' => $e->getMessage(), 'id' => $videoId]);
    jsonResponse(["error" => "Failed to fetch video"], 500);
}
?>
