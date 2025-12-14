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

// Get search parameter and sanitize it
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

// Get category parameter for Releases/Discography filtering
$category = isset($_GET['category']) ? trim($_GET['category']) : null;

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
                    youtube_music_url,
                    youtube_url,
                    youtube2_url,
                    tag,
                    show_in_releases,
                    show_in_discography,
                    created_at,
                    updated_at
                FROM releases";
        
        $params = [];
        $whereConditions = [];
        
        // Add search filter for admin if provided
        if (!empty($search)) {
            $whereConditions[] = "(title LIKE ? OR artist LIKE ?)";
            $params[] = '%' . $search . '%';
            $params[] = '%' . $search . '%';
        }
        
        // Add category filter for admin if provided
        if ($category === 'releases') {
            $whereConditions[] = "show_in_releases = 1";
        } elseif ($category === 'discography') {
            $whereConditions[] = "show_in_discography = 1";
        }
        // If $category is null or 'all', no category filtering (backward compatible)
        
        // Build WHERE clause if any conditions exist
        if (!empty($whereConditions)) {
            $sql .= " WHERE " . implode(" AND ", $whereConditions);
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        try {
            $releases = $db->query($sql, $params);
            
        } catch (Exception $e) {
            error_log("[" . date('Y-m-d H:i:s') . "] FATAL ADMIN DB Error - message: " . $e->getMessage() . ", code: " . $e->getCode());
            throw $e;
        }
        
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
            
            // Map categorization fields to camelCase
            $release['showInReleases'] = (bool)$release['show_in_releases'];
            $release['showInDiscography'] = (bool)$release['show_in_discography'];
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
                    youtube_music_url,
                    youtube_url,
                    youtube2_url,
                    tag,
                    show_in_releases,
                    show_in_discography
                FROM releases
                WHERE tag != 'Removed'";
        
        $params = [];
        
        // Add search filter for public if provided
        if (!empty($search)) {
            $sql .= " AND (title LIKE ? OR artist LIKE ?)";
            $params[] = '%' . $search . '%';
            $params[] = '%' . $search . '%';
        }
        
        // Add category filter for public if provided
        if ($category === 'releases') {
            $sql .= " AND show_in_releases = 1";
        } elseif ($category === 'discography') {
            $sql .= " AND show_in_discography = 1";
        }
        // If $category is null or 'all', no category filtering (backward compatible)
        
        $sql .= " ORDER BY 
                    CASE tag 
                        WHEN 'Featured' THEN 1 
                        WHEN 'New' THEN 2 
                        ELSE 3 
                    END, 
                    release_date DESC";
        
        try {
            $releases = $db->query($sql, $params);
            
        } catch (Exception $e) {
            error_log("[" . date('Y-m-d H:i:s') . "] FATAL PUBLIC DB Error - message: " . $e->getMessage() . ", code: " . $e->getCode());
            throw $e;
        }
        
        // Convert to frontend format with artists as string for public view
        foreach ($releases as &$release) {
            $release['artists'] = $release['artist']; // Simple string for public API
            
            // Map categorization fields to camelCase
            $release['showInReleases'] = (bool)$release['show_in_releases'];
            $release['showInDiscography'] = (bool)$release['show_in_discography'];
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
    // Enhanced error logging with more context
    error_log("[" . date('Y-m-d H:i:s') . "] EXCEPTION in get-releases - error_message: " . $e->getMessage() . ", error_file: " . $e->getFile() . ", error_line: " . $e->getLine() . ", search_param: " . json_encode($search) . ", is_admin: " . ($isAdmin ? 'true' : 'false') . ", request_uri: " . ($_SERVER['REQUEST_URI'] ?? 'unknown'));
    jsonResponse(["error" => "Failed to fetch releases"], 500);
}
?>