from django.db import models


class ContactRequest(models.Model):
    """Model for storing contact/service requests from website visitors."""
    
    SERVICE_CHOICES = [
        ('company_setup', 'Company Setup'),
        ('gst_tax_filing', 'GST & Tax Filing'),
        ('financial_consulting', 'Strategic Financial Consulting'),
        ('bookkeeping', 'Bookkeeping'),
        ('payroll', 'Payroll Services'),
        ('government_advocacy', 'Government Agency Advocacy'),
        ('compliance', 'Compliance Services'),
        ('other', 'Other Services'),
    ]
    
    name = models.CharField(max_length=200, help_text="Full name of the person making the request")
    email = models.EmailField(help_text="Email address for contact")
    phone = models.CharField(max_length=20, help_text="Phone number for contact")
    services_needed = models.JSONField(
        default=list,
        help_text="List of services requested (selected from SERVICE_CHOICES)"
    )
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when request was created")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Request"
        verbose_name_plural = "Contact Requests"
    
    def __str__(self):
        return f"{self.name} - {self.email} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
    
    def get_services_display(self):
        """Return human-readable service names."""
        service_dict = dict(self.SERVICE_CHOICES)
        return [service_dict.get(service, service) for service in self.services_needed] 