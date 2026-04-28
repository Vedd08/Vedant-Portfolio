import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/certificates`;

const AddCertificate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
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
      submitData.append('issuer', formData.issuer);
      submitData.append('date', formData.date);
      if (formData.credentialUrl) {
        submitData.append('credentialUrl', formData.credentialUrl);
      }
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await axios.post(API_URL, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setFormData({ title: '', issuer: '', date: '', credentialUrl: '' });
      setImageFile(null);
      setTimeout(() => navigate('/certificates'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project">
      <div className="page-header">
        <h1 className="page-title">Add New Certificate</h1>
      </div>

      <Card className="form-card">
        <Card.Body>
          {success && <Alert variant="success">Certificate added! Redirecting...</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Certificate Title *</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Issuer *</Form.Label>
              <Form.Control type="text" name="issuer" value={formData.issuer} onChange={handleChange} required disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date/Year *</Form.Label>
              <Form.Control type="text" name="date" value={formData.date} onChange={handleChange} placeholder="e.g. 2023" required disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Certificate Image *</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} 
                required 
                disabled={loading} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Credential URL</Form.Label>
              <Form.Control type="url" name="credentialUrl" value={formData.credentialUrl} onChange={handleChange} disabled={loading} />
            </Form.Group>

            <div className="form-actions mt-4">
              <Button variant="light" onClick={() => navigate('/certificates')} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Adding...' : 'Add Certificate'}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddCertificate;
