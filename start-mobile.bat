@echo off
echo ========================================
echo   Mobile Development Server Launcher
echo ========================================
echo.

REM Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo Your Local IP: %IP%
echo Mobile Access: http://%IP%:5173
echo.

REM Update frontend .env
echo Updating frontend configuration...
if exist frontend\.env (
    findstr /v "VITE_API_BASE_URL" frontend\.env > frontend\.env.tmp 2>nul
    move /y frontend\.env.tmp frontend\.env >nul
)
echo VITE_API_BASE_URL=http://%IP%:8000/api >> frontend\.env

REM Update backend .env
echo Updating backend configuration...
if exist backend\.env (
    findstr /v "FRONTEND_URL" backend\.env > backend\.env.tmp 2>nul
    move /y backend\.env.tmp backend\.env >nul
)
echo FRONTEND_URL=http://%IP%:5173 >> backend\.env

echo Configuration updated!
echo.

REM Start backend server
echo Starting Laravel backend server...
start "Laravel Backend" cmd /k "cd backend && php artisan serve --host=0.0.0.0 --port=8000"

timeout /t 3 /nobreak >nul

REM Start frontend server
echo Starting Vite frontend server...
start "Vite Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo.
echo On your mobile device:
echo   1. Connect to the same Wi-Fi network
echo   2. Open browser: http://%IP%:5173
echo.
echo Press any key to exit...
pause >nul

