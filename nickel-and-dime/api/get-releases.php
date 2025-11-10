<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

$conn = getDBConnection();

// Check if admin param is present (no auth required for public viewing)
$isAdmin = isset($_GET["admin"]) && $_GET["admin"] === "true";

// If admin mode, require authentication
if ($isAdmin) {
    requireAuth();
}

try {
    if ($isAdmin) {
        // Admin view: show all releases including removed ones
        $sql = "SELECT * FROM releases 
                ORDER BY 
                    CASE 
                        WHEN tag = 'featured' THEN 1 
                        WHEN tag = 'new' THEN 2 
                        WHEN tag = 'removed' THEN 4 
                        ELSE 3 
                    END, 
                    artist ASC";
        $stmt = $conn->prepare($sql);
    } else {
        // Public view: exclude removed releases
        $sql = "SELECT * FROM releases 
                WHERE tag != 'removed' OR tag IS NULL
                ORDER BY 
                    CASE 
                        WHEN tag = 'featured' THEN 1 
                        WHEN tag = 'new' THEN 2 
                        ELSE 3 
                    END, 
                    artist ASC";
        $stmt = $conn->prepare($sql);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $releases = [];
    while ($row = $result->fetch_assoc()) {
        // Extract only the year from release_date
        if (isset($row['release_date']) && !empty($row['release_date']) && $row['release_date'] !== '0000-00-00') {
            // For YYYY-MM-DD format, extract just the year
            if (strpos($row['release_date'], '-') !== false) {
                $dateParts = explode('-', $row['release_date']);
                $row['release_date'] = $dateParts[0]; // Just the year
            } else {
                // For other formats, try to extract year
                $timestamp = strtotime($row['release_date']);
                if ($timestamp !== false) {
                    $row['release_date'] = date('Y', $timestamp);
                }
            }
        }
        
        $releases[] = $row;
    }
    
    jsonResponse([
        "success" => true,
        "releases" => $releases
    ]);
    
} catch (Exception $e) {
    error_log("Exception in get-releases: " . $e->getMessage());
    jsonResponse(["error" => "Failed to fetch releases"], 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
    CASE tag
        WHEN 'featured' THEN 1
        WHEN 'new' THEN 2
        WHEN '' THEN 3
        WHEN 'removed' THEN 4
        ELSE 5
    END,
    release_date DESC;
    "
  : "SELECT * FROM releases WHERE tag != 'removed' OR tag IS NULL ORDER BY release_date DESC";

$result = $conn->query($sql);
$releases = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    $releases[] = $row;
  }
  echo json_encode(["success" => true, "releases" => $releases]);
} else {
  http_response_code(500);
  echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
?>
