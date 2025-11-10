<?php
/**
 * Local development configuration
 * This file should NOT be deployed to production
 * Rename to config-local.php.example on production server
 */

$config = [
    'development' => true, // Development mode - bypasses auth
    'db' => [
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'database' => $_ENV['DB_NAME'] ?? 'test_db',
        'username' => $_ENV['DB_USER'] ?? 'test_user',
        'password' => $_ENV['DB_PASS'] ?? 'test_pass'
    ],
    
    'cors' => [
        'allowed_origins' => [
            'https://nickelanddimerecords.com',
            'http://localhost:5173',
            'http://localhost:8000'
        ]
    ],
    
    'upload' => [
        'max_size' => 5 * 1024 * 1024, // 5MB
        'allowed_types' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        'allowed_extensions' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'upload_dir' => '/app/uploads/',
        'base_url' => '/uploads/'
    ],
    
    // Testing mode
    'testing' => true
];

return $config;
?>