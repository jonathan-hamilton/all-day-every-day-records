<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Require authentication for this endpoint
$user = requireAuth();

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Method not allowed"], 405);
}

$conn = getDBConnection();

// Get and validate input data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"])) {
    jsonResponse(["error" => "Missing release ID"], 400);
}

$id = intval($data["id"]);

if ($id <= 0) {
    jsonResponse(["error" => "Invalid release ID"], 400);
}

try {
    // Verify the release exists before updating
    $checkStmt = $conn->prepare("SELECT id FROM releases WHERE id = ?");
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        jsonResponse(["error" => "Release not found"], 404);
    }
    $checkStmt->close();
    
    // Permanently delete the release from the database
    $stmt = $conn->prepare("DELETE FROM releases WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        jsonResponse(["success" => true]);
    } else {
        error_log("Database error in delete-release: " . $stmt->error);
        jsonResponse(["error" => "Failed to delete release"], 500);
    }
    
} catch (Exception $e) {
    error_log("Exception in delete-release: " . $e->getMessage());
    jsonResponse(["error" => "Internal server error"], 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
