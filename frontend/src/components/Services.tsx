import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  const services = [
    {
      icon: '🏢',
      title: 'Company Setup',
      description: 'Complete business registration and setup services for new companies in New Zealand.',
      features: ['Business Registration', 'GST Registration', 'Company Structure', 'Legal Compliance']
    },
    {
      icon: '📊',
      title: 'GST & Tax Filing',
      description: 'Comprehensive tax services including GST returns, income tax, and compliance filing.',
      features: ['GST Returns', 'Income Tax Filing', 'FBT Returns', 'Tax Planning']
    },
    {
      icon: '💼',
      title: 'Strategic Financial Consulting',
      description: 'Expert financial advice to help your business grow and achieve its goals.',
      features: ['Financial Planning', 'Business Strategy', 'Growth Planning', 'Risk Management']
    },
    {
      icon: '📋',
      title: 'Bookkeeping',
      description: 'Professional bookkeeping services to keep your financial records accurate and up-to-date.',
      features: ['Monthly Accounts', 'Bank Reconciliation', 'Financial Reports', 'Record Keeping']
    },
    {
      icon: '💰',
      title: 'Payroll Services',
      description: 'Complete payroll management including PAYE, KiwiSaver, and holiday pay calculations.',
      features: ['Payroll Processing', 'PAYE Filing', 'KiwiSaver Management', 'Holiday Pay']
    },
    {
      icon: '🏛️',
      title: 'Government Agency Advocacy',
      description: 'Representation and support when dealing with government agencies and compliance matters.',
      features: ['IRD Liaison', 'Ministry Support', 'Compliance Advocacy', 'Dispute Resolution']
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Comprehensive financial solutions tailored for New Zealand businesses</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <div className="cta-content">
            <h3>Ready to Get Started?</h3>
            <p>Let us help you navigate the complexities of New Zealand's financial landscape.</p>
            <a
              href="mailto:robbin@srsnz.com,swati@srsnz.com?subject=Contacting%20SRS%20Consulting"
              className="btn btn-primary"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services; 