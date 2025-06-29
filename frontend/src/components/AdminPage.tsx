import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import './AdminPage.css';

interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  services_needed: string[];
  services_display: string[];
  created_at: string;
}

function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enquiries, setEnquiries] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch CSRF token on mount
    fetch('/api/csrf/', {
      credentials: 'include',
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await fetch('/api/admin/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken || '',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        fetchEnquiries(); // Fetch enquiries after successful login
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error - please check if the backend is running');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout/', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // Ignore logout errors
    }
    setIsAuthenticated(false);
    setEnquiries([]);
    setUsername('');
    setPassword('');
    setShowPassword(false);
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/contact-request/list/', {
        method: 'GET',
        credentials: 'include', // Include cookies for session
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data.enquiries || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch enquiries');
        if (response.status === 401 || response.status === 403) {
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      setError('Network error - please check if the backend is running');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>Admin Access</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Enquiry Management</h1>
          <div className="admin-actions">
            <button 
              onClick={fetchEnquiries} 
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading enquiries...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="enquiries-table">
            <h2>Consultation Requests ({enquiries.length})</h2>
            {enquiries.length === 0 ? (
              <p>No enquiries found.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enquiry) => (
                      <tr key={enquiry.id}>
                        <td>{formatDate(enquiry.created_at)}</td>
                        <td>{enquiry.name}</td>
                        <td>
                          <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                        </td>
                        <td>
                          <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                        </td>
                        <td>
                          <div className="services-tags">
                            {(enquiry.services_display || []).map((service, index) => (
                              <span key={index} className="service-tag">
                                {service}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 