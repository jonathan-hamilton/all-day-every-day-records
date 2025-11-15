<?php
/**
 * Logout API Endpoint
 * Destroys user session and clears authentication
 */

// Include security functions and handle CORS
require_once __DIR__ . '/security.php';
handleCORS();

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Only POST method allowed"], 405);
}

try {
    // Start session to access session data
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Check if user was logged in
    $wasLoggedIn = isset($_SESSION['user_id']);

    // Clear all session data
    $_SESSION = array();

    // Delete the session cookie if it exists
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Destroy the session
    session_destroy();

    // Return success response
    jsonResponse([
        "success" => true,
        "message" => $wasLoggedIn ? "Logged out successfully" : "Already logged out"
    ]);

} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    jsonResponse(["error" => "Server error"], 500);
}
?>