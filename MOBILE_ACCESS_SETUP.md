# Mobile Access Setup Guide

## Your Local IP Address
**192.168.88.196**

## Steps to Access on Mobile Phone

### 1. Frontend Setup

Create a `.env` file in the `frontend` folder with:
```
VITE_API_BASE_URL=http://192.168.88.196:8000/api
```

### 2. Backend Setup

Update your `backend/.env` file to include:
```
FRONTEND_URL=http://192.168.88.196:5173
```

### 3. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access on Mobile

1. Make sure your phone is connected to the **same Wi-Fi network** as your computer
2. Open a browser on your phone
3. Navigate to: **http://192.168.88.196:5173**

### 5. Troubleshooting

- **Can't connect?** Check Windows Firewall settings and allow connections on ports 5173 and 8000
- **CORS errors?** The CORS config has been updated to allow local network IPs
- **IP changed?** Run `ipconfig` to get your new IP and update the `.env` files

### Firewall Configuration (Windows)

If you can't access from mobile, you may need to allow ports in Windows Firewall:

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `5173` → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name it "Vite Dev Server" → Finish

Repeat for port `8000` (Laravel backend)

