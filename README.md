# Candidate Compliance Tracker

A full-stack application for tracking candidate credentials and compliance with automatic expiry reminders and email notifications.

## 🚀 Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **MySQL** - Database
- **Laravel Sanctum** - API Authentication
- **Laravel Mail** - Email Notifications

### Frontend
- **React 19** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **React Router** - Routing
- **React CSV** - CSV Export

## 📁 Project Structure

```
candidate-compliance-tracker/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   │           └── CredentialController.php
│   │   ├── Mail/
│   │   │   ├── CredentialExpiryReminder.php
│   │   │   └── CredentialExpirySummary.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   └── Credential.php
│   │   └── Console/
│   │       └── Commands/
│   │           ├── SendCredentialReminders.php
│   │           └── SendCredentialSummary.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── resources/
│       └── views/
│           └── emails/
│               ├── credential-expiry-reminder.blade.php
│               └── credential-expiry-summary.blade.php
└── frontend/         # React App
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── config/
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Configure database in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. **Configure mail settings in `.env`:**
   ```env
   # For Mailtrap (testing)
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_mailtrap_username
   MAIL_PASSWORD=your_mailtrap_password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="noreply@example.com"
   MAIL_FROM_NAME="Laravel"

   # Or use log driver for local testing
   # MAIL_MAILER=log
   ```

7. **Configure frontend URL for CORS:**
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

8. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

9. **Seed the database:**
   ```bash
   php artisan db:seed
   ```

   For test email data:
   ```bash
   php artisan db:seed --class=TestEmailSeeder
   ```

10. **Start the Laravel development server:**
    ```bash
    php artisan serve
    ```
    The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API base URL (optional):**
   Create `.env` file in frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📊 Database Migrations

### Run Migrations

```bash
cd backend
php artisan migrate
```

### Migration Files

1. **`0001_01_01_000000_create_users_table.php`**
   - Creates users table with basic fields
   - Includes password reset tokens and sessions tables

2. **`2025_11_07_220008_add_role_to_users_table.php`**
   - Adds `role` field to users table
   - Enum: `['admin', 'recruiter']`
   - Default: `'recruiter'`

3. **`2025_11_07_220122_create_credentials_table.php`**
   - Creates credentials table
   - Foreign key to users table
   - Fields: candidate_name, position, credential_type, issue_date, expiry_date, email, status

### Rollback Migrations

```bash
php artisan migrate:rollback
```

### Fresh Migration (Drops all tables)

```bash
php artisan migrate:fresh
php artisan db:seed
```

## 🔐 Environment Variables

### Backend `.env` Configuration

```env
# Application
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache
CACHE_STORE=database

# Queue
QUEUE_CONNECTION=database
```

### Frontend `.env` Configuration (Optional)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📡 API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Authentication
All endpoints use Laravel Sanctum for authentication (optional for now).

### Endpoints

#### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "ok"
}
```

#### Credentials

