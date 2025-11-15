<?php
// Simple CORS headers first
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://alldayeverydayrecords.com',
    'https://www.alldayeverydayrecords.com', 
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: text/plain");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

echo "=== Login Debug Test ===\n\n";

// Test basic PHP functionality
echo "PHP Version: " . phpversion() . "\n";
echo "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n";

// Test database credentials from .env
echo "\nTesting .env file loading...\n";

try {
    // Try to load .env file manually
    $envPath = dirname(__DIR__) . '/.env';
    echo "Checking .env at: $envPath\n";
    
    if (file_exists($envPath)) {
        echo "✅ .env file exists\n";
        $envContent = file_get_contents($envPath);
        
        // Parse database credentials
        if (strpos($envContent, 'DATABASE_HOST') !== false) {
            echo "✅ .env contains database config\n";
        } else {
            echo "❌ .env missing database config\n";
        }
    } else {
        echo "❌ .env file not found\n";
    }
    
    // Test if we can include security.php
    echo "\nTesting security.php inclusion...\n";
    if (file_exists(__DIR__ . '/security.php')) {
        echo "✅ security.php exists\n";
        // Don't actually include it yet - might cause errors
    } else {
        echo "❌ security.php not found\n";
    }
    
    // Test basic JSON input
    echo "\nTesting JSON input...\n";
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        echo "✅ JSON input received: " . json_encode($input) . "\n";
    } else {
        echo "⚠️ No JSON input (normal for GET request)\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";
?>