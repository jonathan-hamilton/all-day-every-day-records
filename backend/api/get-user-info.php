<?php
/**
 * Get User Info API Endpoint
 * Returns current user information from session
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_log("DEBUG: get-user-info.php started");

// Include security functions and handle CORS
error_log("DEBUG: About to include security.php");
require_once __DIR__ . '/security.php';
error_log("DEBUG: security.php included");
handleCORS();
error_log("DEBUG: CORS handled");

// Only handle GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error_log("DEBUG: Non-GET request method: " . $_SERVER['REQUEST_METHOD']);
    jsonResponse(["error" => "Only GET method allowed"], 405);
}
error_log("DEBUG: GET request confirmed");

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