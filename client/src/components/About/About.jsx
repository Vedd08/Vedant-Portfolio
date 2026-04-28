import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import vedantPhoto from '../../assets/images/vedant.png';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const badgesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background text animation
      gsap.to('.about-bg-text', {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Text reveal animation
      if (textContainerRef.current) {
        const texts = textContainerRef.current.children;
        gsap.fromTo(texts, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: 'top 85%',
            }
          }
        );
      }

      // Image reveal animation
      if (imageContainerRef.current) {
        gsap.fromTo(imageContainerRef.current,
          { scale: 0.85, opacity: 0, y: 50 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageContainerRef.current,
              start: 'top 85%',
            }
          }
        );
      }

      // Floating Badges continuous animation
      badgesRef.current.forEach((badge, i) => {
        if (badge) {
          gsap.to(badge, {
            y: 'random(-15, 15)',
            x: 'random(-10, 10)',
            rotation: 'random(-5, 5)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about-modern-section" ref={sectionRef}>
      {/* Huge Background Scrolling Text */}
      <div className="about-bg-text">MERN DEVELOPER FULL STACK ENGINEER</div>
      
      <div className="about-glow-blob top-right"></div>
      <div className="about-glow-blob bottom-left"></div>

      <Container className="position-relative z-index-1">
        <Row className="align-items-center g-5">
          {/* Left Side: Visuals */}
          <Col lg={5} md={12} className="mb-5 mb-lg-0 order-2 order-lg-1">
            <div className="about-image-wrapper" ref={imageContainerRef}>
              <div className="image-glass-frame">
                <div className="image-inner">
                  <img src={vedantPhoto} alt="Vedant Sonawane" className="main-about-img" />
                </div>
              </div>
              
              {/* Floating Badges */}
              <div className="floating-badge badge-1" ref={el => badgesRef.current[0] = el}>
                <div className="badge-icon react-color">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <ellipse cx="12" cy="12" rx="10" ry="4"></ellipse>
                    <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(45 12 12)"></ellipse>
                    <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(-45 12 12)"></ellipse>
                  </svg>
                </div>
                <span>React</span>
              </div>
              
              <div className="floating-badge badge-2" ref={el => badgesRef.current[1] = el}>
                <div className="badge-icon node-color">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span>Node.js</span>
              </div>

              <div className="floating-badge badge-3" ref={el => badgesRef.current[2] = el}>
                <div className="badge-icon mongo-color">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                </div>
                <span>MongoDB</span>
              </div>
            </div>
          </Col>

          {/* Right Side: Content */}
          <Col lg={7} md={12} className="order-1 order-lg-2">
            <div className="about-content-wrapper" ref={textContainerRef}>
              <div className="about-subtitle">
                <span className="subtitle-line"></span>
                <span>Discover</span>
              </div>
              
              <h2 className="about-main-title">
                About <span>Me</span>
              </h2>

              <p className="about-intro">
                I am a motivated <span className="highlight-text">BCA student (2023–2026)</span> and an aspiring MERN stack developer. I thrive on building highly interactive, scalable, and responsive web applications.
              </p>

              <p className="about-description">
                With a strong foundation in MongoDB, Express.js, React, and Node.js, I specialize in crafting robust RESTful APIs, implementing secure authentication systems, and designing elegant role-based dashboards. My goal is to merge technical proficiency with creative problem-solving to deliver exceptional digital experiences.
              </p>

              {/* Bento Grid Skills */}
              <div className="about-bento-grid">
                <div className="bento-item">
                  <div className="bento-icon frontend">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div className="bento-text">
                    <h4>Frontend</h4>
                    <p>React, Next.js, Tailwind</p>
                  </div>
                </div>
                
                <div className="bento-item">
                  <div className="bento-icon backend">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                      <line x1="6" y1="6" x2="6.01" y2="6"></line>
                      <line x1="6" y1="18" x2="6.01" y2="18"></line>
                    </svg>
                  </div>
                  <div className="bento-text">
                    <h4>Backend</h4>
                    <p>Node.js, Express.js</p>
                  </div>
                </div>

                <div className="bento-item">
                  <div className="bento-icon database">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                  </div>
                  <div className="bento-text">
                    <h4>Database</h4>
                    <p>MongoDB, Mongoose</p>
                  </div>
                </div>

                <div className="bento-item">
                  <div className="bento-icon design">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                      <path d="M2 2l7.586 7.586"></path>
                      <circle cx="11" cy="11" r="2"></circle>
                    </svg>
                  </div>
                  <div className="bento-text">
                    <h4>Design</h4>
                    <p>UI/UX, Figma, GSAP</p>
                  </div>
                </div>
              </div>

              <div className="about-action-btns">
                <a href="#projects" className="btn-modern-primary">
                  View My Work
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;