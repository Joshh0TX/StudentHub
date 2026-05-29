import React, { useState, useRef } from 'react';
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
import AboutTab from './aboutTab';
import ProfileEditModal from './profileEditModel';
import ProjectsTab from './projectsTab';
import ProjectModal from './projectModel';
import AchievementsTab from './achievementsTab';
import AchievementModal from './achievementsModel';
import MyShopTab from './storeTab';

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
  const [profileImage, setProfileImage] = useState(null);
  const profileInputRef = useRef(null);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-info-card">
      {/* Circle Profile Image Layout Block */}
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar-placeholder">
          {profileImage ? (
            <img src={profileImage} alt="Avatar" className="avatar-image-render" />
          ) : (
            <span>ST</span>
          )}
        </div>
        
        {/* CONDITIONAL: Hide avatar camera trigger from public visitors */}
        {isOwner && (
          <button onClick={() => profileInputRef.current.click()} className="avatar-camera-trigger" aria-label="Change profile picture">
            <FaCamera className="camera-icon-internal" />
          </button>
        )}
        <input type="file" ref={profileInputRef} onChange={handleProfileChange} accept="image/*" className="hidden-input" />
      </div>

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
const [profileData, setProfileData] = useState({
  name: "Anyanwuocha-Collins David",
  email: "david.collins@student.futo.edu.ng",
  dob: "October 24, 2003",
  location: "Owerri, Nigeria",
  linkedin: "#linkedin",
  instagram: "#instagram",
  overview: "Undergraduate Information Technology student at the Federal University of Technology, Owerri (FUTO)...",
  skills: ["Full-Stack Dev", "UI/UX Design", "React", "Tailwind CSS", "JavaScript", "Network Defense", "IoT Architecture"],
  
  // CHANGED: Restructured into dynamic arrays of objects
  education: [
    {
      id: 1,
      degree: "Information Technology (IFT)",
      school: "Federal University of Technology, Owerri",
      meta: "400 Level • Undergraduate Degree Course"
    }
  ],
  certifications: [
    {
      id: 1,
      title: "Cisco Certified Network Defense",
      authority: "Cisco Networking Academy Credential",
      meta: "Security Architecture & Infrastructure Defense"
    }
  ]
});

// Project list array configuration states
const [projectsList, setProjectsList] = useState([
  {
    id: 1,
    title: "Stuudo Platform Canvas Hub",
    description: "Centralized university structural framework engine mapped out to synchronize and process campus hub digital service parameters across institutional records tracking spaces.",
    link: "https://stuudo.io",
    image: null
  },
  {
    id: 2,
    title: "VaultTrack Asset System Tracker",
    description: "Multi-asset automated checking system engineered to index and graph transactional market metrics, valuations, and positions across active network platforms safely.",
    link: "https://vaulttrack.io",
    image: null
  }
]);



// Project modal visibility routing flags
const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
const [selectedProjectToEdit, setSelectedProjectToEdit] = useState(null);

// Project array processing mechanics
const handleOpenAddProject = () => {
  setSelectedProjectToEdit(null);
  setIsProjectModalOpen(true);
};

const handleOpenEditProject = (project) => {
  setSelectedProjectToEdit(project);
  setIsProjectModalOpen(true);
};

const handleSaveProjectCard = (projectData) => {
  setProjectsList((prevList) => {
    const existingIndex = prevList.findIndex((item) => item.id === projectData.id);
    if (existingIndex > -1) {
      // Update item logic execution
      const updatedList = [...prevList];
      updatedList[existingIndex] = projectData;
      return updatedList;
    } else {
      // Add item logic execution
      return [...prevList, projectData];
    }
  });
};

const handleDeleteProjectCard = (id) => {
  setProjectsList((prevList) => prevList.filter((item) => item.id !== id));
};

// Achievements tracker list states
const [achievementsList, setAchievementsList] = useState([
  {
    id: 1,
    title: "Appointed Chair of IEEE SIGHT Chapter",
    issuer: "IEEE Special Interest Group on Humanitarian Technology",
    meta: "Institutional Chapter Leadership Execution • 2026",
    badgeType: "trophy"
  },
  {
    id: 2,
    title: "Cisco Certified Security Practitioner",
    issuer: "Cisco Networking Academy Defense Program",
    meta: "Infrastructure Security & Perimeter Defense Operations",
    badgeType: "security"
  }
]);

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

const handleSaveAchieveCard = (itemData) => {
  setAchievementsList((prevList) => {
    const existingIndex = prevList.findIndex((item) => item.id === itemData.id);
    if (existingIndex > -1) {
      const updatedList = [...prevList];
      updatedList[existingIndex] = itemData;
      return updatedList;
    } else {
      return [...prevList, itemData];
    }
  });
};

const handleDeleteAchieveCard = (id) => {
  setAchievementsList((prevList) => prevList.filter((item) => item.id !== id));
};
// Marketplace store products default preview data collection
const [shopProductsList, setShopProductsList] = useState([
  { id: 1, title: "IFT 400L Comprehensive Exam Coursepack", price: "₦3,500.00", image: null },
  { id: 2, title: "Wireless Smart IoT Node Breadboard Kit", price: "₦18,500.00", image: null },
  { id: 3, title: "Premium Tailored Dark Hoodie (FUTO IFT Edition)", price: "₦12,000.00", image: null },
  { id: 4, title: "V5 Network Infrastructure Lab Reference Log", price: "₦4,000.00", image: null },
  { id: 5, title: "Bonus Unrendered Item (Filtered Out Over Capacity)", price: "₦5,000.00", image: null } // This item stays hidden automatically
]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
        onSave={(updatedData) => setProfileData(updatedData)}
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