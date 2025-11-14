@echo off
echo Adding SUPER_ADMIN_SECRET_KEY to backend/.env...
powershell -ExecutionPolicy Bypass -File "%~dp0add-super-admin-key.ps1"
pause

