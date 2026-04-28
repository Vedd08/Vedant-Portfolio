import { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      await axios.delete(`${API_URL}/${projectToDelete._id}`);
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
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

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="admin-projects">
        <div className="page-header">
          <h1 className="page-title">Projects</h1>
        </div>
        <div className="loading-state">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="admin-projects">
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

      {projects.length > 0 ? (
        <div className="table-responsive">
          <Table className="admin-table" hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Tech Stack</th>
                <th>Created</th>
                <th>Actions</th>
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
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="tech-badge">{tech}</span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="tech-badge">+{project.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(project.createdAt)}</td>
                  <td>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteClick(project)}
                      title="Delete"
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
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>No Projects Yet</h3>
          <p>Start by adding your first project to the portfolio.</p>
          <Link to="/add-project" className="btn btn-primary">
            Add Project
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
        className="delete-modal"
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

export default Projects;