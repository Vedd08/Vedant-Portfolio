import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/services`;

const AddService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [iconFile, setIconFile] = useState(null);
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
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      if (iconFile) {
        submitData.append('image', iconFile); // Note: server expects 'image'
      }

      await axios.post(API_URL, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setFormData({ title: '', description: '' });
      setIconFile(null);
      setTimeout(() => navigate('/services'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project">
      <div className="page-header">
        <h1 className="page-title">Add New Service</h1>
      </div>

      <Card className="form-card">
        <Card.Body>
          {success && <Alert variant="success">Service added! Redirecting...</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Title *</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Service Icon/Image *</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={(e) => setIconFile(e.target.files[0])} 
                required 
                disabled={loading} 
              />
            </Form.Group>

            <div className="form-actions mt-4">
              <Button variant="light" onClick={() => navigate('/services')} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Adding...' : 'Add Service'}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddService;
