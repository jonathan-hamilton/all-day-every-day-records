# PHP Backend CORS Configuration for Hybrid Development

## Overview

To support hybrid development mode (frontend local + backend production), the PHP backend must be configured to allow CORS (Cross-Origin Resource Sharing) requests from localhost development servers.

## Required CORS Configuration

### PHP Headers for Development

Add the following headers to your PHP API endpoints when `$_ENV['ENVIRONMENT'] === 'development'` or when detecting localhost origins:

```php
<?php
// CORS configuration for development
function setCorsHeaders() {
    $allowedOrigins = [
        'http://localhost:5173',  // Vite dev server default
        'http://localhost:3000',  // Alternative dev port
        'http://127.0.0.1:5173',  // Localhost alternative
        'https://localhost:5173'  // HTTPS dev server
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Call this function at the start of each API endpoint
setCorsHeaders();
?>
```

### Environment-Based CORS

```php
<?php
// config.php
$corsConfig = [
    'development' => [
        'origins' => [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'https://localhost:5173'
        ],
        'credentials' => true
    ],
    'production' => [
        'origins' => [
            'https://alldayeverydayrecords.com',
            'https://www.alldayeverydayrecords.com'
        ],
        'credentials' => true
    ]
];

function applyCorsPolicy($environment = 'production') {
    global $corsConfig;
    
    $config = $corsConfig[$environment] ?? $corsConfig['production'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $config['origins'])) {
        header("Access-Control-Allow-Origin: $origin");
        
        if ($config['credentials']) {
            header('Access-Control-Allow-Credentials: true');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
    
    // Handle OPTIONS preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>
```

## Security Considerations

### Development vs Production

1. **Development Environment:**
   - Allow localhost origins for frontend development
   - Enable CORS credentials for authentication testing
   - Consider IP restrictions for additional security

2. **Production Environment:**
   - Restrict origins to production domain only
   - Disable development-specific CORS configurations
   - Use HTTPS-only origins

### Implementation Example

```php
<?php
// At the top of each API endpoint file
require_once 'config.php';

// Determine environment
$environment = $_ENV['ENVIRONMENT'] ?? 'production';

// Apply appropriate CORS policy
applyCorsPolicy($environment);

// Continue with API logic...
?>
```

## Testing CORS Configuration

### Frontend Development Testing

1. Start the React development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Verify CORS headers in browser DevTools:
   - Open Network tab
   - Make API requests
   - Check response headers for `Access-Control-Allow-Origin`

3. Test different request types:
   - GET requests (simple requests)
   - POST requests with JSON (preflight required)
   - Requests with authentication headers

### Troubleshooting Common Issues

1. **CORS Error: "No 'Access-Control-Allow-Origin' header"**
   - Verify the origin is in the allowed origins list
   - Check that CORS headers are being set before any output

2. **Preflight Request Failing**
   - Ensure OPTIONS method is handled
   - Verify all required headers are allowed

3. **Credentials Not Working**
   - Check `Access-Control-Allow-Credentials: true` is set
   - Verify frontend is sending credentials with requests

## Environment Variables

Add to PHP environment configuration:

```env
# PHP .env file
ENVIRONMENT=development
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_ALLOW_CREDENTIALS=true
```

## Frontend API Service Configuration

Update the frontend API service to handle CORS properly:

```typescript
// src/services/api.ts
const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  withCredentials: true, // Important for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
  }
};
```

## Next Steps

1. Implement CORS configuration in PHP backend
2. Test hybrid development mode with frontend local + backend production
3. Verify all API endpoints work with CORS enabled
4. Document any additional CORS requirements for specific features

## Benefits of This Configuration

✅ **Rapid Frontend Development**: Hot reload and fast iteration  
✅ **Stable Backend**: Production data and functionality  
✅ **Minimal Setup**: No local database or PHP environment required  
✅ **Real-World Testing**: Develop against actual production API behavior  
✅ **Team Collaboration**: Consistent backend state across development team  

This configuration enables efficient development workflows while maintaining security and proper separation of concerns between frontend and backend development.