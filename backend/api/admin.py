from django.contrib import admin
from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    """Admin configuration for ContactRequest model."""
    
    list_display = ['name', 'email', 'phone', 'services_display', 'created_at']
    list_filter = ['created_at', 'services_needed']
    search_fields = ['name', 'email', 'phone']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Services Requested', {
            'fields': ('services_needed',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def services_display(self, obj):
        """Display services as a readable list."""
        return ', '.join(obj.get_services_display())
    services_display.short_description = 'Services Requested'
    
    def has_add_permission(self, request):
        """Disable adding contact requests through admin."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Disable editing contact requests through admin."""
        return False 