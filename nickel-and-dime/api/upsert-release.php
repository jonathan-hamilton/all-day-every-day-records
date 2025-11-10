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

$conn = getDBConnection();

// Get and validate input data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    jsonResponse(["error" => "Invalid JSON data"], 400);
}

// Required fields validation
$requiredFields = ['title', 'artist', 'label', 'format', 'release_date', 'description'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        jsonResponse(["error" => "Missing required field: $field"], 400);
    }
}

// Sanitize all input data
$sanitized = sanitizeInput($data, $conn);

$title = $sanitized["title"];
$artist = $sanitized["artist"];
$label = $sanitized["label"];
$format = $sanitized["format"];
$release_date = $sanitized["release_date"];
$cover_image_url = $sanitized["cover_image_url"] ?? '';
$description = $sanitized["description"];
$spotify_url = $sanitized["spotify_url"] ?? '';
$youtube_url = $sanitized["youtube_url"] ?? '';
$apple_music_url = $sanitized["apple_music_url"] ?? '';
$amazon_music_url = $sanitized["amazon_music_url"] ?? '';
$tag = $sanitized["tag"] ?? '';

$hasId = isset($data["id"]) && is_numeric($data["id"]);
$id = $hasId ? intval($data["id"]) : null;

try {
    if ($hasId) {
        // Verify the release exists before updating
        $checkStmt = $conn->prepare("SELECT id FROM releases WHERE id = ?");
        $checkStmt->bind_param("i", $id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            jsonResponse(["error" => "Release not found"], 404);
        }
        $checkStmt->close();
        
        // Update existing release
        $stmt = $conn->prepare("UPDATE releases SET
            title = ?, artist = ?, label = ?, format = ?, release_date = ?,
            cover_image_url = ?, description = ?, spotify_url = ?, youtube_url = ?,
            apple_music_url = ?, amazon_music_url = ?, tag = ?
            WHERE id = ?");

        $stmt->bind_param(
            "ssssssssssssi",
            $title,
            $artist,
            $label,
            $format,
            $release_date,
            $cover_image_url,
            $description,
            $spotify_url,
            $youtube_url,
            $apple_music_url,
            $amazon_music_url,
            $tag,
            $id
        );
    } else {
        // Create new release
        $stmt = $conn->prepare("INSERT INTO releases (
            title, artist, label, format, release_date, cover_image_url,
            description, spotify_url, youtube_url, apple_music_url, amazon_music_url, tag
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->bind_param(
            "ssssssssssss",
            $title,
            $artist,
            $label,
            $format,
            $release_date,
            $cover_image_url,
            $description,
            $spotify_url,
            $youtube_url,
            $apple_music_url,
            $amazon_music_url,
            $tag
        );
    }

    if ($stmt->execute()) {
        $responseData = ["success" => true];
        if (!$hasId) {
            $responseData["id"] = $conn->insert_id;
        }
        jsonResponse($responseData);
    } else {
        error_log("Database error in upsert-release: " . $stmt->error);
        jsonResponse(["error" => "Failed to save release"], 500);
    }

} catch (Exception $e) {
    error_log("Exception in upsert-release: " . $e->getMessage());
    jsonResponse(["error" => "Internal server error"], 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
