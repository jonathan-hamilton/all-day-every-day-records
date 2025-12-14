<?php
/**
 * All Day Every Day Records - Security & Common Functions
 * Based on Nickel & Dime Records pattern - simple and effective
 */

// Load configuration
function getConfig() {
    static $config = null;
    if ($config === null) {
        require_once __DIR__ . '/config.php';
        $config = $GLOBALS['config'];
    }
    return $config;
}

// CORS handling (matches N&D pattern)
function handleCORS() {
    // Set CORS headers to support React 19 cache-busting headers
    $allowedOrigins = [
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'https://alldayeverydayrecords.com',
        'https://www.alldayeverydayrecords.com'
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires, cache-control, pragma, expires");
        header("Access-Control-Max-Age: 3600");
    }
    
    // Handle OPTIONS preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

// Get database connection (simplified from complex Database class)
if (!function_exists('getDBConnection')) {
    function getDBConnection() {
        $config = getConfig();
        $db = $config['database'];
        
        try {
            require_once __DIR__ . '/database.php';
            $database = new Database($db);
            return $database;
        } catch (Exception $e) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["error" => "Database connection failed"]);
            exit;
        }
    }
}

// Simple authentication (matches N&D pattern)
function requireAuth() {
    // Set session cookie params before session_start() - matches login.php
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
    
    session_start();
    
    if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
        // Ensure CORS headers are sent before auth failure response
        handleCORS();
        http_response_code(401);
        header("Content-Type: application/json");
        echo json_encode(["error" => "Authentication required"]);
        exit;
    }
    
    return $_SESSION['user'];
}

// JSON response helper (matches N&D pattern)
if (!function_exists('jsonResponse')) {
    function jsonResponse($data, $httpCode = 200) {
        http_response_code($httpCode);
        header("Content-Type: application/json");
        echo json_encode($data);
        exit;
    }
}

// Validate file upload (matches N&D pattern)
function validateUpload($file) {
    $config = getConfig();
    $upload = $config['uploads'];
    
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ["error" => "No file uploaded or upload error occurred"];
    }
    
    if ($file['size'] > $upload['max_size']) {
        return ["error" => "File size exceeds maximum allowed size"];
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    $allowedMimes = array_map(function($ext) {
        $mimes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp'
        ];
        return $mimes[$ext] ?? null;
    }, $upload['allowed_types']);
    
    if (!in_array($mime, array_filter($allowedMimes))) {
        return ["error" => "Unsupported file type"];
    }
    
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $upload['allowed_types'])) {
        return ["error" => "Unsupported file extension"];
    }
    
    return ["success" => true, "extension" => $ext];
}

// Sanitize input (simple approach for prepared statements)
function sanitizeInput($data) {
    if (is_array($data)) {
        $sanitized = [];
        foreach ($data as $key => $value) {
            $sanitized[$key] = is_string($value) ? trim($value) : $value;
        }
        return $sanitized;
    }
    
    return is_string($data) ? trim($data) : $data;
}

// Simple rate limiting
function checkRateLimit($identifier, $maxAttempts = 5, $timeWindow = 300) {
    $isDevelopment = in_array($_SERVER['HTTP_ORIGIN'] ?? '', ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']);
    
    if ($isDevelopment) {
        ini_set('session.cookie_secure', '0');
        ini_set('session.cookie_httponly', '1');
        ini_set('session.cookie_samesite', 'None');
    } else {
        ini_set('session.cookie_secure', '1');
        ini_set('session.cookie_httponly', '1');
        ini_set('session.cookie_samesite', 'None');
    }
    
    session_start();
    $key = "rate_limit_" . $identifier;
    $now = time();
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 1, 'first_attempt' => $now];
        return true;
    }
    
    $attempts = $_SESSION[$key];
    
    if ($now - $attempts['first_attempt'] > $timeWindow) {
        $_SESSION[$key] = ['count' => 1, 'first_attempt' => $now];
        return true;
    }
    
    if ($attempts['count'] >= $maxAttempts) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    return true;
}

// Helper function to check if request is from admin
function isAdminRequest() {
    return isset($_GET["admin"]) && $_GET["admin"] === "true";
}

// Simple error logging
function logError($message, $context = []) {
    $config = getConfig();
    $logMessage = "[" . date('Y-m-d H:i:s') . "] " . $message;
    
    if ($config['debug'] && !empty($context)) {
        $logMessage .= " Context: " . json_encode($context);
    }
    
    error_log($logMessage);
}

// CSRF Protection Functions

/**
 * Generate a CSRF token and store it in the session
 * @return string The generated CSRF token
 */
function generateCSRFToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Generate a cryptographically secure random token
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    
    return $token;
}

/**
 * Validate CSRF token from request headers
 * @return bool True if token is valid, false otherwise
 */
function validateCSRFToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Get token from session
    $sessionToken = $_SESSION['csrf_token'] ?? null;
    
    if (!$sessionToken) {
        error_log("CSRF validation failed: No token in session");
        return false;
    }
    
    // Get token from request header
    $requestToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    
    if (!$requestToken) {
        error_log("CSRF validation failed: No token in request header");
        return false;
    }
    
    // Use timing-attack safe comparison
    if (!hash_equals($sessionToken, $requestToken)) {
        error_log("CSRF validation failed: Token mismatch");
        return false;
    }
    
    return true;
}

