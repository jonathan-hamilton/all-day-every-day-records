<?php

/**
 * Simple Configuration
 * 
 * Loads environment variables and provides basic configuration
 */

// Load environment variables from .env file
function loadEnv($file = '.env') {
    // Look for .env file in parent directory (domain root)
    $envPath = dirname(__DIR__) . '/' . $file;
    
    if (!file_exists($envPath)) {
        // Fallback: try current directory
        $envPath = $file;
        if (!file_exists($envPath)) {
            return;
        }
    }
    
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        
        // Skip comments and empty lines
        if (empty($line) || strpos($line, '#') === 0) {
            continue;
        }
        
        // Check if line contains =
        if (strpos($line, '=') === false) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        // Remove quotes if present
        if (preg_match('/^".*"$/', $value)) {
            $value = substr($value, 1, -1);
        } elseif (preg_match("/^'.*'$/", $value)) {
            $value = substr($value, 1, -1);
        }
        
        // Set environment variable
        $_ENV[$name] = $value;
        putenv("$name=$value");
    }
}

// Load environment
loadEnv();

// Helper function to get environment variables with defaults
function env($key, $default = null) {
    return $_ENV[$key] ?? $default;
}

// Basic configuration
$config = [
    'environment' => env('APP_ENV', 'development'),
    'debug' => env('APP_DEBUG', 'true') === 'true',
    'api_url' => env('API_BASE_URL', 'http://localhost:8000/api'),
    
    // Database configuration
    'database' => [
        'host' => env('DATABASE_HOST', 'localhost'),
        'database' => env('DATABASE_NAME', 'alldayeveryday_records'),
        'username' => env('DATABASE_USERNAME', 'root'),
        'password' => env('DATABASE_PASSWORD', ''),
    ],
    
    // CORS configuration  
    'cors' => [
        'enabled' => env('CORS_ENABLED', 'true') === 'true',
        'origins' => explode(',', env('CORS_ORIGINS', 'http://localhost:5173,https://alldayeverydayrecords.com')),
        'methods' => explode(',', env('CORS_METHODS', 'GET,POST,PUT,DELETE,OPTIONS')),
        'headers' => explode(',', env('CORS_HEADERS', 'Content-Type,Authorization,X-Requested-With')),
    ],
    
    // Upload configuration
    'uploads' => [
        'path' => env('UPLOAD_PATH', '../public/uploads'),
        'max_size' => (int) env('UPLOAD_MAX_SIZE', 10485760), // 10MB
        'allowed_types' => explode(',', env('UPLOAD_ALLOWED_TYPES', 'jpg,jpeg,png,gif,webp')),
    ],
    
    // Security
    'security' => [
        'jwt_secret' => env('SECURITY_TOKEN_SECRET', 'change-this-in-production'),
        'password_min_length' => (int) env('SECURITY_PASSWORD_MIN_LENGTH', 8),
    ]
];

// Make config available globally for other scripts
$GLOBALS['config'] = $config;

// Set error reporting based on environment
if ($config['debug']) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Simple error handler
function handleError($message, $status = 500, $details = null) {
    global $config;
    
    $error = ['message' => $message];
    
    if ($config['debug'] && $details) {
        $error['details'] = $details;
    }
    
    jsonResponse($error, null, $status);
}

// Create database connection helper
function getDatabase() {
    global $config;
    static $database = null;
    
    if ($database === null) {
        try {
            require_once __DIR__ . '/database.php';
            $database = new Database($config['database']);
        } catch (Exception $e) {
            handleError('Database connection failed', 500, $e->getMessage());
        }
    }
    
    return $database;
}