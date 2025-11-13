# Quick Fix: Backend Connection Refused

## The Problem

You're seeing: `POST http://192.168.88.196:8000/api/login net::ERR_CONNECTION_REFUSED`

This means your backend server is not accessible from your mobile device.

## The Solution (Choose One)

### Option 1: Use the Fix Script (Easiest)

```powershell
.\fix-mobile-connection.ps1
```

This will:
- Stop any existing servers
- Update configuration files
- Start backend on `0.0.0.0:8000` (network accessible)
- Start frontend on `0.0.0.0:5173` (network accessible)

### Option 2: Manual Fix

1. **Stop current backend server** (if running)
   - Close the terminal window
   - Or press `Ctrl+C` in the terminal

2. **Start backend with network access**:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Verify it's listening correctly**:
   ```bash
   netstat -an | findstr :8000
   ```
   
   Should show: `TCP    0.0.0.0:8000` (NOT `127.0.0.1:8000`)

4. **Keep frontend running** (or restart if needed):
   ```bash
   cd frontend
   npm run dev
   ```

### Option 3: Use Mobile Startup Script

```bash
start-mobile.bat
```

or

```powershell
.\start-mobile-dev.ps1
```

## Verify It's Working

1. Check backend is listening on all interfaces:
   ```bash
   netstat -an | findstr :8000
   ```
   Should show: `0.0.0.0:8000`

2. Test from mobile:
   - Open browser on phone
   - Go to: `http://192.168.88.196:8000/api/health`
   - Should return: `{"status":"ok"}`

3. Test login:
   - Go to: `http://192.168.88.196:5173`
   - Try to login
   - Should work without connection errors

## Still Not Working?

1. **Check Windows Firewall**:
   - Allow port 8000 and 5173
   - See MOBILE_ACCESS_SETUP.md for details

2. **Verify IP address**:
   ```bash
   ipconfig
   ```
   Make sure it matches `192.168.88.196`

3. **Check .env files**:
   - `frontend/.env`: `VITE_API_BASE_URL=http://192.168.88.196:8000/api`
   - `backend/.env`: `FRONTEND_URL=http://192.168.88.196:5173`

4. **Restart both servers** after updating .env files

