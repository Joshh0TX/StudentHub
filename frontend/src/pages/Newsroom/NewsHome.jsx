import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users, Send, ChevronRight, UserCircle } from 'lucide-react';
import './NewsHome.css';

// 1. Sub-component: The Profile Header (SRP)
const ProfileCard = ({ user }) => {
  return (
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
};

// 2. Sub-component: The Stats Toggle (SRP)
const StatItem = ({ label, count, icon: Icon, active, onClick }) => (
  <div className={`stat-box ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon size={18} className="stat-icon" />
    <span className="stat-count">{count}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export default function AmeboSidebar({ user }) {
  // 3. Fallback Data (Smart Defaults)
  const safeUser = {
    name: user?.name || "Amebo Chief",
    email: user?.email || "chief@stuudo.app",
    coverImg: user?.coverImg || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500",
    profileImg: user?.profileImg || "https://ui-avatars.com/api/?name=Amebo+Chief&background=3b82f6&color=fff",
  };

  const [view, setView] = useState('connections');

  // 4. Dummy Data for the lists
  const listData = {
    requests: [
      { id: 1, name: "Bisi from Class", status: "Wants to connect" },
      { id: 2, name: "Emeka Tech", status: "Sent 2h ago" }
    ],
    connections: [
      { id: 3, name: "David O.", status: "Online" },
      { id: 4, name: "Sarah Jenkins", status: "Active 5m ago" },
      { id: 5, name: "Lekan Dev", status: "Busy" }
    ],
    sent: [
      { id: 6, name: "Dean of Faculty", status: "Pending" }
    ]
  };

  return (
    <aside className="amebo-sidebar">
      <ProfileCard user={safeUser} />

      <div className="stats-grid">
        <StatItem 
          label="Inbound" 
          count={listData.requests.length} 
          icon={UserPlus} 
          active={view === 'requests'} 
          onClick={() => setView('requests')} 
        />
        <StatItem 
          label="Fam" 
          count={listData.connections.length} 
          icon={Users} 
          active={view === 'connections'} 
          onClick={() => setView('connections')} 
        />
        <StatItem 
          label="Pending" 
          count={listData.sent.length} 
          icon={Send} 
          active={view === 'sent'} 
          onClick={() => setView('sent')} 
        />
      </div>

      <Link to="/profile" className="view-profile-btn">
        Manage Profile <ChevronRight size={16} />
      </Link>

      <div className="dynamic-list-container">
        <h4 className="list-title">{view.toUpperCase()}</h4>
        <div className="mini-list">
          {listData[view].map((person) => (
            <div key={person.id} className="mini-list-item">
              <div className="item-img">
                <UserCircle size={20} color="#94a3b8" />
              </div>
              <div className="item-text">
                <span className="item-name">{person.name}</span>
                <span className="item-meta">{person.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}