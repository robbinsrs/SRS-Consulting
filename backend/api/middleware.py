from django.middleware.csrf import CsrfViewMiddleware
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings


class SelectiveCsrfMiddleware(MiddlewareMixin):
    """
    Custom CSRF middleware that only applies CSRF protection to admin endpoints.
    Public endpoints like contact requests are exempt from CSRF protection.
    """
    
    def __init__(self, get_response=None):
        super().__init__(get_response)
        self.csrf_middleware = CsrfViewMiddleware(get_response)
    
    def process_request(self, request):
        # List of admin endpoints that require CSRF protection
        admin_endpoints = [
            '/api/admin/login/',
            '/api/admin/logout/',
            '/api/admin/contact-requests/',
            '/api/admin/csrf-token/',
        ]
        
        # Check if the current request path is an admin endpoint
        is_admin_endpoint = any(request.path.endswith(endpoint) for endpoint in admin_endpoints)
        
        print(f"[SelectiveCsrfMiddleware] process_request: path={request.path} | is_admin_endpoint={is_admin_endpoint}")
        
        # Only apply CSRF protection to admin endpoints
        if is_admin_endpoint:
            print("[SelectiveCsrfMiddleware] Applying CSRF protection.")
            return self.csrf_middleware.process_request(request)
        
        # For non-admin endpoints, skip CSRF protection
        print("[SelectiveCsrfMiddleware] Skipping CSRF protection.")
        return None
    
    def process_response(self, request, response):
        # Only apply CSRF response processing to admin endpoints
        admin_endpoints = [
            '/api/admin/login/',
            '/api/admin/logout/',
            '/api/admin/contact-requests/',
            '/api/admin/csrf-token/',
        ]
        
        is_admin_endpoint = any(request.path.endswith(endpoint) for endpoint in admin_endpoints)
        
        print(f"[SelectiveCsrfMiddleware] process_response: path={getattr(request, 'path', None)} | is_admin_endpoint={is_admin_endpoint}")
        
        if is_admin_endpoint:
            print("[SelectiveCsrfMiddleware] Applying CSRF response processing.")
            return self.csrf_middleware.process_response(request, response)
        
        print("[SelectiveCsrfMiddleware] Skipping CSRF response processing.")
        return response 