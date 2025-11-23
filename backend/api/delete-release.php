<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Require authentication
$user = requireAuth();

// Only handle POST/DELETE requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'])) {
    jsonResponse(["error" => "Only POST or DELETE methods allowed"], 405);
}

$db = getDBConnection();

// Get release ID from query parameter or JSON body
$releaseId = null;

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $releaseId = $_GET['id'] ?? null;
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    $releaseId = $input['id'] ?? $_GET['id'] ?? null;
}

if (!$releaseId) {
    jsonResponse(["error" => "Release ID is required"], 400);
}

try {
    $db->beginTransaction();
    
    // Check if release exists
    $existing = $db->queryOne("SELECT id, title FROM releases WHERE id = ?", [$releaseId]);
    
    if (!$existing) {
        $db->rollback();
        jsonResponse(["error" => "Release not found"], 404);
    }
    
    // Delete the release (streaming URLs are columns in the releases table, not separate tables)
    $result = $db->execute("DELETE FROM releases WHERE id = ?", [$releaseId]);
    
    if (!$result) {
        $db->rollback();
        logError("Failed to delete release", ['id' => $releaseId, 'title' => $existing['title']]);
        jsonResponse(["error" => "Failed to remove release"], 500);
    }
    
    $db->commit();
    
    jsonResponse([
        "success" => true,
        "message" => "Release deleted successfully",
        "release_id" => $releaseId,
        "title" => $existing['title']
    ]);
    
} catch (Exception $e) {
    $db->rollback();
    logError("Exception in delete-release", ['error' => $e->getMessage(), 'id' => $releaseId]);
    jsonResponse(["error" => "Failed to remove release"], 500);
}
?>