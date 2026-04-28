import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const infoItemsRef = useRef([]);
  const socialLinksRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    message: false
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // GSAP animations (unchanged)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftColumnRef.current,
        { x: -30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: leftColumnRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(rightColumnRef.current,
        { x: 30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rightColumnRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      infoItemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(item,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              delay: 0.2 + (index * 0.1),
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });

      if (socialLinksRef.current) {
        gsap.fromTo(socialLinksRef.current,
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            delay: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: socialLinksRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFocus = (field) => {
    setFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    console.log('📤 Submitting form data:', formData);

    try {
      // Test server connection first
      console.log(`🔗 Connecting to: ${import.meta.env.VITE_API_URL}/api/contact`);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Server response:', response.data);
      
      setSubmitted(true);
      setSuccessMessage(response.data.message || 'Message sent successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitted(false);
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('❌ Form submission error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please check if the server is running.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure backend is running on port 5000.');
      } else if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || 'Server error. Please try again.');
        console.error('Server error response:', err.response.data);
      } else if (err.request) {
        // No response received
        setError('No response from server. Check if backend is running.');
        console.error('No response:', err.request);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: 'Email',
      value: 'sonawanevedant42@gmail.com',
      link: 'mailto:sonawanevedant42@gmail.com'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Phone',
      value: '+91 7666307146',
      link: 'tel:+917666307146'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Location',
      value: 'Surat, Gujarat, India',
      link: null
    }
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
    }
  ];

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="contact-bg-decoration"></div>

      <Container fluid className="px-3 px-lg-5">
        <Row className="g-4 g-lg-5 align-items-stretch">
          <Col lg={5} md={12}>
            <div className="contact-info-wrapper" ref={leftColumnRef}>
              <div className="contact-header">
                <h2 className="contact-title">
                  <span className="title-line"></span>
                  Get In Touch
                </h2>
                <p className="contact-subtitle">
                  Have a project in mind or just want to chat? 
                  I'd love to hear from you.
                </p>
              </div>

              <div className="contact-details">
                {contactInfo.map((item, index) => (
                  <div 
                    key={item.label}
                    className="contact-item"
                    ref={el => infoItemsRef.current[index] = el}
                  >
                    <div className="contact-icon">{item.icon}</div>
                    <div className="contact-content">
                      <span className="contact-label">{item.label}</span>
                      {item.link ? (
                        <a href={item.link} className="contact-value">
                          {item.value}
                        </a>
                      ) : (
                        <span className="contact-value">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-social" ref={socialLinksRef}>
                <span className="social-label">Connect with me</span>
                <div className="social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="availability-badge">
                <span className="pulse-dot"></span>
                Available for opportunities
              </div>
            </div>
          </Col>

          <Col lg={7} md={12}>
            <div className="contact-form-wrapper" ref={rightColumnRef}>
              <div className="form-card">
                {submitted ? (
                  <div className="success-message">
                    <div className="success-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h3>Message Sent!</h3>
                    <p>{successMessage || "Thank you for reaching out. I'll get back to you soon!"}</p>
                    <button 
                      className="btn-send-another"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    {error && (
                      <Alert variant="danger" className="mb-4">
                        {error}
                      </Alert>
                    )}

                    <div className="form-group floating-label">
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={() => handleBlur('name')}
                        required
                        className={focused.name || formData.name ? 'has-value' : ''}
                        disabled={loading}
                      />
                      <label>Your Name</label>
                      <span className="input-border"></span>
                    </div>

                    <div className="form-group floating-label">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        required
                        className={focused.email || formData.email ? 'has-value' : ''}
                        disabled={loading}
                      />
                      <label>Email Address</label>
                      <span className="input-border"></span>
                    </div>

                    <div className="form-group floating-label">
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('message')}
                        onBlur={() => handleBlur('message')}
                        rows="4"
                        required
                        className={focused.message || formData.message ? 'has-value' : ''}
                        disabled={loading}
                      />
                      <label>Your Message</label>
                      <span className="input-border"></span>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </Form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;