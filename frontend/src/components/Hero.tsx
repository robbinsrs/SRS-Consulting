import React from 'react';
import './Hero.css';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Trusted Partner for
              <span className="highlight"> Accounting, Compliance & Growth </span>
              in New Zealand
            </h1>
            
            <p className="hero-subtitle">
              Led by two experienced Chartered Accountants, we provide end-to-end financial 
              solutions to help your business thrive. From company setup to strategic consulting, 
              we're here to support your success.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">2</span>
                <span className="stat-label">Chartered Accountants</span>
              </div>
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Compliance Rate</span>
              </div>
            </div>
            
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={onGetStarted}>
                Get Started Today
              </button>
              <button className="btn btn-secondary">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-icon">📊</div>
              <h3>Expert CA Services</h3>
              <p>Professional accounting services from experienced Chartered Accountants in New Zealand.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 