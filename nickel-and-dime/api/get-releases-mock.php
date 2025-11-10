<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Mock data for testing
$mockReleases = [
    [
        'id' => 1,
        'title' => 'Test Album 1',
        'artist' => 'Test Artist 1',
        'label' => 'Nickel and Dime',
        'format' => 'LP',
        'release_date' => '2024-01-15',
        'cover_image_url' => '/images/test1.jpg',
        'description' => 'A great test album',
        'spotify_url' => 'https://spotify.com/test1',
        'youtube_url' => '',
        'apple_music_url' => '',
        'amazon_music_url' => '',
        'tag' => 'featured'
    ],
    [
        'id' => 2,
        'title' => 'Test Album 2',
        'artist' => 'Test Artist 2',
        'label' => 'Nickel and Dime', // Changed from Triple X to test empty state
        'format' => 'CD',
        'release_date' => '2024-02-20',
        'cover_image_url' => '/images/test2.jpg',
        'description' => 'Another test album',
        'spotify_url' => '',
        'youtube_url' => 'https://youtube.com/test2',
        'apple_music_url' => '',
        'amazon_music_url' => '',
        'tag' => 'new'
    ],
    [
        'id' => 3,
        'title' => 'Test Album 3',
        'artist' => 'Test Artist 3',
        'label' => 'Nickel and Dime', // Changed from Ransom Note to test empty state
        'format' => 'Digital',
        'release_date' => '2024-03-10',
        'cover_image_url' => '/images/test3.jpg',
        'description' => 'Third test album',
        'spotify_url' => '',
        'youtube_url' => '',
        'apple_music_url' => 'https://music.apple.com/test3',
        'amazon_music_url' => '',
        'tag' => ''
    ]
];

// Check if admin param is present
$isAdmin = isset($_GET["admin"]) && $_GET["admin"] === "true";

// If admin mode, require authentication (skip for testing)
if ($isAdmin && !isset($_GET['skip_auth'])) {
    try {
        requireAuth();
    } catch (Exception $e) {
        // For testing, return mock data even if auth fails
        if (!isset($_GET['test_mode'])) {
            jsonResponse(["error" => "Authentication required. Add ?skip_auth=1&test_mode=1 for testing"], 401);
        }
    }
}

if ($isAdmin) {
    // Admin view: show all releases including removed ones
    $releases = $mockReleases;
} else {
    // Public view: exclude removed releases
    $releases = array_filter($mockReleases, function($release) {
        return $release['tag'] !== 'removed';
    });
}

jsonResponse([
    "success" => true,
    "releases" => array_values($releases),
    "message" => "Mock data for local testing"
]);
?>