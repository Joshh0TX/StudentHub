import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users, Send, ChevronRight, UserCircle } from 'lucide-react';
import './AmeboSide.css';
import AmeboFeed from './amebofeed.jsx';

const ProfileCard = ({ user }) => (
  <div className="profile-card">
    <div className="cover-photo">
      <img src={user.coverImg} alt="Cover" />
    </div>
    <div className="avatar-wrapper">
      <img src={user.profileImg} alt={user.name} className="profile-avatar-large" />
    </div>
    <div className="profile-info">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  </div>
);

export default function AmeboSidebar({ user }) {
  const [view, setView] = useState('connections');
  const [showMiniNav, setShowMiniNav] = useState(false);
  const scrollRef = useRef(null);

  const listData = {
    requests: Array(8).fill({ id: 1, name: "Bisi from Class", status: "Wants to connect" }),
    connections: Array(20).fill({ id: 3, name: "David O.", status: "Online" }),
    sent: Array(4).fill({ id: 6, name: "Dean of Faculty", status: "Pending" })
  };

  const handleScroll = (e) => {
    // If we scroll down more than 80px, show the mini nav
    if (e.target.scrollTop > 80) {
      setShowMiniNav(true);
    } else {
      setShowMiniNav(false);
    }
  };

  const scrollToTopAndChangeView = (newView) => {
    setView(newView);
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const safeUser = {
    name: user?.name || "Fred Henry ",
    email: user?.email || "chief@stuudo.app",
    coverImg: user?.coverImg || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500",
    profileImg: user?.profileImg || "https://ui-avatars.com/api/?name=Fred+Henry&background=3b82f6&color=fff",
  };

  return (
    <aside className="amebo-sidebar">
      <ProfileCard user={safeUser} />

      <div className="sidebar-scroll-container" ref={scrollRef} onScroll={handleScroll}>
        
        {/* THE MINI NAV (Hidden by default, slides down) */}
        <div className={`mini-nav-bar ${showMiniNav ? 'visible' : ''}`}>
          <button className={view === 'requests' ? 'active' : ''} onClick={() => scrollToTopAndChangeView('requests')}>
            <UserPlus size={18} />
          </button>
          <button className={view === 'connections' ? 'active' : ''} onClick={() => scrollToTopAndChangeView('connections')}>
            <Users size={18} />
          </button>
          <button className={view === 'sent' ? 'active' : ''} onClick={() => scrollToTopAndChangeView('sent')}>
            <Send size={18} />
          </button>
        </div>

        {/* ORIGINAL STATS GRID */}
        <div className="stats-grid">
          <div className={`stat-box ${view === 'requests' ? 'active' : ''}`} onClick={() => setView('requests')}>
            <UserPlus size={18} className="stat-icon" />
            <span className="stat-count">{listData.requests.length}</span>
            <span className="stat-label">Inbound</span>
          </div>
          <div className={`stat-box ${view === 'connections' ? 'active' : ''}`} onClick={() => setView('connections')}>
            <Users size={18} className="stat-icon" />
            <span className="stat-count">{listData.connections.length}</span>
            <span className="stat-label">Fam</span>
          </div>
          <div className={`stat-box ${view === 'sent' ? 'active' : ''}`} onClick={() => setView('sent')}>
            <Send size={18} className="stat-icon" />
            <span className="stat-count">{listData.sent.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <Link to="/profile" className="view-profile-btn">
          Manage Profile <ChevronRight size={16} />
        </Link>

        <div className="dynamic-list-container">
          <h4 className="list-title">{view.toUpperCase()}</h4>
          <div className="mini-list">
            {listData[view].map((person, i) => (
              <div key={i} className="mini-list-item">
                <div className="item-img"><UserCircle size={20} color="#94a3b8" /></div>
                <div className="item-text">
                  <span className="item-name">{person.name}</span>
                  <span className="item-meta">{person.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

