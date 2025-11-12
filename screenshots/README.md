# Screenshots Directory

This directory should contain screenshots of the application for documentation purposes.

## Required Screenshots

1. **dashboard.png** - Main dashboard showing status cards, notification banner, and credentials table
2. **add-credential.png** - Modal form for adding new credentials
3. **edit-credential.png** - Modal form for editing existing credentials
4. **status-tags.png** - Color-coded status tags with hover tooltips
5. **email-reminder.png** - Sample email reminder for expiring credentials
6. **email-summary.png** - Daily summary email sent to Admin users

## How to Take Screenshots

1. Start the application:
   ```bash
   # Backend
   cd backend && php artisan serve
   
   # Frontend
   cd frontend && npm run dev
   ```

2. Open `http://localhost:5173` in your browser

3. Take screenshots of:
   - Dashboard with sample data
   - Add/Edit credential modals
   - Status tags with tooltips visible
   - Filtered/search results

4. For email screenshots:
   - Configure Mailtrap
   - Send test emails using Tinker
   - Capture emails from Mailtrap inbox

## Screenshot Guidelines

- Use PNG format
- Recommended size: 1920x1080 or similar
- Include browser chrome for context
- Show actual data, not empty states
- Highlight key features (status colors, tooltips, etc.)

## Example Screenshot Names

- `01-dashboard-overview.png`
- `02-add-credential-modal.png`
- `03-status-tags-tooltip.png`
- `04-email-reminder-30-days.png`
- `05-email-summary-admin.png`

