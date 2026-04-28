import React, { useEffect } from 'react';
import Experience from '../components/Experience/Experience';
import Certificates from '../components/Certificates/Certificates';
import useViewTracker from '../hooks/useViewTracker';
import './ExperiencePage.css';

const ExperiencePage = () => {
  useViewTracker(); // Track page views

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="experience-page">
      <div className="page-header-banner">
        <h1 className="page-title">Career & Achievements</h1>
        <p className="page-subtitle">A journey of continuous learning and growth</p>
      </div>
      
      <main>
        <Experience />
        <Certificates />
      </main>
    </div>
  );
};

export default ExperiencePage;
