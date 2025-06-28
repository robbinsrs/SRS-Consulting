import React, { useState } from 'react';
import './AdminPage.css';

interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  message: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [enquiries, setEnquiries] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'srsadmin2024') {
      setIsAuthenticated(true);
      fetchEnquiries();
    } else {
      setError('Incorrect password');
    }
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/contact-request/list/');
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      } else {
        setError('Failed to fetch enquiries');
      }
    } catch (err) {
      setError('Network error');
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary">
              Login
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
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="btn btn-secondary"
          >
            Logout
          </button>
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
                      <th>Company</th>
                      <th>Services</th>
                      <th>Message</th>
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
                        <td>{enquiry.company}</td>
                        <td>
                          <div className="services-tags">
                            {enquiry.services.map((service, index) => (
                              <span key={index} className="service-tag">
                                {service}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="message-preview">
                            {enquiry.message.length > 100 
                              ? `${enquiry.message.substring(0, 100)}...` 
                              : enquiry.message
                            }
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