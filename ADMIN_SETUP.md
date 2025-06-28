# SRS Consulting Admin Setup Guide

## Secure Admin Authentication

The admin panel now uses Django's built-in session-based authentication instead of plain text passwords, making it much more secure.

## Setup Instructions

### 1. Start the Backend

```bash
cd /Users/bhavinikanoongo/srs-consulting
docker-compose up -d
```

### 2. Create Admin User

Run the Django management command to create an admin user:

```bash
docker-compose exec backend python manage.py create_admin_user
```

This will create a user with:
- **Username**: `srsadmin`
- **Password**: `srsadmin2024`
- **Email**: `admin@srsnz.com`

### 3. Access the Admin Panel

1. Navigate to the admin page in your browser
2. Enter the credentials:
   - Username: `srsadmin`
   - Password: `srsadmin2024`

### 4. Security Features

- ✅ **Session-based authentication** - No plain text passwords sent over the network
- ✅ **CSRF protection** - Built-in Django security
- ✅ **Staff-only access** - Only users with `is_staff=True` can access
- ✅ **Automatic logout** - Sessions expire and can be manually logged out
- ✅ **Secure cookies** - Session data stored in HTTP-only cookies

### 5. Change Default Password

**IMPORTANT**: After first login, change the default password:

1. Go to Django admin: `http://localhost:8000/admin/`
2. Login with the same credentials
3. Navigate to Users and change the password for `srsadmin`

### 6. Custom Admin User

To create a custom admin user with different credentials:

```bash
docker-compose exec backend python manage.py create_admin_user --username yourusername --email your@email.com --password yourpassword
```

## API Endpoints

- `POST /api/admin/login/` - Secure login
- `POST /api/admin/logout/` - Secure logout  
- `GET /api/admin/contact-request/list/` - List enquiries (requires authentication)

## Troubleshooting

### "Network error" message
- Ensure the backend is running: `docker-compose ps`
- Check if port 8000 is accessible

### "Invalid credentials" message
- Verify the admin user was created: `docker-compose exec backend python manage.py shell -c "from django.contrib.auth.models import User; print(User.objects.filter(is_staff=True))"`

### Session issues
- Clear browser cookies and try again
- Ensure `credentials: 'include'` is set in frontend requests 