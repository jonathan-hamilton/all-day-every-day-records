<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

try {
    $config = getConfig();
    
    // Basic health info
    $health = [
        'status' => 'healthy',
        'timestamp' => date('c'),
        'environment' => $config['environment'],
        'api_version' => '1.0.0'
    ];
    
    // Test database connection
    try {
        $db = getDBConnection();
        $result = $db->queryValue('SELECT 1');
        
        if ($result == 1) {
            $health['database'] = 'connected';
        } else {
            $health['database'] = 'error';
            $health['status'] = 'degraded';
        }
    } catch (Exception $e) {
        $health['database'] = 'disconnected';
        $health['status'] = 'unhealthy';
        if ($config['debug']) {
            $health['database_error'] = $e->getMessage();
        }
    }
    
    // Check if we can write to logs
    try {
        error_log("Health check test - " . date('Y-m-d H:i:s'));
        $health['logging'] = 'functional';
    } catch (Exception $e) {
        $health['logging'] = 'error';
        if ($health['status'] === 'healthy') {
            $health['status'] = 'degraded';
        }
    }
    
    // Return appropriate HTTP status
    $httpStatus = 200;
    if ($health['status'] === 'degraded') {
        $httpStatus = 200; // Still OK but with warnings
    } elseif ($health['status'] === 'unhealthy') {
        $httpStatus = 503; // Service unavailable
    }
    
    jsonResponse($health, $httpStatus);
    
} catch (Exception $e) {
    logError("Health check failed", ['error' => $e->getMessage()]);
    jsonResponse([
        'status' => 'unhealthy',
        'error' => 'Health check failed',
        'timestamp' => date('c')
    ], 503);
}
?>