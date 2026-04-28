import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const [services, setServices] = useState([]);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`);
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(cardsRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    }
  }, [services]);

  if (services.length === 0) return null;

  return (
    <section id="services" className="services-section" ref={sectionRef}>
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">My <span>Services</span></h2>
          <div className="title-underline"></div>
        </div>
        
        <Row className="g-4">
          {services.map((service, idx) => (
            <Col lg={4} md={6} key={service._id}>
              <div 
                className="service-card glass-card"
                ref={el => cardsRef.current[idx] = el}
              >
                <div className="service-icon-wrapper">
                  <img src={getImageUrl(service.icon)} alt={service.title} className="service-icon" />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="card-glow"></div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Services;
