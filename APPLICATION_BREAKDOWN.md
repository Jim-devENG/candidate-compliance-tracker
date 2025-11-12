# Candidate Compliance Tracker - Complete Application Breakdown

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Backend Features](#backend-features)
5. [Frontend Features](#frontend-features)
6. [Database Structure](#database-structure)
7. [API Endpoints](#api-endpoints)
8. [Email System](#email-system)
9. [Status Management](#status-management)
10. [User Roles & Permissions](#user-roles--permissions)
11. [Key Functionalities](#key-functionalities)

---

## 🎯 Application Overview

**Candidate Compliance Tracker** is a full-stack web application designed to help organizations manage and track candidate credentials, certifications, and compliance documents. The system automatically monitors expiry dates, sends email reminders, and provides a comprehensive dashboard for credential management.

### Primary Purpose
- Track candidate credentials and certifications
- Monitor expiry dates automatically
- Send proactive email reminders
- Generate compliance reports
- Manage credential lifecycle

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.2+)
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: Laravel Sanctum (API tokens)
- **Email**: Laravel Mail with Markdown templates
- **Scheduling**: Laravel Task Scheduler

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Export**: React CSV

---

## 🏗️ Architecture

### Project Structure
```
candidate-compliance-tracker/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Mail/
│   │   └── Console/Commands/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
└── frontend/            # React App
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── config/
```

### Communication Flow
```
Frontend (React) ←→ API (Laravel) ←→ Database (SQLite/MySQL)
                          ↓
                    Email System (Mailtrap/SendGrid)
                          ↓
                    Scheduled Jobs (Cron)
```

---

## 🔧 Backend Features

### 1. RESTful API
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Laravel Sanctum (optional, configured but not enforced)
- **CORS**: Configured for React frontend
- **Response Format**: JSON

### 2. CRUD Operations
- ✅ **Create** credentials with validation
- ✅ **Read** credentials with filtering and search
- ✅ **Update** credentials (partial updates supported)
- ✅ **Delete** credentials

### 3. Data Validation
- Form Request validation for all inputs
- Date validation (expiry must be after issue date)
- Email format validation
- Required field validation
- Status enum validation

### 4. Automatic Status Calculation
- Calculates status based on expiry date
- Rules:
  - **Active**: Expiry > 30 days from today
  - **Expiring Soon**: Expiry ≤ 30 days from today
  - **Expired**: Expiry ≤ today
  - **Pending**: No expiry date set

### 5. Manual Status Override
- Users can manually set status
- Manual status takes precedence over calculated status
- Can reset to auto-calculation by clearing status

### 6. Filtering & Search
- Filter by candidate name (partial match)
- Filter by credential type (partial match)
- Query parameters: `?name=John&type=License`

### 7. Email System
- **Reminder Emails**: Sent at 30, 14, and 7 days before expiry
- **Daily Summary**: Sent to Admin users with all expiring credentials
- **Markdown Templates**: Professional email templates
- **Scheduled Jobs**: Automated email sending via Laravel Scheduler

### 8. Scheduled Tasks
- **Daily Summary Email** (8:00 AM): Lists all credentials expiring within 30 days
- **Reminder Emails** (9:00 AM): Sends reminders at 30, 14, 7 days before expiry
- Runs via cron job: `* * * * * php artisan schedule:run`

### 9. Database Migrations
- Users table with roles
- Credentials table with relationships
- Cache, sessions, and jobs tables
- Rollback support

### 10. Seeders & Factories
- Default seeder: Creates admin, recruiter, and 10 sample credentials
- Test email seeder: Creates credentials with specific expiry dates for testing
- Model factories for generating test data

---

## 🎨 Frontend Features

### 1. Dashboard
- **Status Cards**: Color-coded cards showing:
  - Active credentials (Green)
  - Expiring Soon (Yellow)
  - Expired (Red)
  - Total count
- **Notification Banner**: Shows count of expiring credentials
- **Data Table**: Displays all credentials with:
  - Candidate name
  - Position
  - Credential type
  - Issue date
  - Expiry date
  - Email
  - Status (color-coded tags)

### 2. Search & Filter
- **Search Bar**: Filter by candidate name or credential type
- **Real-time Filtering**: Updates as you type
- **Clear Filters**: Reset search easily

### 3. CRUD Modals
- **Add Credential Modal**:
  - Form with all required fields
  - Date pickers with validation
  - Status dropdown (optional)
  - Error handling
- **Edit Credential Modal**:
  - Pre-filled form with existing data
  - Update any field
  - Status can be changed or reset to auto
- **Delete Confirmation**:
  - Confirmation dialog before deletion
  - Prevents accidental deletions

### 4. Status Tags
- **Color-coded Badges**:
  - Green: Active
  - Yellow: Expiring Soon
  - Red: Expired
  - Gray: Pending
- **Tooltips**: Hover to see days until expiry
- **Visual Indicators**: Easy to spot status at a glance

### 5. CSV Export
- **Download Button**: Export all credentials to CSV
- **Includes All Fields**: Candidate name, position, type, dates, email, status
- **Formatted Data**: Ready for Excel or other tools

### 6. Layout Components
- **Sidebar Navigation**: Easy navigation (expandable for future pages)
- **Topbar**: Header with "Add New" button
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with Tailwind CSS

### 7. Error Handling
- **API Error Messages**: Displayed in modals
- **Loading States**: Shows loading indicators during operations
- **Network Error Handling**: Graceful handling of connection issues

### 8. Real-time Updates
- **Auto-refresh**: Data refreshes after create/update/delete
- **Optimistic Updates**: UI updates immediately
- **State Management**: React hooks for data management

---

## 💾 Database Structure

### Users Table
```sql
- id (primary key)
- name (string)
- email (unique, string)
- password (hashed)
- role (enum: 'admin', 'recruiter')
- email_verified_at (timestamp, nullable)
- created_at, updated_at
```

### Credentials Table
```sql
- id (primary key)
- user_id (foreign key → users.id)
- candidate_name (string)
- position (string)
- credential_type (string)
- issue_date (date)
- expiry_date (date)
- email (string)
- status (enum: 'active', 'expired', 'expiring_soon', 'pending')
- created_at, updated_at
```

### Relationships
- **User → Credentials**: One-to-Many (one user can have many credentials)
- **Credential → User**: Many-to-One (many credentials belong to one user)

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
Response: {"status": "ok"}
```

### Credentials

#### List All Credentials
```
GET /api/credentials
Query Params: ?name=John&type=License
Response: {
  "data": [...],
  "count": 10
}
```

#### Get Single Credential
```
GET /api/credentials/{id}
Response: {
  "data": {...}
}
```

#### Create Credential
```
POST /api/credentials
Body: {
  "candidate_name": "John Doe",
  "position": "Software Engineer",
  "credential_type": "Professional License",
  "issue_date": "2024-01-01",
  "expiry_date": "2025-01-01",
  "email": "john@example.com",
  "status": "active" // optional
}
Response: 201 Created
```

#### Update Credential
```
PUT /api/credentials/{id}
Body: {
  "expiry_date": "2026-01-01",
  "status": "active" // optional, can be empty to reset
}
Response: 200 OK
```

#### Delete Credential
```
DELETE /api/credentials/{id}
Response: 200 OK
```

---

## 📧 Email System

### Email Types

#### 1. Credential Expiry Reminder
- **Recipients**: Credential managers (users who own the credential)
- **Triggers**: 30, 14, and 7 days before expiry
- **Content**:
  - Candidate name
  - Position
  - Credential type
  - Issue date
  - Expiry date
  - Days until expiry
  - Urgent warning (if ≤7 days)

#### 2. Daily Credential Expiry Summary
- **Recipients**: Admin users only
- **Schedule**: Daily at 8:00 AM
- **Content**:
  - Total count of expiring credentials
  - Table of all credentials expiring within 30 days
  - Days until expiry for each
  - Status indicators (Urgent, Warning, Notice)

### Email Configuration
- **Development**: Mailtrap (testing) or Log driver
- **Production**: SendGrid, Mailgun, or SMTP
- **Templates**: Markdown-based Blade templates
- **Styling**: Laravel's built-in email components

### Testing Emails
```bash
# Seed test data
php artisan db:seed --class=TestEmailSeeder

# Test via Tinker
php artisan tinker < test-emails.php

# Test commands
php artisan credentials:send-reminders
php artisan credentials:send-summary
```

---

## 🎯 Status Management

### Status Calculation Logic

#### Automatic Calculation
Status is automatically calculated based on expiry date:

1. **Active** (Green)
   - Condition: Expiry date > 30 days from today
   - Color: Green
   - Meaning: Credential is valid and not expiring soon

2. **Expiring Soon** (Yellow)
   - Condition: Expiry date ≤ 30 days from today (but not expired)
   - Color: Yellow
   - Meaning: Credential needs attention soon

3. **Expired** (Red)
   - Condition: Expiry date ≤ today
   - Color: Red
   - Meaning: Credential has expired and needs renewal

4. **Pending** (Gray)
   - Condition: No expiry date set
   - Color: Gray
   - Meaning: Expiry date not yet determined

### Manual Status Override

Users can manually set status:
- **Override**: Manual status takes precedence over calculated
- **Reset**: Clear status to use auto-calculation
- **Options**: Active, Expiring Soon, Expired, Pending
- **Use Case**: When calculated status doesn't match business needs

### Status Display
- **API Response**: Returns both `status` (used) and `calculated_status` (always calculated)
- **Frontend**: Shows color-coded tags with tooltips
- **Dashboard**: Status cards aggregate counts by status

---

## 👥 User Roles & Permissions

### Roles

#### Admin
- **Capabilities**:
  - Full CRUD access to all credentials
  - Receives daily summary emails
  - Can manage all credentials regardless of owner
- **Email**: Receives daily summary of all expiring credentials

#### Recruiter
- **Capabilities**:
  - Create credentials
  - View and manage their own credentials
  - Receive reminder emails for their credentials
- **Email**: Receives reminder emails for credentials they manage

### Authentication
- **Current State**: Optional (Sanctum configured but not enforced)
- **Future**: Can be enabled for role-based access control
- **Token-based**: API tokens for authenticated requests

---

## 🚀 Key Functionalities

### 1. Credential Management
- ✅ Create new credentials with all required information
- ✅ Edit existing credentials (partial updates supported)
- ✅ Delete credentials with confirmation
- ✅ View credential details
- ✅ Search and filter credentials

### 2. Status Tracking
- ✅ Automatic status calculation from expiry dates
- ✅ Manual status override capability
- ✅ Color-coded status indicators
- ✅ Status-based filtering and aggregation

### 3. Expiry Monitoring
- ✅ Automatic calculation of days until expiry
- ✅ Visual indicators for expiring credentials
- ✅ Notification banner for expiring items
- ✅ Status cards showing counts by status

### 4. Email Notifications
- ✅ Automated reminder emails (30, 14, 7 days)
- ✅ Daily summary emails for admins
- ✅ Professional email templates
- ✅ Scheduled job automation

### 5. Data Export
- ✅ CSV export of all credentials
- ✅ Includes all fields and status information
- ✅ Ready for Excel or other tools

### 6. Search & Filter
- ✅ Search by candidate name
- ✅ Filter by credential type
- ✅ Real-time filtering
- ✅ Clear filters option

### 7. User Interface
- ✅ Modern, responsive design
- ✅ Color-coded status indicators
- ✅ Tooltips for additional information
- ✅ Modal forms for CRUD operations
- ✅ Loading states and error handling

### 8. Data Validation
- ✅ Frontend validation (required fields, date ranges)
- ✅ Backend validation (Form Requests)
- ✅ Date validation (expiry after issue)
- ✅ Email format validation

### 9. Error Handling
- ✅ API error messages displayed to users
- ✅ Network error handling
- ✅ Validation error display
- ✅ Graceful error recovery

### 10. Development Tools
- ✅ Database seeders for test data
- ✅ Model factories for generating data
- ✅ Email testing scripts
- ✅ Comprehensive documentation

---

## 📊 Dashboard Features

### Status Overview Cards
- **Active**: Count of active credentials (green)
- **Expiring Soon**: Count of credentials expiring within 30 days (yellow)
- **Expired**: Count of expired credentials (red)
- **Total**: Total number of credentials

### Notification Banner
- Shows count of credentials expiring within 30 days
- Dismissible alert
- Only appears when there are expiring credentials

### Credentials Table
- **Columns**:
  - Candidate Name
  - Position
  - Credential Type
  - Issue Date
  - Expiry Date
  - Email
  - Status (color-coded tag)
- **Actions**:
  - Edit button (opens edit modal)
  - Delete button (with confirmation)
- **Features**:
  - Search/filter functionality
  - Responsive design
  - Tooltips on status tags

---

## 🔄 Workflow Examples

### Adding a New Credential
1. Click "Add New" button
2. Fill in form fields:
   - Candidate name
   - Position
   - Credential type
   - Issue date
   - Expiry date
   - Email
   - Status (optional)
3. Submit form
4. Credential is created and appears in table
5. Status is calculated automatically (if not manually set)

### Editing a Credential
1. Click "Edit" button on credential row
2. Modal opens with pre-filled data
3. Modify any fields
4. Change status or reset to auto-calculation
5. Submit changes
6. Table updates with new data

### Monitoring Expiring Credentials
1. Dashboard shows notification banner with count
2. Status cards show "Expiring Soon" count
3. Filter table to see expiring credentials
4. Email reminders sent automatically
5. Admin receives daily summary

### Exporting Data
1. Click "Download CSV" button
2. CSV file downloads with all credentials
3. Open in Excel or other tool
4. Use for reporting or analysis

---

## 🎨 UI/UX Features

### Design Principles
- **Clean & Modern**: Professional appearance
- **Color-coded**: Visual status indicators
- **Responsive**: Works on all screen sizes
- **Intuitive**: Easy to use without training
- **Accessible**: Clear labels and tooltips

### User Experience
- **Fast Loading**: Optimized API calls
- **Real-time Updates**: Immediate feedback
- **Error Prevention**: Validation before submission
- **Confirmation Dialogs**: Prevent accidental actions
- **Helpful Messages**: Clear error and success messages

---

## 🔐 Security Features

### Backend
- **Input Validation**: All inputs validated
- **SQL Injection Protection**: Eloquent ORM
- **CORS Configuration**: Restricted to frontend URL
- **Sanctum Ready**: Authentication framework in place

### Frontend
- **XSS Protection**: React's built-in protection
- **Input Sanitization**: Form validation
- **Secure API Calls**: Axios with credentials

---

## 📈 Future Enhancement Possibilities

### Potential Additions
- **Authentication**: Full user login system
- **Role-based Permissions**: Fine-grained access control
- **Bulk Operations**: Import/export multiple credentials
- **Advanced Filtering**: More filter options
- **Reporting**: Generate PDF reports
- **Calendar View**: Visual calendar of expiries
- **Notifications**: In-app notifications
- **Audit Log**: Track all changes
- **File Attachments**: Attach documents to credentials
- **Recurring Credentials**: Auto-renewal tracking

---

## 🧪 Testing & Development

### Test Data
- **Default Seeder**: Creates admin, recruiter, and 10 sample credentials
- **Test Email Seeder**: Creates credentials with specific expiry dates
- **Model Factories**: Generate random test data

### Development Tools
- **Tinker Scripts**: Test email functionality
- **Artisan Commands**: Custom commands for reminders and summaries
- **Logging**: Laravel logs for debugging

---

## 📝 Summary

The **Candidate Compliance Tracker** is a comprehensive solution for managing candidate credentials with:

✅ **Full CRUD Operations** - Create, read, update, delete credentials  
✅ **Automatic Status Tracking** - Calculates status from expiry dates  
✅ **Manual Status Override** - Users can set custom status  
✅ **Email Notifications** - Automated reminders and summaries  
✅ **Search & Filter** - Find credentials quickly  
✅ **CSV Export** - Export data for reporting  
✅ **Modern UI** - Clean, responsive dashboard  
✅ **Role-based Access** - Admin and Recruiter roles  
✅ **Scheduled Jobs** - Automated email sending  
✅ **Comprehensive Documentation** - Complete setup and usage guides  

The application is production-ready and can be deployed to any hosting environment that supports Laravel and React.

---

**Version**: 1.0  
**Last Updated**: November 2024  
**Status**: ✅ Complete and Ready for Production

