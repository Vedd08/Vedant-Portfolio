import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Container, Nav, Navbar as BSNavbar } from 'react-bootstrap';
import { gsap } from 'gsap';
import './Navbar.css';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const brandRef = useRef(null);
  const navLinksRef = useRef([]);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' }
      });

      tl.fromTo(navbarRef.current, 
        { y: -100, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1 }
      )
      .fromTo(brandRef.current,
        { autoAlpha: 0, x: -20 },
        { autoAlpha: 1, x: 0 },
        '-=0.5'
      )
      .fromTo(navLinksRef.current,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, stagger: 0.1 },
        '-=0.3'
      );
    }, navbarRef);

    return () => ctx.revert();
  }, []);

  // Scroll effect for shadow and active link detection
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow on scroll
      setScrolled(window.scrollY > 20);

      // Update active link based on scroll position
      const sections = [
        { id: 'hero', offset: 100 },
        { id: 'projects', offset: 100 }
      ];
      
      // Check if we're near the bottom of the page
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition >= documentHeight - 50) {
        setActiveLink('projects');
        return;
      }
      
      // Check each section's position
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = section.offset;
          
          if (rect.top <= offset && rect.bottom >= offset) {
            setActiveLink(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    setExpanded(false); // Close mobile menu

    if (location.pathname !== '/') {
      // If not on homepage, navigate to homepage with hash
      navigate(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      // Get navbar height for offset
      const navbarHeight = navbarRef.current?.offsetHeight || 70;
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveLink(sectionId);
    }
  };

  // Handle hash changes when navigating back to homepage
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.replace('#', '');
      // Slight delay to ensure elements are rendered before scrolling
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else if (location.pathname === '/experience') {
      setActiveLink('experience');
    }
  }, [location]);

  // Navigation items based on your actual sections
  // In Navbar.jsx
const navItems = [
  { id: 'hero', label: 'Home', isPage: false },
  { id: 'about', label: 'About', isPage: false },
  { id: 'skills', label: 'Skills', isPage: false },
  { id: 'projects', label: 'Projects', isPage: false },
  { id: 'experience', label: 'Experience & Certs', isPage: true, path: '/experience' },
  { id: 'contact', label: 'Contact', isPage: false }   
];

  return (
    <BSNavbar 
      ref={navbarRef}
      expand="lg" 
      fixed="top"
      expanded={expanded}
      className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <Container fluid className="px-3 px-lg-5">
        {/* Brand / Logo */}
        <BSNavbar.Brand 
          as={Link}
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              scrollToSection('hero');
            }
          }}
          className="navbar-brand-custom"
        >
          <span className="brand-text">Vedant</span>
          <span className="brand-dot">.</span>
        </BSNavbar.Brand>

        {/* Hamburger Toggle */}
        <BSNavbar.Toggle 
          aria-controls="navbar-nav"
          onClick={() => setExpanded(!expanded)}
          className="custom-toggler"
        >
          <div className={`hamburger-icon ${expanded ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </BSNavbar.Toggle>

        {/* Navigation Links */}
        <BSNavbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-lg-center">
            {navItems.map((item, index) => (
              <Nav.Item key={item.id}>
                {item.isPage ? (
                  <Nav.Link
                    as={Link}
                    to={item.path}
                    ref={el => navLinksRef.current[index] = el}
                    onClick={() => {
                      setExpanded(false);
                      setActiveLink(item.id);
                    }}
                    className={`nav-link-custom ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="link-text">{item.label}</span>
                    <span className="link-underline"></span>
                  </Nav.Link>
                ) : (
                  <Nav.Link
                    ref={el => navLinksRef.current[index] = el}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={`nav-link-custom ${activeLink === item.id && location.pathname === '/' ? 'active' : ''}`}
                  >
                    <span className="link-text">{item.label}</span>
                    <span className="link-underline"></span>
                  </Nav.Link>
                )}
              </Nav.Item>
            ))}
            
            {/* External Links - GitHub & LinkedIn */}
            <Nav.Item className="ms-lg-3 d-flex gap-2">
              <a 
                href="https://github.com/Vedd08/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
                onClick={() => setExpanded(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/vedant-sonawane-b67341248/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
                onClick={() => setExpanded(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </Nav.Item>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;