<?php
/**
 * All Day Every Day Records - Admin Login
 * Production admin authentication endpoint
 */

// Set session cookie params FIRST, before any includes or session work
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
require_once __DIR__ . '/security.php';
handleCORS();

// Ensure config is loaded
getConfig();

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Only POST method allowed"], 405);
}

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
    $db = getDBConnection();
    
    // Direct query instead of stored procedure to avoid collation issues
    $user = $db->queryOne("SELECT id, username, email, password_hash, is_admin 
                          FROM users 
                          WHERE email = ? COLLATE utf8mb4_general_ci", [$email]);
    
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