import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/experiences`;

const AddExperience = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    duration: '',
    description: '',
    skills: ''
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
      await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setFormData({ role: '', company: '', duration: '', description: '', skills: '' });
      setTimeout(() => navigate('/experiences'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project">
      <div className="page-header">
        <h1 className="page-title">Add New Experience</h1>
      </div>

      <Card className="form-card">
        <Card.Body>
          {success && <Alert variant="success">Experience added! Redirecting...</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Role/Title *</Form.Label>
              <Form.Control type="text" name="role" value={formData.role} onChange={handleChange} required disabled={loading} placeholder="e.g. Frontend Intern" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Name *</Form.Label>
              <Form.Control type="text" name="company" value={formData.company} onChange={handleChange} required disabled={loading} placeholder="e.g. Google" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration *</Form.Label>
              <Form.Control type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. Jan 2023 - Present" required disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} required disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Skills (Comma separated) *</Form.Label>
              <Form.Control type="text" name="skills" value={formData.skills} onChange={handleChange} required disabled={loading} placeholder="e.g. React, Node.js, MongoDB" />
            </Form.Group>

            <div className="form-actions mt-4">
              <Button variant="light" onClick={() => navigate('/experiences')} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Adding...' : 'Add Experience'}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddExperience;
