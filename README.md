# Client Acquisition Automation

A full-stack client acquisition automation platform with AI-powered lead scraping, outreach, and management.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Sonner (toasts) + Framer Motion
- **Backend**: Node.js + Express + JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Integrations**: n8n (workflow automation)

## Project Structure

```
Client Acquisition Automation/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── leadsController.js
│   │   │   └── scraperController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Lead.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── leadsRoutes.js
│   │   │   └── scraperRoutes.js
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── data/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── dashboard/
│   │   │   └── landing/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   ├── .env
│   └── .env.example
├── n8n-workflow.json
└── README.md
```

## Setup Guide

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- (Optional) SerpApi key for real Google Maps scraping (get from https://serpapi.com/)

### 2. Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy .env.example to .env and update environment variables:
   ```bash
   cp .env.example .env
   ```
   Make sure to set:
   - A secure `JWT_SECRET`
   - `MONGO_URI` (use your local MongoDB or MongoDB Atlas connection string)
   - (Optional) `SERP_API_KEY` - Get one for real Google Maps scraping (from https://serpapi.com/)
4. Start the backend server:
   ```bash
   npm start
   ```
   Backend will run on http://localhost:5000

### 3. Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy .env.example to .env:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173 (or next available port)

### 4. n8n Setup (Optional)
1. Install n8n globally:
   ```bash
   npm install -g n8n
   ```
2. Start n8n:
   ```bash
   n8n start
   ```
3. Import the workflow from n8n-workflow.json
4. Configure email credentials in the workflow nodes
5. Activate the workflow!

## Features
- **Authentication**: User registration and login with JWT tokens
- **Dashboard**: Overview of pipeline, KPIs, and recent leads
- **Leads Management**: View, filter, and manage leads
- **Scraper**: Scrape new leads from various sources
- **Audit**: Website audit reports for leads
- **Outreach**: Email outreach campaigns
- **AI Copilot**: AI-powered sales assistance
- **Analytics**: Pipeline and performance analytics
- **Pricing Plan**: Upgrade to premium features

## Security Best Practices (Backend)
- Helmet for security headers
- CORS configuration
- Rate limiting
- Password hashing (bcrypt)
- JWT-based authentication
- Input validation with Mongoose schemas

## Next Steps for Production
- Add more robust input validation (e.g., Zod/Joi)
- Add email verification
- Add password reset functionality
- Set up HTTPS
- Configure proper logging
- Set up monitoring and error tracking
- Add pagination to leads API
- Add sorting/filtering to leads API
