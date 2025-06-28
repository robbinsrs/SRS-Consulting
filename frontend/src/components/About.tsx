import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <div className="section-header">
              <h2>About SRS Consulting</h2>
              <p>Your trusted partner for financial success in New Zealand</p>
            </div>
            
            <div className="about-description">
              <p>
                SRS Consulting is led by two experienced Chartered Accountants who have been 
                serving New Zealand businesses with comprehensive financial solutions. Our team 
                combines deep local knowledge with international best practices to deliver 
                exceptional results for our clients.
              </p>
              
              <p>
                From small startups to established enterprises, we tailor our services to 
                meet your specific needs and goals. Our commitment to excellence and attention 
                to detail ensures that your business receives the highest quality financial 
                guidance and support.
              </p>
            </div>

            <div className="team-section">
              <h3>Meet Our Team</h3>
              <div className="team-members">
                <div className="team-member">
                  <div className="member-info">
                    <h4>Robbin Sebastian</h4>
                    <span className="designation">Chartered Accountant</span>
                    <p>📞 +64 22 185 3119</p>
                    <p>✉️ robbin@srsnz.com</p>
                  </div>
                </div>
                <div className="team-member">
                  <div className="member-info">
                    <h4>Swati Mundra</h4>
                    <span className="designation">Chartered Accountant</span>
                    <p>📞 +64 21 199 7272</p>
                    <p>✉️ swati@srsnz.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <div className="feature-content">
                  <h4>Expert Guidance</h4>
                  <p>Professional advice from experienced Chartered Accountants</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div className="feature-content">
                  <h4>Fast & Efficient</h4>
                  <p>Quick turnaround times without compromising quality</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">🛡️</div>
                <div className="feature-content">
                  <h4>100% Compliance</h4>
                  <p>Ensuring your business meets all regulatory requirements</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">🤝</div>
                <div className="feature-content">
                  <h4>Personal Service</h4>
                  <p>Dedicated support and personalized attention for every client</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-visual">
            <div className="stats-card">
              <h3>Why Choose SRS Consulting?</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">2</span>
                  <span className="stat-label">Chartered Accountants</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Compliance Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 