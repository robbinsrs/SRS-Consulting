import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import SuccessScreen from './components/SuccessScreen';
import AdminPage from './components/AdminPage';
import './App.css';

interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  services_needed: string[];
}

function MainSite() {
  const [submittedRequest, setSubmittedRequest] = useState<ContactRequest | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  const handleFormSubmit = (request: ContactRequest) => {
    setSubmittedRequest(request);
  };

  const handleNewRequest = () => {
    setSubmittedRequest(null);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header activeSection={activeSection} onNavigate={scrollToSection} />
      
      {submittedRequest ? (
        <SuccessScreen 
          request={submittedRequest} 
          onNewRequest={handleNewRequest} 
        />
      ) : (
        <>
          <Hero onGetStarted={() => scrollToSection('contact')} />
          <Services />
          <About />
          <div id="contact">
            <ContactForm onSubmit={handleFormSubmit} />
          </div>
        </>
      )}
      
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 