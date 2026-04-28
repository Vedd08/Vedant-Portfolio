import { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/experiences`;

const ExperienceAdmin = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      setExperiences(response.data);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (experience) => {
    setExperienceToDelete(experience);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/${experienceToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExperiences(experiences.filter(exp => exp._id !== experienceToDelete._id));
      setShowDeleteModal(false);
      setExperienceToDelete(null);
    } catch (err) {
      console.error('Error deleting experience:', err);
      alert('Failed to delete experience');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="projects-admin">
        <div className="page-header">
          <h1 className="page-title">Experience</h1>
        </div>
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-admin">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Experience</h1>
            <p className="page-subtitle">Manage your internships and roles</p>
          </div>
          <Link to="/add-experience" className="btn btn-primary">
            Add Experience
          </Link>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {experiences.length > 0 ? (
        <Card className="projects-card">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="admin-table mb-0" hover>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Duration</th>
                    <th style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => (
                    <tr key={exp._id}>
                      <td className="fw-medium">{exp.role}</td>
                      <td className="text-secondary">{exp.company}</td>
                      <td>{exp.duration}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClick(exp)}
                          title="Delete experience"
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
              <h3>No Experience Yet</h3>
              <p>Start by adding your first internship or role.</p>
              <Link to="/add-experience" className="btn btn-primary">
                Add Experience
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete "{experienceToDelete?.role}" at {experienceToDelete?.company}?</p>
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

export default ExperienceAdmin;
