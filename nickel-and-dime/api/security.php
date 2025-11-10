<?php
/**
 * Security utilities and common functions
 */

// Load configuration
function getConfig() {
    static $config = null;
    if ($config === null) {
        // Use environment variable or default to production config
        $configPath = __DIR__ . '/config.php';
        $localConfigPath = __DIR__ . '/config-local.php';
        
        // Only use local config if explicitly set via environment variable
        if (isset($_ENV['USE_LOCAL_CONFIG']) && $_ENV['USE_LOCAL_CONFIG'] === 'true' && file_exists($localConfigPath)) {
            $config = include $localConfigPath;
        } else {
            $config = include $configPath;
        }
    }
    return $config;
}

// CORS handling
function handleCORS() {
    $config = getConfig();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        if (in_array($origin, $config['cors']['allowed_origins'])) {
            header("Access-Control-Allow-Origin: $origin");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Allow-Headers: Content-Type");
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        }
        exit(0);
    }
    
    if (in_array($origin, $config['cors']['allowed_origins'])) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
}

// Secure database connection
function getDBConnection() {
    $config = getConfig();
    $db = $config['db'];
    
    $conn = new mysqli($db['host'], $db['username'], $db['password'], $db['database']);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit;
    }
    
    // Set charset for security
    $conn->set_charset("utf8mb4");
    
    return $conn;
}

// Authentication middleware
function requireAuth() {
    $config = getConfig();
    
    // In development mode, bypass authentication
    if (isset($config['development']) && $config['development']) {
        return ['id' => 1, 'username' => 'dev_user', 'is_admin' => true];
    }
    
    // Set session cookie params before session_start()
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
    
    session_start();
    
    if (!isset($_SESSION['user']) || !$_SESSION['user']['is_admin']) {
        http_response_code(401);
        echo json_encode(["error" => "Authentication required"]);
        exit;
    }
    
    return $_SESSION['user'];
}

// Safe JSON response
function jsonResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit;
}

// Validate file upload
function validateUpload($file) {
    $config = getConfig();
    $upload = $config['upload'];
    
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ["error" => "No file uploaded or upload error occurred"];
    }
    
    // Check file size
    if ($file['size'] > $upload['max_size']) {
        return ["error" => "File size exceeds maximum allowed size"];
    }
    
    // Validate MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime, $upload['allowed_types'])) {
        return ["error" => "Unsupported file type"];
    }
    
    // Validate file extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $upload['allowed_extensions'])) {
        return ["error" => "Unsupported file extension"];
    }
    
    return ["success" => true, "extension" => $ext];
}

// Sanitize input data for prepared statements
function sanitizeInput($data, $conn = null) {
    if (is_array($data)) {
        $sanitized = [];
        foreach ($data as $key => $value) {
            // Only trim whitespace - prepared statements handle escaping
            $sanitized[$key] = is_string($value) ? trim($value) : $value;
        }
        return $sanitized;
    }
    
    // Only trim whitespace - prepared statements handle escaping
    return is_string($data) ? trim($data) : $data;
}

// Rate limiting (simple implementation)
function checkRateLimit($identifier, $maxAttempts = 5, $timeWindow = 300) {
    // Set session cookie params before session_start()
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
    
    session_start();
    $key = "rate_limit_" . $identifier;
    $now = time();
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 1, 'first_attempt' => $now];
        return true;
    }
    
    $attempts = $_SESSION[$key];
    
    // Reset if time window has passed
    if ($now - $attempts['first_attempt'] > $timeWindow) {
        $_SESSION[$key] = ['count' => 1, 'first_attempt' => $now];
        return true;
    }
    
    // Check if limit exceeded
    if ($attempts['count'] >= $maxAttempts) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    return true;
}
?>