import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SRS Consulting</h3>
            <p>Your trusted partner for accounting, compliance & growth in New Zealand.</p>
            <div className="social-links">
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Company Setup</a></li>
              <li><a href="#services">GST & Tax Filing</a></li>
              <li><a href="#services">Financial Consulting</a></li>
              <li><a href="#services">Bookkeeping</a></li>
              <li><a href="#services">Payroll Services</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📍 Auckland, New Zealand</p>
              <p>📞 +64 22 185 3119 (Robbin)</p>
              <p>📞 +64 21 199 7272 (Swati)</p>
              <p>✉️ robbin@srsnz.com</p>
              <p>✉️ swati@srsnz.com</p>
              <p>🕒 Mon-Fri: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 SRS Consulting. All rights reserved.</p>
          <p>Registered with New Zealand Companies Office</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 