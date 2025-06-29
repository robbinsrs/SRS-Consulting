import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section main-section">
            <h3>SRS Consulting</h3>
            <p>Your trusted partner for accounting, compliance & growth in New Zealand.</p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="LinkedIn">
                <span className="social-icon">💼</span>
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <span className="social-icon">📘</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
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
          
          <div className="footer-section contact-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Auckland, New Zealand</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+64 22 185 3119 (Robbin)</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+64 21 199 7272 (Swati)</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>robbin@srsnz.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>swati@srsnz.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
              </div>
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