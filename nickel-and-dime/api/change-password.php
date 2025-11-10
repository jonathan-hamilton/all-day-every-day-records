<?php
/**
 * Password Change Utility
 * Run this script directly to change your password
 * Usage: php change-password.php
 */

require_once __DIR__ . '/security.php';

// This script should only be run via command line for security
if (isset($_SERVER['HTTP_HOST'])) {
    die("This script can only be run from command line for security reasons.\n");
}

echo "=== Password Change Utility ===\n";
echo "This utility will help you change your admin password.\n\n";

// Get email
echo "Enter your email: ";
$email = trim(fgets(STDIN));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email format.\n");
}

// Get new password
echo "Enter new password: ";
$newPassword = trim(fgets(STDIN));

if (strlen($newPassword) < 8) {
    die("Password must be at least 8 characters long.\n");
}

// Confirm password
echo "Confirm new password: ";
$confirmPassword = trim(fgets(STDIN));

if ($newPassword !== $confirmPassword) {
    die("Passwords do not match.\n");
}

try {
    $conn = getDBConnection();
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, email FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    
    if (!$user) {
        die("User with email '$email' not found.\n");
    }
    
    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password
    $stmt = $conn->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
    $stmt->bind_param("ss", $hashedPassword, $email);
    
    if ($stmt->execute()) {
        echo "\n✅ Password updated successfully for $email\n";
    } else {
        echo "\n❌ Failed to update password: " . $stmt->error . "\n";
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
}

echo "\nDone.\n";
?>