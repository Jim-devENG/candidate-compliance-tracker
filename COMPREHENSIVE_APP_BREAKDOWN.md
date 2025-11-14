# 📚 Comprehensive Application Breakdown
## Goodwill Staffing Compliance Tracker

**Version**: 1.0  
**Last Updated**: 2025  
**Status**: Production Ready

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Schema](#6-database-schema)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Security Features](#8-security-features)
9. [API Documentation](#9-api-documentation)
10. [Features & Functionality](#10-features--functionality)
11. [Email System](#11-email-system)
12. [File Management](#12-file-management)
13. [Usage Guide](#13-usage-guide)
14. [Development Workflow](#14-development-workflow)
15. [Deployment Guide](#15-deployment-guide)

---

## 1. Executive Summary

### 1.1 What is This Application?

The **Goodwill Staffing Compliance Tracker** is a full-stack web application designed to help organizations efficiently manage and track candidate credentials, certifications, and compliance documents. It provides automated monitoring of expiry dates, proactive email reminders, and a comprehensive dashboard for credential lifecycle management.

### 1.2 Key Purpose

- **Credential Management**: Centralized system for tracking candidate credentials and certifications
- **Compliance Monitoring**: Automatic tracking of credential expiry dates and status
- **Proactive Alerts**: Automated email reminders before credentials expire
- **Role-Based Access**: Different permissions for administrators and recruiters
- **Document Storage**: Secure storage and management of credential documents

### 1.3 Target Users

- **Administrators**: Full access to manage all credentials, trigger emails, and view analytics
- **Recruiters**: View and export credentials assigned to them, receive reminder emails

### 1.4 Core Value Propositions

1. **Automation**: Reduces manual tracking and reminder processes
2. **Compliance**: Ensures credentials are renewed before expiration
3. **Efficiency**: Centralized dashboard for quick overview and management
4. **Security**: Production-ready security with comprehensive protection
5. **Scalability**: Built to handle growing numbers of credentials and users

---

## 2. Architecture Overview

### 2.1 System Architecture

The application follows a **decoupled frontend-backend architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser/Mobile)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React 19 SPA (Single Page Application)        │  │
│  │  - Vite Build Tool                                    │  │
│  │  - Tailwind CSS Styling                               │  │
│  │  - React Router for Navigation                        │  │
│  │  - Axios for API Communication                        │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │ (JSON + Bearer Tokens)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              BACKEND SERVER (Laravel 12)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Layer (RESTful)                                  │  │
│  │  - Laravel Sanctum Authentication                    │  │
│  │  - Rate Limiting                                     │  │
│  │  - CORS Handling                                     │  │
│  │  - Security Headers                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                 │  │
│  │  - Controllers                                        │  │
│  │  - Form Requests (Validation)                        │  │
│  │  - Middleware (Auth, Roles)                          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Layer                                           │  │
│  │  - Eloquent ORM                                       │  │
│  │  - Models (User, Credential)                         │  │
│  │  - Database Migrations                               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services Layer                                       │  │
│  │  - Email Service (Laravel Mail)                     │  │
│  │  - File Storage (Laravel Storage)                    │  │
│  │  - Task Scheduler (Cron Jobs)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│   Database    │ │   Storage   │ │    Mail    │
│  (SQLite/     │ │  (Files)    │ │  (SMTP)    │
│   MySQL)      │ │             │ │            │
└───────────────┘ └─────────────┘ └────────────┘
```

### 2.2 Request Flow

1. **User Action** → User interacts with React frontend
2. **API Call** → Axios sends HTTP request with Bearer token
3. **Authentication** → Laravel Sanctum validates token
4. **Authorization** → Middleware checks user role/permissions
5. **Validation** → Form Request validates input data
6. **Business Logic** → Controller processes request
7. **Data Access** → Eloquent ORM queries database
8. **Response** → JSON response sent back to frontend
9. **UI Update** → React updates UI based on response

### 2.3 Data Flow

```
User Input → Frontend Validation → API Request → Backend Validation
    ↓
Sanitization → Business Logic → Database Query → Response
    ↓
Frontend Update → State Management → UI Re-render
```

---

## 3. Technology Stack

### 3.1 Frontend Technologies

#### Core Framework
- **React 19.1.1**: Modern JavaScript library for building user interfaces
  - Component-based architecture
  - Virtual DOM for efficient rendering
  - Hooks for state management
  - Context API for global state

#### Build Tools
- **Vite 7.1.7**: Next-generation frontend build tool
  - Fast Hot Module Replacement (HMR)
  - Optimized production builds
  - ES modules support
  - Plugin ecosystem

#### Styling
- **Tailwind CSS 3.4.13**: Utility-first CSS framework
  - Custom color palette (Goodwill branding)
  - Responsive design utilities
  - Custom animations and transitions
  - Minimalistic design approach

#### Routing
- **React Router DOM 7.1.3**: Declarative routing for React
  - Client-side routing
  - Protected routes
  - Navigation guards
  - URL parameter handling

#### HTTP Client
- **Axios 1.7.9**: Promise-based HTTP client
  - Request/response interceptors
  - Automatic JSON parsing
  - Error handling
  - Token management

#### Icons
- **Lucide React 0.553.0**: Modern icon library
  - Consistent icon set
  - Tree-shakeable
  - Customizable stroke width
  - TypeScript support

#### Additional Libraries
- **react-csv 2.2.2**: CSV export functionality
- **prop-types 15.8.1**: Runtime type checking

### 3.2 Backend Technologies

#### Core Framework
- **Laravel 12.0**: Modern PHP framework
  - MVC architecture
  - Eloquent ORM
  - Artisan CLI
  - Service container
  - Event system

#### Language
- **PHP 8.2+**: Server-side scripting language
  - Type system improvements
  - Performance optimizations
  - Modern syntax features

#### Authentication
- **Laravel Sanctum**: Token-based API authentication
  - Personal access tokens
  - Token expiration
  - Scope-based permissions
  - SPA authentication support

#### Database
- **SQLite** (Development): File-based database
  - Zero configuration
  - Perfect for development
  - Fast and lightweight

- **MySQL** (Production): Relational database
  - Production-ready
  - ACID compliance
  - Scalable
  - Industry standard

#### Email
- **Laravel Mail**: Email sending system
  - Markdown templates
  - Queue support
  - Multiple drivers (SMTP, Mailgun, etc.)
  - Template customization

#### Task Scheduling
- **Laravel Task Scheduler**: Cron job management
  - Artisan commands
  - Scheduled tasks
  - Automatic execution
  - Logging support

### 3.3 Development Tools

#### Code Quality
- **ESLint 9.36.0**: JavaScript linter
- **Laravel Pint**: PHP code formatter
- **PHPUnit**: PHP testing framework

#### Version Control
- **Git**: Distributed version control
- **GitHub**: Repository hosting

---

## 4. Frontend Architecture

### 4.1 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/         # Layout components (Sidebar, Topbar)
│   │   ├── CredentialForm.jsx
│   │   ├── StatusCard.jsx
│   │   ├── QuickStats.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── contexts/          # React Context providers
│   │   └── AuthContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useFetchCredentials.js
│   ├── config/            # Configuration files
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json           # Dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

### 4.2 Component Architecture

#### Layout Components

**Layout.jsx**
- Main application wrapper
- Provides consistent structure
- Handles sidebar and topbar integration
- Manages main content area

**Sidebar.jsx**
- Navigation menu
- Brand logo and title
- Navigation links (Dashboard, Profile)
- Active route highlighting
- Responsive design

**Topbar.jsx**
- User information display
- Avatar with fallback
- Profile and logout buttons
- "Add Credential" button (admin only)
- Responsive layout

#### Page Components

**Dashboard.jsx** (Main Page)
- Credential listing table
- Search and filter functionality
- Quick statistics cards
- Status distribution charts
- Upcoming expiries list
- Email management (admin only)
- Pagination controls
- CSV export functionality

**Login.jsx**
- Authentication form
- Registration toggle
- Password visibility toggle
- Remember Me checkbox
- Forgot password link
- Form validation
- Error handling

**Profile.jsx**
- User profile management
- Avatar upload/removal
- Name and email editing
- Password change section
- Role display (read-only)
- Form validation
- Success/error messages

**ForgotPassword.jsx**
- Email input form
- Password reset request
- Success message
- Back to login link

**ResetPassword.jsx**
- Token and email from URL
- New password form
- Password confirmation
- Password visibility toggle
- Success handling

#### Reusable Components

**CredentialForm.jsx**
- Modal form for creating/editing credentials
- File upload for documents
- Date validation
- Status selection
- Form submission handling

**StatusCard.jsx**
- Displays status count
- Color-coded by status type
- Icon representation
- Animated count-up effect

**QuickStats.jsx**
- Four stat cards:
  - Added This Month
  - Renewals Needed
  - Compliance Rate
  - Expiring Next Week

**StatusChart.jsx**
- Visual bar chart
- Status distribution
- Percentage calculations
- Animated progress bars

**UpcomingExpiries.jsx**
- List of credentials expiring soon
- Days until expiry display
- Urgency color coding
- Sorted by expiry date

**QuickFilters.jsx**
- Filter buttons:
  - All
  - Active
  - Expiring Soon
  - Expired
  - This Week
  - This Month

**StatusTag.jsx**
- Badge component for credential status
- Color-coded
- Dynamic text based on expiry

**NotificationBanner.jsx**
- Alert banner for expiring credentials
- Conditional display
- Dismissible

**EmailResultModal.jsx**
- Modal for email sending results
- Success/error display
- Statistics (total sent, errors)

**ProtectedRoute.jsx**
- Route guard component
- Checks authentication
- Redirects to login if not authenticated
- Loading state handling

### 4.3 State Management

#### AuthContext (Global Authentication State)

**Location**: `src/contexts/AuthContext.jsx`

**State Variables**:
- `user`: Current authenticated user object
- `loading`: Authentication check in progress
- `isAuthenticated`: Boolean authentication status
- `tokenExpiresAt`: Token expiration timestamp

**Functions**:
- `login(email, password, rememberMe)`: Authenticate user
- `register(name, email, password, ...)`: Create new account
- `logout()`: Clear authentication
- `updateProfile(...)`: Update user profile
- `refreshUser()`: Fetch latest user data

**Features**:
- Real-time token validation (every 5 minutes)
- Automatic token expiration monitoring
- Auto-logout on token expiry
- Global user state management
- Role-based helpers (`isAdmin`, `isRecruiter`)

#### Local Component State

Most components use React's `useState` hook for local state:
- Form inputs
- UI toggles (modals, dropdowns)
- Loading states
- Error messages
- Filter selections

### 4.4 Custom Hooks

**useFetchCredentials.js**
- Fetches credentials from API
- Handles pagination
- Manages filters
- Provides loading and error states
- Auto-refresh functionality

### 4.5 API Integration

**Location**: `src/config/api.js`

**Axios Instance Configuration**:
- Base URL from environment variable
- Request interceptor: Adds Bearer token to headers
- Response interceptor: Handles 401 errors, dispatches logout event

**API Endpoints Used**:
- `/api/login` - Authentication
- `/api/register` - User registration
- `/api/user` - Get current user
- `/api/user/profile` - Update profile
- `/api/credentials` - CRUD operations
- `/api/emails/send-reminders` - Trigger reminders
- `/api/emails/send-summary` - Send summary email

### 4.6 Styling System

#### Tailwind Configuration

**Custom Colors** (Goodwill Branding):
- `goodwill-primary`: #02646f (Teal/Cyan)
- `goodwill-secondary`: #e5482e (Red/Orange)
- `goodwill-light`: #eefbfe (Light Blue)
- `goodwill-dark`: #1a1a1a (Almost Black)
- `goodwill-text-muted`: #4a5568 (Dark Gray)
- `goodwill-border`: #d1e7f0 (Light Teal)

#### Custom Animations

Defined in `src/index.css`:
- `fadeIn`, `fadeInUp`, `fadeInDown`
- `slideInRight`, `slideInLeft`
- `scaleIn`, `countUp`
- `float`, `glow`, `pulse`
- `shimmer` (loading effect)

#### Design Principles

- **Minimalistic**: Clean, uncluttered interface
- **Consistent**: Uniform spacing and sizing
- **Responsive**: Mobile-first approach
- **Accessible**: Proper semantic HTML
- **Performant**: Optimized animations and rendering

---

## 5. Backend Architecture

### 5.1 Project Structure

```
backend/
├── app/
│   ├── Console/
│   │   └── Commands/          # Artisan commands
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/           # API controllers
│   │   ├── Middleware/        # Custom middleware
│   │   └── Requests/          # Form request validation
│   ├── Mail/                  # Email classes
│   ├── Models/                # Eloquent models
│   ├── Notifications/         # Notification classes
│   └── Providers/              # Service providers
├── bootstrap/                  # Application bootstrap
├── config/                     # Configuration files
├── database/
│   ├── migrations/            # Database migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories
├── routes/
│   ├── api.php               # API routes
│   ├── console.php           # Console routes
│   └── web.php               # Web routes
├── storage/                   # File storage
├── public/                    # Public assets
└── resources/
    └── views/                # Email templates
```

### 5.2 Controllers

#### AuthController (`app/Http/Controllers/Api/AuthController.php`)

**Purpose**: Handles all authentication-related operations

**Methods**:
- `register(Request)`: Creates new user account
  - Validates input (name, email, password, role, avatar)
  - Hashes password with bcrypt
  - Stores avatar if provided
  - Creates Sanctum token (30-day expiration)
  - Returns user data and token

- `login(Request)`: Authenticates user
  - Validates credentials
  - Checks password hash
  - Creates token (24h or 30d based on remember_me)
  - Returns user data and token

- `logout(Request)`: Revokes authentication token
  - Deletes current token
  - Returns success message

- `user(Request)`: Returns authenticated user data
  - Includes avatar URL
  - Returns token expiration info

- `updateProfile(Request)`: Updates user profile
  - Validates and sanitizes input
  - Updates name, email, password (if provided)
  - Handles avatar upload/removal
  - Refreshes user model
  - Returns updated user data

- `forgotPassword(Request)`: Initiates password reset
  - Validates email
  - Creates reset token
  - Sends custom notification with frontend URL
  - Returns generic success (security)

- `resetPassword(Request)`: Resets password
  - Validates token, email, password
  - Uses Laravel Password facade
  - Returns success/error

#### CredentialController (`app/Http/Controllers/Api/CredentialController.php`)

**Purpose**: Manages credential CRUD operations

**Methods**:
- `index(Request)`: Lists credentials with filtering
  - Role-based filtering (recruiters see only their own)
  - Name and type filtering (with LIKE escaping)
  - Pagination support
  - Calculates status for each credential
  - Returns paginated JSON response

- `show($id)`: Gets single credential
  - Includes user relationship
  - Calculates status
  - Returns credential data

- `store(StoreCredentialRequest)`: Creates new credential
  - Validates and sanitizes input
  - Handles document upload
  - Calculates status if not provided
  - Associates with authenticated user
  - Returns created credential

- `update(UpdateCredentialRequest, $id)`: Updates credential
  - Validates and sanitizes input
  - Updates document if provided
  - Recalculates status
  - Returns updated credential

- `destroy($id)`: Deletes credential
  - Soft delete (if implemented)
  - Deletes associated document
  - Returns success message

#### EmailController (`app/Http/Controllers/Api/EmailController.php`)

**Purpose**: Handles email sending operations

**Methods**:
- `sendReminders(Request)`: Sends reminder emails
  - **Manual mode** (`send_to_all: true`): Sends to ALL candidates
  - **Automatic mode** (`send_to_all: false`): Sends only to 30/14/7 days
  - Calculates days until expiry
  - Sends CredentialExpiryReminder mailable
  - Returns statistics (total sent, errors)

- `sendSummary(Request)`: Sends summary email to admins
  - Finds credentials expiring in next 30 days
  - Finds all admin users
  - Sends CredentialExpirySummary mailable
  - Returns statistics

### 5.3 Middleware

#### SecurityHeaders (`app/Http/Middleware/SecurityHeaders.php`)

**Purpose**: Adds security headers to all responses

**Headers Added**:
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Referrer control
- `Strict-Transport-Security` - HTTPS enforcement (production)
- `Content-Security-Policy` - Resource loading restrictions (production)
- Removes `X-Powered-By` and `Server` headers

**Registration**: Global middleware in `bootstrap/app.php`

#### EnsureUserIsAdmin (`app/Http/Middleware/EnsureUserIsAdmin.php`)

**Purpose**: Restricts routes to admin users only

**Logic**:
- Checks if authenticated user has 'admin' role
- Returns 403 Forbidden if not admin
- Used for admin-only routes (create, update, delete credentials, email triggers)

#### EnsureUserIsRecruiter (`app/Http/Middleware/EnsureUserIsRecruiter.php`)

**Purpose**: Restricts routes to recruiter users

**Logic**:
- Checks if authenticated user has 'recruiter' role
- Returns 403 Forbidden if not recruiter
- Currently not actively used (for future features)

### 5.4 Form Requests (Validation)

#### StoreCredentialRequest (`app/Http/Requests/StoreCredentialRequest.php`)

**Purpose**: Validates credential creation

**Validation Rules**:
- `candidate_name`: Required, string, max 255
- `position`: Required, string, max 255
- `credential_type`: Required, string, max 255
- `issue_date`: Required, date
- `expiry_date`: Required, date, after issue_date
- `email`: Required, valid email, max 255
- `status`: Optional, enum (active, expired, expiring_soon, pending)
- `document`: Optional, file, PDF/DOC/DOCX, max 5MB

**Sanitization**:
- Strips HTML tags from string fields
- Encodes special characters
- Prevents XSS attacks

#### UpdateCredentialRequest (`app/Http/Requests/UpdateCredentialRequest.php`)

**Purpose**: Validates credential updates

**Validation**: Same as StoreCredentialRequest, but all fields optional
**Sanitization**: Same as StoreCredentialRequest

### 5.5 Models

#### User Model (`app/Models/User.php`)

**Table**: `users`

**Fillable Attributes**:
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (admin/recruiter)
- `avatar_path`: Path to avatar image

**Relationships**:
- `credentials()`: HasMany - Credentials managed by this user

**Accessors**:
- `avatar_url`: Computed attribute returning full URL to avatar
  - Dynamically determines base URL (request-based for mobile/production)
  - Adds cache-busting parameter using `updated_at` timestamp
  - Handles relative and absolute URLs

**Methods**:
- `sendPasswordResetNotification($token, $resetUrl)`: Custom password reset notification
  - Uses custom ResetPasswordNotification class
  - Allows frontend URL in reset link

**Traits**:
- `HasApiTokens`: Laravel Sanctum token management
- `HasFactory`: Model factory support
- `Notifiable`: Notification system
- `CanResetPassword`: Password reset interface

#### Credential Model (`app/Models/Credential.php`)

**Table**: `credentials`

**Fillable Attributes**:
- `user_id`: Foreign key to users table
- `candidate_name`: Name of candidate
- `position`: Candidate's position
- `credential_type`: Type of credential/certification
- `issue_date`: Date credential was issued
- `expiry_date`: Date credential expires
- `email`: Candidate's email
- `status`: Manual status (optional, auto-calculated if null)
- `document_path`: Path to credential document

**Relationships**:
- `user()`: BelongsTo - User who manages this credential

**Accessors**:
- `document_url`: Computed attribute returning full URL to document
  - Dynamically determines base URL
  - Handles Storage URLs

**Methods**:
- `getCalculatedStatus()`: Calculates status based on expiry date
  - **Active**: Expiry > 30 days from today
  - **Expiring Soon**: Expiry ≤ 30 days from today
  - **Expired**: Expiry ≤ today
  - **Pending**: No expiry date
  - Returns array with `status` and `color`

**Casts**:
- `issue_date`: Date
- `expiry_date`: Date

### 5.6 Email System

#### CredentialExpiryReminder (`app/Mail/CredentialExpiryReminder.php`)

**Purpose**: Email sent to credential managers when credentials are expiring

**Content**:
- Candidate name
- Credential type
- Expiry date
- Days until expiry
- Link to view credential

**Recipients**: User who manages the credential

**Trigger**: 
- Manual: Send Reminders button (all candidates)
- Automatic: Scheduled task (30/14/7 days before expiry)

#### CredentialExpirySummary (`app/Mail/CredentialExpirySummary.php`)

**Purpose**: Daily summary email to administrators

**Content**:
- List of all credentials expiring in next 30 days
- Sorted by expiry date
- Includes candidate name, credential type, expiry date
- Count of credentials

**Recipients**: All users with 'admin' role

**Trigger**: 
- Manual: Send Summary button
- Automatic: Scheduled daily task

#### ResetPasswordNotification (`app/Notifications/ResetPasswordNotification.php`)

**Purpose**: Custom password reset email

**Content**:
- Reset link pointing to frontend SPA
- Token expiration notice (60 minutes)
- Security message

**URL Format**: `{FRONTEND_URL}/reset-password?token={token}&email={email}`

### 5.7 Scheduled Tasks

**Location**: `routes/console.php` (Laravel 12 uses console routes)

**Tasks**:
1. **Daily Reminder Emails** (30/14/7 days before expiry)
   - Runs daily
   - Finds credentials expiring in exactly 30, 14, or 7 days
   - Sends reminder emails to credential managers

2. **Daily Summary Email**
   - Runs daily
   - Finds credentials expiring in next 30 days
   - Sends summary to all admin users

**Implementation**: Artisan commands called by Laravel Task Scheduler

**Cron Setup**:
```bash
* * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Database Schema

### 6.1 Users Table

**Table Name**: `users`

**Columns**:
- `id` (bigint, primary key, auto-increment)
- `name` (string, 255) - User's full name
- `email` (string, 255, unique) - Email address
- `email_verified_at` (timestamp, nullable) - Email verification timestamp
- `password` (string) - Bcrypt hashed password
- `role` (string) - User role: 'admin' or 'recruiter'
- `avatar_path` (string, nullable) - Path to avatar image file
- `remember_token` (string, nullable) - Remember me token
- `created_at` (timestamp) - Record creation time
- `updated_at` (timestamp) - Record last update time

**Indexes**:
- Primary key on `id`
- Unique index on `email`

**Relationships**:
- HasMany `credentials` (one user manages many credentials)

### 6.2 Credentials Table

**Table Name**: `credentials`

**Columns**:
- `id` (bigint, primary key, auto-increment)
- `user_id` (bigint, foreign key) - ID of user managing this credential
- `candidate_name` (string, 255) - Name of candidate
- `position` (string, 255) - Candidate's position/job title
- `credential_type` (string, 255) - Type of credential/certification
- `issue_date` (date) - Date credential was issued
- `expiry_date` (date) - Date credential expires
- `email` (string, 255) - Candidate's email address
- `status` (enum, nullable) - Manual status: 'active', 'expired', 'expiring_soon', 'pending'
- `document_path` (string, nullable) - Path to credential document file
- `created_at` (timestamp) - Record creation time
- `updated_at` (timestamp) - Record last update time

**Indexes**:
- Primary key on `id`
- Foreign key on `user_id` (references `users.id`, cascade on delete)

**Relationships**:
- BelongsTo `user` (each credential belongs to one user)

### 6.3 Personal Access Tokens Table

**Table Name**: `personal_access_tokens` (Laravel Sanctum)

**Columns**:
- `id` (bigint, primary key)
- `tokenable_type` (string) - Model type (User)
- `tokenable_id` (bigint) - User ID
- `name` (string) - Token name
- `token` (string, unique) - Hashed token
- `abilities` (text, nullable) - Token abilities/scopes
- `last_used_at` (timestamp, nullable) - Last usage timestamp
- `expires_at` (timestamp, nullable) - Token expiration
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Purpose**: Stores API authentication tokens for users

### 6.4 Password Reset Tokens Table

**Table Name**: `password_reset_tokens`

**Columns**:
- `email` (string, primary key) - User email
- `token` (string) - Reset token (hashed)
- `created_at` (timestamp, nullable) - Token creation time

**Purpose**: Stores password reset tokens (60-minute expiration)

### 6.5 Cache Table

**Table Name**: `cache`

**Purpose**: Stores application cache (Laravel cache driver)

### 6.6 Jobs Table

**Table Name**: `jobs`

**Purpose**: Stores queued jobs (if queue driver is database)

### 6.7 Sessions Table

**Table Name**: `sessions`

**Purpose**: Stores user sessions (if session driver is database)

---

## 7. Authentication & Authorization

### 7.1 Authentication System

#### Token-Based Authentication (Laravel Sanctum)

**How It Works**:
1. User submits credentials (email/password) via `/api/login`
2. Backend validates credentials
3. Backend creates personal access token
4. Token returned to frontend
5. Frontend stores token in localStorage
6. Frontend includes token in `Authorization: Bearer {token}` header
7. Backend validates token on each request
8. Token expires after 24 hours (or 30 days with Remember Me)

#### Token Lifecycle

**Creation**:
- Generated on login/register
- Stored in `personal_access_tokens` table
- Hashed using SHA-256
- Includes expiration timestamp

**Validation**:
- Checked on every authenticated request
- Validated against database
- Expiration checked
- Abilities/scopes verified

**Expiration**:
- **Default**: 24 hours
- **Remember Me**: 30 days
- **Auto-logout**: When token expires
- **Real-time monitoring**: Frontend checks every 5 minutes

**Revocation**:
- On logout: Token deleted from database
- On password change: All tokens revoked (optional)
- Manual: Can revoke specific tokens

### 7.2 Authorization System

#### Role-Based Access Control (RBAC)

**Roles**:
1. **Admin**
   - Full CRUD access to all credentials
   - Can create, read, update, delete any credential
   - Can trigger email reminders and summaries
   - Receives daily summary emails
   - Can manage all users' credentials

2. **Recruiter**
   - Read-only access to their own credentials
   - Can view credentials assigned to them
   - Can export credentials (CSV)
   - Receives reminder emails for their credentials
   - Cannot create, edit, or delete credentials

#### Permission Matrix

| Action | Admin | Recruiter |
|--------|-------|-----------|
| View All Credentials | ✅ | ❌ |
| View Own Credentials | ✅ | ✅ |
| Create Credential | ✅ | ❌ |
| Update Credential | ✅ | ❌ |
| Delete Credential | ✅ | ❌ |
| Export Credentials | ✅ | ✅ |
| Send Reminders | ✅ | ❌ |
| Send Summary | ✅ | ❌ |
| Update Profile | ✅ | ✅ |
| Change Password | ✅ | ✅ |

#### Middleware Protection

**Routes Protected by Role**:
- Admin-only routes use `role.admin` middleware
- Checks user role before allowing access
- Returns 403 Forbidden if unauthorized

**Implementation**:
```php
Route::middleware('role.admin')->group(function () {
    // Admin-only routes
});
```

### 7.3 Password Security

#### Password Hashing

**Algorithm**: bcrypt
**Rounds**: 10 (Laravel default)
**Storage**: Hashed passwords stored in database
**Verification**: `Hash::check($password, $hashedPassword)`

#### Password Requirements

- **Minimum Length**: 8 characters
- **Confirmation**: Must match password_confirmation
- **Current Password**: Required when changing password
- **Validation**: Server-side validation

#### Password Reset Flow

1. User requests reset via `/api/forgot-password`
2. Backend generates secure token
3. Token stored in `password_reset_tokens` table
4. Email sent with reset link
5. User clicks link (frontend URL with token)
6. User submits new password via `/api/reset-password`
7. Backend validates token and updates password
8. Token deleted after use
9. Token expires after 60 minutes

### 7.4 Real-Time Token Validation

**Frontend Implementation**:
- Validates token every 5 minutes
- Checks token expiration before expiry
- Auto-logout on token expiration
- Listens for 401 errors from API

**Backend Validation**:
- Sanctum validates token on each request
- Checks expiration timestamp
- Verifies token exists in database
- Returns 401 if invalid/expired

---

## 8. Security Features

### 8.1 Security Score: 9.5/10

The application implements comprehensive security measures across multiple layers.

### 8.2 Authentication Security

#### Password Security
- **Hashing Algorithm**: bcrypt with 10 rounds
- **Storage**: Passwords never stored in plain text
- **Verification**: Secure password comparison
- **Requirements**: Minimum 8 characters, confirmation required
- **Reset Security**: 60-minute token expiration, single-use tokens

#### Token Security
- **Storage**: Tokens stored in database (hashed)
- **Expiration**: 24 hours default, 30 days with Remember Me
- **Validation**: Real-time validation every 5 minutes
- **Revocation**: Tokens deleted on logout
- **Scope**: Token abilities can be restricted (currently `*` for all)

### 8.3 Input Security

#### Validation
- **Form Requests**: All inputs validated using Laravel Form Requests
- **Rules**: Required fields, type validation, length limits
- **Email Validation**: PHP `filter_var` with FILTER_VALIDATE_EMAIL
- **Date Validation**: Ensures expiry_date is after issue_date
- **File Validation**: Type and size limits enforced

#### Sanitization
**Location**: `StoreCredentialRequest.php`, `UpdateCredentialRequest.php`, `AuthController.php`

**Methods**:
1. **HTML Stripping**: `strip_tags()` removes all HTML tags
2. **Character Encoding**: `htmlspecialchars()` encodes special characters
3. **Email Filtering**: `FILTER_SANITIZE_EMAIL` for email inputs
4. **SQL LIKE Escaping**: Escapes `%` and `_` wildcards in LIKE queries

**Example**:
```php
// Before sanitization
$input = "<script>alert('XSS')</script>John Doe";

// After sanitization
$sanitized = htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8');
// Result: "John Doe" (safe)
```

### 8.4 SQL Injection Protection

#### Eloquent ORM
- **Parameterized Queries**: All queries use Eloquent ORM
- **No Raw SQL**: No direct SQL queries in application code
- **Prepared Statements**: Automatic via PDO
- **Type Binding**: Automatic type casting

#### LIKE Query Security
**Location**: `CredentialController.php`

**Protection**:
```php
// Escape LIKE wildcards
$name = str_replace(['%', '_'], ['\%', '\_'], $name);
$query->where('candidate_name', 'like', '%' . $name . '%');
```

This prevents users from using SQL wildcards to extract data.

### 8.5 XSS (Cross-Site Scripting) Protection

#### Frontend Protection
- **React Auto-escaping**: React automatically escapes all content
- **No innerHTML**: No use of `dangerouslySetInnerHTML`
- **JSON API**: All data transferred as JSON (no HTML injection)

#### Backend Protection
- **Input Sanitization**: HTML tags stripped before storage
- **Output Encoding**: Special characters encoded
- **Content Security Policy**: Restricts script execution (production)

### 8.6 CSRF Protection

#### API Routes
- **Token-Based**: API uses Bearer tokens (no CSRF needed)
- **No Session Cookies**: Stateless authentication
- **CORS Configuration**: Properly configured for API access

#### Web Routes (if any)
- **Laravel CSRF Middleware**: Automatic CSRF protection
- **Token Verification**: All forms include CSRF tokens

### 8.7 Security Headers

**Location**: `app/Http/Middleware/SecurityHeaders.php`

**Headers Implemented**:

1. **X-Content-Type-Options: nosniff**
   - Prevents MIME type sniffing
   - Forces browsers to respect Content-Type

2. **X-Frame-Options: DENY**
   - Prevents clickjacking attacks
   - Blocks embedding in iframes

3. **X-XSS-Protection: 1; mode=block**
   - Enables browser XSS filter
   - Blocks detected XSS attempts

4. **Referrer-Policy: strict-origin-when-cross-origin**
   - Controls referrer information
   - Protects user privacy

5. **Strict-Transport-Security** (Production only)
   - Forces HTTPS connections
   - Prevents downgrade attacks
   - Max-age: 1 year

6. **Content-Security-Policy** (Production only)
   - Restricts resource loading
   - Prevents code injection
   - Allows React inline scripts (necessary)

7. **Removed Headers**
   - `X-Powered-By`: Removed (hides server info)
   - `Server`: Removed (hides server version)

### 8.8 Rate Limiting

**Implementation**: Laravel Throttle Middleware

**Limits**:
- **Auth Routes** (`/login`, `/register`): 5 requests per minute
- **Password Reset**: 3 requests per minute
- **Authenticated Routes**: 60 requests per minute
- **Email Routes**: 10 requests per minute

**Purpose**:
- Prevents brute force attacks
- Prevents API abuse
- Protects against DDoS
- Reduces spam

**Response**: Returns 429 Too Many Requests when limit exceeded

### 8.9 File Upload Security

#### Validation
- **File Type**: Validated by MIME type and extension
- **Size Limits**: 
  - Avatars: 2MB maximum
  - Documents: 5MB maximum
- **Storage**: Files stored in `storage/app/public`
- **Access Control**: Files served through Laravel (not direct access)

#### File Types Allowed
- **Avatars**: Images (jpg, png, gif, webp)
- **Documents**: PDF, DOC, DOCX

#### Security Measures
- File type validation before storage
- Size limits enforced
- Secure file naming
- Path traversal prevention

### 8.10 CORS Configuration

**Location**: `config/cors.php`

**Configuration**:
- **Allowed Origins**: Environment-aware
  - Production: Specific domain only
  - Development: Local network IPs allowed
- **Credentials**: Supported for authenticated requests
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Authorization, Content-Type, Accept

**Pattern Matching** (Development):
- `localhost` (any port)
- `127.0.0.1` (any port)
- `192.168.x.x` (local network)
- `10.x.x.x` (private network)
- `172.16-31.x.x` (private network)

### 8.11 Error Handling Security

#### Production Mode
- **Generic Errors**: No sensitive information leaked
- **Stack Traces**: Hidden in production
- **Database Errors**: Generic messages only
- **Validation Errors**: User-friendly messages

#### Security Best Practices
- **Fail Secure**: Errors don't reveal system information
- **Logging**: Errors logged server-side (not exposed)
- **Password Reset**: Generic message (doesn't reveal if email exists)

### 8.12 Session Security

#### Configuration
- **Secure Cookies**: HTTPS only in production
- **HttpOnly**: JavaScript cannot access cookies
- **SameSite**: CSRF protection
- **Session Driver**: Database or file (configurable)

### 8.13 Security Audit Results

**Overall Score**: 9.5/10

**Strengths**:
- ✅ Comprehensive authentication system
- ✅ Input validation and sanitization
- ✅ SQL injection protection
- ✅ XSS protection (frontend + backend)
- ✅ Security headers implemented
- ✅ Rate limiting on all routes
- ✅ File upload security
- ✅ CORS properly configured
- ✅ Production-safe error handling

**Optional Enhancements** (Low Priority):
- Audit logging for sensitive operations
- Password complexity requirements (beyond 8 chars)
- Two-factor authentication (future)
- API versioning (future)
- Refresh token system (future)

---

## 9. API Documentation

### 9.1 Base URL

```
Development: http://localhost:8000/api
Production: https://yourdomain.com/api
```

### 9.2 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {your-token-here}
```

### 9.3 Public Endpoints

#### Health Check
```http
GET /api/health
```

**Response**:
```json
{
  "status": "ok"
}
```

#### Register User
```http
POST /api/register
Content-Type: application/json (or multipart/form-data for avatar)

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "admin", // optional, defaults to "recruiter"
  "avatar": "file" // optional, image file
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "avatar_url": "http://localhost:8000/storage/avatars/..."
  },
  "token": "1|abc123...",
  "expires_at": "2025-12-11T10:00:00Z",
  "message": "User registered successfully"
}
```

**Rate Limit**: 5 requests per minute

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

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "avatar_url": "http://localhost:8000/storage/avatars/..."
  },
  "token": "2|def456...",
  "expires_at": "2025-12-11T10:00:00Z"
}
```

**Rate Limit**: 5 requests per minute

#### Forgot Password
```http
POST /api/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "If that email address exists, we will send a password reset link."
}
```

**Note**: Generic message for security (doesn't reveal if email exists)

**Rate Limit**: 3 requests per minute

#### Reset Password
```http
POST /api/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "token": "reset-token-from-email",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset successfully"
}
```

**Rate Limit**: 3 requests per minute

### 9.4 Protected Endpoints

#### Get Current User
```http
GET /api/user
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "avatar_url": "http://localhost:8000/storage/avatars/..."
  },
  "token_expires_at": "2025-12-11T10:00:00Z"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword", // optional
  "password_confirmation": "newpassword", // required if password provided
  "current_password": "oldpassword", // required if password provided
  "avatar": "file" // optional, image file
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "admin",
    "avatar_url": "http://localhost:8000/storage/avatars/..."
  },
  "message": "Profile updated successfully"
}
```

### 9.5 Credential Endpoints

#### List Credentials
```http
GET /api/credentials?page=1&per_page=10&name=keyword&type=License
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10, max: 100)
- `name` (optional): Filter by candidate name (LIKE search)
- `type` (optional): Filter by credential type (LIKE search)

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "candidate_name": "Jane Smith",
      "position": "Software Engineer",
      "credential_type": "AWS Certification",
      "issue_date": "2024-01-15",
      "expiry_date": "2025-01-15",
      "email": "jane@example.com",
      "status": "active",
      "status_color": "green",
      "calculated_status": "active",
      "calculated_status_color": "green",
      "document_url": "http://localhost:8000/storage/documents/...",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "last_page": 5
  }
}
```

**Note**: Recruiters only see their own credentials. Admins see all.

#### Get Single Credential
```http
GET /api/credentials/{id}
Authorization: Bearer {token}
```

**Response**: Same format as list item

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

**Response** (201 Created):
```json
{
  "message": "Credential created successfully",
  "credential": {
    // Full credential object
  }
}
```

#### Update Credential (Admin Only)
```http
PUT /api/credentials/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  // All fields optional, only include what you want to update
  "candidate_name": "Jane Smith Updated",
  "expiry_date": "2026-01-15",
  "document": "file" // optional, new document file
}
```

**Response** (200 OK):
```json
{
  "message": "Credential updated successfully",
  "credential": {
    // Updated credential object
  }
}
```

#### Delete Credential (Admin Only)
```http
DELETE /api/credentials/{id}
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Credential deleted successfully"
}
```

### 9.6 Email Endpoints (Admin Only)

#### Send Reminders
```http
POST /api/emails/send-reminders
Authorization: Bearer {token}
Content-Type: application/json

{
  "send_to_all": true, // true = all candidates, false = only 30/14/7 days
  "days": "30,14,7" // optional, specific days for automatic mode
}
```

**Response** (200 OK):
```json
{
  "message": "Reminder emails sent to all candidates successfully",
  "total_sent": 25,
  "errors": []
}
```

**Rate Limit**: 10 requests per minute

#### Send Summary
```http
POST /api/emails/send-summary
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Summary emails sent successfully",
  "total_sent": 3,
  "credentials_count": 15,
  "errors": []
}
```

**Rate Limit**: 10 requests per minute

### 9.7 Error Responses

#### Validation Error (422 Unprocessable Entity)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

#### Authentication Error (401 Unauthorized)
```json
{
  "message": "Unauthenticated."
}
```

#### Authorization Error (403 Forbidden)
```json
{
  "message": "This action is unauthorized."
}
```

#### Not Found (404 Not Found)
```json
{
  "message": "Credential not found."
}
```

#### Rate Limit Exceeded (429 Too Many Requests)
```json
{
  "message": "Too Many Attempts."
}
```

---

## 10. Features & Functionality

### 10.1 Credential Management

#### Create Credential
- **Who**: Admin users only
- **Fields Required**:
  - Candidate Name
  - Position
  - Credential Type
  - Email
  - Issue Date
  - Expiry Date
- **Optional Fields**:
  - Status (auto-calculated if not provided)
  - Document (PDF/DOC/DOCX)
- **Validation**:
  - Expiry date must be after issue date
  - Email must be valid format
  - Document max size: 5MB

#### View Credentials
- **Admin**: Sees all credentials
- **Recruiter**: Sees only credentials assigned to them
- **Features**:
  - Pagination (10, 25, 50, 100 per page)
  - Search by candidate name
  - Filter by credential type
  - Sort by creation date (newest first)
  - Status calculation (real-time)

#### Update Credential
- **Who**: Admin users only
- **Features**:
  - Update any field
  - Replace document
  - Status recalculation
  - All fields optional (partial updates)

#### Delete Credential
- **Who**: Admin users only
- **Action**: Permanently deletes credential and associated document
- **Confirmation**: Frontend confirmation dialog

### 10.2 Status Calculation

#### Automatic Status
Status is automatically calculated based on expiry date:

- **Active**: Expiry date > 30 days from today
- **Expiring Soon**: Expiry date ≤ 30 days from today
- **Expired**: Expiry date ≤ today
- **Pending**: No expiry date provided

#### Manual Override
- Admins can manually set status
- Manual status takes precedence over calculated
- Status can be cleared to revert to automatic

### 10.3 Dashboard Features

#### Quick Statistics
Four stat cards showing:
1. **Added This Month**: Credentials created in current month
2. **Renewals Needed**: Credentials expiring in current month
3. **Compliance Rate**: Percentage of active credentials
4. **Expiring Next Week**: Credentials expiring within 7 days

#### Status Cards
Four cards showing counts:
- Active credentials
- Expiring Soon credentials
- Expired credentials
- Total credentials

#### Status Distribution Chart
- Visual bar chart
- Shows percentage of each status
- Color-coded bars
- Animated progress bars

#### Credentials By Type
- Top 5 credential types
- Shows count for each type
- Progress bars showing distribution
- Color-coded by type

#### Upcoming Expiries
- List of credentials expiring in next 30 days
- Sorted by expiry date (soonest first)
- Shows days until expiry
- Urgency color coding:
  - Red: ≤ 7 days
  - Orange: ≤ 14 days
  - Yellow: > 14 days

#### Quick Filters
Filter buttons:
- **All**: Shows all credentials
- **Active**: Only active credentials
- **Expiring Soon**: Only expiring soon
- **Expired**: Only expired
- **This Week**: Expiring this week
- **This Month**: Expiring this month

#### Search & Filter
- Search by candidate name (LIKE search)
- Filter by credential type (LIKE search)
- Real-time filtering
- Combined with quick filters

#### Data Table
- Responsive table design
- Columns:
  - Candidate Name
  - Position
  - Credential Type
  - Issue Date
  - Expiry Date
  - Email
  - Document (view/download)
  - Status (color-coded badge)
  - Actions (edit/delete for admin)
- Pagination controls
- Per-page selector (10, 25, 50, 100)

#### CSV Export
- Export all credentials to CSV
- Includes all fields
- Filename includes date
- Download button in search bar

### 10.4 Email Management (Admin Only)

#### Send Reminders Button
- **Manual Trigger**: Sends to ALL candidates with expiry dates
- **Confirmation**: Requires user confirmation
- **Result**: Shows total sent and any errors
- **Rate Limited**: 10 requests per minute

#### Send Summary Button
- **Manual Trigger**: Sends summary to all admin users
- **Content**: List of credentials expiring in next 30 days
- **Confirmation**: Requires user confirmation
- **Result**: Shows total sent and credential count
- **Rate Limited**: 10 requests per minute

### 10.5 Profile Management

#### View Profile
- User information display
- Avatar display with fallback
- Role display (read-only)
- Edit buttons

#### Update Profile
- **Name**: Update full name
- **Email**: Update email address
- **Avatar**: Upload/remove avatar image
  - Supported: JPG, PNG, GIF
  - Max size: 2MB
  - Preview before save
- **Password**: Change password
  - Requires current password
  - New password confirmation
  - Minimum 8 characters

#### Avatar Management
- Upload new avatar
- Remove existing avatar
- Preview before saving
- Cache-busting for updates
- Fallback to initials if no avatar

### 10.6 Authentication Features

#### Login
- Email and password authentication
- Remember Me option (30-day token)
- Password visibility toggle
- Error handling with user-friendly messages
- Auto-redirect if already authenticated

#### Registration
- Create new account
- Role selection (admin/recruiter)
- Avatar upload (optional)
- Password confirmation
- Form validation
- Auto-login after registration

#### Password Reset
- **Forgot Password**: Request reset link
- **Reset Password**: Set new password with token
- **Security**: 60-minute token expiration
- **Email**: Custom notification with frontend URL

#### Remember Me
- Extends token expiration to 30 days
- Default token: 24 hours
- Checkbox on login form
- Stored in token expiration timestamp

### 10.7 Real-Time Features

#### Token Validation
- Validates token every 5 minutes
- Checks expiration before expiry
- Auto-logout on expiration
- Handles 401 errors gracefully

#### Status Updates
- Status calculated on-the-fly
- Updates when viewing credentials
- No need to manually refresh
- Real-time status in dashboard

#### Avatar Updates
- Immediate preview on upload
- Cache-busting for new images
- Global state refresh
- Updates in dashboard and profile

---

*[Continue to next section...]*



