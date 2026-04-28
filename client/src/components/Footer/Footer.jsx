import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const brandRef = useRef(null);
  const linksRef = useRef(null);
  const socialRef = useRef(null);
  const copyrightRef = useRef(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle fade-in animation for footer elements
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 95%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(brandRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }
      )
      .fromTo(linksRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(socialRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(copyrightRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const quickLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      url: 'https://github.com/Vedd08/'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      url: 'https://www.linkedin.com/in/vedant-sonawane-b67341248/'
    },
    {
      name: 'Email',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      url: 'mailto:vedant.sonawane@example.com'
    }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="footer-section" ref={footerRef}>
      <Container fluid className="px-3 px-lg-5">
        {/* Main Footer Content */}
        <Row className="footer-main g-4 g-lg-5">
          {/* Brand Column */}
          <Col lg={4} md={12}>
            <div className="footer-brand" ref={brandRef}>
              <h3 className="footer-name">Vedant Sonawane</h3>
              <p className="footer-tagline">
                MERN Stack Developer building scalable web applications
              </p>
            </div>
          </Col>

          {/* Quick Links Column */}
          <Col lg={4} md={6} xs={12}>
            <div className="footer-links" ref={linksRef}>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-nav">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="footer-link"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Social Links Column */}
          <Col lg={4} md={6} xs={12}>
            <div className="footer-social" ref={socialRef}>
              <h4 className="footer-heading">Connect</h4>
              <div className="social-icons">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={social.name}
                  >
                    {social.icon}
                    <span className="social-label">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Bar */}
        <div className="footer-bottom" ref={copyrightRef}>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="copyright">
                © {currentYear} Vedant Sonawane. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="footer-credit">
                Built with 
                <span className="heart-icon">❤️</span> 
                using React & Bootstrap
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;