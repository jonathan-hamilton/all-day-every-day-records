<?php
/**
 * All Day Every Day Records - Security & Common Functions
 * Based on Nickel & Dime Records pattern - simple and effective
 */

error_log("DEBUG: security.php loaded");

// Load configuration
function getConfig() {
    error_log("DEBUG: getConfig() called");
    static $config = null;
    if ($config === null) {
        error_log("DEBUG: Loading config.php");
        require_once __DIR__ . '/config.php';
        error_log("DEBUG: config.php loaded");
        $config = $GLOBALS['config'];
        error_log("DEBUG: Config loaded: " . json_encode($config));
    }
    return $config;
}

// CORS handling (matches N&D pattern)
function handleCORS() {
    $config = getConfig();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        if (in_array($origin, $config['cors']['origins'])) {
            header("Access-Control-Allow-Origin: $origin");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        }
        exit(0);
    }
    
    if (in_array($origin, $config['cors']['origins'])) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
}

// Get database connection (simplified from complex Database class)
function getDBConnection() {
    error_log("DEBUG: getDBConnection() called");
    $config = getConfig();
    error_log("DEBUG: Config retrieved for DB connection");
    $db = $config['database'];
    
    try {
        error_log("DEBUG: About to create Database instance");
        require_once __DIR__ . '/database.php';
        error_log("DEBUG: database.php loaded");
        $database = new Database($db);
        error_log("DEBUG: Database instance created successfully");
        return $database;
    } catch (Exception $e) {
        error_log("Database connection failed: " . $e->getMessage());
        error_log("DEBUG: Database config: " . json_encode($db));
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
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
        http_response_code(401);
        echo json_encode(["error" => "Authentication required"]);
        exit;
    }
    
    return $_SESSION['user'];
}

// JSON response helper (matches N&D pattern)
function jsonResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit;
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
    $isDevelopment = in_array($_SERVER['HTTP_ORIGIN'] ?? '', ['http://localhost:5173', 'http://127.0.0.1:5173']);
    
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