<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

$conn = getDBConnection();

// Get and validate ID parameter
$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    jsonResponse(["error" => "Invalid or missing release ID"], 400);
}

$id = intval($id);

try {
    $stmt = $conn->prepare("SELECT * FROM releases WHERE id = ? AND (tag != 'removed' OR tag IS NULL)");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(["error" => "Release not found"], 404);
    }
    
    $release = $result->fetch_assoc();
    
    // Extract only the year from release_date
    if (isset($release['release_date']) && !empty($release['release_date']) && $release['release_date'] !== '0000-00-00') {
        // For YYYY-MM-DD format, extract just the year
        if (strpos($release['release_date'], '-') !== false) {
            $dateParts = explode('-', $release['release_date']);
            $release['release_date'] = $dateParts[0]; // Just the year
        } else {
            // For other formats, try to extract year
            $timestamp = strtotime($release['release_date']);
            if ($timestamp !== false) {
                $release['release_date'] = date('Y', $timestamp);
            }
        }
    }
    
    jsonResponse([
        "success" => true,
        "release" => $release
    ]);
    
} catch (Exception $e) {
    error_log("Exception in get-releases-by-id: " . $e->getMessage());
    jsonResponse(["error" => "Failed to fetch release"], 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
