import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Player } from '@lottiefiles/react-lottie-player';
// import developerAnimation from '../../assets/animations/developer.json';
import developerAnimation from '../../assets/animations/Yoga_Developer.json';
import './Hero.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const nameRef = useRef(null);
  const titleWrapperRef = useRef(null);
  const taglineRef = useRef(null);
  const statsRef = useRef(null);
  const ctaWrapperRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const visualRef = useRef(null);
  const underlineRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(
        [badgeRef.current, nameRef.current, titleWrapperRef.current, 
         taglineRef.current, statsRef.current, ctaWrapperRef.current, 
         scrollIndicatorRef.current, visualRef.current],
        { autoAlpha: 0, y: 30 }
      );

      // Master Timeline
      const tl = gsap.timeline({ 
        defaults: { 
          duration: 0.7, 
          ease: 'power3.out' 
        } 
      });

      // Staggered entrance animation
      tl.to(badgeRef.current, { 
        autoAlpha: 1, 
        y: 0, 
        duration: 0.7 
      })
        .to(nameRef.current, { 
          autoAlpha: 1, 
          y: 0, 
          duration: 1,
          ease: 'back.out(1.2)'
        }, '-=0.3')
        .to(underlineRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4')
        .to(titleWrapperRef.current, { 
          autoAlpha: 1, 
          y: 0 
        }, '-=0.5')
        .to(taglineRef.current, { 
          autoAlpha: 1, 
          y: 0 
        }, '-=0.6')
        .to(statsRef.current, { 
          autoAlpha: 1, 
          y: 0 
        }, '-=0.5')
        .to(ctaWrapperRef.current, { 
          autoAlpha: 1, 
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.1)'
        }, '-=0.4')
        .to(visualRef.current, {
          autoAlpha: 1,
          x: 0,
          duration: 1.2,
          ease: 'power2.out'
        }, '-=0.8')
        .to(scrollIndicatorRef.current, {
          autoAlpha: 0.6,
          y: 0,
          duration: 1
        }, '-=0.5');

      // Subtle parallax on scroll
      gsap.to('.hero-orb-1', {
        y: 100,
        x: -50,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to('.hero-orb-2', {
        y: -80,
        x: 50,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to(visualRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.01;
      const moveY = (clientY - window.innerHeight / 2) * 0.01;
      
      if (visualRef.current) {
        gsap.to(visualRef.current, {
          x: moveX * 0.5,
          y: moveY * 0.5,
          duration: 1,
          ease: 'power2.out'
        });
      }
      
      gsap.to('.hero-orb-1', {
        x: moveX * 0.3,
        y: moveY * 0.3,
        duration: 2,
        ease: 'power2.out'
      });
      
      gsap.to('.hero-orb-2', {
        x: -moveX * 0.2,
        y: -moveY * 0.2,
        duration: 2,
        ease: 'power2.out'
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section d-flex align-items-center" ref={heroRef} id="hero">
      {/* Premium Background Elements */}
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>
      <div className="hero-grid"></div>

      {/* Lottie Animation Visual Element */}
      <div className="hero-visual" ref={visualRef}>
        <div className="lottie-container">
          <Player
            src={developerAnimation}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      <Container fluid className="position-relative">
        <Row className="justify-content-center">
          <Col lg={10} xl={8} className="mx-auto">
            
            {/* Status Badge */}
            <div className="hero-badge" ref={badgeRef}>
              <span className="status-dot"></span>
              <span>BCA Student (2023–2026)</span>
            </div>

            {/* Name with Decorative Elements */}
            <div className="hero-name-wrapper">
              <h1 className="hero-name" ref={nameRef}>
                <span className="first-name">Vedant</span>{' '}
                <span className="last-name">Sonawane</span>
              </h1>
              <div className="name-underline" ref={underlineRef}></div>
            </div>

            {/* Title with Icon */}
            <div className="hero-title-wrapper" ref={titleWrapperRef}>
              <span className="title-icon"></span>
              <h2 className="hero-title">MERN Stack Developer</h2>
            </div>

            {/* Enhanced Tagline */}
            <p className="hero-tagline" ref={taglineRef}>
              Building <span className="tagline-accent">full-stack</span> web applications with{' '}
              <span className="tagline-accent">MongoDB</span>,{' '}
              <span className="tagline-accent">Express</span>,{' '}
              <span className="tagline-accent">React</span> &{' '}
              <span className="tagline-accent">Node.js</span>
            </p>

            {/* Quick Stats */}
            <div className="hero-stats" ref={statsRef}>
              <div className="stat-item">
                <span className="stat-number">MERN</span>
                <span className="stat-label">Full Stack</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">REST</span>
                <span className="stat-label">APIs & JWT</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">Cloud</span>
                <span className="stat-label">Render/Netlify/Vercel</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-wrapper" ref={ctaWrapperRef}>
              <button 
                className="btn btn-primary-custom"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Projects
                <span className="btn-icon">→</span>
              </button>
              
              <button 
                className="btn btn-outline-custom"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                Let's Connect
              </button>
            </div>

          </Col>
        </Row>
      </Container>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" ref={scrollIndicatorRef}>
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;
