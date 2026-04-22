import React, { useState, useRef, useEffect } from 'react';
import './profile.css';
import * as Icons from 'lucide-react';
import BadgeManager from './profileSubsection/BadgeManager';
import SkillsManager from './profileSubsection/SkillsManager';
import InterestsManager from './profileSubsection/InterestsManager';
import ProjectsManager from './profileSubsection/ProjectsManager';
import AchievementsManager from './profileSubsection/AchievementsManager';
import EditAbout from './profileSubsection/EditAbout';
import RequestOverlay from './profileSubsection/RequestOverlay';
import { Edit, Award, Trophy, Star, Zap, Users, X, Camera } from 'lucide-react';
import {
  FaAward,
  FaTrophy,
  FaStar,
  FaBolt,
  FaMedal,
  FaGithub,
  FaCode,
  FaUsers as FaUsersIcon,
  FaBook,
  FaReact,
  FaShieldHalved,
} from 'react-icons/fa6';

// ============================================================================
// SECTION 1: CUSTOM HOOKS - Modal and State Management
// ============================================================================

/**
 * Hook to manage multiple modal states
 * Follows Single Responsibility Principle
 */
function useModalManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isBadgeManagerOpen, setIsBadgeManagerOpen] = useState(false);
  const [isSkillManagerOpen, setIsSkillManagerOpen] = useState(false);
  const [isInterestManagerOpen, setIsInterestManagerOpen] = useState(false);
  const [isProjectsManagerOpen, setIsProjectsManagerOpen] = useState(false);
  const [isAchievementsManagerOpen, setIsAchievementsManagerOpen] = useState(false);

  return {
    isModalOpen,
    setIsModalOpen,
    isRequestOpen,
    setIsRequestOpen,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    isEditingAbout,
    setIsEditingAbout,
    isBadgeManagerOpen,
    setIsBadgeManagerOpen,
    isSkillManagerOpen,
    setIsSkillManagerOpen,
    isInterestManagerOpen,
    setIsInterestManagerOpen,
    isProjectsManagerOpen,
    setIsProjectsManagerOpen,
    isAchievementsManagerOpen,
    setIsAchievementsManagerOpen,
  };
}

/**
 * Hook to manage user profile data
 * Decouples state management from component logic
 */
function useProfileData() {
  const [user, setUser] = useState(null);
    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setUser(data);
      };

      fetchProfile();
    }, []);
  return { user, setUser };
}

/**
 * Hook to handle profile data fetching
 * Follows Dependency Inversion by abstracting API calls
 */
function useProfileFetch(setUser) {
  // populate additional data like projects once
  React.useEffect(() => {
    setUser((prev) =>
      prev.projects && prev.projects.length > 0
        ? prev
        : ({ ...prev, projects: PROJECTS_DATA.map((p, i) => ({ id: i + 1, ...p })) })
    );
  }, [setUser]);
  return setUser;
}

/**
 * Hook to handle image file uploads
 * Single Responsibility: handles only file input logic
 */
function useImageUpload() {
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // 1. THE HELPER (Inside the hook, but separate from the handlers)
  // This is "private" logic that only this hook uses.
  const processImage = (e, key, setUser) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, [key]: imageUrl }));
      return true;
    }
    return false;
  };

  const handleCoverUpdate = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  // 2. THE HANDLERS (Much cleaner now!)
  const onCoverChange = (e, setUser) => {
    processImage(e, 'coverImage', setUser);
  };

  const onProfileChange = (e, setUser, setIsProfileMenuOpen) => {
    const success = processImage(e, 'profileImage', setUser);
    if (success) {
      setIsProfileMenuOpen(false);
    }
  };

  return {
    coverInputRef,
    profileInputRef,
    handleCoverUpdate,
    onCoverChange,
    onProfileChange,
  };
}

// ============================================================================
// SECTION 2: STATIC DATA - Externalized for easier maintenance
// ============================================================================

const SKILLS_DATA = [
  { name: 'React', level: 85 },
  { name: 'Node.js', level: 78 },
  { name: 'UI/UX Design', level: 92 },
  { name: 'Python', level: 65 },
];

