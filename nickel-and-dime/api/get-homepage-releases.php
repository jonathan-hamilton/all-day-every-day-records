<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

$conn = getDBConnection();

try {
    // Fetch 1 featured release
    $featuredQuery = "
        SELECT * FROM releases
        WHERE tag = 'featured' AND (tag != 'removed' OR tag IS NULL)
        ORDER BY release_date DESC
        LIMIT 1
    ";

    $featured = [];
    $result = $conn->query($featuredQuery);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $featured[] = $row;
        }
    }

    // Fetch 6 newest releases (excluding any with tag = 'removed')
    $newQuery = "
        SELECT * FROM releases
        WHERE tag = 'new' AND (tag != 'removed' OR tag IS NULL)
        ORDER BY release_date DESC
        LIMIT 6
    ";

    $new = [];
    $result = $conn->query($newQuery);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $new[] = $row;
        }
    }

    jsonResponse([
        "success" => true,
        "featured" => $featured,
        "new" => $new
    ]);

} catch (Exception $e) {
    error_log("Exception in get-homepage-releases: " . $e->getMessage());
    jsonResponse(["error" => "Failed to fetch homepage releases"], 500);
} finally {
    $conn->close();
}
?>
