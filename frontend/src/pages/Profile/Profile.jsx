import React, { useState } from 'react';
import './profile.css';
import { Edit, Award, Trophy, Star, Zap, Users } from 'lucide-react';

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
    <div className="container">
      <section className="profile-section">
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
        
        <div className="profile-main">
          <div className="profile-text">
            <h1>{user.name || 'Henry'}</h1>
            <p className="profile-course">{user.course || 'Computer Science'}</p>
            <p className="profile-bio">
              {user.bio || "Passionate full-stack developer and UI designer crafting delightful digital experiences from Lagos."}
            </p>
          </div>

          <div className="profile-actions">
            <button className="edit-btn">
              <Edit size={18} style={{ marginRight: '8px' }} />
              Edit Profile
            </button>
            <button className="message-btn">Messages</button>
          </div>
        </div>

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

      {/* Main Content Grid */}
      <div className="info-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* About */}
          <div className="info-box about-box">
            <div className="box-header">
              <h2>About</h2>
              <button className="edit-rect-btn"><Edit size={18} /> Edit</button>
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
  );
}