<?php
echo "=== Database Connection Debug ===\n";

// Test environment variables
echo "1. Environment Variables:\n";
echo "   DB_HOST: " . getenv('DB_HOST') . "\n";
echo "   DB_NAME: " . getenv('DB_NAME') . "\n";
echo "   DB_USER: " . getenv('DB_USER') . "\n";
echo "   DB_PASS: " . (getenv('DB_PASS') ? '[SET]' : '[NOT SET]') . "\n\n";

// Test config loading
echo "2. Loading config.php:\n";
try {
    require '/var/www/html/config.php';
    echo "   Config loaded successfully\n";
    echo "   Config DB Host: " . $config['database']['host'] . "\n";
    echo "   Config DB Name: " . $config['database']['database'] . "\n";
    echo "   Config DB User: " . $config['database']['username'] . "\n\n";
} catch (Exception $e) {
    echo "   ERROR loading config: " . $e->getMessage() . "\n";
    exit(1);
}

// Test direct PDO connection
echo "3. Direct PDO Connection:\n";
try {
    $dsn = "mysql:host={$config['database']['host']};dbname={$config['database']['database']};charset=utf8mb4";
    echo "   DSN: $dsn\n";
    $pdo = new PDO($dsn, $config['database']['username'], $config['database']['password']);
    echo "   SUCCESS: Direct PDO connection works!\n\n";
} catch (Exception $e) {
    echo "   ERROR: " . $e->getMessage() . "\n\n";
}

// Test Database class
echo "4. Database Class:\n";
try {
    require '/var/www/html/database.php';
    $db = new Database($config['database']);
    echo "   SUCCESS: Database class instantiated!\n";
    
    $result = $db->queryValue('SELECT 1');
    echo "   SUCCESS: Query executed, result: $result\n\n";
} catch (Exception $e) {
    echo "   ERROR: " . $e->getMessage() . "\n\n";
}

// Test getDatabase() function
echo "5. getDatabase() function:\n";
try {
    $database = getDatabase();
    echo "   SUCCESS: getDatabase() worked!\n";
} catch (Exception $e) {
    echo "   ERROR: " . $e->getMessage() . "\n";
}
?>