import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProjectsAdmin from './pages/ProjectsAdmin';
import AddProject from './pages/AddProject';
import CertificatesAdmin from './pages/CertificatesAdmin';
import AddCertificate from './pages/AddCertificate';
import ServicesAdmin from './pages/ServicesAdmin';
import AddService from './pages/AddService';
import ExperienceAdmin from './pages/ExperienceAdmin';
import AddExperience from './pages/AddExperience';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="add-project" element={<AddProject />} />
          <Route path="certificates" element={<CertificatesAdmin />} />
          <Route path="add-certificate" element={<AddCertificate />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="experiences" element={<ExperienceAdmin />} />
          <Route path="add-experience" element={<AddExperience />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;