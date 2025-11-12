# Email Testing Guide

## Mail Configuration

### Option 1: Mailtrap (Recommended for Testing)

1. Sign up for a free account at [https://mailtrap.io](https://mailtrap.io)
2. Create an inbox and get your SMTP credentials
3. Update your `.env` file with:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="Laravel"
```

### Option 2: Log Driver (Local Testing)

For local testing without external services, use the log driver:

```env
MAIL_MAILER=log
```

Emails will be saved to `storage/logs/laravel.log`

### Option 3: SendGrid (Production)

For production, configure SendGrid:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="Your App Name"
```

## Testing Emails

### Step 1: Seed Test Data

Run the test email seeder to create credentials with specific expiry dates:

```bash
php artisan db:seed --class=TestEmailSeeder
```

This creates:
- Credential expiring in 30 days
- Credential expiring in 14 days
- Credential expiring in 7 days
- Credential expiring in 5 days (for summary)
- Credential expiring in 20 days (for summary)

### Step 2: Test Reminder Emails

Open Tinker and test individual reminder emails:

```bash
php artisan tinker
```

Then run:

```php
use App\Mail\CredentialExpiryReminder;
use App\Models\Credential;
use Illuminate\Support\Facades\Mail;

// Test 30-day reminder
$credential = Credential::where('candidate_name', 'like', '%30 Days%')->first();
Mail::to($credential->user->email)->send(new CredentialExpiryReminder($credential, 30));

// Test 14-day reminder
$credential = Credential::where('candidate_name', 'like', '%14 Days%')->first();
Mail::to($credential->user->email)->send(new CredentialExpiryReminder($credential, 14));

// Test 7-day reminder
$credential = Credential::where('candidate_name', 'like', '%7 Days%')->first();
Mail::to($credential->user->email)->send(new CredentialExpiryReminder($credential, 7));
```

### Step 3: Test Summary Email

Test the daily summary email to Admin:

```php
use App\Mail\CredentialExpirySummary;
use App\Models\Credential;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

$admin = User::where('role', 'admin')->first();
$credentials = Credential::whereDate('expiry_date', '>=', now())
    ->whereDate('expiry_date', '<=', now()->addDays(30))
    ->whereNotNull('expiry_date')
    ->with('user')
    ->orderBy('expiry_date', 'asc')
    ->get();

Mail::to($admin->email)->send(new CredentialExpirySummary($credentials));
```

### Step 4: Test Scheduled Commands

Test the reminder command:

```bash
php artisan credentials:send-reminders
```

Test the summary command:

```bash
php artisan credentials:send-summary
```

## Email Templates

### Reminder Email Template
Location: `resources/views/emails/credential-expiry-reminder.blade.php`

Features:
- Shows candidate name, position, credential type
- Displays issue date and expiry date
- Shows days until expiry
- Urgent warning for credentials expiring in ≤7 days

### Summary Email Template
Location: `resources/views/emails/credential-expiry-summary.blade.php`

Features:
- Table of all credentials expiring within 30 days
- Days until expiry for each credential
- Status indicators (Urgent, Warning, Notice)
- Sorted by expiry date

## Troubleshooting

### Emails not sending

1. Check your `.env` file has correct mail configuration
2. Verify Mailtrap credentials are correct
3. Check `storage/logs/laravel.log` for errors
4. Run `php artisan config:clear` after changing `.env`

### Emails going to spam

1. Verify `MAIL_FROM_ADDRESS` matches your domain
2. Check SPF and DKIM records for your domain
3. Use a verified sender address

### Testing with log driver

If using `MAIL_MAILER=log`, check emails in:
```
storage/logs/laravel.log
```

Search for "Message-ID" to find email entries.

