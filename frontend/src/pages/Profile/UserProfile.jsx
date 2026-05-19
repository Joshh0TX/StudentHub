import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trophy } from 'lucide-react';
import './profile.css';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null); // null, 'pending', 'accepted'
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile({
        ...data,
        skills: data.skills || [],
        interests: data.interests || [],
        badges: data.badges || [],
        achievements: data.achievements || [],
        projects: data.projects || [],
      });
    };
    fetchProfile();
  }, [userId]);

  const handleFriendRequest = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/request/${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setRequestStatus('pending');
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container">
      <section className="profile-section">
        {/* Cover Image */}
        <div className="cover-wrapper">
          <img
            src={profile.coverImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop'}
            alt="Cover"
            className="coverimg"
          />
        </div>

        <div className="profile-intro-row">
          {/* Profile Image */}
          <div className="profileImg">
            <img
              src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.f_name}+${profile.l_name}&background=3b82f6&color=fff`}
              alt="Profile"
            />
          </div>

          {/* Name and actions */}
          <div className="profile-main">
            <div className="profile-text">
              <h1>{profile.f_name} {profile.l_name}</h1>
              <p className="profile-course">{profile.course || 'Student'}</p>
              <p className="profile-bio">{profile.bio || ''}</p>
            </div>
            <div className="profile-actions">
              {requestStatus === 'pending' ? (
                <button className="edit-btn" disabled>Request Sent</button>
              ) : (
                <button className="edit-btn" onClick={handleFriendRequest}>
                  + Add Friend
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="info-grid">
        <div className="left-column">
          {/* About */}
          <div className="info-box about-box">
            <div className="box-header"><h2>About</h2></div>
            <p className="about-text">{profile.bio || 'No bio yet.'}</p>
            <div className="details-list">
              <div className="detail-item"><strong>Course:</strong> {profile.course}</div>
              <div className="detail-item"><strong>Location:</strong> {profile.location}</div>
              <div className="detail-item"><strong>Email:</strong> {profile.email}</div>
            </div>
          </div>

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="info-box skills-box">
              <div className="box-header"><h2>Skills</h2></div>
              <div className="skills-list">
                {profile.skills.map((skill, i) => (
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
          )}

          {/* Interests */}
          {profile.interests.length > 0 && (
            <div className="info-box interests-box">
              <div className="box-header"><h2>Interests</h2></div>
              <div className="interests-list">
                {profile.interests.map((interest, i) => (
                  <span key={i} className="interest-tag">{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="right-column">
          {/* Projects */}
          {profile.projects.length > 0 && (
            <div className="info-box projects-box">
              <div className="box-header"><h2>Projects & Portfolios</h2></div>
              <div className="projects-grid">
                {profile.projects.map((project, i) => (
                  <div key={i} className="project-card">
                    {project.image && <img src={project.image} alt={project.title} />}
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p className="project-intro">{project.description}</p>
                      <div className="skills-row">
                        {project.skills?.map((skill, j) => (
                          <span key={j} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {profile.achievements.length > 0 && (
            <div className="info-box achievements-box">
              <div className="box-header"><h2>Notable Achievements</h2></div>
              <div className="achievements-list">
                {profile.achievements.map((ach, i) => (
                  <div key={i} className="achievement-item">
                    <Trophy size={22} className="trophy-icon" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}