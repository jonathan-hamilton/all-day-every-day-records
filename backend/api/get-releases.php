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
        // Admin view: show all releases with enhanced data
        $sql = "SELECT 
                    r.id,
                    r.title,
                    r.catalog_number,
                    r.release_date,
                    r.description,
                    r.status,
                    r.label_id,
                    r.cover_image_url,
                    r.is_featured,
                    r.is_new,
                    r.created_at,
                    r.updated_at,
                    GROUP_CONCAT(DISTINCT CONCAT(a.name, ':', ra.role) SEPARATOR '|') as artists_data,
                    GROUP_CONCAT(DISTINCT CONCAT(sl.platform, ':', sl.url) SEPARATOR '|') as streaming_links_data,
                    l.name as label_name
                FROM releases r
                LEFT JOIN release_artists ra ON r.id = ra.release_id
                LEFT JOIN artists a ON ra.artist_id = a.id
                LEFT JOIN streaming_links sl ON r.id = sl.release_id AND sl.is_active = 1
                LEFT JOIN labels l ON r.label_id = l.id
                GROUP BY r.id
                ORDER BY r.created_at DESC";
        $releases = $db->query($sql);
        
        // Process admin releases with enhanced data
        foreach ($releases as &$release) {
            // Add computed tag field based on database flags
            $release['tag'] = computeTagFromFlags($release['is_featured'], $release['is_new'], $release['status']);
            
            // Process artists array
            $release['artists'] = parseArtists($release['artists_data']);
            
            // Process streaming links array  
            $release['streaming_links'] = parseStreamingLinks($release['streaming_links_data']);
            
            // Clean up the raw data fields
            unset($release['artists_data'], $release['streaming_links_data']);
        }
    } else {
        // Public view: exclude removed releases
        $sql = "SELECT r.*, 
                       GROUP_CONCAT(DISTINCT a.name ORDER BY ra.order_index ASC SEPARATOR ', ') as artists,
                       l.name as label_name
                FROM releases r
                LEFT JOIN release_artists ra ON r.id = ra.release_id
                LEFT JOIN artists a ON ra.artist_id = a.id
                LEFT JOIN labels l ON r.label_id = l.id
                WHERE r.status != 'archived'
                GROUP BY r.id
                ORDER BY 
                    CASE 
                        WHEN r.is_featured = 1 THEN 1 
                        WHEN r.is_new = 1 THEN 2 
                        ELSE 3 
                    END, 
                    a.name ASC";
        $releases = $db->query($sql);
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

/**
 * Compute tag field from database flags
 */
function computeTagFromFlags($is_featured, $is_new, $status) {
    if ($status === 'archived') {
        return 'Removed';
    } elseif ($is_featured) {
        return 'Featured';
    } elseif ($is_new) {
        return 'New';
    } else {
        return 'None';
    }
}

/**
 * Parse artists string into array
 */
function parseArtists($artistsString) {
    if (empty($artistsString)) {
        return [];
    }
    
    $artists = [];
    $artistPairs = explode('|', $artistsString);
    
    foreach ($artistPairs as $pair) {
        $parts = explode(':', $pair, 2);
        if (count($parts) === 2) {
            $artists[] = [
                'name' => $parts[0],
                'role' => $parts[1]
            ];
        }
    }
    
    return $artists;
}

/**
 * Parse streaming links string into array
 */
function parseStreamingLinks($linksString) {
    if (empty($linksString)) {
        return [];
    }
    
    $links = [];
    $linkPairs = explode('|', $linksString);
    
    foreach ($linkPairs as $pair) {
        $parts = explode(':', $pair, 2);
        if (count($parts) === 2) {
            $links[] = [
                'platform' => $parts[0],
                'url' => $parts[1],
                'is_active' => true
            ];
        }
    }
    
    return $links;
}
?>