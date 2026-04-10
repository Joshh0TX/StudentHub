import React, { useState } from 'react';
import './profile.css';
import { Edit, Award, Trophy, Star, Zap } from 'lucide-react';

export default function ProfilePage() {
  const [user] = useState({
    name: '', 
    course: '', 
    profileImage: '',
    bio: '',
    location: '',
    joinedDate: '',
    email: '',
  });

  return (
    <div className="container">
      <section className="profile-section">
        {/* Cover + Avatar wrapper */}
        <div className="cover-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop" 
            alt="Cover" 
            className="coverimg"
          />

          <div className="profileImg">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                alt="Henry Profile" 
              />
            )}
          </div>
        </div>
        
        {/* Improved Profile Main Section */}
        <div className="profile-main">
          <div className="profile-text">
            <h1>{user.name || 'Henry'}</h1>
            <p className="profile-course">{user.course || 'Computer Science'}</p>
            <p className="profile-bio">
              {user.bio || 
                "Passionate full-stack developer and UI designer crafting delightful digital experiences from Lagos."}
            </p>
          </div>

          {/* More appealing action buttons */}
          <div className="profile-actions">
            <button className="edit-btn">
              <Edit size={18} style={{ marginRight: '8px' }} />
              Edit Profile
            </button>
            <button className="message-btn">
              Messages
            </button>
          </div>
        </div>

        {/* More appealing stats */}
        <div className="profile-stats">
          <div className="stat">
            <p className="stat-number">182</p>
            <p className="stat-label">Posts</p>
          </div>
          <div className="stat">
            <p className="stat-number">299</p>
            <p className="stat-label">Followers</p>
          </div>
          <div className="stat">
            <p className="stat-number">150</p>
            <p className="stat-label">Following</p>
          </div>
        </div>
      </section>

      {/* Bottom section remains completely unchanged */}
      <div className="info-grid">
        {/* ... your existing bottom section (About, Badges, Projects) ... */}
        <div className="left-column">
          <div className="info-box about-box">
            <div className="box-header">
              <h2>About</h2>
              <button className="edit-rect-btn">
                <Edit size={18} /> Edit
              </button>
            </div>
            <p className="about-text">
              {user.bio || "I'm a passionate developer and designer based in Lagos. Always learning, building, and connecting with great people in the tech space."}
            </p>
            <div className="details-list">
              <div className="detail-item"><strong>Course:</strong> {user.course || 'Computer Science'}</div>
              <div className="detail-item"><strong>Location:</strong> {user.location || 'Lagos, Nigeria'}</div>
              <div className="detail-item"><strong>Joined:</strong> {user.joinedDate || 'March 2024'}</div>
              <div className="detail-item"><strong>Email:</strong> {user.email || 'henry@example.com'}</div>
            </div>
          </div>

          <div className="info-box badges-box">
            <div className="box-header">
              <h2>Badges &amp; Achievements</h2>
              <button className="edit-rect-btn">
                <Edit size={18} /> Edit
              </button>
            </div>
            <div className="badges-grid">
              <button className="badge-btn"><Award size={26} /><span>Top Contributor</span></button>
              <button className="badge-btn"><Trophy size={26} /><span>Hackathon Winner</span></button>
              <button className="badge-btn"><Star size={26} /><span>Best UI Design</span></button>
              <button className="badge-btn"><Zap size={26} /><span>Fastest Learner</span></button>
            </div>
          </div>
        </div>

        <div className="info-box projects-box">
          <div className="box-header">
            <h2>Projects &amp; Portfolios</h2>
            <button className="edit-rect-btn">
              <Edit size={18} /> Edit
            </button>
          </div>
          <div className="projects-grid">
            {/* Your three project cards remain unchanged */}
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
      </div>
    </div>
  );
}