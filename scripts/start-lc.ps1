# Start LOCAL-CONTAINER CORS debugging environment  
# Frontend: npm run dev (localhost:5173)
# Backend: Docker container (localhost:8080) with proper CORS headers
# Database: Production database

Write-Host "Starting CORS debugging environment..." -ForegroundColor Green
Write-Host "Frontend: npm run dev (localhost:5173)" -ForegroundColor Cyan
Write-Host "Backend: Docker container (localhost:8080) with CORS headers" -ForegroundColor Cyan
Write-Host "Database: Production database" -ForegroundColor Cyan
Write-Host ""

# Set up container environment
Write-Host "Configuring container environment..." -ForegroundColor Yellow
Copy-Item "..\\.env.local-container" "..\\.env" -Force

# Start Docker backend
Write-Host "Building and starting Docker backend..." -ForegroundColor Green
Set-Location "..\\docker"
docker-compose up -d --build
Set-Location "..\\scripts"

# Show status
Start-Sleep -Seconds 10
Write-Host ""
Write-Host "Backend container started!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "phpMyAdmin: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""

# Start Frontend with Docker API URL
Write-Host "Starting frontend with Docker API URL..." -ForegroundColor Green
Set-Location "..\\frontend"
Write-Host "Frontend API URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Starting React dev server..." -ForegroundColor Yellow
npm run dev:local