<?php
/**
 * Secure configuration file
 * Place this file OUTSIDE the web root for security
 */

// Database configuration
$config = [
    'development' => false, // Production mode
    'db' => [
        'host' => $_ENV['DB_HOST'] ?? 'mysql.nickelanddimerecords.com',
        'database' => $_ENV['DB_NAME'] ?? 'nickel_and_dime_records',
        'username' => $_ENV['DB_USER'] ?? 'nadr_webuser',
        'password' => $_ENV['DB_PASS'] ?? '_v4b_f8QCYBCGaY'
    ],
    
    // CORS settings
    'cors' => [
        'allowed_origins' => [
            'https://nickelanddimerecords.com',
            'http://localhost:5173'
        ]
    ],
    
    // File upload settings
    'upload' => [
        'max_size' => 5 * 1024 * 1024, // 5MB
        'allowed_types' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        'allowed_extensions' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'upload_dir' => '/home/jonathan_hamilton/nickelanddimerecords.com/release-images/',
        'base_url' => '/release-images/'
    ]
];

return $config;
?>