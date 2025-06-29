from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from typing import List


def send_consultation_notification(contact_request):
    """
    Send email notification to SRS team when a new consultation request is submitted.
    """
    subject = f"New Consultation Request - {contact_request.name}"
    
    # Create email content
    services_list = ", ".join(contact_request.get_services_display())
    
    message = f"""
New consultation request received:

Name: {contact_request.name}
Email: {contact_request.email}
Phone: {contact_request.phone}
Services Requested: {services_list}

Submitted on: {contact_request.created_at.strftime('%B %d, %Y at %I:%M %p')}

Please respond to this enquiry promptly.
    """.strip()
    
    # Send email to all team members
    try:
        from_email = str(settings.EMAIL_HOST_USER)
        print(f"[DEBUG] Sending notification from: {from_email}")
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=settings.SRS_TEAM_EMAILS,
            fail_silently=False,
        )
        print(f"Email notification sent successfully to {settings.SRS_TEAM_EMAILS}")
        return True
    except Exception as e:
        print(f"Failed to send email notification: {e}")
        return False


def send_confirmation_email(contact_request):
    """
    Send confirmation email to the person who submitted the request.
    """
    subject = "Thank you for contacting SRS Consulting"
    
    message = f"""
Dear {contact_request.name},

Thank you for contacting SRS Consulting. We have received your consultation request and will get back to you within 24 hours.

Request Details:
- Services: {', '.join(contact_request.get_services_display())}
- Submitted: {contact_request.created_at.strftime('%B %d, %Y at %I:%M %p')}

If you have any urgent questions, please don't hesitate to contact us directly:
- Robbin Sebastian: +64 22 185 3119, robbin@srsnz.com
- Swati Mundra: +64 21 199 7272, swati@srsnz.com

Best regards,
The SRS Consulting Team
    """.strip()
    
    try:
        from_email = str(settings.EMAIL_HOST_USER)
        print(f"[DEBUG] Sending confirmation from: {from_email}")
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[contact_request.email],
            fail_silently=False,
        )
        print(f"Confirmation email sent successfully to {contact_request.email}")
        return True
    except Exception as e:
        print(f"Failed to send confirmation email: {e}")
        return False 