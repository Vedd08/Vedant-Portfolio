import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './AboutAdmin.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/about`;

const AboutAdmin = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [aboutId, setAboutId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    setLoading(true);
    setError('');
    
    try {
      // GET request doesn't need token
      const response = await axios.get(API_URL);
      
      console.log('About API Response:', response.data);
      
      if (response.data) {
        setAboutContent(response.data.content || '');
        setAboutId(response.data._id || null);
      }
    } catch (err) {
      console.error('Error fetching about:', err);
      setError('Failed to load about content. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e) => {
    setAboutContent(e.target.value);
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      // Your backend expects { content: "..." }
      const requestData = { content: aboutContent };
      
      console.log('Sending update request:', {
        url: API_URL,
        data: requestData,
        hasToken: !!token
      });

      const response = await axios.post(API_URL, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update response:', response.data);
      
      setSuccess('About content updated successfully!');
      
      // Update local state with saved data
      if (response.data) {
        setAboutContent(response.data.content || aboutContent);
        setAboutId(response.data._id || aboutId);
      }
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error updating about:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.status === 404) {
        setError('About API endpoint not found. Check server routes.');
      } else {
        setError(err.response?.data?.message || 'Failed to update about content.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchAboutContent();
    setSuccess('');
    setError('');
  };

  if (loading) {
    return (
      <div className="about-admin">
        <div className="page-header">
          <h1 className="page-title">About Editor</h1>
        </div>
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Loading about content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="about-admin">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">About Editor</h1>
            <p className="page-subtitle">Update your about section content</p>
          </div>
        </div>
      </div>

      <div className="about-editor-container">
        <Card className="editor-card">
          <Card.Body>
            {/* Debug Info */}
            <Alert variant="light" className="mb-3 small">
              <strong>Status:</strong> {aboutId ? 'Document exists' : 'No document yet'} | 
              <strong> Characters:</strong> {aboutContent.length}
            </Alert>

            {error && (
              <Alert variant="danger" className="editor-alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="editor-alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="editor-form-group" controlId="aboutContent">
                <Form.Label>About Content</Form.Label>
                <Form.Control
                  as="textarea"
                  value={aboutContent}
                  onChange={handleContentChange}
                  rows={12}
                  placeholder="Write your about section content here..."
                  className="about-textarea"
                  disabled={saving}
                />
                <Form.Text className="text-muted">
                  You can use multiple paragraphs. This content will appear in the about section of your portfolio.
                </Form.Text>
              </Form.Group>

              <div className="character-count">
                {aboutContent.length} characters
              </div>

              <div className="editor-actions">
                <Button 
                  variant="light" 
                  onClick={handleReset}
                  disabled={saving}
                  className="reset-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Reset
                </Button>
                
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={saving}
                  className="save-btn"
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Preview Card */}
        <Card className="preview-card">
          <Card.Header className="preview-header">
            <h3 className="preview-title">Preview</h3>
            <span className="preview-badge">Live Preview</span>
          </Card.Header>
          <Card.Body>
            <div className="preview-content">
              {aboutContent ? (
                <div className="about-preview">
                  {aboutContent.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="preview-placeholder">
                  Your about content will appear here...
                </p>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AboutAdmin;