<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Require authentication
$user = requireAuth();

// Require CSRF token for state-changing operation
requireCSRFToken();

// Only handle POST/DELETE requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'])) {
    jsonResponse(["error" => "Only POST or DELETE methods allowed"], 405);
}

$db = getDBConnection();

// Get video ID from query parameter or JSON body
$videoId = null;

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $videoId = $_GET['id'] ?? null;
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    $videoId = $input['id'] ?? $_GET['id'] ?? null;
}

if (!$videoId) {
    jsonResponse(["error" => "Video ID is required"], 400);
}

try {
    $db->beginTransaction();
    
    // Check if video exists
    $existing = $db->queryOne("SELECT id, title FROM videos WHERE id = ?", [$videoId]);
    
    if (!$existing) {
        $db->rollback();
        jsonResponse(["error" => "Video not found"], 404);
    }
    
    // Delete the video
    $result = $db->execute("DELETE FROM videos WHERE id = ?", [$videoId]);
    
    if (!$result) {
        $db->rollback();
        logError("Failed to delete video", ['id' => $videoId, 'title' => $existing['title']]);
        jsonResponse(["error" => "Failed to delete video"], 500);
    }
    
    $db->commit();
    
    jsonResponse([
        "success" => true,
        "message" => "Video deleted successfully"
    ]);
    
} catch (Exception $e) {
    $db->rollback();
    logError("Exception in delete-video", [
        'error' => $e->getMessage(),
        'id' => $videoId
    ]);
    jsonResponse(["error" => "Failed to delete video"], 500);
}
?>
