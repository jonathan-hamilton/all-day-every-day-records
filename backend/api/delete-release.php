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
    
    // Soft delete: mark as removed instead of actually deleting
    // This preserves data integrity and allows for recovery
    $sql = "UPDATE releases SET status = 'removed', updated_at = NOW() WHERE id = ?";
    $db->execute($sql, [$releaseId]);
    
    // Optionally, you could do a hard delete by uncommenting below:
    // and commenting out the soft delete above
    /*
    // Delete related records first (foreign key constraints)
    $db->execute("DELETE FROM streaming_links WHERE release_id = ?", [$releaseId]);
    $db->execute("DELETE FROM release_artists WHERE release_id = ?", [$releaseId]);
    
    // Delete the release itself
    $db->execute("DELETE FROM releases WHERE id = ?", [$releaseId]);
    */
    
    $db->commit();
    
    jsonResponse([
        "success" => true,
        "message" => "Release removed successfully",
        "release_id" => $releaseId,
        "title" => $existing['title']
    ]);
    
} catch (Exception $e) {
    $db->rollback();
    logError("Exception in delete-release", ['error' => $e->getMessage(), 'id' => $releaseId]);
    jsonResponse(["error" => "Failed to remove release"], 500);
}
?>