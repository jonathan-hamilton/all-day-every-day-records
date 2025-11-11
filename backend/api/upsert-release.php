<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Require authentication for this endpoint
$user = requireAuth();

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

// Validate required fields
$required = ['title', 'catalog_number'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        jsonResponse(["error" => "Field '$field' is required"], 400);
    }
}

try {
    $db->beginTransaction();
    
    $releaseId = $input['id'] ?? null;
    $isUpdate = !empty($releaseId);
    
    if ($isUpdate) {
        // Update existing release
        $sql = "UPDATE releases 
                SET title = ?, catalog_number = ?, release_date = ?, 
                    description = ?, status = ?, label_id = ?, 
                    cover_image_url = ?, updated_at = NOW()
                WHERE id = ?";
        
        $params = [
            $input['title'],
            $input['catalog_number'],
            $input['release_date'] ?? null,
            $input['description'] ?? null,
            $input['status'] ?? 'active',
            $input['label_id'] ?? null,
            $input['cover_image_url'] ?? null,
            $releaseId
        ];
        
        $db->execute($sql, $params);
        
        // Clear existing artist relationships
        $db->execute("DELETE FROM release_artists WHERE release_id = ?", [$releaseId]);
        
        // Clear existing streaming links
        $db->execute("DELETE FROM streaming_links WHERE release_id = ?", [$releaseId]);
        
    } else {
        // Create new release
        $sql = "INSERT INTO releases 
                (title, catalog_number, release_date, description, status, label_id, cover_image_url, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        $params = [
            $input['title'],
            $input['catalog_number'],
            $input['release_date'] ?? null,
            $input['description'] ?? null,
            $input['status'] ?? 'active',
            $input['label_id'] ?? null,
            $input['cover_image_url'] ?? null
        ];
        
        $db->execute($sql, $params);
        $releaseId = $db->lastInsertId();
    }
    
    // Add artist relationships
    if (!empty($input['artists']) && is_array($input['artists'])) {
        foreach ($input['artists'] as $index => $artist) {
            $artistId = $artist['id'] ?? null;
            
            if (!$artistId) {
                // Create new artist if needed
                $artistSql = "INSERT INTO artists (name, created_at, updated_at) VALUES (?, NOW(), NOW())";
                $db->execute($artistSql, [$artist['name']]);
                $artistId = $db->lastInsertId();
            }
            
            // Link artist to release
            $linkSql = "INSERT INTO release_artists (release_id, artist_id, order_index, role) 
                        VALUES (?, ?, ?, ?)";
            $db->execute($linkSql, [
                $releaseId,
                $artistId,
                $index,
                $artist['role'] ?? 'artist'
            ]);
        }
    }
    
    // Add streaming links
    if (!empty($input['streaming_links']) && is_array($input['streaming_links'])) {
        foreach ($input['streaming_links'] as $link) {
            if (!empty($link['platform']) && !empty($link['url'])) {
                $linkSql = "INSERT INTO streaming_links (release_id, platform, url, is_active, created_at, updated_at) 
                            VALUES (?, ?, ?, ?, NOW(), NOW())";
                $db->execute($linkSql, [
                    $releaseId,
                    $link['platform'],
                    $link['url'],
                    $link['is_active'] ?? 1
                ]);
            }
        }
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