/**
 * Require valid CSRF token for state-changing operations
 * Call this function at the start of POST/PUT/DELETE endpoints
 */
function requireCSRFToken() {
    if (!validateCSRFToken()) {
        handleCORS(); // Ensure CORS headers are sent
        http_response_code(403);
        header("Content-Type: application/json");
        echo json_encode([
            "error" => "Invalid or missing CSRF token",
            "code" => "CSRF_VALIDATION_FAILED"
        ]);
        exit;
    }
}

// ============================================================================
// RATE LIMITING FUNCTIONS
// ============================================================================

/**
 * Check if IP address is currently rate limited
 * 
 * @param string $ipAddress The IP address to check
 * @return array ['limited' => bool, 'message' => string, 'retry_after' => int|null]
 */
function checkRateLimit($ipAddress) {
    $db = getDBConnection();
    
    try {
        // Check if IP is currently locked out
        $stmt = $db->prepare("
            SELECT attempt_count, lockout_until 
            FROM login_attempts 
            WHERE ip_address = ? 
            AND lockout_until > NOW()
            LIMIT 1
        ");
        $stmt->execute([$ipAddress]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($record) {
            $lockoutUntil = strtotime($record['lockout_until']);
            $now = time();
            $retryAfter = max(0, $lockoutUntil - $now);
            
            return [
                'limited' => true,
                'message' => 'Too many failed login attempts. Please try again later.',
                'retry_after' => $retryAfter
            ];
        }
        
        return [
            'limited' => false,
            'message' => '',
            'retry_after' => null
        ];
        
    } catch (PDOException $e) {
        error_log("Rate limit check error: " . $e->getMessage());
        // On error, allow the request (fail open)
        return [
            'limited' => false,
            'message' => '',
            'retry_after' => null
        ];
    }
}

/**
 * Record a failed login attempt and apply rate limiting
 * 
 * @param string $ipAddress The IP address that failed login
 * @return void
 */
function recordFailedLogin($ipAddress) {
    $db = getDBConnection();
    
    try {
        // Check if record exists for this IP
        $stmt = $db->prepare("
            SELECT id, attempt_count, lockout_until 
            FROM login_attempts 
            WHERE ip_address = ? 
            LIMIT 1
        ");
        $stmt->execute([$ipAddress]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($record) {
            // Increment attempt count
            $newCount = $record['attempt_count'] + 1;
            
            // Apply lockout after 5 failed attempts (15 minutes)
            if ($newCount >= 5) {
                $lockoutUntil = date('Y-m-d H:i:s', strtotime('+15 minutes'));
                $stmt = $db->prepare("
                    UPDATE login_attempts 
                    SET attempt_count = ?, 
                        last_attempt_at = NOW(),
                        lockout_until = ?
                    WHERE ip_address = ?
                ");
                $stmt->execute([$newCount, $lockoutUntil, $ipAddress]);
                error_log("Rate limit applied for IP $ipAddress: locked out until $lockoutUntil");
            } else {
                // Just increment counter
                $stmt = $db->prepare("
                    UPDATE login_attempts 
                    SET attempt_count = ?, 
                        last_attempt_at = NOW()
                    WHERE ip_address = ?
                ");
                $stmt->execute([$newCount, $ipAddress]);
            }
        } else {
            // Create new record
            $stmt = $db->prepare("
                INSERT INTO login_attempts (ip_address, attempt_count, first_attempt_at, last_attempt_at)
                VALUES (?, 1, NOW(), NOW())
            ");
            $stmt->execute([$ipAddress]);
        }
        
    } catch (PDOException $e) {
        error_log("Failed login recording error: " . $e->getMessage());
    }
}

/**
 * Clear failed login attempts for an IP address (called on successful login)
 * 
 * @param string $ipAddress The IP address that successfully logged in
 * @return void
 */
function clearFailedLogins($ipAddress) {
    $db = getDBConnection();
    
    try {
        $stmt = $db->prepare("DELETE FROM login_attempts WHERE ip_address = ?");
        $stmt->execute([$ipAddress]);
    } catch (PDOException $e) {
        error_log("Failed login clearing error: " . $e->getMessage());
    }
}

/**
 * Require rate limit check before processing login
 * Returns 429 Too Many Requests if rate limited
 */
function requireRateLimit($ipAddress) {
    $rateLimitCheck = checkRateLimit($ipAddress);
    
    if ($rateLimitCheck['limited']) {
        handleCORS(); // Ensure CORS headers are sent
        http_response_code(429);
        header("Content-Type: application/json");
        header("Retry-After: " . $rateLimitCheck['retry_after']);
        echo json_encode([
            "error" => $rateLimitCheck['message'],
            "code" => "RATE_LIMITED",
            "retry_after" => $rateLimitCheck['retry_after']
        ]);
        exit;
    }
}
?>