# 🎯 Candidate Compliance Tracker

A comprehensive full-stack web application for managing candidate credentials, certifications, and compliance documents with automatic expiry tracking, email reminders, and a modern dashboard interface.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Schema](#-database-schema)
- [Email Configuration](#-email-configuration)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Candidate Compliance Tracker** is designed to help organizations efficiently manage and track candidate credentials, certifications, and compliance documents. The system automatically monitors expiry dates, sends proactive email reminders, and provides a comprehensive dashboard for credential lifecycle management.

### Key Capabilities

- ✅ **Credential Management**: Full CRUD operations for candidate credentials
- ✅ **Automatic Status Tracking**: Real-time status calculation (Active/Expiring Soon/Expired)
- ✅ **Email Reminders**: Automated reminders at 30, 14, and 7 days before expiry
- ✅ **Role-Based Access Control**: Admin and Recruiter roles with different permissions
- ✅ **Document Management**: Upload and manage credential documents (PDF/DOC)
- ✅ **Dashboard Analytics**: Visual statistics and charts for credential overview
- ✅ **Export Functionality**: CSV export for credential data
- ✅ **Responsive Design**: Modern, mobile-friendly interface

---

## ✨ Features

### Backend Features

- **RESTful API** built with Laravel 12
- **Laravel Sanctum** for API token authentication
- **Role-based access control** (Admin/Recruiter)
- **Automatic status calculation** based on expiry dates
- **Scheduled email reminders** (30, 14, 7 days before expiry)
- **Daily summary emails** for administrators
- **File upload handling** for credential documents
- **Pagination** for large datasets
- **Comprehensive validation** with Form Requests
- **CORS configuration** for frontend integration

### Frontend Features

- **Modern React Dashboard** with Tailwind CSS
- **Real-time credential status** visualization
- **Interactive charts** (Status distribution, Credentials by type)
- **Advanced filtering** and search functionality
- **Quick statistics** cards
- **Modal-based forms** for credential management
- **CSV export** functionality
- **Responsive design** for all devices
- **Token-based authentication** with secure storage
- **Protected routes** with automatic redirects

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 12
- **Language**: PHP 8.2+
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: Laravel Sanctum
- **Email**: Laravel Mail with Markdown templates
- **Scheduling**: Laravel Task Scheduler
- **Validation**: Laravel Form Requests

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7
- **Export**: React CSV
- **State Management**: React Context API

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** >= 8.2 with extensions:
  - BCMath
  - Ctype
  - cURL
  - DOM
  - Fileinfo
  - JSON
  - Mbstring
  - OpenSSL
  - PCRE
  - PDO
  - Tokenizer
  - XML
- **Composer** >= 2.0
- **Node.js** >= 18.0
- **npm** >= 9.0
- **Git**
- **MySQL** (for production) or **SQLite** (for development)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jim-devENG/candidate-compliance-tracker.git
cd candidate-compliance-tracker
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database (SQLite for development)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Create storage symlink
php artisan storage:link
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install Node dependencies
npm install
```

### Step 4: Configure Environment

Edit `backend/.env` file:

```env
APP_NAME="Candidate Compliance Tracker"
APP_ENV=local
APP_KEY=base64:... (generated by key:generate)
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

# For production, use MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## ⚙️ Configuration

### Database Configuration

#### SQLite (Development)
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/backend/database/database.sqlite
```

#### MySQL (Production)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Email Configuration

#### Using Mailtrap (Testing)
1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Create an inbox
3. Copy SMTP credentials
4. Update `.env` file:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
```

#### Using Production SMTP
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="Candidate Compliance Tracker"
```

### CORS Configuration

The backend is pre-configured to accept requests from `http://localhost:5173` (Vite default). For production, update `backend/config/cors.php`:

```php
'allowed_origins' => [
    'http://localhost:5173',
    'https://your-production-domain.com',
],
```

---

## 🏃 Running the Application

### Development Mode

#### Terminal 1: Backend Server
```bash
cd backend
php artisan serve
```
Backend will run on `http://localhost:8000`

#### Terminal 2: Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Serve Backend
```bash
cd backend
php artisan serve
# Or configure with your web server (Apache/Nginx)
```

### Scheduled Tasks (Email Reminders)

For production, add this to your crontab:

```bash
* * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
```

Or use Laravel's task scheduler with your web server's cron configuration.

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "admin",
  "avatar": "file" // optional
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "1|...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "avatar_url": "http://localhost:8000/storage/..."
  }
}
```

#### Get Authenticated User
```http
GET /api/user
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

