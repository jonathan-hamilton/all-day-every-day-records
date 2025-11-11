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
        // Admin view: show all releases including removed ones
        $sql = "SELECT * FROM releases 
                ORDER BY 
                    CASE 
                        WHEN status = 'featured' THEN 1 
                        WHEN status = 'new' THEN 2 
                        WHEN status = 'removed' THEN 4 
                        ELSE 3 
                    END, 
                    artist_name ASC";
        $releases = $db->query($sql);
    } else {
        // Public view: exclude removed releases
        $sql = "SELECT r.*, 
                       GROUP_CONCAT(DISTINCT a.name ORDER BY ra.order_index ASC SEPARATOR ', ') as artists,
                       l.name as label_name
                FROM releases r
                LEFT JOIN release_artists ra ON r.id = ra.release_id
                LEFT JOIN artists a ON ra.artist_id = a.id
                LEFT JOIN labels l ON r.label_id = l.id
                WHERE r.status != 'removed' OR r.status IS NULL
                GROUP BY r.id
                ORDER BY 
                    CASE 
                        WHEN r.status = 'featured' THEN 1 
                        WHEN r.status = 'new' THEN 2 
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
?>