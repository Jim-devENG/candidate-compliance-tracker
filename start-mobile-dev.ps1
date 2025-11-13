# Mobile Development Server Startup Script
# This script starts both frontend and backend servers for mobile access

Write-Host "🚀 Starting Mobile Development Servers..." -ForegroundColor Green
Write-Host ""

# Get local IP address
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.16*" } | Select-Object -First 1).IPAddress

if (-not $ipAddress) {
    Write-Host "⚠️  Could not detect local IP address. Using 192.168.88.196" -ForegroundColor Yellow
    $ipAddress = "192.168.88.196"
}

Write-Host "📍 Your local IP: $ipAddress" -ForegroundColor Cyan
Write-Host "📱 Access on mobile: http://$ipAddress`:5173" -ForegroundColor Cyan
Write-Host ""

# Update .env files
Write-Host "📝 Updating configuration files..." -ForegroundColor Yellow

# Frontend .env
$frontendEnv = "frontend\.env"
if (Test-Path $frontendEnv) {
    $content = Get-Content $frontendEnv
    if ($content -match 'VITE_API_BASE_URL') {
        $content -replace 'VITE_API_BASE_URL=.*', "VITE_API_BASE_URL=http://$ipAddress`:8000/api" | Set-Content $frontendEnv
    } else {
        "VITE_API_BASE_URL=http://$ipAddress`:8000/api" | Add-Content $frontendEnv
    }
} else {
    "VITE_API_BASE_URL=http://$ipAddress`:8000/api" | Set-Content $frontendEnv
}

# Backend .env
$backendEnv = "backend\.env"
if (Test-Path $backendEnv) {
    $content = Get-Content $backendEnv
    if ($content -match 'FRONTEND_URL') {
        ($content -replace 'FRONTEND_URL=.*', "FRONTEND_URL=http://$ipAddress`:5173") | Set-Content $backendEnv
    } else {
        $content + "FRONTEND_URL=http://$ipAddress`:5173" | Set-Content $backendEnv
    }
} else {
    "FRONTEND_URL=http://$ipAddress`:5173" | Set-Content $backendEnv
}

Write-Host "✅ Configuration updated!" -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "🔧 Starting Laravel backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; php artisan serve --host=0.0.0.0 --port=8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend server
Write-Host "⚛️  Starting Vite frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "✅ Servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 On your mobile device:" -ForegroundColor Cyan
Write-Host "   1. Connect to the same Wi-Fi network" -ForegroundColor White
Write-Host "   2. Open browser and go to: http://$ipAddress`:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

