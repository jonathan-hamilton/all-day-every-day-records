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

$config = getConfig();
$uploadConfig = $config['upload'];

// Validate file upload
if (!isset($_FILES["file"])) {
    jsonResponse(["error" => "No file uploaded"], 400);
}

$file = $_FILES["file"];
$validation = validateUpload($file);

if (isset($validation["error"])) {
    jsonResponse($validation, 400);
}

$ext = $validation["extension"];

// Generate secure filename
$safeName = uniqid("cover_", true) . "." . $ext;
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
