import React, {useRef, useEffect} from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, ShoppingBag, BookOpen, Bell, LogOut, Search, User } from 'lucide-react';
import './Bottomnav.css';

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

const NavIcon = ({ to, Icon }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
  >
    <Icon size={18} strokeWidth={2.5} />
  </NavLink>
);

const UserProfile = ({ name, avatarUrl }) => {
  const fallback = `https://ui-avatars.com/api/?name=${name}&background=DBEAFE&color=3B82F6&bold=true`;
  
  return (
    <div className="user-profile-group">
      <img 
        src={avatarUrl || fallback} 
        alt="Profile" 
        className="user-avatar" 
        onError={(e) => { e.target.src = fallback; }} 
      />
      <span className="user-display-name">{name}</span>
    </div>
  );
};



export default function TopNav({ isDarkMode, toggleTheme}) {

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
  function handleClickOutside(event) {
    // If the click happened outside the search bar wrapper
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsExpanded(false);
      setIsFocused(false);
    }
  }

  // Attach listener to the document
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    // Clean up listener when component unmounts
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Simple mock data array to simulate live UI filtering
  const mockStudents = [
    { name: "David Collins", meta: "Information Technology • 400L", bg: "DBEAFE", co: "3B82F6" },
    { name: "Daniel Okoro", meta: "Computer Science • 200L", bg: "FEE2E2", co: "EF4444" },
    { name: "Deborah Aminu", meta: "Cyber Security • 300L", bg: "D1FAE5", co: "10B981" }
  ];

  // Filters results to only show names that match what is typed (case-insensitive)
  const filteredResults = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  <>
    <header className="site-header">
      {/* 1. Left Section */}
      <div className="header-left">
        <Link to="/newsroom" className="logo-anchor">
           <h1 className="stuudo-logo">stuudo<span>.</span></h1>
        </Link>
        
      </div>

      {/* 2. Center Section */}
      <div className="header-center">
        <nav className="icon-hub">
          <NavIcon to="/newsroom" Icon={Home} />
          <NavIcon to="/marketplace" Icon={ShoppingBag} />
          <NavIcon to="/academy" Icon={BookOpen} />
          <NavIcon to="/notifications" Icon={Bell} />
        </nav>

        {/*  search container  */}
        <div ref={searchRef} className={`header-search-bar ${isExpanded ? 'expanded' : ''}`}>
          <Search 
             className="search-icon" 
             size={18} 
             onClick={() => setIsExpanded(true)} 
           />
          <input 
            type="text" 
            placeholder="Search for people..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Tracks typed letters
            onFocus={() => { setIsExpanded(true); setIsFocused(true); }} // Detects click/focus
            
          />

          {/*  DROPDOWN DISPLAY LOGIC: Only shows if focused AND there is text typed */}
          {isFocused && searchQuery.length > 0 && (
            <div className="search-results-dropdown">
              {filteredResults.length > 0 ? (
                filteredResults.map((student, idx) => (
                  <div key={idx} className="search-result-item">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=${student.bg}&color=${student.co}&bold=true`} 
                      alt="Avatar" 
                      className="result-avatar" 
                    />
                    <div className="result-info">
                      <span className="result-name">{student.name}</span>
                      <span className="result-meta">{student.meta}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-no-results">No students match "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Section */}
      <div className="header-right">
        <Link to="/profile" className="profile-anchor">
           <img src={
            storedUser?.profile_pic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`
          }
          className="user-avatar"
          alt="User"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`;
          }}
          />
        </Link>
        
        <Link to="/" className="logout-btn">
         <LogOut size={20} />
        </Link> 
      </div>
    </header>
    <nav className="mobile-pill-bottom-nav">
        <div className="mobile-pill-items-wrapper">
          <NavIcon to="/newsroom" Icon={Home} />
          <NavIcon to="/marketplace" Icon={ShoppingBag} />
          <NavIcon to="/academy" Icon={BookOpen} />
          <NavIcon to="/notifications" Icon={Bell} />
          <NavIcon to="/profile" Icon={User} /> {/* Profile tab added directly to the mobile track */}
        </div>
      </nav>
    </>
  );
}