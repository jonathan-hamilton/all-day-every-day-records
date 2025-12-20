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
        'upload_dir' => '/var/www/html/uploads/audio/',
        'base_url' => 'https://alldayeverydayrecords.com/release-audio/',  // Production URL for frontend compatibility
        'max_size' => 2 * 1024 * 1024,  // 2MB
        'allowed_types' => ['audio/mpeg', 'audio/mp3'],
        'allowed_extensions' => ['mp3']
    ];
} else {
    // Production: Direct upload to domain file system
    $uploadConfig = [
        'upload_dir' => '/home/dh_9d47dc/alldayeverydayrecords.com/release-audio/',
        'base_url' => 'https://alldayeverydayrecords.com/release-audio/',
        'max_size' => 2 * 1024 * 1024,  // 2MB
        'allowed_types' => ['audio/mpeg', 'audio/mp3'],
        'allowed_extensions' => ['mp3']
    ];
}

// Validate file upload
if (!isset($_FILES["file"])) {
    jsonResponse(["error" => "No file uploaded"], 400);
}

$file = $_FILES["file"];

// Validate release_id parameter
if (!isset($_POST["release_id"]) || !is_numeric($_POST["release_id"])) {
    jsonResponse(["error" => "Invalid or missing release_id"], 400);
}

$releaseId = intval($_POST["release_id"]);

// Validate file size
if ($file["size"] > $uploadConfig['max_size']) {
    jsonResponse(["error" => "File too large. Maximum size is 2MB"], 400);
}

// Validate file type
$fileType = $file["type"];
if (!in_array($fileType, $uploadConfig['allowed_types'])) {
    jsonResponse(["error" => "Invalid file type. Only MP3 files are allowed"], 400);
}

// Validate file extension
$fileExtension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
if (!in_array($fileExtension, $uploadConfig['allowed_extensions'])) {
    jsonResponse(["error" => "Invalid file extension. Only .mp3 files are allowed"], 400);
}

// Generate secure filename based on release ID
$safeName = "{$releaseId}_audio.mp3";
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

// Delete existing audio file if it exists (handle replacement)
if (file_exists($target)) {
    if (!unlink($target)) {
        error_log("Failed to delete existing audio file: " . $target);
        jsonResponse(["error" => "Failed to replace existing audio file"], 500);
    }
}

// Move uploaded file to target location
if (!move_uploaded_file($file["tmp_name"], $target)) {
    error_log("Failed to move uploaded file to: " . $target);
    jsonResponse(["error" => "Failed to upload file"], 500);
}

// Generate the public URL for the audio file
$audioUrl = $uploadConfig['base_url'] . $safeName;

// Return success response with audio URL
jsonResponse([
    "success" => true,
    "audio_url" => $audioUrl,
    "filename" => $safeName,
    "message" => "Audio file uploaded successfully"
], 200);
