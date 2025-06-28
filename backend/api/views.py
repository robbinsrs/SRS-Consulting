from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import ContactRequest
from .serializers import ContactRequestSerializer
from .utils import send_consultation_notification, send_confirmation_email


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