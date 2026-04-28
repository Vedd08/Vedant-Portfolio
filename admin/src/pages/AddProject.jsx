import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

const AddProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveLink: '',
    githubLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('adminToken');
      
      const techStackArray = formData.techStack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');

      const projectData = {
        ...formData,
        techStack: techStackArray
      };

      await axios.post(API_URL, projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        techStack: '',
        liveLink: '',
        githubLink: ''
      });

      setTimeout(() => navigate('/projects'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project">
      <div className="page-header">
        <h1 className="page-title">Add New Project</h1>
        <p className="page-subtitle">Create a new project for your portfolio</p>
      </div>

      <Card className="form-card">
        <Card.Body>
          {success && (
            <Alert variant="success">
              Project added! Redirecting...
            </Alert>
          )}

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Project Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., E-Commerce Platform"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project..."
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="techStack">
              <Form.Label>Tech Stack *</Form.Label>
              <Form.Control
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                required
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Separate technologies with commas
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="liveLink">
              <Form.Label>Live Demo URL</Form.Label>
              <Form.Control
                type="url"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleChange}
                placeholder="https://your-project.com"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="githubLink">
              <Form.Label>GitHub URL</Form.Label>
              <Form.Control
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
                disabled={loading}
              />
            </Form.Group>

            <div className="form-actions">
              <Button 
                variant="light" 
                onClick={() => navigate('/projects')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Project'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddProject;