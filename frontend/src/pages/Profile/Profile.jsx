import React, { useState, useEffect } from 'react';
import './profile.css';
import { Edit, Award, Trophy, Star, Zap, Users, X, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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

  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  });

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
          setStats({
            posts: data.posts?.length || 0,
            followers: data.followers?.length || 0,
            following: data.following?.length || 0,
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
        
        <div className="profile-main">
          <div className="profile-text">
            <h1>{user.name || 'Henry'}</h1>
            <p className="profile-course">{user.course || 'Computer Science'}</p>
            <p className="profile-bio">{user.bio || "Passionate full-stack developer."}</p>
          </div>
          <div className="profile-actions">
            <button className="edit-btn"><Edit size={18} style={{ marginRight: '8px' }} /> View Request</button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat"><p className="stat-number">{stats.posts}</p><p className="stat-label">Posts</p></div>
          <div className="stat"><p className="stat-number">{stats.followers}</p><p className="stat-label">Followers</p></div>
          <div className="stat"><p className="stat-number">{stats.following}</p><p className="stat-label">Following</p></div>
        </div>
      </section>

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