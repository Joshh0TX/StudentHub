import React, { useState, useRef, useEffect } from 'react';
import { Edit } from 'lucide-react'; 
import {
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCamera,
  FaSun,
  FaMoon
} from 'react-icons/fa'; 
import { fetchMyProfile, updateMyProfile, uploadProfileImage, uploadCoverImage } from './profileApi';
import AboutTab from './aboutTab';
import ProfileEditModal from './profileEditModel';
import ProjectsTab from './projectsTab';
import ProjectModal from './projectModel';
import AchievementsTab from './achievementsTab';
import AchievementModal from './achievementsModel';
import MyShopTab from './storeTab';
import { useAuth } from '../../context/AuthContext';
import { fetchStore } from '../Marketplace/marketplaceApi';

import './profile.css';

// =========================================================================
// 1. SUB-COMPONENT: PROFILE COVER
// =========================================================================
const ProfileCover = ({ coverImage, onCoverChange,isOwner }) => {
  const coverInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onCoverChange(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-cover-wrapper">
      {coverImage ? (
        <img src={coverImage} alt="Profile Cover" className="cover-image-asset" />
      ) : (
        <div className="cover-default-premium-bg" />
      )}
      {/* CONDITIONAL: Only show edit button if looking at your own profile */}
      {isOwner && (
        <button onClick={() => coverInputRef.current.click()} className="cover-edit-floating-icon" aria-label="Change cover image">
          <Edit className="edit-svg-dimension" />
        </button>
      )}
      <input type="file" ref={coverInputRef} onChange={handleFileChange} accept="image/*" className="hidden-input" />
    </div>
  );
};

// =========================================================================
// 2. SUB-COMPONENT: STUDENT INFO SIDEBAR CARD (With theme toggle & profile upload)
// =========================================================================
const ProfileInfoCard = ({ theme, onToggleTheme, isOwner, setIsOwner, profileData }) => {
  const [profileImage, setProfileImage] = useState(profileData?.profileImage || null);
  const profileInputRef = useRef(null);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-info-card">
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar-placeholder">
          <img src={profileImage ||`https://ui-avatars.com/api/?name=${encodeURIComponent(  `${profileData?.f_name || ''} ${profileData?.l_name || ''}`)}&background=random`}
            alt="Avatar"
            className="avatar-image-render"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${profileData?.f_name || ''} ${profileData?.l_name || ''}`
              )}&background=random`;
            }}
          />
        </div>

        {/* CONDITIONAL: Hide avatar camera trigger from public visitors */}
        {isOwner && (
          <button onClick={() => profileInputRef.current.click()} className="avatar-camera-trigger" aria-label="Change profile picture">
            <FaCamera className="camera-icon-internal" />
          </button>
        )}
      </div>
      <input type="file" ref={profileInputRef} onChange={handleProfileChange} accept="image/*" className="hidden-input" />
      {/* Student Details */}
      <div className="profile-details-content">
        <h2 className="student-name">{profileData.name}</h2>
        <p className="student-email">{profileData.email}</p>
        {/* Location Row */}
        <div className="info-row">
          <FaMapMarkerAlt className="info-icon" /> 
          <span className="info-text">{profileData.location}</span>
        </div>
        {/* Date of Birth Row */}
        <div className="info-row">
          <FaCalendarAlt className="info-icon" /> 
          <span className="info-text">Born: {profileData.dob}</span>
        </div>
        <hr className="card-divider" />
        {/* Social Connections */}
        <div className="profile-socials-stacked">
          <a href={profileData.linkedin} className="social-text-link" aria-label="LinkedIn">
            <FaLinkedin className="social-link-icon linkedin-brand" />
            <span>Connect on LinkedIn</span>
          </a>
          <a href={profileData.instagram} className="social-text-link" aria-label="Instagram">
            <FaInstagram className="social-link-icon instagram-brand" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <hr className="card-divider" />

        {/* Dynamic Light/Dark Theme Switch Controller Button */}
        <button onClick={onToggleTheme} className="theme-toggle-control-btn">
          {theme === 'light' ? (
            <>
              <FaMoon className="toggle-btn-icon" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <FaSun className="toggle-btn-icon" />
              <span>Light Mode</span>
            </>
          )}
        </button>
        {/* NEW SIMULATION SWITCH: Placed directly below your theme toggle */}
        <button 
          onClick={() => setIsOwner(!isOwner)} 
          className="theme-toggle-control-btn" 
          style={{ marginTop: '10px', borderColor: isOwner ? '#22c55e' : '#f97316' }}
        >
          <span>View As: <strong>{isOwner ? "Profile Owner" : "Visitor"}</strong></span>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 3. SUB-COMPONENT: PREMIUM MINI NAVBAR (With View Request Action)
