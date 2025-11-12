# Documentation Index

Complete guide to all project documentation files.

## 📚 Main Documentation

### [README.md](README.md)
**Main project documentation** - Complete guide covering:
- Tech stack overview
- Project structure
- Setup instructions (Backend & Frontend)
- Database migrations
- Environment variables
- API endpoints summary
- Frontend features
- Email features
- Database seeding
- Screenshots guide
- Deployment basics
- Troubleshooting

**Start here for:** Complete project overview and setup

---

### [QUICK_START.md](QUICK_START.md)
**5-minute quick start guide** - Get up and running fast:
- Prerequisites
- Backend setup (2 minutes)
- Frontend setup (2 minutes)
- Test credentials
- Test email data
- Quick testing commands

**Start here for:** Fast setup without reading full documentation

---

### [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
**Project summary** - High-level overview:
- Key features
- Project structure
- Database schema
- API endpoints summary
- Status calculation logic
- Email features
- Technology stack
- Development URLs
- Default credentials

**Start here for:** Quick project overview

---

## 🚀 Deployment Documentation

### [DEPLOYMENT.md](DEPLOYMENT.md)
**Production deployment guide** - Complete deployment instructions:
- Server requirements
- Environment configuration
- Deployment steps
- Web server configuration (Nginx/Apache)
- Scheduled tasks setup
- SSL/HTTPS setup
- Monitoring & logs
- Backup strategy
- Security checklist
- Performance optimization
- Docker deployment (optional)
- CI/CD pipeline (optional)

**Start here for:** Production deployment

---

## 📡 API Documentation

### [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
**Complete API reference** - Detailed API documentation:
- Base URL
- Authentication
- All endpoints with examples
- Request/response formats
- Validation rules
- Error responses
- Status calculation logic
- Example cURL requests

**Start here for:** API integration and testing

---

## 📧 Email Documentation

### [backend/README-EMAIL-TESTING.md](backend/README-EMAIL-TESTING.md)
**Email testing guide** - Email configuration and testing:
- Mail configuration options (Mailtrap, SendGrid, Log)
- Email templates overview
- Testing instructions
- Tinker commands
- Troubleshooting

**Start here for:** Email setup and testing

---

## 🖼️ Screenshots

### [screenshots/README.md](screenshots/README.md)
**Screenshot guidelines** - Instructions for taking screenshots:
- Required screenshots list
- How to take screenshots
- Screenshot guidelines
- Example screenshot names

**Start here for:** Creating documentation screenshots

---

## 📋 Quick Reference

### Setup Commands

**Backend:**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Database Seeding

**Default data:**
```bash
php artisan db:seed
```

**Test email data:**
```bash
php artisan db:seed --class=TestEmailSeeder
```

### Testing Commands

**Test reminder emails:**
```bash
php artisan credentials:send-reminders
```

**Test summary email:**
```bash
php artisan credentials:send-summary
```

**Test emails via Tinker:**
```bash
php artisan tinker < test-emails.php
```

### API Testing

**Health check:**
```bash
curl http://localhost:8000/api/health
```

**List credentials:**
```bash
curl http://localhost:8000/api/credentials
```

**Create credential:**
```bash
curl -X POST http://localhost:8000/api/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_name": "John Doe",
    "position": "Software Engineer",
    "credential_type": "Professional License",
    "issue_date": "2024-01-01",
    "expiry_date": "2025-01-01",
    "email": "john@example.com"
  }'
```

---

## 📁 File Structure

```
candidate-compliance-tracker/
├── README.md                    # Main documentation
├── QUICK_START.md               # Quick start guide
├── PROJECT_SUMMARY.md           # Project summary
├── DEPLOYMENT.md                # Deployment guide
├── DOCUMENTATION_INDEX.md       # This file
├── screenshots/                 # Screenshots directory
│   └── README.md               # Screenshot guidelines
├── backend/                     # Laravel API
│   ├── API_DOCUMENTATION.md     # API reference
│   └── README-EMAIL-TESTING.md # Email testing guide
└── frontend/                    # React App
```

---

## 🎯 Getting Started

1. **New to the project?** → Start with [QUICK_START.md](QUICK_START.md)
2. **Need full setup?** → Read [README.md](README.md)
3. **Want overview?** → Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
4. **Deploying?** → Follow [DEPLOYMENT.md](DEPLOYMENT.md)
5. **API integration?** → See [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
6. **Email setup?** → Read [backend/README-EMAIL-TESTING.md](backend/README-EMAIL-TESTING.md)

---

## 📞 Support

For issues and questions:
- Check [README.md](README.md) Troubleshooting section
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- See [backend/README-EMAIL-TESTING.md](backend/README-EMAIL-TESTING.md) for email issues

---

**Documentation Version:** 1.0  
**Last Updated:** November 2024

