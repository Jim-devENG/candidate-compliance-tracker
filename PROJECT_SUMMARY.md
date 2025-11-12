# Project Summary

## Overview

**Candidate Compliance Tracker** is a full-stack web application for managing candidate credentials with automatic expiry tracking, email reminders, and a modern dashboard interface.

## Key Features

### ✅ Backend Features
- RESTful API with Laravel 12
- MySQL database with migrations
- Automatic status calculation (Active/Expiring Soon/Expired)
- Email reminders at 30, 14, and 7 days before expiry
- Daily summary emails to Admin users
- Scheduled jobs for automated email sending
- CORS configuration for React frontend
- Laravel Sanctum for authentication (optional)

### ✅ Frontend Features
- Modern React dashboard with Tailwind CSS
- Color-coded status cards (Green/Yellow/Red)
- Real-time filtering and search
- CRUD operations with modals
- CSV export functionality
- Status tags with tooltips
- Notification banner for expiring credentials
- Responsive design

## Project Structure

```
candidate-compliance-tracker/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/Api/
│   │   │       └── CredentialController.php
│   │   ├── Mail/
│   │   │   ├── CredentialExpiryReminder.php
│   │   │   └── CredentialExpirySummary.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   └── Credential.php
│   │   └── Console/Commands/
│   │       ├── SendCredentialReminders.php
│   │       └── SendCredentialSummary.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── resources/views/emails/
│       ├── credential-expiry-reminder.blade.php
│       └── credential-expiry-summary.blade.php
│
├── frontend/             # React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   ├── StatusCard.jsx
│   │   │   ├── StatusTag.jsx
│   │   │   ├── CredentialForm.jsx
│   │   │   └── NotificationBanner.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/
│   │   │   └── useFetchCredentials.js
│   │   └── config/
│   │       └── api.js
│   └── package.json
│
├── screenshots/          # Screenshots directory
├── README.md             # Main documentation
├── QUICK_START.md        # Quick start guide
├── DEPLOYMENT.md         # Deployment guide
└── backend/
    ├── API_DOCUMENTATION.md
    └── README-EMAIL-TESTING.md
```

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User name
- `email` - Unique email
- `password` - Hashed password
- `role` - Enum: 'admin' or 'recruiter'
- `email_verified_at` - Timestamp
- `created_at`, `updated_at` - Timestamps

### Credentials Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `candidate_name` - String
- `position` - String
- `credential_type` - String
- `issue_date` - Date
- `expiry_date` - Date
- `email` - String
- `status` - Enum: 'active', 'expired', 'expiring_soon', 'pending'
- `created_at`, `updated_at` - Timestamps

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/credentials` | List all credentials (with filters) |
| GET | `/api/credentials/{id}` | Get single credential |
| POST | `/api/credentials` | Create credential |
| PUT | `/api/credentials/{id}` | Update credential |
| DELETE | `/api/credentials/{id}` | Delete credential |

## Status Calculation Logic

- **Active** (green): Expiry date > 30 days from today
- **Expiring Soon** (yellow): Expiry date ≤ 30 days from today
- **Expired** (red): Expiry date ≤ today
- **Pending** (gray): No expiry date set

## Email Features

### Reminder Emails
- Sent at 30, 14, and 7 days before expiry
- Sent to credential managers
- Includes credential details and days until expiry
- Urgent warning for ≤7 days

### Summary Emails
- Sent daily to Admin users
- Lists all credentials expiring within 30 days
- Table format with status indicators
- Sorted by expiry date

## Scheduled Jobs

- **Daily Summary** (8:00 AM): Sends summary email to Admin
- **Reminder Emails** (9:00 AM): Sends reminders at 30, 14, 7 days

## Setup Commands

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Test Data

### Default Seeder
```bash
php artisan db:seed
```
Creates:
- 1 Admin user (admin@example.com)
- 1 Recruiter user (recruiter@example.com)
- 10 sample credentials with mixed expiry dates

### Test Email Seeder
```bash
php artisan db:seed --class=TestEmailSeeder
```
Creates credentials expiring in:
- 30 days
- 14 days
- 7 days
- 5 days
- 20 days

## Documentation Files

1. **README.md** - Main project documentation
2. **QUICK_START.md** - Quick setup guide
3. **DEPLOYMENT.md** - Production deployment guide
4. **backend/API_DOCUMENTATION.md** - Complete API reference
5. **backend/README-EMAIL-TESTING.md** - Email testing guide
6. **screenshots/README.md** - Screenshot guidelines

## Technology Stack

### Backend
- Laravel 12
- PHP 8.2+
- MySQL 8.0+
- Laravel Sanctum
- Laravel Mail

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios
- React Router
- React CSV

## Development URLs

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **API Base**: http://localhost:8000/api

## Default Credentials

- **Admin**: admin@example.com / password
- **Recruiter**: recruiter@example.com / password

## Next Steps

1. Configure mail settings (Mailtrap for testing)
2. Take screenshots of the application
3. Test all features
4. Deploy to production (see DEPLOYMENT.md)

---

**Project Status**: ✅ Complete and ready for delivery

