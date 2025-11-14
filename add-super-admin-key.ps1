# Add SUPER_ADMIN_SECRET_KEY to backend/.env

$backendEnvPath = ".\backend\.env"

if (-not (Test-Path $backendEnvPath)) {
    Write-Host "Error: backend/.env not found" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $backendEnvPath -Raw

if ($envContent -match "SUPER_ADMIN_SECRET_KEY\s*=") {
    Write-Host "SUPER_ADMIN_SECRET_KEY already exists" -ForegroundColor Yellow
    exit 0
}

# Generate secure random key
Add-Type -AssemblyName System.Security
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$secretKey = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()

# Add to .env
$newLine = "`n# Super Admin Secret Key`nSUPER_ADMIN_SECRET_KEY=$secretKey"
if ($envContent -notmatch "\n$") {
    Add-Content -Path $backendEnvPath -Value "`n"
}
Add-Content -Path $backendEnvPath -Value $newLine

Write-Host "SUPER_ADMIN_SECRET_KEY added successfully" -ForegroundColor Green
Write-Host "Key: $secretKey" -ForegroundColor Cyan