**List All Credentials**
```
GET /api/credentials
```
**Query Parameters:**
- `name` (optional) - Filter by candidate name
- `type` (optional) - Filter by credential type

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "Recruiter User",
        "email": "recruiter@example.com"
      },
      "candidate_name": "John Doe",
      "position": "Software Engineer",
      "credential_type": "Professional License",
      "issue_date": "2024-01-15",
      "expiry_date": "2025-01-15",
      "email": "john@example.com",
      "status": "active",
      "status_color": "green",
      "created_at": "2024-11-07T22:00:00.000000Z",
      "updated_at": "2024-11-07T22:00:00.000000Z"
    }
  ],
  "count": 1
}
```

**Get Single Credential**
```
GET /api/credentials/{id}
```

**Create Credential**
```
POST /api/credentials
```
**Request Body:**
```json
{
  "candidate_name": "Jane Doe",
  "position": "Nurse",
  "credential_type": "Professional License",
  "issue_date": "2024-01-01",
  "expiry_date": "2025-01-01",
  "email": "jane@example.com"
}
```

**Update Credential**
```
PUT /api/credentials/{id}
```
**Request Body:** (all fields optional)
```json
{
  "candidate_name": "Jane Doe Updated",
  "expiry_date": "2026-01-01"
}
```

**Delete Credential**
```
DELETE /api/credentials/{id}
```

### Status Calculation

Status is automatically calculated based on expiry date:
- **Active** → expiry > 30 days from today (green)
- **Expiring Soon** → expiry ≤ 30 days from today (yellow)
- **Expired** → expiry ≤ today (red)
- **Pending** → no expiry date (gray)

## 🎨 Frontend Features

### Dashboard
- **Status Cards**: Color-coded cards showing Active, Expiring Soon, Expired, and Total counts
- **Notification Banner**: Shows count of credentials expiring within 30 days
- **Data Table**: Displays all credentials with sorting and filtering
- **Search & Filter**: Filter by candidate name or credential type
- **CRUD Operations**: Add, Edit, Delete credentials via modals
- **CSV Export**: Download credentials as CSV file
- **Status Tags**: Color-coded status badges with tooltips showing days until expiry

### Components
- **Layout**: Sidebar navigation and topbar with "Add New" button
- **StatusCard**: Color-coded status cards
- **StatusTag**: Status badges with hover tooltips
- **CredentialForm**: Modal form for creating/editing credentials
- **NotificationBanner**: Alert banner for expiring credentials

## 📧 Email Features

### Scheduled Jobs

The application includes scheduled jobs for email reminders:

1. **Daily Summary Email** (8:00 AM)
   - Sends summary to Admin users
   - Lists all credentials expiring within 30 days

2. **Reminder Emails** (9:00 AM)
   - Sends reminders at 30, 14, and 7 days before expiry
   - Sent to credential managers

### Email Templates

1. **Credential Expiry Reminder**
   - Sent to credential managers
   - Includes credential details and days until expiry
   - Urgent warning for credentials expiring in ≤7 days

2. **Daily Credential Expiry Summary**
   - Sent to Admin users
   - Table of all credentials expiring within 30 days
   - Status indicators (Urgent, Warning, Notice)

### Testing Emails

**Seed test data:**
```bash
php artisan db:seed --class=TestEmailSeeder
```

**Test via Tinker:**
```bash
php artisan tinker < test-emails.php
```

**Or manually in Tinker:**
```php
use App\Mail\CredentialExpiryReminder;
use App\Models\Credential;
use Illuminate\Support\Facades\Mail;

$credential = Credential::where('candidate_name', 'like', '%30 Days%')->first();
Mail::to($credential->user->email)->send(new CredentialExpiryReminder($credential, 30));
```

**Test commands:**
```bash
# Test reminder emails
php artisan credentials:send-reminders

# Test summary email
php artisan credentials:send-summary
```

## 🗄️ Database Seeding

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

Creates test credentials with specific expiry dates:
- 30 days
- 14 days
- 7 days
- 5 days
- 20 days

### Fresh Seed (Drops and recreates)

```bash
php artisan migrate:fresh --seed
```

## 🖼️ Screenshots

### Dashboard Overview
![Dashboard](screenshots/dashboard.png)
*Main dashboard showing status cards, notification banner, and credentials table*

### Add Credential Modal
![Add Credential](screenshots/add-credential.png)
*Modal form for adding new credentials*

### Status Tags with Tooltips
![Status Tags](screenshots/status-tags.png)
*Color-coded status tags with hover tooltips showing days until expiry*

### Email Reminder
![Email Reminder](screenshots/email-reminder.png)
*Sample email reminder for expiring credentials*

### Email Summary
![Email Summary](screenshots/email-summary.png)
*Daily summary email sent to Admin users*

> **Note:** Screenshots should be taken from the running application at `http://localhost:5173` and `http://localhost:8000`. Place them in a `screenshots/` directory in the project root.

## 🚀 Deployment

### Backend Deployment

1. **Set environment to production:**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Optimize for production:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan optimize
   ```

3. **Set up scheduled tasks:**
   Add to crontab:
   ```bash
   * * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your web server (Nginx, Apache, etc.)

3. **Configure API base URL** in production environment

## 🧪 Testing

### Backend Tests

```bash
cd backend
php artisan test
```

### Manual Testing

1. **API Testing:**
   - Use Postman or curl to test endpoints
   - Test CRUD operations
   - Test filtering and search

2. **Email Testing:**
   - Configure Mailtrap for testing
   - Run test email seeder
   - Test email commands

3. **Frontend Testing:**
   - Test all CRUD operations
   - Test filtering and search
   - Test CSV export
   - Test status calculations

## 📝 Additional Documentation

- **Email Testing Guide**: `backend/README-EMAIL-TESTING.md`
- **API Documentation**: See API Endpoints section above

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify MySQL is running
- Check `.env` database credentials
- Ensure database exists

**CORS Errors:**
- Verify `FRONTEND_URL` in `.env`
- Check `config/cors.php` configuration

**Email Not Sending:**
- Check mail configuration in `.env`
- Verify Mailtrap credentials
- Check `storage/logs/laravel.log` for errors

**Frontend API Errors:**
- Verify backend is running on port 8000
- Check API base URL configuration
- Verify CORS settings

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Laravel and React**

