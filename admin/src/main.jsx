import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Admin.css';

// Strip trailing slash once globally — fixes //api/ double-slash 404s on Vercel
axios.defaults.baseURL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);