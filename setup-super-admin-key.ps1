# Script to automatically add SUPER_ADMIN_SECRET_KEY to backend/.env

$backendEnvPath = ".\backend\.env"

if (-not (Test-Path $backendEnvPath)) {
    Write-Host "Error: backend/.env not found. Please ensure it exists." -ForegroundColor Red
    exit 1
}

# Read the .env file
$envContent = Get-Content $backendEnvPath -Raw

# Check if SUPER_ADMIN_SECRET_KEY already exists
if ($envContent -match "SUPER_ADMIN_SECRET_KEY\s*=") {
    Write-Host "SUPER_ADMIN_SECRET_KEY already exists in backend/.env" -ForegroundColor Yellow
    Write-Host "Current value: $($envContent -match 'SUPER_ADMIN_SECRET_KEY\s*=\s*(.+)' | Out-Null; $matches[1])"
    exit 0
}

# Generate a secure random key (64 characters hex)
$secretKey = -join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object { [char]$_ })

# Alternative: Use a more secure method if available
try {
    # Try to use .NET's RNGCryptoServiceProvider for better security
    Add-Type -AssemblyName System.Security
    $rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
    $bytes = New-Object byte[] 32
    $rng.GetBytes($bytes)
    $secretKey = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
} catch {
    # Fallback to random string if crypto fails
    $secretKey = -join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object { [char]$_ })
}

# Add the key to .env
$newLine = "`n# Super Admin Secret Key (for first super admin creation)`nSUPER_ADMIN_SECRET_KEY=$secretKey"

# Check if file ends with newline
if ($envContent -notmatch "\n$") {
    Add-Content -Path $backendEnvPath -Value "`n"
}

Add-Content -Path $backendEnvPath -Value $newLine

Write-Host "✓ SUPER_ADMIN_SECRET_KEY added to backend/.env" -ForegroundColor Green
Write-Host "Secret Key: $secretKey" -ForegroundColor Cyan
Write-Host "`n⚠️  IMPORTANT: Keep this key secure and do not commit it to version control!" -ForegroundColor Yellow

