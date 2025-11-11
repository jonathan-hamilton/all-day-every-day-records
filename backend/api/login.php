<?php
require_once __DIR__ . '/security.php';

// Handle CORS
handleCORS();

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Only POST method allowed"], 405);
}

// Rate limiting
if (!checkRateLimit($_SERVER['REMOTE_ADDR'], 5, 900)) {
    jsonResponse(["error" => "Too many login attempts. Please try again later."], 429);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonResponse(["error" => "Invalid JSON input"], 400);
}

$input = sanitizeInput($input);

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    jsonResponse(["error" => "Username and password are required"], 400);
}

$config = getConfig();

try {
    // For development, use simple hardcoded credentials
    // In production, this would check against a users table
    if ($config['debug']) {
        // Development credentials
        $validCredentials = [
            'admin' => 'admin123',
            'dev' => 'dev123'
        ];
        
        if (isset($validCredentials[$username]) && $validCredentials[$username] === $password) {
            // Set session cookie params
            $isDevelopment = in_array($_SERVER['HTTP_ORIGIN'] ?? '', ['http://localhost:5173', 'http://127.0.0.1:5173']);
            
            if ($isDevelopment) {
                ini_set('session.cookie_secure', '0');
                ini_set('session.cookie_httponly', '1');
                ini_set('session.cookie_samesite', 'None');
            } else {
                ini_set('session.cookie_secure', '1');
                ini_set('session.cookie_httponly', '1');
                ini_set('session.cookie_samesite', 'None');
            }
            
            session_start();
            
            $_SESSION['user'] = [
                'id' => 1,
                'username' => $username,
                'is_admin' => true,
                'login_time' => time()
            ];
            
            jsonResponse([
                "success" => true,
                "message" => "Login successful",
                "user" => [
                    'username' => $username,
                    'is_admin' => true
                ]
            ]);
        }
    } else {
        // Production: check against database
        $db = getDBConnection();
        
        $sql = "SELECT id, username, password_hash, is_admin 
                FROM users 
                WHERE username = ? AND is_active = 1";
        
        $user = $db->queryOne($sql, [$username]);
        
        if ($user && password_verify($password, $user['password_hash'])) {
            // Set session cookie params
            ini_set('session.cookie_secure', '1');
            ini_set('session.cookie_httponly', '1');
            ini_set('session.cookie_samesite', 'None');
            
            session_start();
            
            $_SESSION['user'] = [
                'id' => $user['id'],
                'username' => $user['username'],
                'is_admin' => (bool)$user['is_admin'],
                'login_time' => time()
            ];
            
            // Update last login time
            $db->execute("UPDATE users SET last_login = NOW() WHERE id = ?", [$user['id']]);
            
            jsonResponse([
                "success" => true,
                "message" => "Login successful",
                "user" => [
                    'username' => $user['username'],
                    'is_admin' => (bool)$user['is_admin']
                ]
            ]);
        }
    }
    
    // Invalid credentials
    logError("Invalid login attempt", ['username' => $username, 'ip' => $_SERVER['REMOTE_ADDR']]);
    jsonResponse(["error" => "Invalid username or password"], 401);
    
} catch (Exception $e) {
    logError("Exception in login", ['error' => $e->getMessage(), 'username' => $username]);
    jsonResponse(["error" => "Login failed"], 500);
}
?>