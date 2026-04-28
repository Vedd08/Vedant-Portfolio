import { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/services`;

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/${serviceToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter(s => s._id !== serviceToDelete._id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Failed to delete service');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="projects-admin">
        <div className="page-header">
          <h1 className="page-title">Services</h1>
        </div>
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-admin">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Services</h1>
            <p className="page-subtitle">Manage your portfolio services</p>
          </div>
          <Link to="/add-service" className="btn btn-primary">
            Add Service
          </Link>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {services.length > 0 ? (
        <Card className="projects-card">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="admin-table mb-0" hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td className="fw-medium">{service.title}</td>
                      <td className="text-secondary">{service.description}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClick(service)}
                          title="Delete service"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="empty-card">
          <Card.Body>
            <div className="empty-state">
              <h3>No Services Yet</h3>
              <p>Start by adding your first service.</p>
              <Link to="/add-service" className="btn btn-primary">
                Add Service
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete "{serviceToDelete?.title}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServicesAdmin;
