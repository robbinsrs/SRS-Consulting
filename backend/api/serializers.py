from rest_framework import serializers
from .models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    """Serializer for ContactRequest model."""
    
    services_display = serializers.SerializerMethodField()
    
    class Meta:
        model = ContactRequest
        fields = ['id', 'name', 'email', 'phone', 'services_needed', 'services_display', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_services_display(self, obj):
        """Return human-readable service names."""
        return obj.get_services_display()
    
    def validate_services_needed(self, value):
        """Validate that services_needed contains valid service choices."""
        valid_services = [choice[0] for choice in ContactRequest.SERVICE_CHOICES]
        
        if not value:
            raise serializers.ValidationError("At least one service must be selected.")
        
        for service in value:
            if service not in valid_services:
                raise serializers.ValidationError(f"Invalid service: {service}")
        
        return value
    
    def validate_phone(self, value):
        """Basic phone number validation."""
        # Remove common separators and check if it's mostly digits
        cleaned = ''.join(filter(str.isdigit, value))
        if len(cleaned) < 7:
            raise serializers.ValidationError("Phone number must contain at least 7 digits.")
        return value 