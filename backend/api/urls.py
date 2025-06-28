from django.urls import path
from .views import (
    ContactRequestCreateView, 
    ContactRequestListView, 
    admin_login,
    admin_logout,
    admin_contact_request_list_secure,
    get_csrf_token,
    health_check
)

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('contact-request/', ContactRequestCreateView.as_view(), name='contact-request-create'),
    path('contact-request/list/', ContactRequestListView.as_view(), name='contact-request-list'),
    path('admin/login/', admin_login, name='admin-login'),
    path('admin/logout/', admin_logout, name='admin-logout'),
    path('admin/contact-request/list/', admin_contact_request_list_secure, name='admin-contact-request-list-secure'),
    path('csrf/', get_csrf_token, name='get-csrf-token'),
] 