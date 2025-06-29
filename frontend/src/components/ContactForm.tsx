import React, { useState } from 'react';
import api from '../utils/axios';
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

// Australian email domains for validation
const AUSTRALIAN_EMAIL_DOMAINS = [
  // Major Australian ISPs and providers
  'bigpond.com', 'bigpond.net.au', 'bigpond.com.au',
  'optusnet.com.au', 'optus.com.au',
  'iinet.net.au', 'westnet.com.au', 'internode.on.net',
  'tpg.com.au', 'tpg.net.au',
  'telstra.com', 'telstra.com.au',
  'dodo.com.au', 'dodo.net.au',
  'exetel.com.au',
  'aussiebroadband.com.au',
  'superloop.com.au',
  'belong.com.au',
  'vodafone.com.au',
  'amaysim.com.au',
  'aldimobile.com.au',
  
  // Australian business and government domains
  'gov.au', 'govt.au',
  'edu.au', 'education.au',
  'org.au', 'net.au', 'com.au',
  'asn.au', 'id.au',
  
  // Australian universities and educational institutions
  'unimelb.edu.au', 'sydney.edu.au', 'anu.edu.au', 'uq.edu.au',
  'monash.edu.au', 'unsw.edu.au', 'uts.edu.au', 'qut.edu.au',
  'rmit.edu.au', 'deakin.edu.au', 'latrobe.edu.au', 'swinburne.edu.au',
  'curtin.edu.au', 'uwa.edu.au', 'adelaide.edu.au', 'flinders.edu.au',
  'newcastle.edu.au', 'griffith.edu.au', 'bond.edu.au', 'jcu.edu.au',
  'usc.edu.au', 'cqu.edu.au', 'ecu.edu.au', 'murdoch.edu.au',
  'scu.edu.au', 'une.edu.au', 'csu.edu.au',
  
  // Australian banks and financial institutions
  'cba.com.au', 'commbank.com.au', 'commonwealthbank.com.au',
  'westpac.com.au', 'nab.com.au', 'anz.com.au',
  'bendigobank.com.au', 'bendigoadelaide.com.au',
  'stgeorge.com.au', 'bankofmelbourne.com.au', 'bankwest.com.au',
  'rams.com.au', 'ubank.com.au', '86400.com.au',
  
  // Australian media and news
  'abc.net.au', 'sbs.com.au', 'nine.com.au', 'seven.com.au',
  'ten.com.au', 'news.com.au', 'smh.com.au', 'theage.com.au',
  'afr.com.au', 'brisbanetimes.com.au', 'watoday.com.au',
  'perthnow.com.au', 'adelaidenow.com.au', 'heraldsun.com.au',
  'dailytelegraph.com.au', 'couriermail.com.au', 'ntnews.com.au',
  'townsvillebulletin.com.au', 'cairnspost.com.au', 'goldcoastbulletin.com.au',
  'geelongadvertiser.com.au', 'bendigoadvertiser.com.au',
  
  // Australian retail and e-commerce
  'woolworths.com.au', 'coles.com.au', 'aldi.com.au',
  'kmart.com.au', 'target.com.au', 'bigw.com.au',
  'harveynorman.com.au', 'thegoodguys.com.au', 'jbhi-fi.com.au',
  'officeworks.com.au', 'bunnings.com.au',
  'rebel.com.au', 'amart.com.au', 'supercheapauto.com.au',
  'autobarn.com.au', 'repco.com.au', 'superretailgroup.com.au',
  
  // Australian telecommunications
  'virginmobile.com.au', 'boost.com.au',
  'felix.com.au', 'circles.life', 'moose.com.au', 'koganmobile.com.au',
  
  // Australian utilities and services
  'agl.com.au', 'originenergy.com.au', 'energyaustralia.com.au',
  'powershop.com.au', 'redenergy.com.au', 'momentumenergy.com.au',
  'simplyenergy.com.au', 'alintaenergy.com.au',
  'sydneywater.com.au', 'melbournewater.com.au', 'seqwater.com.au',
  'watercorporation.com.au', 'sa.gov.au', 'act.gov.au',
  
  // Australian transport and logistics
  'qantas.com.au', 'virginaustralia.com', 'jetstar.com.au',
  'rex.com.au', 'tigerair.com.au', 'bonza.com.au',
  'uber.com.au', 'lyft.com.au', 'didi.com.au',
  'taxify.com.au', 'ola.com.au', 'shemesh.com.au',
  
  // Australian real estate
  'realestate.com.au', 'domain.com.au', 'allhomes.com.au',
  'onthehouse.com.au', 'homely.com.au', 'ratemyagent.com.au',
  'raywhite.com.au', 'lre.com.au', 'barryplant.com.au',
  'harcourts.com.au', 'ljhooker.com.au', 'mcgrath.com.au',
  
  // Australian job sites
  'seek.com.au', 'careerone.com.au', 'mycareer.com.au',
  'adzuna.com.au', 'indeed.com.au', 'linkedin.com',
  'glassdoor.com.au', 'jobsearch.gov.au', 'apsjobs.gov.au',
  
  // Australian social media and tech
  'facebook.com', 'instagram.com', 'twitter.com',
  'snapchat.com', 'tiktok.com', 'youtube.com', 'reddit.com',
  'discord.com', 'slack.com', 'zoom.us', 'teams.microsoft.com',
  'google.com', 'microsoft.com', 'apple.com', 'amazon.com.au',
  'ebay.com.au', 'gumtree.com.au', 'facebook.com.au',
  
  // Australian health and medical
  'health.gov.au', 'medicare.gov.au', 'myhealthrecord.gov.au',
  'healthdirect.gov.au', 'bupa.com.au', 'medibank.com.au',
  'hcf.com.au', 'nib.com.au', 'ahm.com.au', 'guild.com.au',
  'pharmacyguild.org.au', 'racgp.org.au', 'ama.com.au',
  
  // Australian sports and entertainment
  'afl.com.au', 'nrl.com.au', 'cricket.com.au', 'footballaustralia.com.au',
  'tennis.com.au', 'golf.org.au', 'rugby.com.au', 'basketball.com.au',
  'netball.com.au', 'hockey.org.au', 'swimming.org.au',
  'ticketek.com.au', 'ticketmaster.com.au', 'moshtix.com.au',
  'eventbrite.com.au', 'humanitix.com.au', 'oztix.com.au',
  
  // Australian automotive
  'carsales.com.au', 'carsguide.com.au', 'drive.com.au',
  'motoring.com.au', 'whichcar.com.au', 'caradvice.com.au',
  'nrma.com.au', 'racv.com.au', 'racq.com.au', 'rac.com.au',
  'aami.com.au', 'gio.com.au', 'shannons.com.au', 'justcar.com.au',
  
  // Australian insurance
  'allianz.com.au', 'bingle.com.au',
  'budgetdirect.com.au', 'youi.com.au', 'huddle.com.au',
  
  // Australian travel and tourism
  'tripadvisor.com.au', 'booking.com', 'expedia.com.au',
  'wotif.com', 'lastminute.com.au', 'webjet.com.au',
  'flightcentre.com.au', 'studentflights.com.au', 'escape.com.au',
  'lonelyplanet.com', 'visitvictoria.com', 'queensland.com',
  'nsw.gov.au', 'wa.gov.au', 'tas.gov.au',
  'nt.gov.au',
];

