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

### Phase 1: Contact Request System ✅
- User contact form with name, email, phone, and service selection
- REST API for form submission
- Django admin interface for managing requests
- Real-time form validation
- Success confirmation screen
- **Secure Admin Dashboard:** Session-based authentication at `/admin` to view all enquiries
- **Email Notifications:** Automatic email notifications to SRS team members on new requests
- **Theme Toggle:** Light/dark mode support throughout the application
- **Responsive Design:** Mobile-friendly interface with modern UI
- **Security:** Django session-based authentication with CSRF protection

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

3. **Create Admin User:**
   ```bash
   docker-compose exec backend python manage.py create_admin_user
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin (username: srsadmin, password: srsadmin2024)
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
- **Credentials:** Username: `srsadmin`, Password: `srsadmin2024`
- **Purpose:** View and manage all consultation requests
- **Features:**
  - Secure session-based authentication
  - View all submitted enquiries
  - Contact details with clickable email/phone links
  - Service selections and messages
  - Responsive table design
  - Refresh and logout functionality

### 🔧 **Backend API**
- **URL:** http://localhost:8000
- **Purpose:** REST API for the frontend
- **Endpoints:**
  - `POST /api/contact-request/` - Submit new consultation request
  - `POST /api/admin/login/` - Secure admin login
  - `POST /api/admin/logout/` - Secure admin logout
  - `GET /api/admin/contact-request/list/` - List all requests (authenticated)

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
- `POST /api/admin/login/` - Secure admin login
- `POST /api/admin/logout/` - Secure admin logout
- `GET /api/admin/contact-request/list/` - List contact requests (authenticated)

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

## Docker Configuration

### Proxy Setup
The frontend container is configured to proxy API requests to the backend:
- **Development**: `http://backend:8000` (Docker service communication)
- **Production**: Configure based on your deployment setup

### Container Communication
- Frontend container communicates with backend using service name `backend:8000`
- Database container accessible via `db:5432` from backend
- All containers are on the same Docker network for internal communication

## Troubleshooting

### Common Issues

#### 1. **"Proxy error: Could not proxy request"**
- **Cause**: Frontend can't reach backend API
- **Solution**: Ensure both containers are running: `docker-compose ps`
- **Check**: Backend logs: `docker-compose logs backend`

#### 2. **"CSRF Failed: Origin checking failed"**
- **Cause**: Frontend origin not in trusted origins
- **Solution**: Verify `CSRF_TRUSTED_ORIGINS` includes `http://localhost:3000`

#### 3. **"Database relation does not exist"**
- **Cause**: Migrations not applied
- **Solution**: Run `docker-compose exec backend python manage.py migrate`

#### 4. **"Invalid credentials" in admin**
- **Cause**: Admin user not created
- **Solution**: Run `docker-compose exec backend python manage.py create_admin_user`

#### 5. **Frontend not loading**
- **Cause**: Container not started or build issues
- **Solution**: Rebuild containers: `docker-compose up --build`

### Debug Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart backend
docker-compose restart frontend

