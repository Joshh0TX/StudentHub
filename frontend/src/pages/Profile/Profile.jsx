import React, { useState, useEffect } from 'react';
import './profile.css';
import EditAbout from './profileSubsection/EditAbout';
import RequestOverlay from './profileSubsection/RequestOverlay';

import { Edit, Award, Trophy, Star, Zap, Users, X, Camera} from 'lucide-react';

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [user, setUser] = useState({
    name: '', 
    course: '', 
    profileImage: '',
    bio: '',
    location: '',
    joinedDate: '',
    email: '',
  });

  const handleCoverUpdate = () => {
      document.getElementById('coverInput').click();
    };
    // Add these right after your handleCoverUpdate function
  const onCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, coverImage: imageUrl }));
    }
  };

  const onProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, profileImage: imageUrl }));
      setIsProfileMenuOpen(false); // Closes the "Upload" tooltip after selection
    }
  };

 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored here
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.name || '',
            course: data.department || '',
            profileImage: data.profilePic || '',
            bio: data.bio || '',
            location: '', // Not in schema
            joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '',
            email: data.email || '',
          });
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Fallback data (ready for backend)
  const skills = [
    { name: "React", level: 85 },
    { name: "Node.js", level: 78 },
    { name: "UI/UX Design", level: 92 },
    { name: "Python", level: 65 },
  ];

  const interests = ["Photography", "Reading Tech Blogs", "Gaming", "Travel", "Music Production"];

  const socials = [
    { platform: "Twitter", handle: "@henrydev", link: "#" },
    { platform: "LinkedIn", handle: "henry-ade", link: "#" },
    { platform: "GitHub", handle: "henrycodes", link: "#" },
  ];

  const achievements = [
    "1st Place - University Hackathon 2025",
    "Google Developer Scholarship Recipient",
    "Best Project Award - TechFest 2024",
  ];

  const recentActivities = [
    {
      name: "Henry",
      time: "2 hours ago",
      content: "Just completed the new dashboard UI for Campus Connect. Feedback welcome!",
    },
    {
      name: "Henry",
      time: "Yesterday",
      content: "Participated in the monthly code review session with the team.",
    },
    {
      name: "Henry",
      time: "3 days ago",
      content: "Liked and commented on Sarah's new portfolio redesign.",
    },
  ];

  return (
    <>
    <div className="container">
      <section className="profile-section">
        {/* COVER WRAPPER */}
        <div className="cover-wrapper" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
          <img 
            src={user.coverImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop"} 
            alt="Cover" 
            className="coverimg"
          />
          <div className="cover-overlay">Click to expand</div>

          {/* PROFILE IMAGE */}
          <div 
            className="profileImg" 
            onClick={(e) => {
              e.stopPropagation(); // Prevents opening the cover modal
              setIsProfileMenuOpen(!isProfileMenuOpen);
            }}
          >
            <img 
              src={user.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"} 
              alt="Profile" 
            />
            
            {/* 4. UPDATED: Tooltip logic */}
            {isProfileMenuOpen && (
              <div className="profile-upload-tooltip">
                <button onClick={() => document.getElementById('profileInput').click()}>
                  <Camera size={16} />
                  <span>Upload Photo</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 5. UPDATED: Hidden inputs with onChange handlers */}
        <input 
          type="file" 
          id="coverInput" 
          accept="image/*"
          style={{ display: 'none' }} 
          onChange={onCoverChange} 
        />
        <input 
          type="file" 
          id="profileInput" 
          accept="image/*"
          style={{ display: 'none' }} 
          onChange={onProfileChange} 
        />
          {/* FULL SCREEN MODAL */}
        {isModalOpen && (
          <div className="full-screen-modal">
            <div className="modal-content">
              <button className="close-modal" onClick={() => setIsModalOpen(false)}><X size={30} /></button>
              <img 
                src={user.coverImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop"} 
                alt="Full Cover" 
                className="full-img" 
              />
              <div className="modal-actions">
                <button className="change-photo-btn" onClick={handleCoverUpdate}>
                  <Camera size={20} /> Change Cover Photo
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="profile-main">
          <div className="profile-text">
            <h1>{user.name || 'Henry'}</h1>
            <p className="profile-course">{user.course || 'Computer Science'}</p>
            <p className="profile-bio">{user.bio || "Passionate full-stack developer."}</p>
            <div className="profile-socials-list">
              {socials.map((social, i) => {
                const platform = social.platform.toLowerCase();
                return (
                  <a key={i} href={social.link} className="social-pill-item" target="_blank" rel="noreferrer">
                    {/* GitHub Icon */}
                    {platform === 'github' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    )}
                    {/* LinkedIn Icon */}
                    {platform === 'linkedin' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    )}
                    {/* Twitter/X Icon */}
                    {(platform === 'twitter' || platform === 'x') && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    )}
                    {/* Generic/Email Icon */}
                    {platform === 'email' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                   )}
                    <span>{social.handle}</span>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-btn" onClick={() => setIsRequestOpen(true)}>
              <Edit size={18} style={{ marginRight: '8px' }} /> View Request
            </button>
          </div>
        </div>
      </section>
      {/* Main Content Grid */}
      <div className="info-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* About */}
         {isEditingAbout ? (
            <EditAbout 
              initialData={user} 
              onCancel={() => setIsEditingAbout(false)}
              onSave={(newData) => {
                setUser(prev => ({ ...prev, ...newData }));
                setIsEditingAbout(false);
              }}
            />
            ) : (
            <div className="info-box about-box">
              <div className="box-header">
                <h2>About</h2>
                <button className="edit-rect-btn" onClick={() => setIsEditingAbout(true)}>
                  <Edit size={18} /> Edit
                </button>
              </div>
              <p className="about-text">
                {user.bio || "I'm a passionate developer and designer..."}
              </p>
              <div className="details-list">
                <div className="detail-item"><strong>Course:</strong> {user.course}</div>
                <div className="detail-item"><strong>Location:</strong> {user.location}</div>
                <div className="detail-item"><strong>Joined:</strong> {user.joinedDate}</div>
                <div className="detail-item"><strong>Email:</strong> {user.email}</div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="info-box badges-box">
            <div className="box-header">
              <h2>Badges &amp; Achievements</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
            </div>
            <div className="badges-grid">
              <button className="badge-btn"><Award size={26} /><span>Top Contributor</span></button>
              <button className="badge-btn"><Trophy size={26} /><span>Hackathon Winner</span></button>
              <button className="badge-btn"><Star size={26} /><span>Best UI Design</span></button>
              <button className="badge-btn"><Zap size={26} /><span>Fastest Learner</span></button>
            </div>
          </div>

          {/* Skills with Progress Bars */}
          <div className="info-box skills-box">
            <div className="box-header">
              <h2>Skills</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
            </div>
            <div className="skills-list">
              {skills.map((skill, i) => (
                <div key={i} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percent">{skill.level}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="info-box interests-box">
            <div className="box-header">
              <h2>Interests</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
            </div>
            <div className="interests-list">
              {interests.map((interest, i) => (
                <span key={i} className="interest-tag">{interest}</span>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="info-box connect-box">
            <div className="box-header">
              <h2>Connect</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
            </div>
            <div className="social-links">
              {socials.map((social, i) => (
                <a key={i} href={social.link} className="social-link">
                  <Users size={20} />
                  <span>{social.platform}: <strong>{social.handle}</strong></span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Projects */}
          <div className="info-box projects-box">
            <div className="box-header">
              <h2>Projects &amp; Portfolios</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
            </div>
            <div className="projects-grid">
              <div className="project-card">
                <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop" alt="Campus Connect" />
                <div className="project-content">
                  <h3>Campus Connect App</h3>
                  <p className="project-intro">A mobile platform that helps students find study groups and campus events easily.</p>
                  <div className="skills-row">
                    <span className="skill-tag">React Native</span>
                    <span className="skill-tag">Firebase</span>
                    <span className="skill-tag">Tailwind</span>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop" alt="E-commerce Dashboard" />
                <div className="project-content">
                  <h3>E-commerce Dashboard</h3>
                  <p className="project-intro">Real-time sales analytics dashboard with beautiful charts and user management.</p>
                  <div className="skills-row">
                    <span className="skill-tag">Next.js</span>
                    <span className="skill-tag">Chart.js</span>
                    <span className="skill-tag">Node.js</span>
                  </div>
                </div>
              </div>

              <div className="project-card">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop" alt="Portfolio Site" />
                <div className="project-content">
                  <h3>Personal Portfolio Website</h3>
                  <p className="project-intro">Modern responsive portfolio built with clean design and smooth animations.</p>
                  <div className="skills-row">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">Framer Motion</span>
                    <span className="skill-tag">CSS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notable Achievements */}
          <div className="info-box achievements-box">
            <div className="box-header">
              <h2>Notable Achievements</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
            </div>
            <div className="achievements-list">
              {achievements.map((ach, i) => (
                <div key={i} className="achievement-item">
                  <Trophy size={22} className="trophy-icon" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity - Updated with Profile Image + Edit Button */}
          <div className="info-box activity-box">
            <div className="box-header">
              <h2>Recent Activity</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
            </div>
            <div className="activity-list">
              {recentActivities.map((activity, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-avatar">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                      alt="Henry" 
                    />
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <strong>{activity.name}</strong>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                    <p className="activity-text">{activity.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <RequestOverlay isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
  </>
  );
}