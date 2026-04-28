import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/experiences`);
        setExperiences(res.data);
      } catch (err) {
        console.error('Failed to fetch experiences', err);
      }
    };
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (experiences.length > 0) {
    const ctx = gsap.context(() => {
      gsap.fromTo(itemsRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
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
  }, [experiences]);

  return (
    <section id="experience" className="experience-section" ref={sectionRef}>
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">My <span>Experience</span></h2>
          <div className="title-underline"></div>
        </div>
        
        <div className="timeline">
          {experiences.map((exp, idx) => (
            <div 
              className="timeline-item" 
              key={exp._id}
              ref={el => itemsRef.current[idx] = el}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-card">
                <div className="timeline-header">
                  <h3 className="timeline-role">{exp.role}</h3>
                  <span className="timeline-duration">{exp.duration}</span>
                </div>
                <h4 className="timeline-company">{exp.company}</h4>
                <p className="timeline-description">{exp.description}</p>
                <div className="timeline-skills">
                  {exp.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Experience;
