import { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/${projectToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="projects-admin">
        <div className="page-header">
          <h1 className="page-title">Projects</h1>
        </div>
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-admin">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Manage your portfolio projects</p>
          </div>
          <Link to="/add-project" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {projects.length > 0 ? (
        <Card className="projects-card">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="admin-table mb-0" hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Tech Stack</th>
                    <th>Created</th>
                    <th style={{ width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td className="fw-medium">{project.title}</td>
                      <td className="text-secondary">
                        {truncateText(project.description)}
                      </td>
                      <td>
                        <div className="tech-badges">
                          {project.techStack?.slice(0, 2).map((tech, idx) => (
                            <span key={idx} className="tech-badge">{tech}</span>
                          ))}
                          {project.techStack?.length > 2 && (
                            <span className="tech-badge">+{project.techStack.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>{formatDate(project.createdAt)}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteClick(project)}
                          title="Delete project"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
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
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <h3>No Projects Yet</h3>
              <p>Start by adding your first project.</p>
              <Link to="/add-project" className="btn btn-primary">
                Add Project
              </Link>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>"{projectToDelete?.title}"</strong>?</p>
          <p className="text-secondary small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="light" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectsAdmin;