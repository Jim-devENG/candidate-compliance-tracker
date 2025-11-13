# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration

**Backend `.env` (Production):**
```env
APP_NAME="Goodwill Staffing Compliance Tracker"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com
APP_KEY=base64:your-generated-key-here

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=goodwill_production
DB_USERNAME=your_db_user
DB_PASSWORD=your_strong_password

FRONTEND_URL=https://yourdomain.com

MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Goodwill Staffing"

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

**Frontend `.env.production`:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### 2. Security Settings

- ✅ **APP_DEBUG=false** - Never enable in production
- ✅ **HTTPS Only** - All URLs must use https://
- ✅ **Strong Passwords** - Database, email, etc.
- ✅ **Rate Limiting** - Already configured
- ✅ **CORS** - Restricted to production domain
- ✅ **Token Expiration** - Configured (24h/30d)

### 3. Server Setup

**Required:**
- PHP 8.2+ with extensions: pdo, pdo_mysql, mbstring, openssl, tokenizer, xml, json, bcmath
- MySQL 8.0+ or PostgreSQL 13+
- Composer
- Node.js 18+ and npm
- Web server (Nginx recommended)
- SSL certificate

### 4. Deployment Steps

#### Backend Deployment

```bash
# 1. Clone repository
git clone <your-repo-url>
cd goodwill/backend

# 2. Install dependencies (production only)
composer install --optimize-autoloader --no-dev

# 3. Copy environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Configure .env with production values (see above)

# 6. Run migrations
php artisan migrate --force

# 7. Create storage link
php artisan storage:link

# 8. Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 9. Set permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### Frontend Deployment

```bash
# 1. Navigate to frontend
cd ../frontend

# 2. Install dependencies
npm install

# 3. Create production .env
echo "VITE_API_BASE_URL=https://api.yourdomain.com/api" > .env.production

# 4. Build for production
npm run build

# 5. Deploy dist/ folder to web server
# Configure web server to serve index.html for all routes (SPA routing)
```

### 5. Web Server Configuration

#### Nginx Configuration Example

```nginx
# Frontend
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/goodwill/frontend/dist;
    index index.html;
    
    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/goodwill/backend/public;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Deny access to .htaccess
    location ~ /\. {
        deny all;
    }
}
```

### 6. Cron Job Setup

Add to crontab (`crontab -e`):
```bash
* * * * * cd /var/www/goodwill/backend && php artisan schedule:run >> /dev/null 2>&1
```

This runs scheduled tasks (email reminders, summaries).

### 7. Database Backup

Set up automated backups:
```bash
# Daily backup script
0 2 * * * mysqldump -u user -p'password' goodwill_production > /backups/goodwill_$(date +\%Y\%m\%d).sql
```

### 8. Monitoring

- **Error Logging**: Check `storage/logs/laravel.log`
- **Uptime Monitoring**: Use services like UptimeRobot
- **Performance**: Monitor API response times
- **Database**: Monitor query performance

### 9. Post-Deployment Verification

1. ✅ Test login/registration
2. ✅ Test password reset
3. ✅ Test protected routes
4. ✅ Test file uploads (avatar, documents)
5. ✅ Test email sending
6. ✅ Verify HTTPS is working
7. ✅ Check CORS headers
8. ✅ Test rate limiting
9. ✅ Verify scheduled tasks (cron)
10. ✅ Test on mobile devices

### 10. Security Hardening

- [ ] Enable firewall (only allow 80, 443, 22)
- [ ] Disable unnecessary PHP functions
- [ ] Set proper file permissions
- [ ] Enable fail2ban
- [ ] Regular security updates
- [ ] Database user with minimal privileges
- [ ] Regular backups tested

## Production Features Status

✅ **Ready:**
- Authentication system
- Token-based security
- Real-time validation
- Password reset
- Role-based access
- File uploads
- Email functionality
- Rate limiting
- Error handling

⚠️ **Requires Configuration:**
- Environment variables
- SSL certificates
- Email service (SendGrid/AWS SES)
- Database credentials
- Web server setup
- Cron jobs

## Support

For issues or questions, check:
- `PRODUCTION_CHECKLIST.md` - Complete checklist
- `MOBILE_ACCESS_SETUP.md` - Mobile access setup
- Laravel logs: `storage/logs/laravel.log`

