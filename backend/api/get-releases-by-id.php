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
    // Get release with all related data
    $sql = "SELECT r.*,
                   l.name as label_name,
                   l.website as label_website
            FROM releases r
            LEFT JOIN labels l ON r.label_id = l.id
            WHERE r.id = ?";
    
    // Add status filter for non-admin requests
    if (!$isAdmin) {
        $sql .= " AND (r.status != 'removed' OR r.status IS NULL)";
    }
    
    $release = $db->queryOne($sql, [$releaseId]);
    
    if (!$release) {
        jsonResponse(["error" => "Release not found"], 404);
    }
    
    // Get artists for this release
    $artistSql = "SELECT a.*, ra.order_index, ra.role
                  FROM artists a
                  JOIN release_artists ra ON a.id = ra.artist_id
                  WHERE ra.release_id = ?
                  ORDER BY ra.order_index ASC";
    
    $artists = $db->query($artistSql, [$releaseId]);
    $release['artists'] = $artists;
    
    // Get streaming links for this release
    $streamingSql = "SELECT platform, url, is_active
                     FROM streaming_links
                     WHERE release_id = ? AND is_active = 1
                     ORDER BY platform ASC";
    
    $streamingLinks = $db->query($streamingSql, [$releaseId]);
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