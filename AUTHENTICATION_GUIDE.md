# Authentication & Role-Based Access Control Guide

## Overview

The application now includes full authentication with Laravel Sanctum and role-based access control. Users must log in to access the dashboard, and permissions are enforced based on their role (admin or recruiter).

---

## Backend Implementation

### Authentication Routes

**Public Routes:**
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and receive token

**Protected Routes (require authentication):**
- `POST /api/logout` - Logout and revoke token
- `GET /api/user` - Get authenticated user information

### Credential Routes with Role-Based Access

**All Authenticated Users:**
- `GET /api/credentials` - List credentials (recruiters see only their own)
- `GET /api/credentials/{id}` - View single credential

**Admin Only:**
- `POST /api/credentials` - Create new credential
- `PUT /api/credentials/{id}` - Update credential
- `DELETE /api/credentials/{id}` - Delete credential

### Middleware

1. **`auth:sanctum`** - Ensures user is authenticated
2. **`role.admin`** - Ensures user has admin role
3. **`role.recruiter`** - Ensures user has recruiter role

### Role-Based Permissions

#### Admin
- ✅ Full CRUD access to all credentials
- ✅ Can create, edit, and delete any credential
- ✅ Can view all credentials
- ✅ Receives daily summary emails

#### Recruiter
- ✅ Can view their own credentials only
- ✅ Can export credentials (CSV)
- ❌ Cannot create, edit, or delete credentials
- ✅ Receives reminder emails for their credentials

---

## Frontend Implementation

### Authentication Context

**Location:** `frontend/src/contexts/AuthContext.jsx`

**Features:**
- Manages authentication state
- Handles login, register, and logout
- Persists token in localStorage
- Auto-verifies token on app load
- Provides user information and role helpers

**Usage:**
```jsx
import { useAuth } from '../contexts/AuthContext';

const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
```

### Login Page

**Location:** `frontend/src/pages/Login.jsx`

**Features:**
- Login form with email and password
- Registration form (toggle)
- Role selection during registration
- Test credentials display
- Error handling and validation

**Test Credentials:**
- **Admin:** admin@example.com / password
- **Recruiter:** recruiter@example.com / password

### Protected Routes

**Location:** `frontend/src/components/ProtectedRoute.jsx`

**Features:**
- Redirects unauthenticated users to login
- Shows loading state during auth check
- Optional admin-only protection
- Access denied page for unauthorized users

**Usage:**
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

<ProtectedRoute requireAdmin>
  <AdminPanel />
</ProtectedRoute>
```

### Axios Interceptors

**Location:** `frontend/src/config/api.js`

**Request Interceptor:**
- Automatically adds `Authorization: Bearer {token}` header to all requests
- Retrieves token from localStorage

**Response Interceptor:**
- Handles 401 (Unauthorized) errors
- Clears token and redirects to login on authentication failure

---

## Authentication Flow

### Login Flow
1. User enters email and password
2. Frontend sends POST request to `/api/login`
3. Backend validates credentials
4. Backend generates Sanctum token
5. Frontend stores token in localStorage
6. Frontend sets token in Axios headers
7. User is redirected to dashboard

### Token Persistence
- Token stored in `localStorage` as `auth_token`
- Token automatically added to all API requests
- Token verified on app load
- Invalid tokens are cleared automatically

### Logout Flow
1. User clicks logout
2. Frontend sends POST request to `/api/logout`
3. Backend revokes token
4. Frontend clears token from localStorage
5. Frontend removes token from Axios headers
6. User is redirected to login

---

## Role-Based UI

### Dashboard Features by Role

#### Admin
- ✅ "Add New Credential" button visible
- ✅ Edit button on each credential
- ✅ Delete button on each credential
- ✅ Can see all credentials

#### Recruiter
- ❌ "Add New Credential" button hidden
- ❌ Edit button hidden
- ❌ Delete button hidden
- ✅ Can see only their own credentials
- ✅ Can export credentials (CSV)

### Topbar
- Shows user name and role
- Logout button for all users
- "Add New" button only for admins

---

## API Request Examples

### Login
```javascript
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}

