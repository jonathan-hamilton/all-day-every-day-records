<?php
// Generate correct password hash for ADE_Records_2025!

$password = 'ADE_Records_2025!';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: $password\n";
echo "New Hash: $hash\n";
echo "\nSQL UPDATE command:\n";
echo "UPDATE users SET password_hash = '$hash' WHERE username = 'admin';\n";

// Verify it works
if (password_verify($password, $hash)) {
    echo "\n✅ Verification test: PASSED\n";
} else {
    echo "\n❌ Verification test: FAILED\n";
}
?>