from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import connection
from django.db.utils import OperationalError
from django.utils import timezone
import platform
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import ContactRequest
from .serializers import ContactRequestSerializer
from .utils import send_consultation_notification, send_confirmation_email


@swagger_auto_schema(
    method='get',
    operation_description="Health check endpoint to verify backend status and system information",
    responses={
        200: openapi.Response(
            description="Backend is healthy",
            examples={
                "application/json": {
                    "status": "healthy",
                    "timestamp": "2025-06-28T22:35:51.566021+00:00",
                    "service": "SRS Consulting Backend",
                    "version": "1.0.0",
                    "system": {
                        "platform": "Linux-6.10.14-linuxkit-aarch64-with-glibc2.36",
                        "python_version": "3.9.23",
                        "django_version": "4.2.7",
                        "architecture": "64bit"
                    },
                    "database": {
                        "status": "connected",
                        "connection": True
                    },
                    "endpoints": {
                        "contact_request": "/api/contact-request/",
                        "admin_login": "/api/admin/login/",
                        "health_check": "/api/health/"
                    },
                    "metrics": {
                        "total_contact_requests": 4
                    }
                }
            }
        ),
        503: openapi.Response(
            description="Backend is unhealthy (database connection failed)"
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint to verify backend status.
    Returns system information and database connectivity status.
    """
    health_status = {
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'service': 'SRS Consulting Backend',
        'version': '1.0.0',
        'system': {
            'platform': platform.platform(),
            'python_version': platform.python_version(),
            'django_version': '4.2.7',
            'architecture': platform.architecture()[0],
            'processor': platform.processor(),
        },
        'database': {
            'status': 'unknown',
            'connection': False,
        },
        'endpoints': {
            'contact_request': '/api/contact-request/',
            'admin_login': '/api/admin/login/',
            'health_check': '/api/health/',
        }
    }
    
    # Check database connectivity
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            health_status['database']['status'] = 'connected'
            health_status['database']['connection'] = True
    except OperationalError as e:
        health_status['database']['status'] = 'error'
        health_status['database']['connection'] = False
        health_status['database']['error'] = str(e)
        health_status['status'] = 'unhealthy'
    except Exception as e:
        health_status['database']['status'] = 'unknown'
        health_status['database']['connection'] = False
        health_status['database']['error'] = str(e)
        health_status['status'] = 'unhealthy'
    
    # Add contact request count
    try:
        contact_count = ContactRequest.objects.count()
        health_status['metrics'] = {
            'total_contact_requests': contact_count,
        }
    except Exception as e:
        health_status['metrics'] = {
            'error': f'Could not fetch metrics: {str(e)}'
        }
    
    # Determine overall status
    if health_status['database']['connection']:
        return Response(health_status, status=status.HTTP_200_OK)
    else:
        return Response(health_status, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@swagger_auto_schema(
    operation_description="Submit a new consultation request",
    request_body=ContactRequestSerializer,
    responses={
        201: openapi.Response(
            description="Contact request submitted successfully",
            schema=ContactRequestSerializer
        ),
        400: openapi.Response(
            description="Invalid request data"
        )
    }
)
class ContactRequestCreateView(generics.CreateAPIView):
    """API view for creating contact requests."""
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact_request = serializer.save()
        
        # Send email notifications
        try:
            # Send notification to SRS team
            send_consultation_notification(contact_request)
            
            # Send confirmation email to requester
            send_confirmation_email(contact_request)
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Email notification failed: {e}")
        
        headers = self.get_success_headers(serializer.data)
        
        return Response({
            'message': 'Contact request submitted successfully!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)


class ContactRequestListView(generics.ListAPIView):
    """API view for listing contact requests (admin only)."""
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        """Allow filtering by date range."""
        queryset = ContactRequest.objects.all()
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        return queryset


@swagger_auto_schema(
    method='post',
    operation_description="Secure admin login with session-based authentication",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['username', 'password'],
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Admin username'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Admin password'),
        }
    ),
    responses={
        200: openapi.Response(
            description="Login successful",
            examples={
                "application/json": {
                    "message": "Login successful",
                    "user": {
                        "username": "srsadmin",
                        "is_staff": True
                    }
                }
            }
        ),
        400: openapi.Response(description="Username and password are required"),
        401: openapi.Response(description="Invalid credentials or insufficient permissions")
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """Secure admin login endpoint."""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None and user.is_staff:
        login(request, user)
        return Response({
            'message': 'Login successful',
            'user': {
                'username': user.username,
                'is_staff': user.is_staff
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Invalid credentials or insufficient permissions'
        }, status=status.HTTP_401_UNAUTHORIZED)


@swagger_auto_schema(
    method='post',
    operation_description="Secure admin logout",
    responses={
        200: openapi.Response(
            description="Logout successful",
            examples={
                "application/json": {
                    "message": "Logout successful"
                }
            }
        ),
        401: openapi.Response(description="Authentication required")
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    """Secure admin logout endpoint."""
    logout(request)
    return Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="List all contact requests (admin only, requires authentication)",
    responses={
        200: openapi.Response(
            description="List of contact requests",
            examples={
                "application/json": {
                    "enquiries": [
                        {
                            "id": 1,
                            "name": "John Smith",
                            "email": "john@example.com",
                            "phone": "0212345678",
                            "services_needed": ["company_setup"],
                            "services_display": ["Company Setup"],
                            "created_at": "2025-06-28T22:26:24.895924Z"
                        }
                    ],
                    "count": 1
                }
            }
        ),
        401: openapi.Response(description="Authentication required"),
        403: openapi.Response(description="Insufficient permissions")
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_contact_request_list_secure(request):
    """Secure API view for listing contact requests with session authentication."""
    if not request.user.is_staff:
        return Response({
            'error': 'Insufficient permissions'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get all contact requests
    queryset = ContactRequest.objects.all().order_by('-created_at')
    serializer = ContactRequestSerializer(queryset, many=True)
    
    return Response({
        'enquiries': serializer.data,
        'count': queryset.count()
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Get CSRF token for admin authentication",
    responses={
        200: openapi.Response(
            description="CSRF cookie set",
            examples={
                "application/json": {
                    "message": "CSRF cookie set"
                }
            }
        )
    }
)
@api_view(['GET'])
def get_csrf_token(request):
    return Response({'message': 'CSRF cookie set'}) 