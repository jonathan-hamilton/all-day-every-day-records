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

// Rate limiting
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit('password_change_' . $user['id'], 3, 300)) {
    jsonResponse(["error" => "Too many password change attempts. Please try again later."], 429);
}

// Get and validate input
$data = json_decode(file_get_contents("php://input"), true);
$currentPassword = $data["currentPassword"] ?? null;
$newPassword = $data["newPassword"] ?? null;
$confirmPassword = $data["confirmPassword"] ?? null;

if (!$currentPassword || !$newPassword || !$confirmPassword) {
    jsonResponse(["error" => "All fields are required"], 400);
}

if ($newPassword !== $confirmPassword) {
    jsonResponse(["error" => "New passwords do not match"], 400);
}

if (strlen($newPassword) < 8) {
    jsonResponse(["error" => "Password must be at least 8 characters long"], 400);
}

$conn = getDBConnection();

try {
    // Get current password hash
    $stmt = $conn->prepare("SELECT password_hash FROM users WHERE id = ?");
    $stmt->bind_param("i", $user['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $userData = $result->fetch_assoc();
    $stmt->close();
    
    if (!$userData) {
        jsonResponse(["error" => "User not found"], 404);
    }
    
    // Verify current password
    if (!password_verify($currentPassword, $userData['password_hash'])) {
        jsonResponse(["error" => "Current password is incorrect"], 401);
    }
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password
    $stmt = $conn->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->bind_param("si", $hashedPassword, $user['id']);
    
    if ($stmt->execute()) {
        jsonResponse(["success" => true, "message" => "Password updated successfully"]);
    } else {
        error_log("Failed to update password for user " . $user['id'] . ": " . $stmt->error);
        jsonResponse(["error" => "Failed to update password"], 500);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Password change error: " . $e->getMessage());
    jsonResponse(["error" => "An error occurred while updating password"], 500);
} finally {
    $conn->close();
}
?>