// =========================================================================
const ProfileMiniNav = ({ activeTab, setActiveTab, isOwner }) => {
  const navItems = ['My Shop', 'About', 'Projects', 'Achievements'];

  const handleViewRequests = () => {
    // Add your click logic or modal trigger for requests here
    console.log("Viewing requests panel...");
  };

  return (
    <div className="profile-mini-nav-container">
      <nav className="profile-mini-navbar">
        
        {/* Left-aligned floating links cluster */}
        <div className="mini-nav-links-cluster">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`mini-nav-item ${activeTab === item ? 'is-active' : ''}`}
            >
              <span className="mini-nav-text-label">{item}</span>
              {activeTab === item && <div className="active-nav-bottom-line" />}
            </button>
          ))}
        </div>

        {/* CONDITIONAL: Only show 'View Request' when looking at someone else's profile (Visitor Mode) */}
        {!isOwner && (
          <button onClick={() => console.log("Requests modal...")} className="mini-nav-request-action-btn">
            View Request
          </button>
        )}

      </nav>
    </div>
  );
};
// =========================================================================
// 4. MAIN HUB EXPORT
// =========================================================================
const StudentProfile = () => {
  const [coverImage, setCoverImage] = useState(null);
  const [theme, setTheme] = useState('light'); 
  const [activeTab, setActiveTab] = useState('About');
  
  // --- NEW: Local Simulation Toggle State ---
  const [isOwner, setIsOwner] = useState(true); 
  // Inside the StudentProfile component body, add this state bucket:
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  // Project list array configuration states
  const [projectsList, setProjectsList] = useState([]);
  // Project modal visibility routing flags
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProjectToEdit, setSelectedProjectToEdit] = useState(null);

  // Project array processing mechanics
  const handleOpenAddProject = () => {setSelectedProjectToEdit(null);setIsProjectModalOpen(true);};

const handleOpenEditProject = (project) => {
  setSelectedProjectToEdit(project);
  setIsProjectModalOpen(true);
};

const handleSaveProjectCard = async (projectData) => {
  const isEdit = projectsList.some((p) => p.id === projectData.id);
  const updatedList = isEdit
    ? projectsList.map((p) => (p.id === projectData.id ? projectData : p))
    : [...projectsList, projectData];

  setProjectsList(updatedList); // optimistic
  await updateMyProfile({ projects: updatedList });
};

const handleDeleteProjectCard = async (id) => {
  const updatedList = projectsList.filter((p) => p.id !== id);
  setProjectsList(updatedList); // optimistic
  await updateMyProfile({ projects: updatedList });
};

// Achievements tracker list states
const [achievementsList, setAchievementsList] = useState([]);

const [isAchieveModalOpen, setIsAchieveModalOpen] = useState(false);
const [selectedAchieveToEdit, setSelectedAchieveToEdit] = useState(null);

// Achievements processing logic loops
const handleOpenAddAchieve = () => {
  setSelectedAchieveToEdit(null);
  setIsAchieveModalOpen(true);
};

const handleOpenEditAchieve = (item) => {
  setSelectedAchieveToEdit(item);
  setIsAchieveModalOpen(true);
};

const handleSaveAchieveCard = async (itemData) => {
  const isEdit = achievementsList.some((a) => a.id === itemData.id);

  const itemWithId = isEdit ? itemData : { ...itemData, id: Date.now() };

  const updatedList = isEdit
    ? achievementsList.map((a) => (a.id === itemData.id ? itemData : a))
    : [...achievementsList, itemData];

  setAchievementsList(updatedList); // optimistic
  await updateMyProfile({ achievements: updatedList });
};

const handleDeleteAchieveCard = async (id) => {
  const updatedList = achievementsList.filter((a) => a.id !== id);
  setAchievementsList(updatedList); // optimistic
  await updateMyProfile({ achievements: updatedList });
};


