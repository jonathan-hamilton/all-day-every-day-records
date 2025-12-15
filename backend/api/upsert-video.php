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
$required = ['title', 'youtube_url', 'artist'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        jsonResponse(["error" => "Field '$field' is required"], 400);
    }
}

try {
    $db->beginTransaction();
    
    $videoId = $input['id'] ?? null;
    $isUpdate = !empty($videoId);
    
    if ($isUpdate) {
        // Update existing video
        $sql = "UPDATE videos 
                SET title = ?, 
                    youtube_url = ?, 
                    description = ?, 
                    artist = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?";
        
        $params = [
            $input['title'],
            $input['youtube_url'],
            $input['description'] ?? null,
            $input['artist'],
            $videoId
        ];
        
        $result = $db->execute($sql, $params);
        
        if (!$result) {
            $db->rollback();
            jsonResponse(["error" => "Failed to update video"], 500);
        }
        
        $db->commit();
        
        // Fetch the updated video
        $sql = "SELECT * FROM videos WHERE id = ?";
        $video = $db->queryOne($sql, [$videoId]);
        
        jsonResponse([
            "success" => true,
            "message" => "Video updated successfully",
            "video" => $video
        ]);
        
    } else {
        // Create new video
        $sql = "INSERT INTO videos 
                (title, youtube_url, description, artist, created_at, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        
        $params = [
            $input['title'],
            $input['youtube_url'],
            $input['description'] ?? null,
            $input['artist']
        ];
        
        $result = $db->execute($sql, $params);
        
        if (!$result) {
            $db->rollback();
            jsonResponse(["error" => "Failed to create video"], 500);
        }
        
        $newId = $db->lastInsertId();
        $db->commit();
        
        // Fetch the newly created video
        $sql = "SELECT * FROM videos WHERE id = ?";
        $video = $db->queryOne($sql, [$newId]);
        
        jsonResponse([
            "success" => true,
            "message" => "Video created successfully",
            "video" => $video
        ]);
    }
    
} catch (Exception $e) {
    $db->rollback();
    logError("Exception in upsert-video", [
        'error' => $e->getMessage(),
        'input' => $input
    ]);
    jsonResponse(["error" => "Failed to save video"], 500);
}
?>
