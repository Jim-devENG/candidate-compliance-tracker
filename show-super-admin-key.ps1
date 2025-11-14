# Display the current SUPER_ADMIN_SECRET_KEY from backend/.env

$backendEnvPath = ".\backend\.env"

if (-not (Test-Path $backendEnvPath)) {
    Write-Host "Error: backend/.env not found." -ForegroundColor Red
    exit 1
}

$envContent = Get-Content $backendEnvPath -Raw

if ($envContent -match "SUPER_ADMIN_SECRET_KEY\s*=\s*(.+)") {
    $secretKey = $matches[1].Trim()
    Write-Host "`n✓ SUPER_ADMIN_SECRET_KEY found in backend/.env" -ForegroundColor Green
    Write-Host "`nSecret Key:" -ForegroundColor Cyan
    Write-Host $secretKey -ForegroundColor Yellow
    Write-Host "`n⚠️  Copy this key exactly (including all characters) to create the first super admin." -ForegroundColor Yellow
    Write-Host "`n"
} else {
    Write-Host "SUPER_ADMIN_SECRET_KEY not found in backend/.env" -ForegroundColor Red
    Write-Host "Run 'add-super-admin-key.bat' to generate and add it." -ForegroundColor Yellow
}

