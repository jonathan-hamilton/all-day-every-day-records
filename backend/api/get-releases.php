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

// Debug: Log all incoming parameters
error_log("[" . date('Y-m-d H:i:s') . "] DEBUG get-releases start - search: " . json_encode($search) . ", all_params: " . json_encode($_GET) . ", is_admin: " . ($isAdmin ? 'true' : 'false'));

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
                FROM releases";
        
        $params = [];
        
        // Add search filter for admin if provided
        if (!empty($search)) {
            $sql .= " WHERE (title LIKE ? OR artist LIKE ?)";
            $params[] = '%' . $search . '%';
            $params[] = '%' . $search . '%';
            error_log("[" . date('Y-m-d H:i:s') . "] DEBUG admin search added - sql_fragment: 'WHERE (title LIKE ? OR artist LIKE ?)', search_value: " . json_encode('%' . $search . '%'));
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        // Debug: Log final SQL and parameters for admin
        error_log("[" . date('Y-m-d H:i:s') . "] DEBUG admin SQL - sql: " . json_encode($sql) . ", params: " . json_encode($params));
        
        
        try {
            error_log("[" . date('Y-m-d H:i:s') . "] DEBUG admin about to execute query");
            
            $releases = $db->query($sql, $params);
            error_log("[" . date('Y-m-d H:i:s') . "] DEBUG admin query executed successfully");
            
        } catch (Exception $e) {
            error_log("[" . date('Y-m-d H:i:s') . "] FATAL ADMIN DB Error - message: " . $e->getMessage() . ", code: " . $e->getCode());
            throw $e;
        }
        
        // Debug: Log result count for admin
        error_log("[" . date('Y-m-d H:i:s') . "] DEBUG admin results - count: " . count($releases));
        
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
                WHERE tag != 'Removed'";
        
        $params = [];
        
        // Add search filter for public if provided
        if (!empty($search)) {
            $sql .= " AND (title LIKE ? OR artist LIKE ?)";
            $params[] = '%' . $search . '%';
            $params[] = '%' . $search . '%';
            error_log("[" . date('Y-m-d H:i:s') . "] DEBUG public search added - sql_fragment: 'AND (title LIKE ? OR artist LIKE ?)', search_value: " . json_encode('%' . $search . '%'));
        }
        
        $sql .= " ORDER BY 
                    CASE tag 
                        WHEN 'Featured' THEN 1 
                        WHEN 'New' THEN 2 
                        ELSE 3 
                    END, 
                    release_date DESC";
        
        // Debug: Log final SQL and parameters for public
        error_log("[" . date('Y-m-d H:i:s') . "] DEBUG public SQL - sql: " . json_encode($sql) . ", params: " . json_encode($params));
        
        try {
            error_log("[" . date('Y-m-d H:i:s') . "] DEBUG about to execute public query");
            
            $releases = $db->query($sql, $params);
            error_log("[" . date('Y-m-d H:i:s') . "] DEBUG public query executed successfully");
            
        } catch (Exception $e) {
            error_log("[" . date('Y-m-d H:i:s') . "] FATAL PUBLIC DB Error - message: " . $e->getMessage() . ", code: " . $e->getCode());
            throw $e;
        }
        
        // Debug: Log result count for public
        error_log("[" . date('Y-m-d H:i:s') . "] DEBUG public results - count: " . count($releases));
        
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
    
    // Debug: Log before final response
    error_log("[" . date('Y-m-d H:i:s') . "] DEBUG before response - releases_count: " . count($releases));
    
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