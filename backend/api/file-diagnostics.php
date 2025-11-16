<?php
/**
 * File Diagnostic Script
 * 
 * Checks file timestamps, content, and PHP environment
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$diagnostics = [];

// Check file timestamps and sizes
$files_to_check = [
    'security.php',
    'get-homepage-videos.php',
    'debug-homepage-videos.php'
];

foreach ($files_to_check as $filename) {
    $filepath = __DIR__ . '/' . $filename;
    if (file_exists($filepath)) {
        $diagnostics['files'][$filename] = [
            'exists' => true,
            'size' => filesize($filepath),
            'modified' => date('Y-m-d H:i:s', filemtime($filepath)),
            'permissions' => substr(sprintf('%o', fileperms($filepath)), -4),
            'readable' => is_readable($filepath),
            'writable' => is_writable($filepath)
        ];
        
        // Check if security.php contains our updated CORS headers
        if ($filename === 'security.php') {
            $content = file_get_contents($filepath);
            $has_cache_headers = strpos($content, 'Cache-Control, Pragma, Expires') !== false;
            $diagnostics['files'][$filename]['has_updated_cors'] = $has_cache_headers;
            $diagnostics['files'][$filename]['content_preview'] = substr($content, 0, 200) . '...';
        }
    } else {
        $diagnostics['files'][$filename] = [
            'exists' => false
        ];
    }
}

// PHP Environment info
$diagnostics['php'] = [
    'version' => PHP_VERSION,
    'sapi' => php_sapi_name(),
    'server_time' => date('Y-m-d H:i:s'),
    'opcache_enabled' => function_exists('opcache_get_status') ? opcache_get_status() : false,
    'memory_limit' => ini_get('memory_limit'),
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size')
];

// Test if we can include security.php without errors
$include_test = 'unknown';
try {
    // Capture any output from including the file
    ob_start();
    $error_before = error_get_last();
    
    // Just check if file can be read, don't actually include to avoid function redefinition
    $security_content = file_get_contents(__DIR__ . '/security.php');
    $include_test = strlen($security_content) > 0 ? 'readable' : 'empty';
    
    ob_end_clean();
} catch (Exception $e) {
    $include_test = 'error: ' . $e->getMessage();
    ob_end_clean();
}

$diagnostics['security_include_test'] = $include_test;

// Current working directory
$diagnostics['environment'] = [
    'current_dir' => getcwd(),
    'script_dir' => __DIR__,
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'unknown',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'unknown'
];

echo json_encode([
    'success' => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'diagnostics' => $diagnostics
], JSON_PRETTY_PRINT);
?>