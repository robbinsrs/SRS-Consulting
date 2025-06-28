# SRS Consulting - Financial Services Platform

## Overview

**SRS Consulting:** Your Trusted Partner for Accounting, Compliance & Growth in New Zealand. We provide end-to-end financial solutions, including company setup, GST & tax filings, strategic financial consulting, bookkeeping, payroll, government agency advocacy, and more.

## Tech Stack

- **Frontend:** React with TypeScript
- **Backend:** Django REST API
- **Database:** PostgreSQL (AWS RDS Free Tier)
- **Deployment:** Docker containers

## Project Structure

```
srs-consulting/
├── backend/                 # Django backend
│   ├── srs_consulting/     # Django project
│   ├── api/                # REST API app
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend container
├── frontend/               # React frontend
│   ├── src/
│   ├── package.json       # Node dependencies
│   └── Dockerfile         # Frontend container
├── docker-compose.yml     # Development environment
└── README.md             # This file
```

## Features

### Phase 1: Contact Request System
- User contact form with name, email, phone, and service selection
- REST API for form submission
- Django admin interface for managing requests
- Real-time form validation
- Success confirmation screen
- **Admin Dashboard:** Password-protected admin page at `/admin` to view all enquiries
- **Email Notifications:** Automatic email notifications to SRS team members on new requests
- **Theme Toggle:** Light/dark mode support throughout the application
- **Responsive Design:** Mobile-friendly interface with modern UI

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd srs-consulting
   ```

2. **Start with Docker:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin (password: srsadmin2024)
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

## How to Access

Once the application is running, you can access different parts of the system:

### 🌐 **Main Website**
- **URL:** http://localhost:3000
- **Purpose:** Public-facing website for SRS Consulting
- **Features:** 
  - Company information and services
  - Contact form for consultation requests
  - Theme toggle (light/dark mode)
  - Responsive design

### 🔐 **Admin Dashboard**
- **URL:** http://localhost:3000/admin
- **Password:** `srsadmin2024`
- **Purpose:** View and manage all consultation requests
- **Features:**
  - View all submitted enquiries
  - Contact details with clickable email/phone links
  - Service selections and messages
  - Responsive table design
  - Export functionality (future enhancement)

### 🔧 **Backend API**
- **URL:** http://localhost:8000
- **Purpose:** REST API for the frontend
- **Endpoints:**
  - `POST /api/contact-request/` - Submit new consultation request
  - `GET /api/contact-request/list/` - List all requests (admin only)

### ⚙️ **Django Admin**
- **URL:** http://localhost:8000/admin
- **Purpose:** Django's built-in admin interface
- **Features:** Database management and user administration
- **Note:** Requires Django superuser account

### 📧 **Email Notifications**
- **Automatic emails sent to:**
  - **SRS Team:** robbin@srsnz.com, swati@srsnz.com (on new requests)
  - **Requesters:** Auto-confirmation emails
- **Setup:** Configure email settings in backend `.env` file

### 🎨 **Theme Features**
- **Toggle:** Available in the header navigation
- **Colors:** Light blue and light pink theme
- **Modes:** Light and dark mode support
- **Persistence:** Theme preference saved in browser

## Local Development

1. **Backend setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## API Endpoints

- `POST /api/contact-request/` - Submit contact request
- `GET /api/contact-request/list/` - List contact requests (admin only)

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/srs_consulting
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Email Settings (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Admin Access

- **Admin Dashboard:** Access at `/admin` with password `srsadmin2024`
- **Features:** View all consultation requests, contact details, and service selections
- **Email Integration:** Click on email addresses to open email client
- **Responsive Table:** Mobile-friendly table with sorting and filtering

## Email Notifications

The system automatically sends:
1. **Team Notifications:** Email to both SRS team members (robbin@srsnz.com, swati@srsnz.com) when new requests are submitted
2. **Confirmation Emails:** Auto-reply to the person who submitted the request

**Setup Required:** Configure email settings in backend `.env` file for notifications to work.

## Security Features

- CORS configuration for cross-origin requests
- Input validation and sanitization
- HTTPS enforcement in production
- Django admin authentication
- Rate limiting on API endpoints

## Deployment

The application is containerized and ready for deployment to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Any Docker-compatible platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

Proprietary - SRS Consulting 