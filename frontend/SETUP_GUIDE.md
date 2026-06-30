
# Client Acquisition Automation - Setup Guide

## 1. Start the Backend
```bash
cd backend
npm start
```

## 2. Start the Frontend
```bash
cd frontend
npm run dev
```

## 3. Install & Start n8n
To install n8n globally, run:
```bash
npm install -g n8n
```

Then start n8n:
```bash
n8n start
```
n8n will be available at http://localhost:5678

## 4. Import the Workflow
1. Open n8n in your browser: http://localhost:5678
2. Click "Import from File" in the top right
3. Select the `n8n-workflow.json` file from this directory
4. Click "Open"

## 5. Configure the Workflow
1. Update the "Send Initial Email" and "Send Follow-Up" nodes with your email credentials
2. (Optional) Add a Calendar node (Google Calendar, Cal.com, etc.) to book meetings automatically
3. Activate the workflow!

## How It Works
1. You click "Start Scraper" in the frontend
2. Backend scrapes leads and sends them to n8n via webhook
3. n8n:
   - Sends initial email
   - Waits 2 days
   - Sends follow-up email
   - Updates lead in backend (status, follow-up status, etc.)

## Important Notes
- For production, use a real database (PostgreSQL, MongoDB) instead of in-memory storage
- Secure the `/update-lead` endpoint with a secret header
- Add real scraping logic using Puppeteer, Cheerio, or similar libraries
