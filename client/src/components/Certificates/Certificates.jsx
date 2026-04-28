import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Certificates.css';

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`;
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(getImageUrl(imageUrl));
    setShowModal(true);
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/certificates`);
        setCertificates(res.data);
      } catch (err) {
        console.error('Failed to fetch certificates', err);
      }
    };
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (certificates.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(cardsRef.current,
          { scale: 0.9, opacity: 0, rotationY: 15 },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            }
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    }
  }, [certificates]);

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="certificates-section" ref={sectionRef}>
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">My <span>Certificates</span></h2>
          <div className="title-underline"></div>
        </div>
        
        <Row className="g-4 justify-content-center">
          {certificates.map((cert, idx) => (
            <Col lg={4} md={6} key={cert._id}>
              <div 
                className="certificate-card"
                ref={el => cardsRef.current[idx] = el}
              >
                <div className="cert-image-container" onClick={() => handleImageClick(cert.imageUrl)}>
                  <img src={getImageUrl(cert.imageUrl)} alt={cert.title} className="cert-image" />
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="verify-btn">
                      Verify Credential
                    </a>
                  )}
                </div>
                <div className="cert-info">
                  <h4 className="cert-title">{cert.title}</h4>
                  <div className="cert-meta">
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="cert-date">{cert.date}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Image Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered 
        size="lg"
        className="certificate-modal"
      >
        <Modal.Header closeButton variant="white">
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {selectedImage && <img src={selectedImage} alt="Certificate" className="img-fluid w-100" />}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Certificates;
