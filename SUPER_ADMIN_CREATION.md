# Super Admin Account Creation Guide

## Overview

Super Admin accounts have a **special creation process** that is different from regular user registration. This ensures security and proper access control.

**Super Admin** is the highest level of access in the system:
- Can create and manage admin accounts
- Can create and manage recruiter accounts  
- Can create additional super admin accounts
- Full access to User Management panel
- All admin privileges plus user management capabilities

## Two Methods for Creating Super Admin

### Method 1: First Super Admin (Secret Key)

When **no super admin exists** in the system, you can create the first one using a **secret key**.

**Steps**:
1. **Set the secret key** (choose one):
   - **Automatic**: Run `add-super-admin-key.bat` or `add-super-admin-key.ps1`
   - **Manual**: Add to `backend/.env`:
     ```env
     SUPER_ADMIN_SECRET_KEY=your-secure-secret-key-here
     ```

2. **Get the secret key** (if you need to see it):
   - Run `show-super-admin-key.bat` or `show-super-admin-key.ps1`
   - This will display the current secret key from `backend/.env`

3. Navigate to: `http://localhost:5173/create-super-admin`

4. Enter:
   - **Secret Key** (copy exactly from `backend/.env` - no spaces, all characters)
   - Full Name
   - Email
   - Password (min 8 characters)
   - Confirm Password

5. Submit the form
6. You'll be automatically logged in and redirected to the dashboard

**⚠️ Important**: The secret key must match **exactly** (case-sensitive, no extra spaces). Use `show-super-admin-key.bat` to see the exact key.

### Method 2: Additional Super Admin (Authenticated)

When **a super admin already exists**, only logged-in super admins can create additional super admin accounts.

**Steps**:
1. Log in as an existing super admin
2. Go to User Management page (`/admin/users`)
3. Click "Create Super Admin" button (purple button)
4. Fill in the form (no secret key needed)
5. Submit to create the new super admin

## Security Features

1. **Secret Key Protection**: First super admin requires a secret key from `.env`
2. **Authentication Required**: Additional super admins require existing super admin login
3. **Rate Limiting**: 3 requests per minute
4. **Input Sanitization**: All inputs are sanitized
5. **Password Hashing**: Bcrypt with 10 rounds

## Environment Configuration

### Automatic Setup

**Option 1: Run the setup script** (Recommended)
```bash
# Windows
add-super-admin-key.bat

# Or PowerShell
powershell -ExecutionPolicy Bypass -File add-super-admin-key.ps1
```

The script will:
- Check if `SUPER_ADMIN_SECRET_KEY` already exists
- Generate a secure random 64-character hex key
- Add it to `backend/.env` automatically

### Manual Setup

If you prefer to add it manually, add to `backend/.env`:

```env
# Super Admin Secret Key (for first super admin creation)
# Change this to a secure random string in production!
SUPER_ADMIN_SECRET_KEY=your-secure-secret-key-change-in-production
```

**⚠️ Important**: 
- Use a strong, random secret key in production
- Never commit the secret key to version control
- Keep it secure and private
- The automatic script generates a cryptographically secure random key

## API Endpoint

**Endpoint**: `POST /api/super-admin/create`

**Request (First Super Admin)**:
```json
{
  "secret_key": "your-secret-key",
  "name": "Super Admin Name",
  "email": "superadmin@example.com",
  "password": "securepassword123",
  "password_confirmation": "securepassword123"
}
```

**Request (Additional Super Admin - requires auth)**:
```json
{
  "name": "Super Admin Name",
  "email": "superadmin2@example.com",
  "password": "securepassword123",
  "password_confirmation": "securepassword123"
}
```

**Response**:
```json
{
  "message": "Super admin account created successfully",
  "user": {
    "id": 1,
    "name": "Super Admin Name",
    "email": "superadmin@example.com",
    "role": "super_admin",
    "avatar_url": null
  },
  "token": "1|abc123...", // Only for first super admin
  "expires_at": "2025-12-11T10:00:00Z" // Only for first super admin
}
```

## Frontend Routes

- **Public Route**: `/create-super-admin` - For creating first super admin
- **Protected Route**: Accessible from User Management page when logged in as super admin

## Regular Registration

**Important**: Regular registration (`/api/register`) **cannot** create super admin accounts. The `super_admin` role is explicitly excluded from regular registration validation.

## Quick Setup

1. **Set Secret Key**:
   ```bash
   # In backend/.env
   SUPER_ADMIN_SECRET_KEY=my-secure-key-12345
   ```

2. **Create First Super Admin**:
   - Visit: `http://localhost:5173/create-super-admin`
   - Enter secret key and details
   - Submit

3. **Create Additional Super Admins**:
   - Log in as super admin
   - Go to User Management
   - Click "Create Super Admin" button

---

**Super Admin creation is now secure and separate from regular registration!** 🔐

