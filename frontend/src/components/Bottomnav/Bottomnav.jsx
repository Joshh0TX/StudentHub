import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, ShoppingBag, BookOpen, User, LogOut } from 'lucide-react';
import './Bottomnav.css';

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
      {/* Profile Image first (Left), then Name */}
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



export default function TopNav({ isDarkMode, toggleTheme, user = { name: "Alex Smith" } }) {
  return (
    <header className="site-header">
      {/* 1. Left Section */}
      <div className="header-left">
        <Link to="/newsroom" className="logo-anchor">
           <h1 className="stuudo-logo">stuudo<span>.</span></h1>
        </Link>
        
      </div>

      {/* 2. Center Section (Absolute Centering) */}
      <div className="header-center">
        <nav className="icon-hub">
          <NavIcon to="/newsroom" Icon={Home} />
          <NavIcon to="/marketplace" Icon={ShoppingBag} />
          <NavIcon to="/academy" Icon={BookOpen} />
          <NavIcon to="/profile" Icon={User} />
        </nav>
      </div>

      {/* 3. Right Section */}
      <div className="header-right">
        <Link to="/profile" className="profile-anchor">
           <UserProfile name={user.name} avatarUrl={user.avatar} />
        </Link>
        
        <Link to="/" className="logout-btn">
         <LogOut size={20} />
        </Link>
      </div>
    </header>
  );
}