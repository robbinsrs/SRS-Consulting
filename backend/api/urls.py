from django.urls import path
from .views import ContactRequestCreateView, ContactRequestListView

urlpatterns = [
    path('contact-request/', ContactRequestCreateView.as_view(), name='contact-request-create'),
    path('contact-request/list/', ContactRequestListView.as_view(), name='contact-request-list'),
] 