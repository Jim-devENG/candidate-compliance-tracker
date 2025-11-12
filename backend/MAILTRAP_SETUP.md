# Mailtrap Setup Guide

Mailtrap is a fake SMTP server for testing emails in development. It captures all emails sent by your application so you can view them in a web interface without actually sending them.

## Step 1: Create a Mailtrap Account

1. Go to [https://mailtrap.io](https://mailtrap.io)
2. Click **"Sign Up"** (or **"Log In"** if you already have an account)
3. Create a free account (no credit card required)

## Step 2: Get Your SMTP Credentials

1. After logging in, you'll see your **Inboxes**
2. Click on **"Inboxes"** in the left sidebar
3. Select an inbox (or create a new one)
4. Click on the inbox name to open it
5. Go to the **"SMTP Settings"** tab
6. Select **"Laravel"** from the integration dropdown
7. You'll see your credentials:
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525` (or `465` for SSL, `587` for TLS)
   - **Username**: (your Mailtrap username)
   - **Password**: (your Mailtrap password)

## Step 3: Update Your Laravel .env File

Open your `backend/.env` file and add/update these lines:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username_here
MAIL_PASSWORD=your_mailtrap_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

**Important:** Replace:
- `your_mailtrap_username_here` with your actual Mailtrap username
- `your_mailtrap_password_here` with your actual Mailtrap password
- `noreply@yourdomain.com` with your preferred sender email (can be any email for testing)

## Step 4: Clear Laravel Config Cache

After updating `.env`, clear the config cache:

```bash
cd backend
php artisan config:clear
php artisan config:cache
```

## Step 5: Test Email Sending

### Option A: Test via Artisan Command

Test the reminder emails:

```bash
php artisan credentials:send-reminders
```

Test the summary email:

```bash
php artisan credentials:send-summary
```

### Option B: Test via Tinker

```bash
php artisan tinker
```

Then run:

```php
use App\Mail\CredentialExpiryReminder;
use App\Models\Credential;
use Illuminate\Support\Facades\Mail;

// Get a credential
$credential = Credential::with('user')->first();

// Send a test reminder email
Mail::to($credential->user->email)->send(
    new CredentialExpiryReminder($credential, 30)
);
```

## Step 6: View Emails in Mailtrap

1. Go back to your Mailtrap inbox
2. Click on the **"Messages"** tab
3. You should see all emails sent by your application
4. Click on any email to view its content, HTML, raw source, etc.

## Troubleshooting

### Emails not appearing in Mailtrap

1. **Check credentials**: Verify your `MAIL_USERNAME` and `MAIL_PASSWORD` in `.env` match Mailtrap exactly
2. **Clear cache**: Run `php artisan config:clear` and `php artisan config:cache`
3. **Check logs**: Look at `storage/logs/laravel.log` for error messages
4. **Verify port**: Make sure `MAIL_PORT=2525` (or `587` for TLS)
5. **Check encryption**: Use `MAIL_ENCRYPTION=tls` for port 2525 or 587

### Common Errors

**"Connection refused"**
- Check if `MAIL_HOST` is correct: `sandbox.smtp.mailtrap.io`
- Verify port number matches encryption type

**"Authentication failed"**
- Double-check `MAIL_USERNAME` and `MAIL_PASSWORD` in `.env`
- Make sure there are no extra spaces or quotes

**"Emails not sending"**
- Run `php artisan config:clear` after changing `.env`
- Check `storage/logs/laravel.log` for detailed error messages

## Production Setup

**Important:** Mailtrap is for **testing only**. For production, use a real email service like:
- **SendGrid** (recommended)
- **Mailgun**
- **Amazon SES**
- **Postmark**

Update your `.env` with production SMTP credentials when deploying.

## Quick Reference

Your `.env` should look like this:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=abc123def456
MAIL_PASSWORD=xyz789uvw012
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@goodwill.com
MAIL_FROM_NAME="Goodwill Credential Tracker"
```

After updating, always run:
```bash
php artisan config:clear
```

