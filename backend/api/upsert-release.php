<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Require authentication for this endpoint
$user = requireAuth();

// Require CSRF token for state-changing operation
requireCSRFToken();

$db = getDBConnection();

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Only POST method allowed"], 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonResponse(["error" => "Invalid JSON input"], 400);
}

$input = sanitizeInput($input);

// Validate required fields (only title and artist are required)
$required = ['title', 'artist'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        jsonResponse(["error" => "Field '$field' is required"], 400);
    }
}

try {
    $db->beginTransaction();
    
    $releaseId = $input['id'] ?? null;
    $isUpdate = !empty($releaseId);
    
    // Handle categorization flags with defaults
    $showInReleases = isset($input['show_in_releases']) ? 
        filter_var($input['show_in_releases'], FILTER_VALIDATE_BOOLEAN) : true;
    $showInDiscography = isset($input['show_in_discography']) ? 
        filter_var($input['show_in_discography'], FILTER_VALIDATE_BOOLEAN) : false;
    
    if ($isUpdate) {
        // Update existing release
        $sql = "UPDATE releases 
                SET title = ?, 
                    artist = ?, 
                    description = ?, 
                    release_date = ?, 
                    format = ?, 
                    cover_image_url = ?, 
                    spotify_url = ?, 
                    apple_music_url = ?, 
                    amazon_music_url = ?,
                    youtube_music_url = ?,
                    youtube_url = ?,
                    youtube2_url = ?,
                    instagram_url = ?,
                    facebook_url = ?,
                    tiktok_url = ?,
                    twitter_url = ?,
                    tag = ?,
                    show_in_releases = ?,
                    show_in_discography = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?";
        
        $params = [
            $input['title'],
            $input['artist'],
            $input['description'] ?? null,
            $input['release_date'] ?? null,
            $input['format'] ?? null,
            $input['cover_image_url'] ?? '',
            $input['spotify_url'] ?? null,
            $input['apple_music_url'] ?? null,
            $input['amazon_music_url'] ?? null,
            $input['youtube_music_url'] ?? null,
            $input['youtube_url'] ?? null,
            $input['youtube2_url'] ?? null,
            $input['instagram_url'] ?? null,
            $input['facebook_url'] ?? null,
            $input['tiktok_url'] ?? null,
            $input['twitter_url'] ?? null,
            $input['tag'] ?? 'None',
            $showInReleases ? 1 : 0,
            $showInDiscography ? 1 : 0,
            $releaseId
        ];
        
        $result = $db->execute($sql, $params);
        
    } else {
        // Create new release
        $sql = "INSERT INTO releases 
                (title, artist, description, release_date, format, cover_image_url, 
                spotify_url, apple_music_url, amazon_music_url, youtube_music_url, youtube_url, youtube2_url,
                instagram_url, facebook_url, tiktok_url, twitter_url, tag,
                show_in_releases, show_in_discography, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        
        $params = [
            $input['title'],
            $input['artist'],
            $input['description'] ?? null,
            $input['release_date'] ?? null,
            $input['format'] ?? null,
            $input['cover_image_url'] ?? '',
            $input['spotify_url'] ?? null,
            $input['apple_music_url'] ?? null,
            $input['amazon_music_url'] ?? null,
            $input['youtube_music_url'] ?? null,
            $input['youtube_url'] ?? null,
            $input['youtube2_url'] ?? null,
            $input['instagram_url'] ?? null,
            $input['facebook_url'] ?? null,
            $input['tiktok_url'] ?? null,
            $input['twitter_url'] ?? null,
            $input['tag'] ?? 'None',
            $showInReleases ? 1 : 0,
            $showInDiscography ? 1 : 0
        ];
        
        $db->execute($sql, $params);
        $releaseId = $db->lastInsertId();
    }
    
    $db->commit();
    
    jsonResponse([
        "success" => true,
        "message" => $isUpdate ? "Release updated successfully" : "Release created successfully",
        "release_id" => $releaseId
    ]);
    
} catch (Exception $e) {
    $db->rollback();
    logError("Exception in upsert-release", ['error' => $e->getMessage(), 'input' => $input]);
    jsonResponse(["error" => "Failed to save release"], 500);
}
?>