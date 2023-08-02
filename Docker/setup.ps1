# Call the image-builder script
& .\image-builder.sh

# Check the exit status of the image-builder script
if ($LASTEXITCODE -eq 0) {
  Write-Host "Image build successful. Starting Docker Compose..."
  docker-compose up
} else {
  Write-Host "Image build failed. Exiting..."
}