### Credential Endpoints

#### List Credentials
```http
GET /api/credentials?page=1&per_page=10&status=active&search=keyword
Authorization: Bearer {token}
```

#### Get Single Credential
```http
GET /api/credentials/{id}
Authorization: Bearer {token}
```

#### Create Credential (Admin Only)
```http
POST /api/credentials
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "candidate_name": "Jane Smith",
  "position": "Software Engineer",
  "credential_type": "AWS Certification",
  "email": "jane@example.com",
  "issue_date": "2024-01-15",
  "expiry_date": "2025-01-15",
  "status": "active", // optional, auto-calculated if not provided
  "document": "file" // optional, PDF/DOC/DOCX
}
```

#### Update Credential (Admin Only)
```http
PUT /api/credentials/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "candidate_name": "Jane Smith Updated",
  "status": "", // empty string to auto-calculate
  "document": "file" // optional
}
```

#### Delete Credential (Admin Only)
```http
DELETE /api/credentials/{id}
Authorization: Bearer {token}
```

### Email Endpoints (Admin Only)

#### Send Reminder Emails
```http
POST /api/emails/send-reminders
Authorization: Bearer {token}
```

#### Send Summary Email
```http
POST /api/emails/send-summary
Authorization: Bearer {token}
```

---

## 🔐 Authentication & Authorization

### User Roles

#### Admin
- ✅ Full CRUD access to all credentials
- ✅ Can create, edit, and delete any credential
- ✅ Can view all credentials
- ✅ Can trigger email reminders and summaries
- ✅ Receives daily summary emails

#### Recruiter
- ✅ Can view their own credentials only
- ✅ Can export credentials (CSV)
- ❌ Cannot create, edit, or delete credentials
- ✅ Receives reminder emails for their credentials

### Authentication Flow

1. User registers/logs in via `/api/register` or `/api/login`
2. Backend returns an authentication token
3. Frontend stores token in `localStorage`
4. All subsequent requests include token in `Authorization: Bearer {token}` header
5. Backend validates token using Laravel Sanctum middleware

### Protected Routes

All credential routes require authentication. Admin-only routes are protected by `role.admin` middleware.

---

## 🗄️ Database Schema

