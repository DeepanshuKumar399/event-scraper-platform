# Event Scraper Platform

Automatically scrape events from Sydney, Australia with Google OAuth authentication.

## Features
- Auto-scrape events every hour
- Manual scraper trigger
- Google OAuth login
- Event filtering (city, date, keyword, status)
- Status tracking (new, updated, inactive, imported)
- Import events to database

## Setup

### 1. Install MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017`

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret

### 3. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event-scraper
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_random_secret_key
CLIENT_URL=http://localhost:5500
```

Start server:
```bash
node server.js
```

### 4. Frontend Setup
Open `frontend/index.html` with Live Server (port 5500) or any web server.

## Usage
1. Open `http://localhost:5500` in browser
2. Click "Login with Google"
3. After login, you'll be redirected to dashboard
4. Click "Run Scraper Now" to manually trigger scraping
5. Use filters to search events
6. Select events and click "Import Selected to DB" to mark as imported

## Auto-Updates
The scraper runs automatically every hour via cron job.
