<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Require authentication for this endpoint
$user = requireAuth();

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Method not allowed"], 405);
}

// Configuration for uploads - environment-aware with production persistence
$config = getConfig();

// Determine upload strategy based on environment
$isDevelopment = $config['environment'] === 'development';

if ($isDevelopment) {
    // Development: Upload to mounted volume but return production-compatible URLs
    $uploadConfig = [
        'upload_dir' => '/var/www/html/uploads/covers/',
        'base_url' => 'https://alldayeverydayrecords.com/release-images/',  // Production URL for frontend compatibility
        'max_size' => $config['uploads']['max_size'],
        'allowed_types' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'allowed_extensions' => $config['uploads']['allowed_types']
    ];
} else {
    // Production: Direct upload to domain file system
    $uploadConfig = [
        'upload_dir' => '/home/dh_9d47dc/alldayeverydayrecords.com/release-images/',
        'base_url' => 'https://alldayeverydayrecords.com/release-images/',
        'max_size' => $config['uploads']['max_size'],
        'allowed_types' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'allowed_extensions' => $config['uploads']['allowed_types']
    ];
}

// Validate file upload
if (!isset($_FILES["file"])) {
    jsonResponse(["error" => "No file uploaded"], 400);
}

$file = $_FILES["file"];

// Validate file size
if ($file["size"] > $uploadConfig['max_size']) {
    jsonResponse(["error" => "File too large. Maximum size is 5MB"], 400);
}

// Validate file type
$fileType = $file["type"];
if (!in_array($fileType, $uploadConfig['allowed_types'])) {
    jsonResponse(["error" => "Invalid file type. Allowed types: JPEG, PNG, WebP, GIF"], 400);
}

// Validate file extension
$fileExtension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
if (!in_array($fileExtension, $uploadConfig['allowed_extensions'])) {
    jsonResponse(["error" => "Invalid file extension"], 400);
}

// Generate secure filename
$safeName = uniqid("cover_", true) . "." . $fileExtension;
$target = $uploadConfig['upload_dir'] . $safeName;

// Ensure upload directory exists and is writable
if (!is_dir($uploadConfig['upload_dir'])) {
    if (!mkdir($uploadConfig['upload_dir'], 0755, true)) {
        error_log("Failed to create upload directory: " . $uploadConfig['upload_dir']);
        jsonResponse(["error" => "Upload directory not available"], 500);
    }
}

if (!is_writable($uploadConfig['upload_dir'])) {
    error_log("Upload directory not writable: " . $uploadConfig['upload_dir']);
    jsonResponse(["error" => "Upload directory not writable"], 500);
}

// Additional security: Check file contents
$imageInfo = getimagesize($file["tmp_name"]);
if ($imageInfo === false) {
    jsonResponse(["error" => "File is not a valid image"], 400);
}

// Move uploaded file
if (!move_uploaded_file($file["tmp_name"], $target)) {
    error_log("Failed to move uploaded file to: " . $target);
    jsonResponse(["error" => "Failed to save file"], 500);
}

// Set proper file permissions
chmod($target, 0644);

jsonResponse([
    "success" => true,
    "url" => $uploadConfig['base_url'] . $safeName,
    "filename" => $safeName
]);
?>