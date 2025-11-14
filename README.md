# 🎯 Goodwill Staffing Compliance Tracker

A comprehensive, production-ready full-stack web application for managing candidate credentials, certifications, and compliance documents with automatic expiry tracking, email reminders, and a modern dashboard interface.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php)
![Security](https://img.shields.io/badge/Security-9.5%2F10-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Security](#-security)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Mobile Access](#-mobile-access)
- [API Documentation](#-api-documentation)
- [Authentication & Authorization](#-authentication--authorization)
- [Deployment](#-deployment)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Goodwill Staffing Compliance Tracker** is a production-ready application designed to help organizations efficiently manage and track candidate credentials, certifications, and compliance documents. The system automatically monitors expiry dates, sends proactive email reminders, and provides a comprehensive dashboard for credential lifecycle management.

### Key Capabilities

- ✅ **Real-time Authentication** - Token-based auth with Remember Me and password reset
- ✅ **Credential Management** - Full CRUD operations for candidate credentials
- ✅ **Automatic Status Tracking** - Real-time status calculation (Active/Expiring Soon/Expired)
- ✅ **Email Reminders** - Automated reminders at 30, 14, and 7 days before expiry
- ✅ **Role-Based Access Control** - Super Admin, Admin, and Recruiter roles with hierarchical permissions
- ✅ **Document Management** - Upload and manage credential documents (PDF/DOC)
- ✅ **Dashboard Analytics** - Visual statistics and charts for credential overview
- ✅ **Export Functionality** - CSV export for credential data
- ✅ **Responsive Design** - Modern, mobile-friendly interface
- ✅ **Production Ready** - Comprehensive security, rate limiting, and error handling

---

## ✨ Features

### Backend Features

- **RESTful API** built with Laravel 12
- **Laravel Sanctum** for secure API token authentication
- **Real-time token validation** with automatic expiration handling
- **Role-based access control** (Admin/Recruiter)
- **Automatic status calculation** based on expiry dates
- **Scheduled email reminders** (30, 14, 7 days before expiry)
- **Daily summary emails** for administrators
- **File upload handling** for credential documents
- **Pagination** for large datasets
- **Comprehensive validation** with Form Requests
- **Input sanitization** to prevent XSS attacks
- **Rate limiting** on all API endpoints
- **Security headers** middleware
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
- **Remember Me** functionality
- **Password reset** flow
- **Profile management** with avatar upload

---

## 🔒 Security

### Security Score: 9.5/10

The application implements comprehensive security measures:

- ✅ **Authentication & Authorization**
  - Token-based authentication (Laravel Sanctum)
  - Password hashing (bcrypt)
  - Token expiration (24h/30d with Remember Me)
  - Real-time token validation
  - Role-based access control
  - Secure password reset

- ✅ **Input Security**
  - Form request validation
  - Input sanitization (HTML stripping & encoding)
  - SQL injection protection (Eloquent ORM)
  - LIKE query escaping
  - XSS protection (React + backend sanitization)

- ✅ **Response Security**
  - Security headers middleware
  - Content Security Policy
  - HTTPS enforcement
  - Production-safe error handling

- ✅ **API Security**
  - Rate limiting (all routes)
  - CORS configuration
  - Token-based authentication

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) and [SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md) for detailed security documentation.

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
- **Icons**: Lucide React
- **State Management**: React Context API

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** >= 8.2 with extensions:
  - BCMath, Ctype, cURL, DOM, Fileinfo, JSON, Mbstring, OpenSSL, PCRE, PDO, Tokenizer, XML
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
APP_NAME="Goodwill Staffing Compliance Tracker"
APP_ENV=local
APP_KEY=base64:... (generated by key:generate)
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

FRONTEND_URL=http://localhost:5173

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Step 5: Setup Super Admin Secret Key

**Automatic Setup** (Recommended):
```bash
# Windows
add-super-admin-key.bat

# Or PowerShell
powershell -ExecutionPolicy Bypass -File add-super-admin-key.ps1
```

This will automatically generate and add `SUPER_ADMIN_SECRET_KEY` to `backend/.env`. This key is required for creating the first super admin account.

**To view the secret key later:**
```bash
# Windows
show-super-admin-key.bat

# Or PowerShell
powershell -ExecutionPolicy Bypass -File show-super-admin-key.ps1
```

See [SUPER_ADMIN_CREATION.md](SUPER_ADMIN_CREATION.md) for detailed information.

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
4. Update `.env` file

#### Using Production SMTP
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
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

### Mobile Access

For mobile device access on your local network, see [MOBILE_ACCESS_SETUP.md](MOBILE_ACCESS_SETUP.md) or use the automated script:

**Windows:**
```bash
start-mobile.bat
```

**PowerShell:**
```powershell
.\start-mobile-dev.ps1
```

This will automatically:
- Detect your local IP address
- Configure frontend and backend `.env` files
- Start both servers with network access

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
  "password": "password123",
  "remember_me": true // optional, extends token to 30 days
}
```

#### Forgot Password
```http
POST /api/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "token": "reset-token",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
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
GET /api/credentials?page=1&per_page=10&name=keyword&type=License
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
```

#### Delete Credential (Admin Only)
```http
DELETE /api/credentials/{id}
Authorization: Bearer {token}
```

### Rate Limiting

- **Auth Routes**: 5 requests/minute
- **Password Reset**: 3 requests/minute
- **Authenticated Routes**: 60 requests/minute
- **Email Routes**: 10 requests/minute

---

## 🔐 Authentication & Authorization

### User Roles

#### Super Admin
- ✅ Full access to all features
- ✅ Can create, edit, and delete any credential
- ✅ Can create and manage admin and recruiter accounts
- ✅ Can create additional super admin accounts
- ✅ Can trigger email reminders and summaries
- ✅ Receives daily summary emails
- ✅ Access to User Management panel

#### Admin
- ✅ Full CRUD access to all credentials
- ✅ Can create, edit, and delete any credential
- ✅ Can view all credentials
- ✅ Can trigger email reminders and summaries
- ✅ Receives daily summary emails
- ❌ Cannot create admin or super admin accounts
- ❌ Cannot access User Management panel

#### Recruiter
- ✅ Can view their own credentials only
- ✅ Can export credentials (CSV)
- ❌ Cannot create, edit, or delete credentials
- ✅ Receives reminder emails for their credentials

### Authentication Features

- **Token-based Authentication** - Secure API tokens with expiration
- **Remember Me** - Extended session (30 days) option
- **Password Reset** - Secure email-based password reset
- **Real-time Validation** - Automatic token validation every 5 minutes
- **Auto-logout** - Automatic logout on token expiration

---

## 🚢 Deployment

### Production Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive deployment instructions.

### Quick Production Setup

#### Backend
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to web server
```

#### Environment Variables (Production)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
SESSION_SECURE_COOKIE=true
```

### Scheduled Tasks

Add to crontab:
```bash
* * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🛡️ Security Features

### Implemented Security Measures

1. **Security Headers**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin
   - Strict-Transport-Security (HTTPS enforcement)
   - Content-Security-Policy

2. **Input Security**
   - HTML tag stripping
   - Special character encoding
   - SQL injection protection
   - LIKE query escaping

3. **Authentication Security**
   - Bcrypt password hashing
   - Token expiration
   - Real-time token validation
   - Secure password reset

4. **API Security**
   - Rate limiting
   - CORS configuration
   - Token-based authentication
   - Production-safe error handling

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for complete security documentation.

---

## 📖 Documentation

- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Production readiness checklist
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Comprehensive deployment guide
- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) - Security audit report
- [SECURITY_IMPROVEMENTS.md](SECURITY_IMPROVEMENTS.md) - Security improvements documentation
- [MOBILE_ACCESS_SETUP.md](MOBILE_ACCESS_SETUP.md) - Mobile access configuration

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

**Production Ready | Secure | Modern | Scalable**
