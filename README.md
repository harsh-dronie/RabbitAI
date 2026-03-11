# Rabbitt AI – Sales Insight Automator

A production-ready full stack application that analyzes sales spreadsheets with AI and sends professional narrative summaries via email within 30 seconds.

## Features

- Upload CSV/XLSX sales spreadsheets
- AI-powered sales analysis and insights
- Automated email delivery
- Production-ready security (helmet, CORS, rate limiting)
- 5MB file size limit
- 30-second processing guarantee

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios

**Backend:**
- Node.js + Express
- TypeScript
- Multer (file upload)
- xlsx & csv-parser (spreadsheet parsing)
- OpenAI API (AI summarization)
- Nodemailer (email service)
- Security: helmet, cors, express-rate-limit

## Project Structure

```
rabbitt-ai/
├── frontend/          # Next.js 14 application
├── backend/           # Express REST API
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- SMTP email credentials

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Configure environment variables
4. Start development servers

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

Frontend runs on http://localhost:3000

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs on http://localhost:3001

## Environment Variables

See `.env.example` files in frontend and backend directories.

## Deployment

**Frontend:** Deploy to Vercel
**Backend:** Deploy to Railway, Render, or Fly.io

## API Documentation

### POST /api/upload

Upload a sales spreadsheet and send AI-generated summary via email.

**Request:**
- Content-Type: multipart/form-data
- Fields:
  - `file`: CSV or XLSX file (max 5MB)
  - `email`: Recipient email address

**Response:**
```json
{
  "success": true,
  "message": "Sales summary sent successfully"
}
```

**Rate Limit:** 10 requests per 15 minutes per IP

## Security

- Helmet security headers
- CORS allowlist
- Rate limiting
- File type validation
- File size limits
- Memory-only storage
- Input sanitization

## License

MIT


## DevOps: Docker & CI

### Local Deployment with Docker

Build and run the application using Docker Compose:

```bash
# Build images with latest base images
docker compose build --pull

# Start services in detached mode
docker compose up -d

# View backend logs
docker compose logs -f backend
```

### Production Deployment

**Environment Variables:**
- Copy `.env.example` to `.env` in backend directory
- Set production secrets (API keys, email credentials)
- Never commit `.env` to git

**GitHub Actions:**
- Secrets are configured in repository settings
- CI workflow runs on pull requests to main branch
- Lints code and builds Docker images

**Cloud Provider Setup:**
- Set environment variables in your cloud provider dashboard
- Configure secrets for OpenAI API key and email credentials
- Use production SMTP settings for email delivery

### Available Services

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Health Check:** http://localhost:8000/api/health
- **Swagger Docs:** http://localhost:8000/api-docs
