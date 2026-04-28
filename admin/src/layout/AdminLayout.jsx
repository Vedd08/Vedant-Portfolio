import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleViewSite = () => {
    window.open('http://localhost:5173', '_blank');
  };

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile Header */}
        <header className="admin-header">
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="page-title-mobile">Admin Panel</h1>
          
          {/* View Site Button for Mobile */}
          <button 
            className="view-site-btn-mobile"
            onClick={handleViewSite}
            title="View Portfolio Site"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </header>

        {/* Page Content */}
        <Container fluid className="admin-container">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;