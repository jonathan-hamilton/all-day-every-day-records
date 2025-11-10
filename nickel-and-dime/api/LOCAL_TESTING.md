# PHP Local Testing Setup

## Quick Start with Downloaded PHP

1. Download PHP from: https://windows.php.net/download/
2. Extract to C:\php
3. Navigate to your php-files directory
4. Run local server:

```bash
C:\php\php.exe -S localhost:8000
```

## Test URLs (after starting server):

- Health check: http://localhost:8000/get-releases.php
- Homepage releases: http://localhost:8000/get-homepage-releases.php
- Login test: http://localhost:8000/login.php (POST request)

## Testing with cURL or Postman:

### Get Releases:
```bash
curl http://localhost:8000/get-releases.php
```

### Test Login:
```bash
curl -X POST http://localhost:8000/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'
```

### Test Upload (after login):
```bash
curl -X POST http://localhost:8000/upload-image.php \
  -F "file=@path/to/image.jpg" \
  -b "PHPSESSID=your_session_id"
```

## Using with Frontend:

Update your frontend API URLs to:
- Development: http://localhost:8000/
- Production: https://nickelanddimerecords.com/api/

## Note:
Make sure to update the CORS origins in config.php to include:
- http://localhost:8000 (for PHP server)
- http://localhost:5173 (for your React dev server)