# Rebuild and start
docker-compose up --build
```

## Admin Access

- **Admin Dashboard:** Access at `/admin` with secure session authentication
- **Default Credentials:** Username: `srsadmin`, Password: `srsadmin2024`
- **Features:** View all consultation requests, contact details, and service selections
- **Security:** Session-based authentication with CSRF protection
- **Email Integration:** Click on email addresses to open email client
- **Responsive Table:** Mobile-friendly table with sorting and filtering

## Email Notifications

The system automatically sends:
1. **Team Notifications:** Email to both SRS team members (robbin@srsnz.com, swati@srsnz.com) when new requests are submitted
2. **Confirmation Emails:** Auto-reply to the person who submitted the request

**Setup Required:** Configure email settings in backend `.env` file for notifications to work.

## Security Features

- ✅ **Session-based authentication** - No plain text passwords transmitted
- ✅ **CSRF protection** - Built-in Django security
- ✅ **Staff-only access** - Only users with `is_staff=True` can access admin
- ✅ **Secure cookies** - Session data stored in HTTP-only cookies
- ✅ **CORS configuration** for cross-origin requests
- ✅ **Input validation** and sanitization
- ✅ **Rate limiting** on API endpoints

---

## Phase 2: Pre-Launch Requirements

### 🔒 Security Enhancements

#### Current State
- ✅ Session-based authentication implemented
- ✅ Admin credentials stored in database
- ✅ CSRF protection enabled

#### Required Improvements
1. **Remove Hardcoded Credentials**
   - [ ] Remove default password from management command
   - [ ] Implement secure password generation
   - [ ] Add password complexity requirements
   - [ ] Remove all hardcoded credential references from code

2. **Enhanced Authentication**
   - [ ] Implement password reset functionality
   - [ ] Add two-factor authentication (2FA)
   - [ ] Implement account lockout after failed attempts
   - [ ] Add session timeout configuration
   - [ ] Implement audit logging for admin actions

3. **Data Security**
   - [ ] Encrypt sensitive data at rest
   - [ ] Implement data backup encryption
   - [ ] Add GDPR compliance features
   - [ ] Implement data retention policies

4. **API Security**
   - [ ] Add API rate limiting
   - [ ] Implement request signing
   - [ ] Add API versioning
   - [ ] Implement proper error handling without data leakage

### 🚀 Deployment (AWS)

#### Infrastructure Setup
1. **AWS Account & IAM**
   - [ ] Create dedicated AWS account for production
   - [ ] Set up IAM roles and policies
   - [ ] Configure AWS CLI and credentials
   - [ ] Enable CloudTrail for audit logging

2. **Container Registry**
   - [ ] Set up Amazon ECR repositories
   - [ ] Configure image scanning
   - [ ] Implement automated image builds
   - [ ] Set up image lifecycle policies

3. **Compute & Orchestration**
   - [ ] Deploy to AWS ECS with Fargate
   - [ ] Set up Application Load Balancer (ALB)
   - [ ] Configure auto-scaling policies
   - [ ] Implement health checks and monitoring

4. **Database**
   - [ ] Migrate to AWS RDS PostgreSQL
   - [ ] Configure automated backups
   - [ ] Set up read replicas for performance
   - [ ] Implement database encryption

5. **Networking & Security**
   - [ ] Set up VPC with private subnets
   - [ ] Configure security groups
   - [ ] Implement WAF for DDoS protection
   - [ ] Set up CloudFront CDN

6. **Monitoring & Logging**
   - [ ] Configure CloudWatch monitoring
   - [ ] Set up centralized logging
   - [ ] Implement alerting and notifications
   - [ ] Create dashboards for key metrics

#### CI/CD Pipeline
1. **Build Pipeline**
   - [ ] Set up GitHub Actions or AWS CodePipeline
   - [ ] Implement automated testing
   - [ ] Configure security scanning
   - [ ] Set up staging environment

2. **Deployment Strategy**
   - [ ] Implement blue-green deployment
   - [ ] Set up rollback procedures
   - [ ] Configure environment-specific configs
   - [ ] Implement database migrations

### 🎯 Product Launch

#### Pre-Launch Checklist
1. **Domain & SSL**
   - [ ] Purchase and configure domain (e.g., srsconsulting.co.nz)
   - [ ] Set up SSL certificates (Let's Encrypt or AWS Certificate Manager)
   - [ ] Configure DNS records
   - [ ] Test domain resolution

2. **Content & Branding**
   - [ ] Review and finalize all website content
   - [ ] Verify contact information accuracy
   - [ ] Test all forms and functionality
   - [ ] Ensure mobile responsiveness
   - [ ] Validate accessibility compliance

3. **Email Configuration**
   - [ ] Set up professional email addresses
   - [ ] Configure SPF, DKIM, and DMARC records
   - [ ] Test email delivery and notifications
   - [ ] Set up email monitoring

4. **Performance & Testing**
   - [ ] Load test the application
   - [ ] Optimize images and assets
   - [ ] Implement caching strategies
   - [ ] Test backup and recovery procedures

5. **Legal & Compliance**
   - [ ] Review privacy policy and terms of service
   - [ ] Ensure GDPR compliance
   - [ ] Set up cookie consent if required
   - [ ] Verify data handling procedures

#### Launch Day
1. **Final Verification**
   - [ ] Complete end-to-end testing
   - [ ] Verify all integrations work
   - [ ] Test admin functionality
   - [ ] Confirm email notifications

2. **Go-Live**
   - [ ] Update DNS to point to production
   - [ ] Monitor application health
   - [ ] Verify SSL certificate activation
   - [ ] Test contact form submissions

3. **Post-Launch**
   - [ ] Monitor error logs and performance
   - [ ] Gather user feedback
   - [ ] Plan iterative improvements
   - [ ] Set up ongoing maintenance schedule

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to SRS Consulting Limited. 