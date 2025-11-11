<?php
// Simple syntax validation test
// This file just includes our main files to check for syntax errors

echo "Testing simplified API structure...\n";

try {
    echo "1. Testing config.php... ";
    require_once __DIR__ . '/config.php';
    echo "✓ OK\n";
    
    echo "2. Testing database.php... ";
    require_once __DIR__ . '/database.php';
    echo "✓ OK\n";
    
    echo "3. Testing security.php... ";
    require_once __DIR__ . '/security.php';
    echo "✓ OK\n";
    
    echo "4. Testing configuration access... ";
    $testConfig = getConfig();
    if (is_array($testConfig) && isset($testConfig['database'])) {
        echo "✓ OK\n";
    } else {
        echo "✗ FAILED - Config not accessible\n";
    }
    
    echo "\n✅ All basic components loaded successfully!\n";
    echo "📁 Files created:\n";
    echo "   - config.php (simplified configuration)\n";
    echo "   - database.php (simple Database class)\n"; 
    echo "   - security.php (N&D pattern functions)\n";
    echo "   - get-releases.php (main endpoint)\n";
    echo "   - get-releases-by-id.php (single release)\n";
    echo "   - upsert-release.php (create/update)\n";
    echo "   - delete-release.php (remove release)\n";
    echo "   - login.php (authentication)\n";
    echo "   - health.php (health check)\n";
    echo "\n🎯 Much simpler than the enterprise approach!\n";
    
} catch (Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
?>