Response:
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "1|xxxxxxxxxxxxx",
  "message": "Login successful"
}
```

### Register
```javascript
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "recruiter"
}
```

### Get Authenticated User
```javascript
GET /api/user
Authorization: Bearer {token}

Response:
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Create Credential (Admin Only)
```javascript
POST /api/credentials
Authorization: Bearer {token}
Content-Type: application/json

{
  "candidate_name": "Jane Doe",
  "position": "Nurse",
  "credential_type": "Professional License",
  "issue_date": "2024-01-01",
  "expiry_date": "2025-01-01",
  "email": "jane@example.com"
}
```

---

## Security Features

### Backend
- ✅ Password hashing (bcrypt)
- ✅ Token-based authentication (Sanctum)
- ✅ Role-based middleware protection
- ✅ Input validation on all endpoints
- ✅ CORS configuration for frontend

### Frontend
- ✅ Token stored securely in localStorage
- ✅ Automatic token injection in requests
- ✅ Automatic logout on 401 errors
- ✅ Protected routes with redirects
- ✅ Role-based UI rendering

---

## Testing Authentication

### Test Users

After running `php artisan db:seed`, you'll have:

1. **Admin User**
   - Email: `admin@example.com`
   - Password: `password`
   - Role: `admin`

2. **Recruiter User**
   - Email: `recruiter@example.com`
   - Password: `password`
   - Role: `recruiter`

### Testing Flow

1. **Login as Admin:**
   - Go to `/login`
   - Enter admin credentials
   - Should see "Add New" button
   - Should see Edit/Delete buttons on credentials
   - Should see all credentials

2. **Login as Recruiter:**
   - Go to `/login`
   - Enter recruiter credentials
   - Should NOT see "Add New" button
   - Should NOT see Edit/Delete buttons
   - Should see only their own credentials

3. **Test Protected Routes:**
   - Try accessing `/dashboard` without login
   - Should redirect to `/login`
   - After login, should access dashboard

4. **Test Token Expiration:**
   - Login and get token
   - Manually delete token from localStorage
   - Try to access dashboard
   - Should redirect to login

---

## Troubleshooting

### Common Issues

**1. "Unauthorized" errors**
- Check if token is in localStorage
- Verify token is being sent in Authorization header
- Check if user is authenticated in backend

**2. "403 Forbidden" errors**
- Verify user has correct role
- Check middleware is applied correctly
- Ensure route requires correct role

**3. Token not persisting**
- Check localStorage is enabled
- Verify token is saved after login
- Check browser console for errors

**4. Redirect loop**
- Clear localStorage
- Check ProtectedRoute logic
- Verify login route is accessible

---

## Files Modified/Created

### Backend
- `app/Http/Controllers/Api/AuthController.php` - Authentication logic
- `app/Http/Middleware/EnsureUserIsAdmin.php` - Admin middleware
- `app/Http/Middleware/EnsureUserIsRecruiter.php` - Recruiter middleware
- `routes/api.php` - Updated with auth routes and protection
- `bootstrap/app.php` - Registered middleware aliases
- `app/Http/Controllers/Api/CredentialController.php` - Added role checks

### Frontend
- `src/contexts/AuthContext.jsx` - Auth state management
- `src/pages/Login.jsx` - Login/Register page
- `src/components/ProtectedRoute.jsx` - Route protection
- `src/config/api.js` - Axios interceptors
- `src/App.jsx` - Updated routing
- `src/components/Layout/Topbar.jsx` - Added logout and role display
- `src/pages/Dashboard.jsx` - Role-based UI rendering

---

## Next Steps

### Potential Enhancements
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Remember me option
- [ ] Session timeout handling
- [ ] Multi-factor authentication
- [ ] Activity logging
- [ ] User management panel (admin)

---

**Status:** ✅ Complete and Ready for Use


