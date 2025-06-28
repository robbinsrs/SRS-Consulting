import React from 'react';
import './SuccessScreen.css';

interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  services_needed: string[];
}

interface SuccessScreenProps {
  request: ContactRequest;
  onNewRequest: () => void;
}

const SERVICE_LABELS: Record<string, string> = {
  company_setup: 'Company Setup',
  gst_tax_filing: 'GST & Tax Filing',
  financial_consulting: 'Strategic Financial Consulting',
  bookkeeping: 'Bookkeeping',
  payroll: 'Payroll Services',
  government_advocacy: 'Government Agency Advocacy',
  compliance: 'Compliance Services',
  other: 'Other Services',
};

const SuccessScreen: React.FC<SuccessScreenProps> = ({ request, onNewRequest }) => {
  const selectedServices = request.services_needed.map(service => SERVICE_LABELS[service] || service);

  return (
    <div className="success-screen-container">
      <div className="card success-card">
        <div className="success-icon">✓</div>
        
        <h2>Thank You!</h2>
        <p className="success-message">
          Your consultation request has been submitted successfully. One of our Chartered Accountants 
          will get back to you within 24 hours.
        </p>

        <div className="request-summary">
          <h3>Request Summary</h3>
          <div className="summary-item">
            <strong>Name:</strong> {request.name}
          </div>
          <div className="summary-item">
            <strong>Email:</strong> {request.email}
          </div>
          <div className="summary-item">
            <strong>Phone:</strong> {request.phone}
          </div>
          <div className="summary-item">
            <strong>Services Requested:</strong>
            <ul className="services-list">
              {selectedServices.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="next-steps">
          <h3>What happens next?</h3>
          <ol>
            <li>We'll review your request within 24 hours</li>
            <li>One of our Chartered Accountants will contact you to discuss your specific needs</li>
            <li>We'll provide a customized proposal for your business</li>
            <li>Once approved, we'll begin working on your requirements</li>
          </ol>
        </div>

        <div className="contact-info">
          <h3>Need immediate assistance?</h3>
          <p>Call us directly:</p>
          <p><strong>Robbin Sebastian:</strong> +64 22 185 3119</p>
          <p><strong>Swati Mundra:</strong> +64 21 199 7272</p>
          <p>Email: <strong>robbin@srsnz.com</strong> or <strong>swati@srsnz.com</strong></p>
        </div>

        <button onClick={onNewRequest} className="btn btn-secondary">
          Submit Another Request
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen; 