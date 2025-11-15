<?php
/**
 * All Day Every Day Records - Admin Login
 * Production admin authentication endpoint
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_log("DEBUG: login.php started");

// CRITICAL: Set session cookie params FIRST, before any includes or session work
// Check if request is from localhost (development mode)
$isDevelopment = isset($_SERVER['HTTP_ORIGIN']) && strpos($_SERVER['HTTP_ORIGIN'], 'localhost') !== false;

if ($isDevelopment) {
    // Development mode: use insecure cookies for cross-origin localhost
    ini_set('session.cookie_secure', '0');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'None');
} else {
    // Production mode: use secure cookies
    ini_set('session.cookie_secure', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'None');
}

// Include security functions and handle CORS
error_log("DEBUG: About to include security.php");
require_once __DIR__ . '/security.php';
error_log("DEBUG: security.php included successfully");
handleCORS();
error_log("DEBUG: CORS handled successfully");

// Ensure config is loaded
error_log("DEBUG: About to load config");
getConfig();
error_log("DEBUG: Config loaded successfully");

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("DEBUG: Non-POST request method: " . $_SERVER['REQUEST_METHOD']);
    jsonResponse(["error" => "Only POST method allowed"], 405);
}
error_log("DEBUG: POST request confirmed");

// Get and validate JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonResponse(["error" => "Invalid JSON input"], 400);
}

$input = sanitizeInput($input);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(["error" => "Email and password are required"], 400);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(["error" => "Invalid email format"], 400);
}

try {
    // Connect to database
    error_log("DEBUG: About to connect to database");
    $db = getDBConnection();
    error_log("DEBUG: Database connection successful");
    
    // Direct query instead of stored procedure to avoid collation issues
    error_log("DEBUG: About to query user with email: " . $email);
    $user = $db->queryOne("SELECT id, username, email, password_hash, is_admin 
                          FROM users 
                          WHERE email = ? COLLATE utf8mb4_general_ci", [$email]);
    error_log("DEBUG: User query completed, found user: " . ($user ? "YES" : "NO"));
    
    if (!$user) {
        error_log("Login attempt failed - user not found: " . $email);
        jsonResponse(["error" => "Invalid credentials"], 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        error_log("Login attempt failed - invalid password for user: " . $email);
        jsonResponse(["error" => "Invalid credentials"], 401);
    }
    
    // Password verified - create session
    session_start();
    
    unset($user["password_hash"]);
    $_SESSION["user"] = [
        'id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'is_admin' => (bool)$user['is_admin'],
        'login_time' => time()
    ];
    
    // For development mode, explicitly handle session cookies for cross-origin
    if ($isDevelopment) {
        // Explicitly set the session cookie for cross-origin
        $sessionId = session_id();
        header("Set-Cookie: " . session_name() . "=$sessionId; path=/; secure=false; httponly=true; samesite=None", false);
    }
    
    // Return success response
    jsonResponse([
        "success" => true,
        "message" => "Login successful",
        "user" => [
            'username' => $user['username'],
            'email' => $user['email'],
            'is_admin' => (bool)$user['is_admin']
        ]
    ]);
    
    // Log successful login
    error_log("Successful admin login: " . $email);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    jsonResponse(["error" => "Login failed"], 500);
}
?>