### Users Table
```sql
- id (bigint, primary key)
- name (string)
- email (string, unique)
- email_verified_at (timestamp, nullable)
- password (string)
- role (string: 'admin' or 'recruiter')
- avatar_path (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### Credentials Table
```sql
- id (bigint, primary key)
- candidate_name (string)
- position (string)
- credential_type (string)
- email (string)
- issue_date (date)
- expiry_date (date)
- status (string, nullable: 'active', 'expired', 'expiring_soon', 'pending')
- document_path (string, nullable)
- user_id (bigint, foreign key -> users.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### Personal Access Tokens Table (Laravel Sanctum)
```sql
- id (bigint, primary key)
- tokenable_type (string)
- tokenable_id (bigint)
- name (string)
- token (string, unique)
- abilities (text, nullable)
- last_used_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## 📧 Email Configuration

### Email Reminders

The system automatically sends email reminders at:
- **30 days** before expiry
- **14 days** before expiry
- **7 days** before expiry

### Daily Summary

Administrators receive a daily summary email containing:
- Total credentials
- Expiring credentials (next 7 days)
- Expired credentials
- Compliance statistics

### Email Templates

- **Reminder Email**: `resources/views/emails/credential-expiry-reminder.blade.php`
- **Summary Email**: `resources/views/emails/credential-expiry-summary.blade.php`

Both templates use Laravel Markdown for beautiful, responsive emails.

### Testing Emails

Use the test command:
```bash
cd backend
php artisan test:mailtrap
```

Or manually trigger emails via API:
```http
POST /api/emails/send-reminders
POST /api/emails/send-summary
```

---

## 📁 Project Structure

```
candidate-compliance-tracker/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Console/
│   │   │   └── Commands/       # Scheduled commands
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/         # API controllers
│   │   │   ├── Middleware/     # Custom middleware
│   │   │   └── Requests/       # Form validation
│   │   ├── Mail/               # Email classes
│   │   └── Models/             # Eloquent models
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/            # Database seeders
│   ├── resources/
│   │   └── views/
│   │       └── emails/          # Email templates
│   ├── routes/
│   │   └── api.php             # API routes
│   └── storage/
│       └── app/
│           └── public/         # Public storage (documents)
│
├── frontend/                    # React Application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Layout/         # Layout components
│   │   │   └── ...             # Other components
│   │   ├── contexts/           # React Context (Auth)
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   └── config/             # Configuration files
│   └── public/                # Static assets
│
└── README.md                   # This file
```

---

## 📖 Usage Guide

### Creating a Credential

1. Log in as an **Admin** user
2. Click **"Add New Credential"** button
3. Fill in the form:
   - Candidate Name (required)
   - Position (required)
   - Credential Type (required)
   - Email (required)
   - Issue Date (required)
   - Expiry Date (required)
   - Status (optional - auto-calculated if not provided)
   - Document (optional - PDF/DOC/DOCX)
4. Click **"Create"**

### Viewing Credentials

- **Admins**: See all credentials
- **Recruiters**: See only their own credentials
- Use filters to narrow down results
- Use search to find specific credentials

### Editing a Credential

1. Click the **Edit** button (Admin only)
2. Modify the fields
3. Click **"Update"**

### Deleting a Credential

1. Click the **Delete** button (Admin only)
2. Confirm the deletion

### Exporting Credentials

1. Use the **Export to CSV** button
2. File will be downloaded automatically

### Status Calculation

Status is automatically calculated based on expiry date:
- **Active**: Expiry date is more than 30 days away
- **Expiring Soon**: Expiry date is between 7-30 days away
- **Expired**: Expiry date has passed
- **Pending**: Can be manually set

You can override automatic calculation by manually setting the status.

---

## 🚢 Deployment

### Backend Deployment

1. **Set up production environment variables**:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION=mysql
   # ... other production settings
   ```

2. **Install dependencies**:
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

3. **Run migrations**:
   ```bash
   php artisan migrate --force
   ```

4. **Optimize application**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

5. **Set up scheduled tasks** (cron):
   ```bash
   * * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
   ```

### Frontend Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your web server

3. **Configure API URL** in production environment

### Environment Variables

Ensure all production environment variables are set:
- Database credentials
- Mail configuration
- APP_URL
- APP_KEY
- CORS allowed origins

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Email Testing
```bash
cd backend
php artisan test:mailtrap
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Check `.env` file database configuration
- Ensure database file exists (SQLite) or database is created (MySQL)
- Verify database credentials

#### 2. Storage Link Error
```bash
cd backend
php artisan storage:link
```

#### 3. CORS Error
- Check `backend/config/cors.php`
- Verify frontend URL is in allowed origins
- Clear config cache: `php artisan config:clear`

#### 4. Email Not Sending
- Verify email configuration in `.env`
- Check Mailtrap inbox (if using Mailtrap)
- Check Laravel logs: `backend/storage/logs/laravel.log`

#### 5. Token Authentication Failing
- Clear config cache: `php artisan config:clear`
- Verify Sanctum is properly installed
- Check token is being sent in Authorization header

#### 6. Document Upload Failing
- Ensure `storage/app/public` directory exists
- Run `php artisan storage:link`
- Check file permissions on storage directory
- Verify file size is under 5MB

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow PSR-12 coding standards for PHP
- Use ESLint for JavaScript/React code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Jim-devENG** - [GitHub](https://github.com/Jim-devENG)

---

## 🙏 Acknowledgments

- Laravel Framework
- React Team
- Tailwind CSS
- All contributors and users

---

## 📞 Support

For support, please open an issue in the [GitHub repository](https://github.com/Jim-devENG/candidate-compliance-tracker/issues).

---

## 🔗 Useful Links

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)

---

**Made with ❤️ for efficient credential management**
