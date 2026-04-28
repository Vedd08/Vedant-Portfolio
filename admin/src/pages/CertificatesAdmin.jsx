import { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/certificates`;

const CertificatesAdmin = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      setCertificates(response.data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (certificate) => {
    setCertificateToDelete(certificate);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!certificateToDelete) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/${certificateToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(certificates.filter(c => c._id !== certificateToDelete._id));
      setShowDeleteModal(false);
      setCertificateToDelete(null);
    } catch (err) {
      console.error('Error deleting certificate:', err);
      alert('Failed to delete certificate');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="projects-admin">
        <div className="page-header">
          <h1 className="page-title">Certificates</h1>
        </div>
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-admin">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Certificates</h1>
            <p className="page-subtitle">Manage your portfolio certificates</p>
          </div>
          <Link to="/add-certificate" className="btn btn-primary">
            Add Certificate
          </Link>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {certificates.length > 0 ? (
        <Card className="projects-card">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="admin-table mb-0" hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Issuer</th>
                    <th>Date</th>
                    <th style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr key={cert._id}>
                      <td className="fw-medium">{cert.title}</td>
                      <td className="text-secondary">{cert.issuer}</td>
                      <td>{cert.date}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClick(cert)}
                          title="Delete certificate"
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
              <h3>No Certificates Yet</h3>
              <p>Start by adding your first certificate.</p>
              <Link to="/add-certificate" className="btn btn-primary">
                Add Certificate
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete "{certificateToDelete?.title}"?</p>
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

export default CertificatesAdmin;
