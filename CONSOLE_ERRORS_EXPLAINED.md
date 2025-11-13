# Console Errors Explained

## ✅ Safe to Ignore (Browser Extensions)

These errors are from browser extensions and don't affect your app:

- `Denying load of <URL>. Resources must be listed in the web_accessible_resources manifest key`
- `GET chrome-extension://invalid/ net::ERR_FAILED`
- `contentScript.bundle.js` errors

**Solution**: These are normal and can be ignored. They're from extensions like:
- Password managers
- Ad blockers
- Translation tools
- Other browser extensions

## ✅ Safe to Ignore (Ad Blockers)

- `POST https://www.google-analytics.com/mp/collect... net::ERR_BLOCKED_BY_CLIENT`

**Solution**: This is your ad blocker blocking Google Analytics. It doesn't affect your app functionality.

## ✅ Safe to Ignore (External Sites)

- `Framing 'https://www.wps.com/' violates the following Content Security Policy directive`

**Solution**: This is from external websites trying to be embedded. Not related to your app.

## ❌ Action Required (Backend Connection)

**Error**: `POST http://192.168.88.196:8000/api/login net::ERR_CONNECTION_REFUSED`

**Cause**: Backend server is not running or not accessible on network IP.

**Solution**: See below.

---

## How to Filter Console Errors

### Chrome DevTools

1. Open DevTools (F12)
2. Go to Console tab
3. Click the filter icon (funnel)
4. Add filter: `-chrome-extension -google-analytics -wps.com`
5. This hides extension and external site errors

### Or Use Console Filter

Type in console filter box:
```
-extension -analytics -wps -chrome-extension
```

This will hide all extension-related errors and show only your app's errors.

---

## Focus on Real Issues

The only error that matters for your app is:
- `ERR_CONNECTION_REFUSED` on your backend URL

Fix this by ensuring the backend is running with `--host=0.0.0.0`.

