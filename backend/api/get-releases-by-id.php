<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

$db = getDBConnection();

// Check if admin param is present
$isAdmin = isAdminRequest();

// If admin mode, require authentication
if ($isAdmin) {
    requireAuth();
}

// Get the release ID from query parameter
$releaseId = $_GET['id'] ?? null;

if (!$releaseId) {
    jsonResponse(["error" => "Release ID is required"], 400);
}

try {
    // Get release data - simplified to match working get-releases.php
    $sql = "SELECT * FROM releases WHERE id = ?";
    
    $release = $db->queryOne($sql, [$releaseId]);
    
    if (!$release) {
        jsonResponse(["error" => "Release not found"], 404);
    }
    
    // Transform the release data to match expected frontend format
    $release['artists'] = [
        [
            'id' => 1,
            'name' => $release['artist'] ?? 'Unknown Artist',
            'role' => 'primary'
        ]
    ];
    
    // Add streaming links from the existing URL fields
    $streamingLinks = [];
    if (!empty($release['spotify_url'])) {
        $streamingLinks[] = ['platform' => 'spotify', 'url' => $release['spotify_url'], 'is_active' => 1];
    }
    if (!empty($release['apple_music_url'])) {
        $streamingLinks[] = ['platform' => 'apple_music', 'url' => $release['apple_music_url'], 'is_active' => 1];
    }
    if (!empty($release['amazon_music_url'])) {
        $streamingLinks[] = ['platform' => 'amazon_music', 'url' => $release['amazon_music_url'], 'is_active' => 1];
    }
    if (!empty($release['youtube_music_url'])) {
        $streamingLinks[] = ['platform' => 'youtube_music', 'url' => $release['youtube_music_url'], 'is_active' => 1];
    }
    if (!empty($release['youtube_url'])) {
        $streamingLinks[] = ['platform' => 'youtube', 'url' => $release['youtube_url'], 'is_active' => 1];
    }
    if (!empty($release['youtube2_url'])) {
        $streamingLinks[] = ['platform' => 'youtube', 'url' => $release['youtube2_url'], 'is_active' => 1];
    }
    
    $release['streaming_links'] = $streamingLinks;
    
    // Format release date
    if (isset($release['release_date']) && !empty($release['release_date']) && $release['release_date'] !== '0000-00-00') {
        if (strpos($release['release_date'], '-') !== false) {
            $dateParts = explode('-', $release['release_date']);
            $release['release_date'] = $dateParts[0]; // Just the year
        }
    }
    
    jsonResponse([
        "success" => true,
        "release" => $release
    ]);
    
} catch (Exception $e) {
    logError("Exception in get-releases-by-id", ['error' => $e->getMessage(), 'id' => $releaseId]);
    jsonResponse(["error" => "Failed to fetch release"], 500);
}
?>