const INTERESTS_DATA = [
  'Photography',
  'Reading Tech Blogs',
  'Gaming',
  'Travel',
  'Music Production',
];

const SOCIALS_DATA = [
  { platform: 'Twitter', handle: '@henrydev', link: '#' },
  { platform: 'LinkedIn', handle: 'henry-ade', link: '#' },
  { platform: 'GitHub', handle: 'henrycodes', link: '#' },
];

const ACHIEVEMENTS_DATA = [
  '1st Place - University Hackathon 2025',
  'Google Developer Scholarship Recipient',
  'Best Project Award - TechFest 2024',
];

const PROJECTS_DATA = [
  {
    title: 'Campus Connect App',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    description:
      'A mobile platform that helps students find study groups and campus events easily.',
    skills: ['React Native', 'Firebase', 'Tailwind'],
  },
  {
    title: 'E-commerce Dashboard',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    description:
      'Real-time sales analytics dashboard with beautiful charts and user management.',
    skills: ['Next.js', 'Chart.js', 'Node.js'],
  },
  {
    title: 'Personal Portfolio Website',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    description:
      'Modern responsive portfolio built with clean design and smooth animations.',
    skills: ['React', 'Framer Motion', 'CSS'],
  },
];

const ACTIVITIES_DATA = [
  {
    name: 'Henry',
    time: '2 hours ago',
    content:
      'Just completed the new dashboard UI for Campus Connect. Feedback welcome!',
  },
  {
    name: 'Henry',
    time: 'Yesterday',
    content: 'Participated in the monthly code review session with the team.',
  },
  {
    name: 'Henry',
    time: '3 days ago',
    content: "Liked and commented on Sarah's new portfolio redesign.",
  },
];

const BADGE_ICON_MAP = {
  FaAward,
  FaTrophy,
  FaStar,
  FaBolt,
  FaMedal,
  FaGithub,
  FaCode,
  FaUsers: FaUsersIcon,
  FaBook,
  FaReact,
  FaShieldHalved,
};

const BADGE_ICON_OPTIONS = [
  { key: 'FaAward', label: 'Award', color: '#f59e0b' },
  { key: 'FaTrophy', label: 'Trophy', color: '#3b82f6' },
  { key: 'FaStar', label: 'Star', color: '#10b981' },
  { key: 'FaBolt', label: 'Bolt', color: '#ef4444' },
  { key: 'FaMedal', label: 'Medal', color: '#8b5cf6' },
  { key: 'FaGithub', label: 'GitHub', color: '#111827' },
  { key: 'FaCode', label: 'Code', color: '#14b8a6' },
  { key: 'FaUsers', label: 'Community', color: '#f97316' },
  { key: 'FaBook', label: 'Book', color: '#0ea5e9' },
  { key: 'FaReact', label: 'React', color: '#06b6d4' },
  { key: 'FaShieldHalved', label: 'Shield', color: '#6366f1' },
];

function renderBadgeIcon(iconName, color = '#3b82f6') {
  const BadgeIcon = BADGE_ICON_MAP[iconName] || FaAward;
  return <BadgeIcon style={{ color }} />;
}

// ============================================================================
// SECTION 3: UTILITY FUNCTIONS - Reusable helpers
// ============================================================================

/**
 * Renders the appropriate social platform icon
 */
function renderSocialIcon(platform) {
  const platformLower = platform.toLowerCase();

  if (platformLower === 'github') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    );
  }

  if (platformLower === 'linkedin') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    );
  }

  if (platformLower === 'twitter' || platformLower === 'x') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

// ============================================================================
// SECTION 4: SUB-COMPONENTS - Each follows Single Responsibility Principle
// ============================================================================

/**
 * COMPONENT: CoverPhotoSection
 * Responsibility: Display and manage cover photo
 */
