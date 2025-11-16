<?php
echo "=== Database Connection Debug ===\n";

// Test environment variables
echo "DB_HOST: " . getenv('DB_HOST') . "\n";
echo "DB_NAME: " . getenv('DB_NAME') . "\n"; 
echo "DB_USER: " . getenv('DB_USER') . "\n";
echo "DB_PASS: " . (getenv('DB_PASS') ? '[SET]' : '[NOT SET]') . "\n";

// Test direct PDO connection
try {
    $host = getenv('DB_HOST');
    $dbname = getenv('DB_NAME'); 
    $user = getenv('DB_USER');
    $pass = getenv('DB_PASS');
    
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    echo "DSN: $dsn\n";
    
    $pdo = new PDO($dsn, $user, $pass);
    echo "SUCCESS: Database connection working!\n";
    
    $stmt = $pdo->query('SELECT COUNT(*) FROM homepage_videos');
    $count = $stmt->fetchColumn();
    echo "Found $count homepage videos\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>