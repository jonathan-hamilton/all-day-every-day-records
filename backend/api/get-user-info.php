<?php
/**
 * Get User Info API Endpoint
 * Returns current user information from session
 */

require_once __DIR__ . '/security.php';
handleCORS();

// Only handle GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(["error" => "Only GET method allowed"], 405);
}

try {
    // Check if user is authenticated via session
    if (!requireAuth()) {
        jsonResponse(["error" => "Not authenticated"], 401);
    }

    // Get user info from session
    if (!isset($_SESSION['user']) || !is_array($_SESSION['user'])) {
        jsonResponse(["error" => "Invalid session data"], 401);
    }

    $user = $_SESSION['user'];

    // Return user information
    jsonResponse([
        "success" => true,
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email'],
            "is_admin" => isset($user['is_admin']) ? (bool)$user['is_admin'] : false
        ]
    ]);

} catch (Exception $e) {
    error_log("Get user info error: " . $e->getMessage());
    jsonResponse(["error" => "Server error"], 500);
}
?>