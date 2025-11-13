# Troubleshooting Guide

## Common Issues and Solutions

### 1. Connection Refused Error (ERR_CONNECTION_REFUSED)

**Error**: `Failed to load resource: net::ERR_CONNECTION_REFUSED` on `192.168.88.196:8000`

**Cause**: Backend server is only listening on localhost (127.0.0.1), not on the network interface.

**Solution**:

1. **Stop the current backend server** (if running)
   - Close the terminal window running `php artisan serve`
   - Or press `Ctrl+C` in that terminal

2. **Restart backend with network access**:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Verify it's listening on all interfaces**:
   ```bash
   netstat -an | findstr :8000
   ```
   Should show: `TCP    0.0.0.0:8000         0.0.0.0:0              LISTENING`

4. **Use the automated script** (recommended):
   ```bash
   start-mobile.bat
   ```
   or
   ```powershell
   .\start-mobile-dev.ps1
   ```

### 2. Chrome Extension Errors

**Error**: `Denying load of <URL>. Resources must be listed in the web_accessible_resources manifest key`

**Cause**: Browser extensions trying to inject scripts. This is normal and doesn't affect your app.

**Solution**: These can be safely ignored. They're from browser extensions (ad blockers, password managers, etc.) and don't impact your application.

### 3. Google Analytics Blocked

**Error**: `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT` for `google-analytics.com`

**Cause**: Ad blocker or privacy extension blocking analytics.

**Solution**: This is expected behavior if you have an ad blocker. It doesn't affect your app functionality.

### 4. CSP Violations for External Sites

**Error**: `Framing 'https://www.wps.com/' violates the following Content Security Policy directive`

**Cause**: External websites trying to be embedded. Not related to your app.

**Solution**: These are from other websites, not your application. Can be ignored.

### 5. Frontend Can't Connect to Backend

**Symptoms**:
- Login fails with connection error
- API calls return `ERR_CONNECTION_REFUSED`
- Network tab shows failed requests to `192.168.88.196:8000`

**Solutions**:

1. **Check backend is running**:
   ```bash
   netstat -an | findstr :8000
   ```

2. **Check backend is listening on 0.0.0.0**:
   - Should show `0.0.0.0:8000`, not `127.0.0.1:8000`

3. **Check Windows Firewall**:
   - Allow port 8000 in Windows Firewall
   - See MOBILE_ACCESS_SETUP.md for instructions

4. **Verify .env files**:
   - `frontend/.env` should have: `VITE_API_BASE_URL=http://192.168.88.196:8000/api`
   - `backend/.env` should have: `FRONTEND_URL=http://192.168.88.196:5173`

5. **Restart both servers**:
   ```bash
   # Stop all servers (Ctrl+C in each terminal)
   # Then restart using the mobile script
   start-mobile.bat
   ```

### 6. CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
2. Clear config cache: `php artisan config:clear`
3. Restart backend server

### 7. Port Already in Use

**Error**: `Address already in use` or port conflict

**Solution**:
1. Find process using the port:
   ```bash
   netstat -ano | findstr :8000
   ```
2. Kill the process (replace PID with actual process ID):
   ```bash
   taskkill /PID <PID> /F
   ```
3. Or use a different port:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8001
   ```
   (Update frontend .env accordingly)

### 8. Mobile Device Can't Find Server

**Symptoms**: Mobile browser shows "This site can't be reached"

**Solutions**:
1. **Verify same Wi-Fi network**: Phone and computer must be on the same network
2. **Check IP address**: Run `ipconfig` to get current IP
3. **Update .env files** with correct IP
4. **Check firewall**: Windows Firewall may be blocking connections
5. **Try ping**: From phone, try to ping the computer's IP address

### Quick Fix Checklist

1. ✅ Backend running with `--host=0.0.0.0`?
2. ✅ Frontend running with `host: '0.0.0.0'` in vite.config.js?
3. ✅ Both .env files updated with correct IP?
4. ✅ Windows Firewall allows ports 8000 and 5173?
5. ✅ Phone on same Wi-Fi network?
6. ✅ Backend shows `0.0.0.0:8000` in netstat?

### Still Having Issues?

1. Check backend logs: `backend/storage/logs/laravel.log`
2. Check browser console for specific errors
3. Verify network connectivity: `ping 192.168.88.196` from phone
4. Try accessing backend directly: `http://192.168.88.196:8000/api/health`

