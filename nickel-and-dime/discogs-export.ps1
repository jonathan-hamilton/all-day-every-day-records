# Discogs API Triple X Records Export Script
# Exports all releases from Triple X Records (Label ID: 15524) to CSV

param(
    [string]$OutputPath = ".\triple-x-releases.csv"
)

# API Configuration
$ConsumerKey = "YkqbvBhyGCzZdDCuZokI"
$ConsumerSecret = "GnJJVVcsNmkxnIuHXvGUZnNbEvQQBNOq"
$LabelId = 15524
$BaseUrl = "https://api.discogs.com"

# User Agent (required by Discogs API)
$UserAgent = "TripleXExport/1.0"

# Authentication header
$AuthHeader = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${ConsumerKey}:${ConsumerSecret}"))

Write-Host "Starting Triple X Records export..." -ForegroundColor Green
Write-Host "Label ID: $LabelId" -ForegroundColor Cyan

# Function to make API requests with rate limiting
function Invoke-DiscogsAPI {
    param(
        [string]$Url,
        [hashtable]$Headers
    )
    
    try {
        # Rate limiting - Discogs allows 60 requests per minute
        Start-Sleep -Milliseconds 1100
        
        $response = Invoke-RestMethod -Uri $Url -Headers $Headers -UserAgent $UserAgent
        return $response
    }
    catch {
        Write-Warning "API request failed: $($_.Exception.Message)"
        Write-Warning "URL: $Url"
        return $null
    }
}

# Initialize headers
$headers = @{
    "Authorization" = "Basic $AuthHeader"
    "Accept" = "application/json"
}

# Array to store all releases
$allReleases = @()
$page = 1
$perPage = 100

do {
    Write-Host "Fetching page $page..." -ForegroundColor Yellow
    
    $url = "$BaseUrl/labels/$LabelId/releases?page=$page&per_page=$perPage"
    $response = Invoke-DiscogsAPI -Url $url -Headers $headers
    
    if ($response -and $response.releases) {
        Write-Host "Found $($response.releases.Count) releases on page $page" -ForegroundColor Green
        
        foreach ($release in $response.releases) {
            # Create a custom object with all the fields we want
            $releaseObj = [PSCustomObject]@{
                DiscogsId = $release.id
                CatalogNumber = $release.catno
                Title = $release.title
                Artist = $release.artist
                Year = $release.year
                Format = $release.format
                Status = $release.status
                ResourceUrl = $release.resource_url
                Role = $release.role
                Thumb = $release.thumb
            }
            
            $allReleases += $releaseObj
        }
        
        # Check if there are more pages
        $hasMorePages = $response.pagination.pages -gt $page
        $page++
    }
    else {
        Write-Warning "No response or releases found for page $page"
        $hasMorePages = $false
    }
    
} while ($hasMorePages)

Write-Host "`nTotal releases found: $($allReleases.Count)" -ForegroundColor Green

if ($allReleases.Count -gt 0) {
    # Export to CSV
    Write-Host "Exporting to CSV: $OutputPath" -ForegroundColor Cyan
    $allReleases | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8
    
    Write-Host "`nExport completed successfully!" -ForegroundColor Green
    Write-Host "File saved: $OutputPath" -ForegroundColor Cyan
    Write-Host "Total releases exported: $($allReleases.Count)" -ForegroundColor Green
    
    # Show sample of data
    Write-Host "`nFirst 5 releases:" -ForegroundColor Yellow
    $allReleases | Select-Object -First 5 | Format-Table -AutoSize
}
else {
    Write-Warning "No releases found to export."
}

# Optional: Open the CSV file
$openFile = Read-Host "`nWould you like to open the CSV file? (y/n)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    if (Test-Path $OutputPath) {
        Start-Process $OutputPath
    }
}

Write-Host "`nScript completed." -ForegroundColor Green