// Helper function to check if email domain is Australian
const isAustralianEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return AUSTRALIAN_EMAIL_DOMAINS.some(auDomain => 
    domain === auDomain || domain.endsWith('.' + auDomain)
  );
};

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
    } else {
      const name = formData.name.trim();
      
      // Length validation
      if (name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      } else if (name.length > 100) {
        newErrors.name = 'Name is too long (maximum 100 characters)';
      }
      
      // Check for valid characters (letters, spaces, hyphens, apostrophes, periods)
      const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
      if (!nameRegex.test(name)) {
        newErrors.name = 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
      }
      
      // Check for consecutive spaces
      if (name.includes('  ')) {
        newErrors.name = 'Name cannot contain consecutive spaces';
      }
      
      // Check for leading/trailing spaces (should be handled by trim, but double-check)
      if (name !== name.trim()) {
        newErrors.name = 'Name cannot start or end with spaces';
      }
      
      // Check for at least one letter
      if (!/[a-zA-Z]/.test(name)) {
        newErrors.name = 'Name must contain at least one letter';
      }
      
      // Check for proper capitalization (optional but helpful)
      const words = name.split(' ').filter((word: string) => word.length > 0);
      if (words.length > 0) {
        const firstWord = words[0];
        if (firstWord.length > 0 && firstWord[0] !== firstWord[0].toUpperCase()) {
          newErrors.name = 'Name should start with a capital letter';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // More comprehensive email validation
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (formData.email.length > 254) {
        newErrors.email = 'Email address is too long (maximum 254 characters)';
      } else if (formData.email.includes('..')) {
        newErrors.email = 'Email address cannot contain consecutive dots';
      } else if (formData.email.startsWith('.') || formData.email.endsWith('.')) {
        newErrors.email = 'Email address cannot start or end with a dot';
      } else if (formData.email.includes('@.') || formData.email.includes('.@')) {
        newErrors.email = 'Email address has invalid format';
      } else {
        const [localPart, domain] = formData.email.split('@');
        if (localPart.length > 64) {
          newErrors.email = 'Email local part is too long (maximum 64 characters)';
        } else if (domain.length > 253) {
          newErrors.email = 'Email domain is too long (maximum 253 characters)';
        } else if (domain.includes('..')) {
          newErrors.email = 'Email domain cannot contain consecutive dots';
        }
        
        // Optional: Check if it's an Australian email (for informational purposes)
        const isAustralian = isAustralianEmail(formData.email);
        // You can add specific validation for Australian emails here if needed
      }
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
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleServiceToggle = (serviceValue: string) => {
    setFormData((prev: any) => ({
      ...prev,
      services_needed: prev.services_needed.includes(serviceValue)
        ? prev.services_needed.filter((s: string) => s !== serviceValue)
        : [...prev.services_needed, serviceValue],
    }));
    
    // Clear services error when user selects a service
    if (errors.services) {
      setErrors((prev: any) => ({
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
      const response = await api.post('/contact-request/', formData);
      
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