// Marketplace store & products state
const [shopProductsList, setShopProductsList] = useState([]);
const [storeData, setStoreData] = useState(null);
const [shopLoading, setShopLoading] = useState(false);

// Auth
const { user } = useAuth();

// Fetch the current user's store and products
useEffect(() => {
  if (!user?.id) return;
  setProfileLoading(true);
  fetchMyProfile()
    .then((data) => {
      setProfileData({
        name: `${data.f_name} ${data.l_name}`,
        f_name: data.f_name,   // ← add this
        l_name: data.l_name, 
        email: data.email,
        dob: data.dob ?? '',
        location: data.location ?? '',
        overview: data.bio ?? '',
        skills: data.skills ?? [],
        linkedin: data.socials?.linkedin ?? '#',
        instagram: data.socials?.instagram ?? '#',
        certifications: data.certifications ?? [],
        education: (data.courseMemberships ?? []).map((m) => ({
          id: m.id,
          degree: m.course?.name,
          school: m.course?.institution,
          meta: m.level ?? '',
        })),
      });
      setProjectsList(data.projects ?? []);
      setAchievementsList(data.achievements ?? []);
      if (data.coverImage) setCoverImage(data.coverImage);
    })
    .catch(() => {})
    .finally(() => setProfileLoading(false));
}, [user?.id]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (profileLoading || !profileData) return <div>Loading...</div>;

  return (
    <div className="profile-page-container" data-theme={theme}>
      {/* 1. Passed isOwner to Cover */}
      <ProfileCover coverImage={coverImage} onCoverChange={setCoverImage} isOwner={isOwner} />
      
      <div className="profile-content-layout">
        {/* 2. Passed isOwner and state handlers to the Sidebar Card */}
        <ProfileInfoCard 
  theme={theme} 
  onToggleTheme={toggleTheme} 
  isOwner={isOwner} 
  setIsOwner={setIsOwner}
  profileData={profileData} /* Pass down */
/>
        
        {/* Right Content Area */}
        <div className="profile-main-display-area">
          
          {/* 3. Passed isOwner to Mini-Navbar */}
          <ProfileMiniNav activeTab={activeTab} setActiveTab={setActiveTab} isOwner={isOwner} />

          {/* Main Context Display Box Container */}
          {/* Main Context Display Box Container */}
<div className="profile-content-display-box">
  {(() => {
    switch (activeTab) {
      case 'About':
  return (
    <AboutTab 
      isOwner={isOwner} 
      profileData={profileData} 
      onOpenEdit={() => setIsModalOpen(true)} /* Send modal trigger down */
    />
  );
      case 'Projects':
  return (
    <ProjectsTab 
      isOwner={isOwner}
      projectsData={projectsList}
      onOpenAddModal={handleOpenAddProject}
      onOpenEditModal={handleOpenEditProject}
      onDeleteProject={handleDeleteProjectCard}
    />
  );
      case 'Achievements':
  return (
    <AchievementsTab 
      isOwner={isOwner}
      achievementsData={achievementsList}
      onOpenAddModal={handleOpenAddAchieve}
      onOpenEditModal={handleOpenEditAchieve}
      onDeleteAchievement={handleDeleteAchieveCard}
    />
  );
      case 'My Shop':
  return (
    <MyShopTab 
      isOwner={isOwner}
      shopProductsData={shopProductsList}
      storeData={storeData}
      isLoading={shopLoading}
    />
  );
      default:
        return <AboutTab isOwner={isOwner} profileData={profileData} onOpenEdit={() => setIsModalOpen(true)} />;
    }
  })()}
</div>

        </div>
      </div>
      <ProfileEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={profileData}
        onSave={async (updatedData) => {
  setProfileData(updatedData); // optimistic
  await updateMyProfile({
    bio: updatedData.overview,
    location: updatedData.location,
    skills: updatedData.skills,
    socials: {
      linkedin: updatedData.linkedin,
      instagram: updatedData.instagram,
    },
  });
}}
      />
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProjectCard}
        projectToEdit={selectedProjectToEdit}
      />
      <AchievementModal 
        isOpen={isAchieveModalOpen}
        onClose={() => setIsAchieveModalOpen(false)}
        onSave={handleSaveAchieveCard}
        achievementToEdit={selectedAchieveToEdit}
      />
      
    </div>
  );
};

export default StudentProfile;