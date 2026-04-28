import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const featuredCardRef = useRef(null);
  const cardRefs = useRef([]);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`);
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // GSAP Animations after projects load
  useEffect(() => {
    if (loading || error || projects.length === 0) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Title and subtitle animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        });

        tl.fromTo(titleRef.current,
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo(subtitleRef.current,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );

        // Featured card animation
        if (featuredCardRef.current) {
          gsap.fromTo(featuredCardRef.current,
            { y: 50, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featuredCardRef.current,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }

        // Regular cards staggered animation
        cardRefs.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(card,
              { y: 40, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 90%',
                  end: 'bottom 20%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
        });

        // Parallax effect for background
        gsap.to('.projects-bg-shape', {
          y: 100,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }, sectionRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, error, projects]);

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Separate featured project (first project)
  const featuredProject = projects.length > 0 ? projects[0] : null;
  const regularProjects = projects.length > 1 ? projects.slice(1) : [];

  // Loading State
  if (loading) {
    return (
      <section id="projects" className="projects-section">
        <Container fluid className="px-3 px-lg-5">
          <div className="loading-container">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading projects...</span>
            </Spinner>
            <p className="loading-text">Loading amazing projects...</p>
          </div>
        </Container>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section id="projects" className="projects-section">
        <Container fluid className="px-3 px-lg-5">
          <div className="error-container">
            <div className="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button 
              className="btn-retry"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </Container>
      </section>
    );
  }

  // No Projects State
  if (projects.length === 0) {
    return (
      <section id="projects" className="projects-section">
        <Container fluid className="px-3 px-lg-5">
          <div className="empty-container">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" />
                <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
              </svg>
            </div>
            <h3>No Projects Yet</h3>
            <p>Check back soon for exciting projects!</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="projects-bg-shape"></div>
      <div className="projects-bg-dots"></div>

      <Container fluid className="px-3 px-lg-5">
        {/* Section Header */}
        <div className="section-header text-center">
          <h2 className="section-title" ref={titleRef}>
            <span className="title-decoration"></span>
            Featured Projects
            <span className="title-decoration"></span>
          </h2>
          <p className="section-subtitle" ref={subtitleRef}>
            Exploring innovation through code and creativity
          </p>
        </div>

        {/* Featured Project */}
        {featuredProject && (
          <div className="featured-project-wrapper" ref={featuredCardRef}>
            <div className="featured-badge">
              <span className="badge-icon">★</span>
              Featured Project
            </div>
            <div className="project-card featured">
              <div className="card-content">
                <div className="card-header">
                  <div className="project-meta">
                    <span className="project-date">
                      {formatDate(featuredProject.createdAt)}
                    </span>
                  </div>
                  <h3 className="project-title">{featuredProject.title}</h3>
                </div>
                
                <p className="project-description">
                  {featuredProject.description}
                </p>
                
                <div className="tech-stack">
                  {featuredProject.techStack.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
                
                <div className="card-actions">
                  {featuredProject.liveLink && (
                    <a 
                      href={featuredProject.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary-custom"
                    >
                      <span>Live Demo</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                  {featuredProject.githubLink && (
                    <a 
                      href={featuredProject.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-custom"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
              <div className="card-visual">
                {featuredProject.title.toLowerCase().includes('applyflow') ? (
                  <img src="/applyflow.png" alt="ApplyFlow" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
                ) : (
                  <div className="visual-placeholder">
                    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="200" height="150" rx="8" fill="url(#featuredGrad)" opacity="0.1" />
                      <defs>
                        <linearGradient id="featuredGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#2563EB" />
                          <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Regular Projects Grid */}
        {regularProjects.length > 0 && (
          <Row className="g-4">
            {regularProjects.map((project, index) => (
              <Col key={project._id} lg={4} md={6} xs={12}>
                <div 
                  className="project-card regular"
                  ref={el => cardRefs.current[index] = el}
                >
                  <div className="card-inner">
                    <div className="card-header">
                      <div className="project-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 7h-4.5A2.5 2.5 0 0 0 13 9.5v0A2.5 2.5 0 0 0 15.5 12H18a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-2" />
                          <path d="M16 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
                        </svg>
                      </div>
                      <h3 className="project-title">{project.title}</h3>
                      <span className="project-date-badge">
                        {formatDate(project.createdAt)}
                      </span>
                    </div>
                    
                    <p className="project-description">
                      {truncateDescription(project.description)}
                    </p>
                    
                    <div className="tech-stack">
                      {project.techStack.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="tech-tag more">+{project.techStack.length - 4}</span>
                      )}
                    </div>
                    
                    <div className="card-actions">
                      {project.liveLink && (
                        <a 
                          href={project.liveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="card-link"
                        >
                          Live Demo
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                      )}
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="card-link"
                        >
                          GitHub
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Projects;