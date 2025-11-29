# Read .env file and set variables
$envContent = Get-Content .env
$clientId = ($envContent | Select-String "VITE_GOOGLE_CLIENT_ID=(.*)").Matches.Groups[1].Value
$apiKey = ($envContent | Select-String "VITE_GOOGLE_API_KEY=(.*)").Matches.Groups[1].Value

if (-not $clientId -or -not $apiKey) {
    Write-Host "Error: Could not find VITE_GOOGLE_CLIENT_ID or VITE_GOOGLE_API_KEY in .env file." -ForegroundColor Red
    exit 1
}

Write-Host "Found credentials in .env file." -ForegroundColor Green

# Stop and remove existing container
Write-Host "Stopping existing container..."
docker rm -f turtle-container 2>$null

# Build the image
Write-Host "Building Docker image..."
docker build -t turtle-app `
    --build-arg VITE_GOOGLE_CLIENT_ID=$clientId `
    --build-arg VITE_GOOGLE_API_KEY=$apiKey `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}

# Run the container
Write-Host "Starting container..."
docker run -d -p 8080:80 --name turtle-container turtle-app

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful! App is running at http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "Failed to start container." -ForegroundColor Red
}
