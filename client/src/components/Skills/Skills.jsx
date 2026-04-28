import React, { useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const categoryRefs = useRef([]);
  const skillBarRefs = useRef([]);

  // Static skills from your resume
  const skillCategories = [
    {
      id: 'frontend',
      title: 'Frontend',
      icon: '🎨',
      skills: [
        { name: 'HTML', level: 90 },
        { name: 'CSS', level: 85 },
        { name: 'Bootstrap', level: 85 },
        { name: 'Tailwind CSS', level: 80 },
        { name: 'JavaScript', level: 85 },
        { name: 'React.js', level: 85 }
      ]
    },
    {
      id: 'backend',
      title: 'Backend',
      icon: '⚙️',
      skills: [
        { name: 'Node.js', level: 80 },
        { name: 'Express.js', level: 80 },
        { name: 'REST APIs', level: 85 },
        { name: 'JWT Authentication', level: 80 }
      ]
    },
    {
      id: 'database',
      title: 'Database',
      icon: '🗄️',
      skills: [
        { name: 'MongoDB', level: 80 }
      ]
    },
    {
      id: 'tools',
      title: 'Tools & Platforms',
      icon: '🛠️',
      skills: [
        { name: 'Git', level: 85 },
        { name: 'GitHub', level: 85 },
        { name: 'Render', level: 75 },
        { name: 'Netlify', level: 75 }
      ]
    }
  ];

  useEffect(() => {
    // Make elements visible immediately
    if (titleRef.current) {
      titleRef.current.style.opacity = '1';
    }
    
    categoryRefs.current.forEach(card => {
      if (card) card.style.opacity = '1';
    });

    // GSAP animations (non-blocking)
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      categoryRefs.current.forEach((category, index) => {
        if (category) {
          gsap.fromTo(category,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              delay: index * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: category,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });

      skillBarRefs.current.forEach((bar, index) => {
        if (bar) {
          const level = bar.getAttribute('data-level') || '85';
          gsap.fromTo(bar,
            { width: '0%' },
            {
              width: `${level}%`,
              duration: 1,
              delay: 0.2 + (index * 0.03),
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getCategoryColor = (index) => {
    const colors = [
      { start: '#2563EB', end: '#3B82F6' },
      { start: '#14B8A6', end: '#2DD4BF' },
      { start: '#22C55E', end: '#4ADE80' },
      { start: '#8B5CF6', end: '#A78BFA' }
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <Container fluid className="px-3 px-lg-5">
        <div className="section-header text-center">
          <h2 className="section-title" ref={titleRef} style={{ opacity: 1 }}>
            <span className="title-accent"></span>
            Technical Skills
            <span className="title-accent"></span>
          </h2>
          <p className="section-subtitle">
            Technologies I work with to bring ideas to life
          </p>
        </div>

        <Row className="g-4">
          {skillCategories.map((category, catIndex) => (
            <Col key={category.id} lg={6} xl={6} className="mb-4">
              <div 
                className="skill-category-card"
                ref={el => categoryRefs.current[catIndex] = el}
                style={{ opacity: 1 }}
              >
                <div className="category-header">
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-title">{category.title}</h3>
                  <span className="skill-count">{category.skills.length} skills</span>
                </div>

                <div className="skills-list">
                  {category.skills.map((skill, skillIndex) => {
                    const colors = getCategoryColor(catIndex);
                    return (
                      <div key={`${category.id}-${skill.name}-${skillIndex}`} className="skill-item">
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-level">{skill.level}%</span>
                        </div>
                        <div className="skill-progress">
                          <div 
                            className="skill-progress-bar"
                            ref={el => skillBarRefs.current.push(el)}
                            data-level={skill.level}
                            style={{ 
                              width: `${skill.level}%`,
                              background: `linear-gradient(90deg, ${colors.start} 0%, ${colors.end} 100%)`
                            }}
                          >
                            <span className="progress-glow"></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="category-footer">
                  <div className="category-tag">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Proficient</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Skills;