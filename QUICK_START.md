# Quick Start Guide

Get the application up and running in 5 minutes!

## Prerequisites

- PHP 8.2+, Composer, Node.js 18+, MySQL 8.0+

## Backend Setup (2 minutes)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Update .env with your database credentials
# DB_DATABASE=your_database
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

php artisan migrate
php artisan db:seed
php artisan serve
```

Backend running at: `http://localhost:8000`

## Frontend Setup (2 minutes)

```bash
cd frontend
npm install
npm run dev
```

Frontend running at: `http://localhost:5173`

## Test Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `password`

**Recruiter:**
- Email: `recruiter@example.com`
- Password: `password`

## Test Email Data

```bash
cd backend
php artisan db:seed --class=TestEmailSeeder
```

## Test Emails

```bash
cd backend
php artisan tinker < test-emails.php
```

## That's it! 🎉

Open `http://localhost:5173` in your browser and start managing credentials!

For detailed documentation, see [README.md](README.md)

