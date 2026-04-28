import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/login`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard');
    }
    
    // Load saved email if "Remember Me" was checked
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(API_URL, formData);
      
      // Store token
      localStorage.setItem('adminToken', response.data.token);
      
      // Store email if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('adminEmail', formData.email);
      } else {
        localStorage.removeItem('adminEmail');
      }
      
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || 'Invalid email or password');
      } else if (err.request) {
        setError('Unable to connect to server. Please check if backend is running.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <div className="login-wrapper">
          <Card className="login-card">
            <Card.Body>
              <div className="login-header">
                <div className="login-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h2 className="login-title">Admin Login</h2>
                <p className="login-subtitle">Sign in to manage your portfolio</p>
              </div>

              {error && (
                <Alert variant="danger" className="login-alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="login-form-group" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sonawanevedant42@gmail.com"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="login-form-group" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="login-form-group" controlId="rememberMe">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>

              <div className="login-footer">
                <a href={import.meta.env.VITE_CLIENT_URL || 'https://vedant-portfolio-rust-two.vercel.app'} className="back-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Portfolio
                </a>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Login;