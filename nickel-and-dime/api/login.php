<?php
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

require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Set response header
header("Content-Type: application/json");

// Rate limiting
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit($clientIP, 5, 300)) {
    jsonResponse(["error" => "Too many login attempts. Please try again later."], 429);
}

// Get and validate input
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;

if (!$email || !$password) {
    jsonResponse(["error" => "Email and password are required"], 400);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(["error" => "Invalid email format"], 400);
}

$conn = getDBConnection();

// Always hash the provided password to prevent timing attacks
$providedHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("SELECT id, email, password_hash, is_admin FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$user = $result->fetch_assoc();
$stmt->close();
$conn->close();

// Always verify password to prevent timing attacks
if ($user && password_verify($password, $user["password_hash"])) {
    // UPDATED VERSION - Session cookie params already set at top of file
    
    // For development mode, explicitly clear any old session cookies first
    if ($isDevelopment) {
        // Check if there's an old session cookie being sent by browser
        $oldSessionId = $_COOKIE[session_name()] ?? null;
        if ($oldSessionId) {
            // Explicitly expire the old cookie in browser
            setcookie(session_name(), '', [
                'expires' => time() - 3600,
                'path' => '/',
                'domain' => '',
                'secure' => false,
                'httponly' => true,
                'samesite' => 'None'
            ]);
        }
    }
    
    session_start();
    
    // Verify the session ID
    $actualSessionId = session_id();
    unset($user["password_hash"]);
    $_SESSION["user"] = $user;
    
    // Force set the session cookie with explicit parameters for cross-origin
    $cookieParams = session_get_cookie_params();
    $newSessionId = session_id();
    
    // Send multiple Set-Cookie headers to ensure browser accepts the new session
    if ($isDevelopment) {
        // First, explicitly clear any old session
        header("Set-Cookie: " . session_name() . "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure=false; httponly=true; samesite=None", false);
        // Then set the new session cookie
        header("Set-Cookie: " . session_name() . "=$newSessionId; path=/; secure=false; httponly=true; samesite=None", false);
    }
    
    // Also use the standard setcookie function
    setcookie(
        session_name(),
        $newSessionId, 
        [
            'expires' => $cookieParams['lifetime'] ? time() + $cookieParams['lifetime'] : 0,
            'path' => $cookieParams['path'],
            'domain' => $cookieParams['domain'],
            'secure' => $cookieParams['secure'],
            'httponly' => $cookieParams['httponly'],
            'samesite' => $cookieParams['samesite']
        ]
    );
    
    jsonResponse(["success" => true, "user" => $user]);
} else {
    // Generic error message to prevent user enumeration
    jsonResponse(["error" => "Invalid credentials"], 401);
}
?>
