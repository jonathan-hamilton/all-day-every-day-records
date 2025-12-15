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
?>