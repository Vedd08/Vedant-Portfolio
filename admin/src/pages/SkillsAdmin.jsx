import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './SkillsAdmin.css';

const API_URL = `${import.meta.env.VITE_API_URL}/api/skills`;

const SkillsAdmin = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    category: '',
    items: ''
  });
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Category options
  const categories = ['Frontend', 'Backend', 'Database', 'Tools'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSkills(response.data || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      
      // Convert comma-separated items to array
      const itemsArray = formData.items
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      
      const skillData = {
        category: formData.category,
        items: itemsArray
      };
      
      await axios.post(API_URL, skillData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess('Skill added successfully!');
      
      // Reset form
      setFormData({
        category: '',
        items: ''
      });
      
      // Refresh skills list
      fetchSkills();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error adding skill:', err);
      setError(err.response?.data?.message || 'Failed to add skill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (skill) => {
    setSkillToDelete(skill);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/${skillToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from state
      setSkills(skills.filter(s => s._id !== skillToDelete._id));
      setShowDeleteModal(false);
      setSkillToDelete(null);
      
      // Show success message
      setSuccess('Skill deleted successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="skills-admin">
        <div className="page-header">
          <h1 className="page-title">Skills Management</h1>
        </div>
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-admin">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Skills Management</h1>
            <p className="page-subtitle">Manage your technical skills by category</p>
          </div>
        </div>
      </div>

      <Container fluid className="px-0">
        {/* Alerts */}
        {error && (
          <Alert variant="danger" className="skills-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="skills-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {success}
          </Alert>
        )}

        <Row className="g-4">
          {/* Add Skill Form */}
          <Col lg={5}>
            <Card className="add-skill-card">
              <Card.Header className="card-header-custom">
                <h3 className="card-title">Add New Skill</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="form-group-custom" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      disabled={saving}
                      className="custom-select"
                    >
                      <option value="">Select category...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="form-group-custom" controlId="items">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="items"
                      value={formData.items}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="React, Node.js, MongoDB, Express"
                      required
                      disabled={saving}
                      className="custom-textarea"
                    />
                    <Form.Text className="text-muted">
                      Enter skills separated by commas
                    </Form.Text>
                  </Form.Group>

                  {/* Preview */}
                  {formData.items && (
                    <div className="skill-preview">
                      <p className="preview-label">Preview:</p>
                      <div className="preview-badges">
                        {formData.items
                          .split(',')
                          .map(item => item.trim())
                          .filter(item => item !== '')
                          .map((item, index) => (
                            <span key={index} className="preview-badge">{item}</span>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="submit-btn"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Add Skill
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Skills List */}
          <Col lg={7}>
            {Object.keys(groupedSkills).length > 0 ? (
              <div className="skills-list-container">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <Card key={category} className="category-card">
                    <Card.Header className="category-header">
                      <h3 className="category-title">{category}</h3>
                      <span className="skill-count">{categorySkills.length} skills</span>
                    </Card.Header>
                    <Card.Body>
                      <div className="skills-grid">
                        {categorySkills.map((skill) => (
                          <div key={skill._id} className="skill-item">
                            <div className="skill-content">
                              <div className="skill-badges">
                                {skill.items.map((item, index) => (
                                  <span key={index} className="skill-badge">{item}</span>
                                ))}
                              </div>
                            </div>
                            <button
                              className="delete-skill-btn"
                              onClick={() => handleDeleteClick(skill)}
                              title="Delete skill category"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="empty-skills-card">
                <Card.Body>
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" />
                        <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
                      </svg>
                    </div>
                    <h3>No Skills Yet</h3>
                    <p>Start by adding your first skill category.</p>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
        className="delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Skill Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the <strong>{skillToDelete?.category}</strong> skill category?</p>
          <p className="text-secondary small">This will remove all skills in this category. This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="light" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SkillsAdmin;