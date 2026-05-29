import React from 'react';
import { PenTool, Award, Compass, Cpu } from 'lucide-react';
import './aboutTab.css';

const AboutTab = ({ isOwner, profileData, onOpenEdit }) => {
  const skills = ["Full-Stack Dev", "UI/UX Design", "React", "Tailwind CSS", "JavaScript", "Network Defense", "IoT Architecture"];

  return (
    <div className="about-tab-wrapper">
      
      {/* 1. CENTRALIZED SECTION MASTER HEADER */}
      <div className="about-tab-master-header">
        <h2>About</h2>
        {/* CONDITIONAL: Just a naked pen icon visible only to the profile owner */}
        {isOwner && (
          <button className="about-master-edit-naked-btn" onClick={() => onOpenEdit('about')} aria-label="Edit about section">
            <PenTool className="master-edit-svg" />
          </button>
        )}
      </div>

      {/* 2. OVERVIEW PANEL */}
      <div className="about-card-panel">
        <div className="about-panel-sub-title">
          <Compass className="panel-header-icon" />
          <h3>Overview</h3>
        </div>
        <p className="about-bio-paragraph">
          {profileData.overview}
        </p>
      </div>

      {/* 3. SKILLS MATRIX PILLS */}
      <div className="about-card-panel">
        <div className="about-panel-sub-title">
          <Cpu className="panel-header-icon" />
          <h3>Skills & Technologies</h3>
        </div>
        <div className="skills-tags-grid">
  {profileData.skills && profileData.skills.map((skill, index) => (
    <span key={index} className="profile-skill-badge">
      {skill}
    </span>
  ))}
</div>
      </div>

      {/* 4. ACADEMIC CREDENTIALS TIMELINE */}
<div className="about-card-panel">
  <div className="about-panel-sub-title">
    <Award className="panel-header-icon" />
    <h3>Education & Certifications</h3>
  </div>
  <div className="credentials-timeline-track">
    
    {/* Map through Education History list */}
    {profileData.education && profileData.education.map((edu) => (
      <div key={edu.id} className="timeline-milestone-node">
        <div className="timeline-node-indicator" />
        <div className="timeline-node-details">
          <h4>{edu.degree}</h4>
          <p className="node-institution">{edu.school}</p>
          <span className="node-meta-plain-text">{edu.meta}</span>
        </div>
      </div>
    ))}

    {/* Map through Certifications list */}
    {profileData.certifications && profileData.certifications.map((cert) => (
      <div key={cert.id} className="timeline-milestone-node">
        <div className="timeline-node-indicator" />
        <div className="timeline-node-details">
          <h4>{cert.title}</h4>
          <p className="node-institution">{cert.authority}</p>
          <span className="node-meta-plain-text">{cert.meta}</span>
        </div>
      </div>
    ))}

  </div>
</div>

    </div>
  );
};

export default AboutTab;