function CoverPhotoSection({ user, isModalOpen, setIsModalOpen, onCoverChange, handleCoverUpdate, coverInputRef }) {
  return (
    <>
      <div
        className="cover-wrapper"
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={
            user.coverImage ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop'
          }
          alt="Cover"
          className="coverimg"
        />
        <div className="cover-overlay">Click to expand</div>
      </div>

      {isModalOpen && (
        <div className="full-screen-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={30} />
            </button>
            <img
              src={
                user.coverImage ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop'
              }
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

      <input
        type="file"
        ref={coverInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onCoverChange}
      />
    </>
  );
}

/**
 * COMPONENT: ProfileHeader
 * Responsibility: Display user profile name, course, bio, and socials
 */
function ProfileHeader({ user, setIsRequestOpen, socials }) {
  return (
    <div className="profile-main">
      <div className="profile-text">
        <h1>{user.name || 'Henry'}</h1>
        <p className="profile-course">{user.course || 'Computer Science'}</p>
        <p className="profile-bio">{user.bio || 'Passionate full-stack developer.'}</p>
        <div className="profile-socials-list">
          {socials.map((social, i) => (
            <a key={i} href={social.link} className="social-pill-item" target="_blank" rel="noreferrer">
              {renderSocialIcon(social.platform)}
              <span>{social.handle}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="profile-actions">
        <button className="edit-btn" onClick={() => setIsRequestOpen(true)}>
          <Edit size={18} style={{ marginRight: '8px' }} /> View Request
        </button>
      </div>
    </div>
  );
}

/**
 * COMPONENT: ProfileImageSection
 * Responsibility: Display and manage profile image upload
 */
function ProfileImageSection({
  user,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  onProfileChange,
  profileInputRef,
}) {
  return (
    <div
      className="profileImg"
      onClick={(e) => {
        e.stopPropagation();
        setIsProfileMenuOpen(!isProfileMenuOpen);
      }}
    >
      <img
        src={
          user.profileImage ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
        }
        alt="Profile"
      />
      {isProfileMenuOpen && (
        <div className="profile-upload-tooltip">
          <button onClick={() => profileInputRef.current?.click()}>
            <Camera size={16} />
            <span>Upload Photo</span>
          </button>
        </div>
      )}

      <input
        type="file"
        ref={profileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onProfileChange}
      />
    </div>
  );
}

/**
 * COMPONENT: AboutSection
 * Responsibility: Display and edit user about information
 */
function AboutSection({ user, setUser, isEditingAbout, setIsEditingAbout }) {
  if (isEditingAbout) {
    return (
      <EditAbout
        initialData={user}
        onCancel={() => setIsEditingAbout(false)}
        onSave={(newData) => {
          setUser((prev) => ({ ...prev, ...newData }));
          setIsEditingAbout(false);
        }}
      />
    );
  }

  return (
    <div className="info-box about-box">
      <div className="box-header">
        <h2>About</h2>
        <button
          className="edit-rect-btn"
          onClick={() => setIsEditingAbout(true)}
        >
          <Edit size={18} /> Edit
        </button>
      </div>
      <p className="about-text">
        {user.bio || "I'm a passionate developer and designer..."}
      </p>
      <div className="details-list">
        <div className="detail-item">
          <strong>Course:</strong> {user.course}
        </div>
        <div className="detail-item">
          <strong>Location:</strong> {user.location}
        </div>
        <div className="detail-item">
          <strong>Joined:</strong> {user.joinedDate}
        </div>
        <div className="detail-item">
          <strong>Email:</strong> {user.email}
        </div>
      </div>
    </div>
  );
}

/**
 * COMPONENT: BadgesSection
 * Responsibility: Display badges and trigger the editor modal
 */
function BadgesSection({ user, onEdit }) {
  const badgesToShow = Array.isArray(user.badges) ? user.badges.slice(0, 4) : [];

  return (
    <div className="info-box badges-box">
      <div className="box-header">
        <h2>Achievements</h2>
        <button
          className="edit-rect-btn"
          type="button"
          onClick={onEdit}
          aria-label="Edit badges"
          title="Edit badges"
        >
          <Edit size={18} /> Edit
        </button>
      </div>
      <div className="badges-grid">
        {badgesToShow.map((badge) => (
          <div key={badge.id} className="badge-btn" style={{ borderColor: badge.color || '#e2e8f0' }}>
            <span className="badge-icon" style={{ color: badge.color || '#3b82f6' }}>
              {renderBadgeIcon(badge.icon, badge.color)}
            </span>
            <span>{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * COMPONENT: SkillsSection
 * Responsibility: Display skills with progress bars
 */
function SkillsSection({ skills, onEdit }) {
  const coreSkills = Array.isArray(skills) ? skills.filter((s) => s.core) : [];
  let visible = coreSkills.slice(0, 4);

  if (visible.length === 0 && Array.isArray(skills)) {
    visible = [...skills].sort((a, b) => b.level - a.level).slice(0, 4);
  }

  return (
    <div className="info-box skills-box">
      <div className="box-header">
        <h2>Skills</h2>
        <button className="edit-rect-btn" onClick={onEdit}>
          <Edit size={18} /> Edit
        </button>
      </div>
      <div className="skills-list">
        {visible.map((skill, i) => (
          <div key={i} className="skill-item">
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-percent">{skill.level}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * COMPONENT: InterestsSection
 * Responsibility: Display user interests
 */
function InterestsSection({ interests = [], onEdit }) {
  return (
    <div className="info-box interests-box">
      <div className="box-header">
        <h2>Interests</h2>
        <button className="edit-rect-btn" onClick={onEdit}>
          <Edit size={18} /> Edit
        </button>
      </div>
      <div className="interests-list">
        {interests.map((interest, i) => (
          <span key={i} className="interest-tag">
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}


/**
 * COMPONENT: ProjectsSection
 * Responsibility: Display user projects
 */
function ProjectsSection({ projects, onEdit }) {
  return (
    <div className="info-box projects-box">
      <div className="box-header">
        <h2>Projects &amp; Portfolios</h2>
        <button className="edit-rect-btn" onClick={onEdit}>
          <Edit size={18} /> Edit
        </button>
      </div>
      <div className="projects-grid">
        {projects.map((project, i) => (
          <div key={i} className="project-card">
            <img src={project.image} alt={project.title} />
            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-intro">{project.description}</p>
              <div className="skills-row">
                {project.skills.map((skill, j) => (
                  <span key={j} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * COMPONENT: AchievementsSection
 * Responsibility: Display user achievements
 */
function AchievementsSection({ achievements = [], onEdit }) {
  const visible = Array.isArray(achievements) ? achievements.slice(0, 4) : [];

  return (
    <div className="info-box achievements-box">
      <div className="box-header">
        <h2>Notable Achievements</h2>
        <button className="edit-rect-btn" onClick={onEdit}>
          <Edit size={18} /> Edit
        </button>
      </div>
      <div className="achievements-list">
        {visible.map((ach, i) => (
          <div key={i} className="achievement-item">
            <Trophy size={22} className="trophy-icon" />
            <span>{ach}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * COMPONENT: ActivitiesSection
 * Responsibility: Display recent user activities
 */
function ActivitiesSection({ activities }) {
  return (
    <div className="info-box activity-box">
      <div className="box-header">
        <h2>Recent Activity</h2>
      </div>
      <div className="activity-list">
        {activities.map((activity, i) => (
          <div key={i} className="activity-item">
            <div className="activity-avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt={activity.name} />
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
  );
}

// ============================================================================
// SECTION 5: MAIN COMPONENT
// ============================================================================

/**
 * COMPONENT: ProfilePage
 * Responsibility: Orchestrate all profile sections and manage state
 * Follows: Open/Closed Principle - Easy to extend with new sections
 */
function ProfilePage() {
  // State Management
  const modals = useModalManager();
  const { user, setUser } = useProfileData();
  const imageUpload = useImageUpload();

  // Data Fetching
  useProfileFetch(setUser);

  // Handlers for image upload
  const handleOnCoverChange = (e) =>
    imageUpload.onCoverChange(e, setUser);
  const handleOnProfileChange = (e) =>
    imageUpload.onProfileChange(e, setUser, modals.setIsProfileMenuOpen);

  const handleSaveBadges = (updatedBadges) => {
    setUser((prev) => ({
      ...prev,
      badges: updatedBadges,
    }));
    modals.setIsBadgeManagerOpen(false);
  };

  const handleSaveSkills = (updatedSkills) => {
    setUser((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
    modals.setIsSkillManagerOpen(false);
  };

  const handleSaveInterests = (updatedInterests) => {
    setUser((prev) => ({
      ...prev,
      interests: updatedInterests,
    }));
    modals.setIsInterestManagerOpen(false);
  };

  const handleSaveProjects = (updatedProjects) => {
    setUser((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
    modals.setIsProjectsManagerOpen(false);
  };

  const handleSaveAchievements = (updatedAchievements) => {
    setUser((prev) => ({
      ...prev,
      achievements: updatedAchievements,
    }));
    modals.setIsAchievementsManagerOpen(false);
  };

  // ========================================================================
  // RENDER - Organized by sections
  // ========================================================================

  return (
    <>
      <div className="container">
        <section className="profile-section">
          {/* ===== COVER PHOTO & PROFILE IMAGE ===== */}
          <CoverPhotoSection
            user={user}
            isModalOpen={modals.isModalOpen}
            setIsModalOpen={modals.setIsModalOpen}
            onCoverChange={handleOnCoverChange}
            handleCoverUpdate={imageUpload.handleCoverUpdate}
            coverInputRef={imageUpload.coverInputRef}
          />

          <div className="profile-intro-row">
            <ProfileImageSection
              user={user}
              isProfileMenuOpen={modals.isProfileMenuOpen}
              setIsProfileMenuOpen={modals.setIsProfileMenuOpen}
              onProfileChange={handleOnProfileChange}
              profileInputRef={imageUpload.profileInputRef}
            />

            {/* ===== PROFILE HEADER ===== */}
            <ProfileHeader
              user={user}
              setIsRequestOpen={modals.setIsRequestOpen}
              socials={SOCIALS_DATA}
            />
          </div>
        </section>

        {/* ===== MAIN CONTENT GRID ===== */}
        <div className="info-grid">
          {/* ===== LEFT COLUMN ===== */}
          <div className="left-column">
            <AboutSection
              user={user}
              setUser={setUser}
              isEditingAbout={modals.isEditingAbout}
              setIsEditingAbout={modals.setIsEditingAbout}
            />

            <BadgesSection
              user={user}
              onEdit={() => modals.setIsBadgeManagerOpen(true)}
            />

            <SkillsSection skills={user.skills} onEdit={() => modals.setIsSkillManagerOpen(true)} />

            <InterestsSection interests={user.interests} onEdit={() => modals.setIsInterestManagerOpen(true)} />

            
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="right-column">
            <ProjectsSection projects={user.projects || []} onEdit={() => modals.setIsProjectsManagerOpen(true)} />

            <AchievementsSection achievements={user.achievements} onEdit={() => modals.setIsAchievementsManagerOpen(true)} />

            <ActivitiesSection activities={ACTIVITIES_DATA} />
          </div>
        </div>
      </div>

      {/* ===== OVERLAY MODALS ===== */}
      <RequestOverlay
        isOpen={modals.isRequestOpen}
        onClose={() => modals.setIsRequestOpen(false)}
      />

      <BadgeManager
        isOpen={modals.isBadgeManagerOpen}
        badges={user.badges}
        achievements={ACHIEVEMENTS_DATA}
        iconOptions={BADGE_ICON_OPTIONS}
        onClose={() => modals.setIsBadgeManagerOpen(false)}
        onSave={handleSaveBadges}
      />

      <SkillsManager
        isOpen={modals.isSkillManagerOpen}
        skills={user.skills}
        onClose={() => modals.setIsSkillManagerOpen(false)}
        onSave={handleSaveSkills}
      />

      <InterestsManager
        isOpen={modals.isInterestManagerOpen}
        interests={user.interests}
        onClose={() => modals.setIsInterestManagerOpen(false)}
        onSave={handleSaveInterests}
      />

      <ProjectsManager
        isOpen={modals.isProjectsManagerOpen}
        projects={user.projects}
        onClose={() => modals.setIsProjectsManagerOpen(false)}
        onSave={handleSaveProjects}
      />

      <AchievementsManager
        isOpen={modals.isAchievementsManagerOpen}
        achievements={user.achievements}
        onClose={() => modals.setIsAchievementsManagerOpen(false)}
        onSave={handleSaveAchievements}
      />
    </>
  );
}

export default ProfilePage;
