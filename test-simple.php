<?php
echo "=== Environment Test ===\n";
echo "DB_HOST: " . getenv('DB_HOST') . "\n";
echo "DB_NAME: " . getenv('DB_NAME') . "\n";
echo "DB_USER: " . getenv('DB_USER') . "\n";
echo "DB_PASS: " . (getenv('DB_PASS') ? '[SET]' : '[NOT SET]') . "\n";

echo "\n=== Connection Test ===\n";
try {
    $pdo = new PDO(
        'mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME') . ';charset=utf8mb4',
        getenv('DB_USER'),
        getenv('DB_PASS')
    );
    echo "SUCCESS: Database connection established!\n";
    
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM homepage_videos');
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Found " . $result['count'] . " homepage videos\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>