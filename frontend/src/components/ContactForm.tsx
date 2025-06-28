import React, { useState } from 'react';
import axios from 'axios';
import './ContactForm.css';

interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  services_needed: string[];
}

interface ContactFormProps {
  onSubmit: (request: ContactRequest) => void;
}

const SERVICE_OPTIONS = [
  { value: 'company_setup', label: 'Company Setup' },
  { value: 'gst_tax_filing', label: 'GST & Tax Filing' },
  { value: 'financial_consulting', label: 'Strategic Financial Consulting' },
  { value: 'bookkeeping', label: 'Bookkeeping' },
  { value: 'payroll', label: 'Payroll Services' },
  { value: 'government_advocacy', label: 'Government Agency Advocacy' },
  { value: 'compliance', label: 'Compliance Services' },
  { value: 'other', label: 'Other Services' },
];

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services_needed: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.services_needed.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleServiceToggle = (serviceValue: string) => {
    setFormData(prev => ({
      ...prev,
      services_needed: prev.services_needed.includes(serviceValue)
        ? prev.services_needed.filter(s => s !== serviceValue)
        : [...prev.services_needed, serviceValue],
    }));
    
    // Clear services error when user selects a service
    if (errors.services) {
      setErrors(prev => ({
        ...prev,
        services: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/contact-request/', formData);
      
      if (response.status === 201) {
        onSubmit(formData);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      if (error.response?.data) {
        const serverErrors = error.response.data;
        setErrors(serverErrors);
      } else {
        setErrors({
          general: 'An error occurred while submitting your request. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="card">
        <h2>Request a Consultation</h2>
        <p className="form-description">
          Tell us about your business needs and we'll get back to you within 24 hours.
        </p>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Services Needed *
            </label>
            <div className="checkbox-group">
              {SERVICE_OPTIONS.map((service) => (
                <div
                  key={service.value}
                  className={`checkbox-item ${
                    formData.services_needed.includes(service.value) ? 'checked' : ''
                  }`}
                  onClick={() => handleServiceToggle(service.value)}
                >
                  <input
                    type="checkbox"
                    id={service.value}
                    checked={formData.services_needed.includes(service.value)}
                    onChange={() => {}} // Handled by onClick on parent
                  />
                  <label htmlFor={service.value}>{service.label}</label>
                </div>
              ))}
            </div>
            {errors.services && <div className="error-message">{errors.services}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading"></span>
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm; 