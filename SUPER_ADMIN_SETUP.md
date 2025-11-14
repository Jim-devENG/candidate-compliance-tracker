# Super Admin Role Implementation

## Overview

A **Super Admin** role has been added to the system with the highest level of permissions. Super Admins can create and manage admin accounts, while regular admins can only create and manage recruiter accounts.

## Role Hierarchy

```
Super Admin (Highest)
    ↓ Can create/manage
Admin
    ↓ Can create/manage
Recruiter (Lowest)
```

## Permissions Matrix

| Action | Super Admin | Admin | Recruiter |
|--------|-------------|-------|-----------|
| Create Super Admin | ✅ | ❌ | ❌ |
| Create Admin | ✅ | ❌ | ❌ |
| Create Recruiter | ✅ | ✅ | ❌ |
| Edit Super Admin | ✅ | ❌ | ❌ |
| Edit Admin | ✅ | ❌ (can only demote to recruiter) | ❌ |
| Edit Recruiter | ✅ | ✅ | ❌ |
| Delete Super Admin | ✅ | ❌ | ❌ |
| Delete Admin | ✅ | ❌ | ❌ |
| Delete Recruiter | ✅ | ✅ | ❌ |
| Manage Credentials | ✅ | ✅ | ❌ (view own only) |
| Send Emails | ✅ | ✅ | ❌ |

## Backend Changes

### 1. AdminController Updates

**Create User**:
- Super Admin: Can create `super_admin`, `admin`, or `recruiter`
- Admin: Can only create `recruiter`

**Update User**:
- Super Admin: Can change any role
- Admin: Can only change admin to recruiter (demote), cannot promote to admin

**Delete User**:
- Super Admin: Can delete any user
- Admin: Can only delete recruiters

### 2. Middleware Updates

`EnsureUserIsAdmin` now allows both `admin` and `super_admin` roles to access admin routes.

### 3. Email System

Daily summary emails are now sent to both `admin` and `super_admin` users.

## Frontend Changes

### 1. AuthContext

Added `isSuperAdmin` helper:
```javascript
isSuperAdmin: user?.role === 'super_admin'
```

Updated `isAdmin` to include super_admin:
```javascript
isAdmin: user?.role === 'admin' || user?.role === 'super_admin'
```

### 2. AdminUsers Page

**Role Selection**:
- Super Admin: Can select `Super Admin`, `Admin`, or `Recruiter`
- Admin: Can only select `Recruiter`

**Role Display**:
- Super Admin: Purple badge
- Admin: Blue badge (Goodwill primary)
- Recruiter: Light gray badge

**Edit/Delete Restrictions**:
- Super Admin: Can edit/delete anyone
- Admin: Can only edit/delete recruiters
- Edit/Delete buttons hidden for restricted users

**User Sorting**:
- Users sorted by role hierarchy (super_admin → admin → recruiter)

## Creating Your First Super Admin

### Option 1: Database Direct Update

1. Find your user ID:
```sql
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
```

2. Update role to super_admin:
```sql
UPDATE users SET role = 'super_admin' WHERE id = 1;
```

### Option 2: Using Tinker

```bash
cd backend
php artisan tinker
```

```php
$user = App\Models\User::where('email', 'your-email@example.com')->first();
$user->role = 'super_admin';
$user->save();
```

### Option 3: Registration Endpoint (One-time)

You can temporarily allow super_admin in registration for initial setup:

```php
// In AuthController.php register method
'role' => ['sometimes', 'string', 'in:admin,recruiter,super_admin'],
```

**⚠️ Important**: Remove `super_admin` from registration validation after creating your first super admin for security.

## Security Features

1. **Role Validation**: Backend validates role assignments based on current user's role
2. **Self-Protection**: Users cannot remove their own role
3. **Hierarchy Enforcement**: Lower roles cannot manage higher roles
4. **Input Sanitization**: All user inputs are sanitized
5. **Rate Limiting**: All admin routes are rate-limited

## Visual Indicators

- **Super Admin Badge**: Purple background (`bg-purple-600`)
- **Admin Badge**: Blue background (`bg-goodwill-primary`)
- **Recruiter Badge**: Light gray background (`bg-goodwill-light`)

## Testing

1. **Create Super Admin**: Use one of the methods above
2. **Login as Super Admin**: Verify you can see all role options
3. **Create Admin Account**: As super admin, create an admin user
4. **Login as Admin**: Verify admin can only create recruiters
5. **Test Restrictions**: Verify admin cannot edit/delete other admins or super admins

## Files Modified

**Backend**:
- `app/Http/Controllers/Api/AdminController.php` - Role-based permissions
- `app/Http/Middleware/EnsureUserIsAdmin.php` - Allow super_admin access
- `app/Http/Controllers/Api/EmailController.php` - Include super_admin in emails

**Frontend**:
- `src/contexts/AuthContext.jsx` - Added `isSuperAdmin` helper
- `src/pages/AdminUsers.jsx` - Role-based UI restrictions

---

**Super Admin system is now fully implemented!** 🎉

