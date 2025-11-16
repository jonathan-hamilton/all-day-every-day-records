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

try {
    if ($isAdmin) {
        // Admin view: show all releases with all data including removed
        $sql = "SELECT 
                    id,
                    title,
                    artist,
                    description,
                    release_date,
                    format,
                    cover_image_url,
                    spotify_url,
                    apple_music_url,
                    amazon_music_url,
                    youtube_url,
                    tag,
                    created_at,
                    updated_at
                FROM releases
                ORDER BY created_at DESC";
        $releases = $db->query($sql);
        
        // Convert database format to expected frontend format for admin
        foreach ($releases as &$release) {
            // Create artists array from single artist field
            $release['artists'] = [
                [
                    'name' => $release['artist'],
                    'role' => 'Artist'
                ]
            ];
            
            // Create streaming_links array from individual URL fields
            $release['streaming_links'] = [];
            if ($release['spotify_url']) {
                $release['streaming_links'][] = [
                    'platform' => 'Spotify',
                    'url' => $release['spotify_url'],
                    'is_active' => true
                ];
            }
            if ($release['apple_music_url']) {
                $release['streaming_links'][] = [
                    'platform' => 'Apple Music',
                    'url' => $release['apple_music_url'],
                    'is_active' => true
                ];
            }
            if ($release['amazon_music_url']) {
                $release['streaming_links'][] = [
                    'platform' => 'Amazon Music',
                    'url' => $release['amazon_music_url'],
                    'is_active' => true
                ];
            }
            if ($release['youtube_url']) {
                $release['streaming_links'][] = [
                    'platform' => 'YouTube',
                    'url' => $release['youtube_url'],
                    'is_active' => true
                ];
            }
            
            // Keep the tag field as is for admin
            // Add computed fields for consistency
            $release['is_featured'] = ($release['tag'] === 'Featured');
            $release['is_new'] = ($release['tag'] === 'New');
            $release['status'] = ($release['tag'] === 'Removed') ? 'archived' : 'published';
        }
    } else {
        // Public view: exclude removed releases
        $sql = "SELECT 
                    id,
                    title,
                    artist,
                    description,
                    release_date,
                    format,
                    cover_image_url,
                    spotify_url,
                    apple_music_url,
                    amazon_music_url,
                    youtube_url,
                    tag
                FROM releases
                WHERE tag != 'Removed'
                ORDER BY 
                    CASE tag 
                        WHEN 'Featured' THEN 1 
                        WHEN 'New' THEN 2 
                        ELSE 3 
                    END, 
                    release_date DESC";
        $releases = $db->query($sql);
        
        // Convert to frontend format with artists as string for public view
        foreach ($releases as &$release) {
            $release['artists'] = $release['artist']; // Simple string for public API
        }
    }
    
    // Process release dates to extract year only
    foreach ($releases as &$release) {
        if (isset($release['release_date']) && !empty($release['release_date']) && $release['release_date'] !== '0000-00-00') {
            if (strpos($release['release_date'], '-') !== false) {
                $dateParts = explode('-', $release['release_date']);
                $release['release_date'] = $dateParts[0]; // Just the year
            } else {
                $timestamp = strtotime($release['release_date']);
                if ($timestamp !== false) {
                    $release['release_date'] = date('Y', $timestamp);
                }
            }
        }
    }
    
    jsonResponse([
        "success" => true,
        "releases" => $releases
    ]);
    
} catch (Exception $e) {
    logError("Exception in get-releases", ['error' => $e->getMessage()]);
    jsonResponse(["error" => "Failed to fetch releases"], 500);
}
?>