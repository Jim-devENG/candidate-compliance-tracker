# Deployment Guide

## Production Deployment Checklist

### Backend Deployment

#### 1. Server Requirements
- PHP 8.2 or higher
- MySQL 8.0+
- Composer
- Nginx or Apache
- SSL Certificate (recommended)

#### 2. Environment Configuration

Update `.env` for production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your_production_host
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password

# Mail (Use SendGrid, Mailgun, or similar)
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="Your App Name"

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Cache
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Session
SESSION_DRIVER=redis
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
```

#### 3. Deployment Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd candidate-compliance-tracker/backend

# 2. Install dependencies
composer install --optimize-autoloader --no-dev

# 3. Copy environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Update .env with production values
nano .env

# 6. Run migrations
php artisan migrate --force

# 7. Seed database (optional)
php artisan db:seed --force

# 8. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# 9. Set permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 4. Web Server Configuration

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**Apache Configuration (.htaccess already included):**

Ensure `mod_rewrite` is enabled:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### 5. Scheduled Tasks

Add to crontab:
```bash
crontab -e
```

Add this line:
```
* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1
```

### Frontend Deployment

#### 1. Build for Production

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with optimized production files.

#### 2. Deploy Options

**Option A: Static Hosting (Vercel, Netlify, etc.)**

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable: `VITE_API_BASE_URL=https://api.yourdomain.com/api`

**Option B: Traditional Web Server**

1. Copy `dist/` folder contents to web server
2. Configure web server to serve index.html for all routes
3. Update API base URL in production build

**Nginx Configuration for SPA:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3. Environment Variables

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Build with production env:
```bash
npm run build -- --mode production
```

### Database Migration in Production

```bash
# Run migrations
php artisan migrate --force

# Rollback if needed
php artisan migrate:rollback --step=1

# Fresh migration (WARNING: Drops all tables)
php artisan migrate:fresh --force
```

### SSL/HTTPS Setup

1. **Install Certbot:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Get SSL Certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal:**
   Certbot sets up auto-renewal automatically.

### Monitoring & Logs

**View Laravel logs:**
```bash
tail -f storage/logs/laravel.log
```

**View scheduled task logs:**
```bash
tail -f storage/logs/scheduler.log
```

**Monitor queue jobs:**
```bash
php artisan queue:work
```

### Backup Strategy

**Database Backup:**
```bash
# Daily backup script
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

**File Backup:**
```bash
# Backup storage and .env
tar -czf backup_$(date +%Y%m%d).tar.gz storage .env
```

### Security Checklist

- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure session cookies
- [ ] Use Redis for cache and sessions
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Backup strategy in place

### Performance Optimization

1. **Enable OPcache:**
   ```ini
   opcache.enable=1
   opcache.memory_consumption=128
   ```

2. **Use Redis for cache:**
   ```env
   CACHE_STORE=redis
   ```

3. **Enable HTTP/2:**
   Configure in Nginx/Apache

4. **CDN for static assets:**
   Use CloudFlare or similar

### Troubleshooting

**Clear all caches:**
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear
```

**Check queue status:**
```bash
php artisan queue:work --verbose
```

**Test scheduled tasks:**
```bash
php artisan schedule:run --verbose
```

---

## Docker Deployment (Optional)

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:80"
    environment:
      - DB_HOST=db
      - DB_DATABASE=laravel
      - DB_USERNAME=laravel
      - DB_PASSWORD=password
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend

  db:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=laravel
      - MYSQL_USER=laravel
      - MYSQL_PASSWORD=password
      - MYSQL_ROOT_PASSWORD=rootpassword
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

---

## CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/project
            git pull
            composer install --no-dev
            php artisan migrate --force
            php artisan optimize
```

---

**Remember:** Always test in a staging environment before deploying to production!

