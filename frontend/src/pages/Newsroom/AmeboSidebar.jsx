import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Users, Send, ChevronRight, UserCircle, Check, X } from 'lucide-react';
import './AmeboSide.css';

const ProfileCard = ({ user }) => (
  <div className="profile-card">
    <div className="cover-photo">
      <img src={user.coverImg} alt="UI" />
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
  const [inbound, setInbound] = useState([]);
  const [connections, setConnections] = useState([]);
  const [sent, setSent] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // ← DEFINE fetchAll HERE, outside useEffect
  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [inboundRes, connectionsRes, sentRes, profileRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/users/friends/inbound`, { headers }),
      fetch(`${import.meta.env.VITE_API_URL}/api/users/friends/connections`, { headers }),
      fetch(`${import.meta.env.VITE_API_URL}/api/users/friends/sent`, { headers }),
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, { headers }),
    ]);

    const [inboundData, connectionsData, sentData, profileRes2] = await Promise.all([
      inboundRes.json(),
      connectionsRes.json(),
      sentRes.json(),
      profileRes.json(),
    ]);

    setInbound(Array.isArray(inboundData) ? inboundData : []);
    setConnections(Array.isArray(connectionsData) ? connectionsData : []);
    setSent(Array.isArray(sentData) ? sentData : []);
    setProfileData(profileRes2);
  };

  // ← THEN useEffect just calls it
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRespond = async (requestId, action) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/friends/respond/${requestId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action })
    });
    if (res.ok) {
      await fetchAll(); //fetchAll is in scope
    }
  };


  const handleScroll = (e) => {
    setShowMiniNav(e.target.scrollTop > 80);
  };

  const scrollToTopAndChangeView = (newView) => {
    setView(newView);
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const activeUser = profileData || storedUser;
  const safeUser = {
    name: `${activeUser?.f_name || ''} ${activeUser?.l_name || ''}`.trim() || "Student",
    email: activeUser?.email || "",
    coverImg: activeUser?.coverImage || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500",
    profileImg: activeUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${activeUser?.f_name || ''} ${activeUser?.l_name || ''}`)}&background=random`,
  };

  const listData = { requests: inbound, connections, sent };

  return (
    <aside className="amebo-sidebar">
      <ProfileCard user={safeUser} />

      <div className="sidebar-scroll-container" ref={scrollRef} onScroll={handleScroll}>

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

        <div className="stats-grid">
          <div className={`stat-box ${view === 'requests' ? 'active' : ''}`} onClick={() => setView('requests')}>
            <UserPlus size={18} className="stat-icon" />
            <span className="stat-count">{inbound.length}</span>
            <span className="stat-label">Inbound</span>
          </div>
          <div className={`stat-box ${view === 'connections' ? 'active' : ''}`} onClick={() => setView('connections')}>
            <Users size={18} className="stat-icon" />
            <span className="stat-count">{connections.length}</span>
            <span className="stat-label">Fam</span>
          </div>
          <div className={`stat-box ${view === 'sent' ? 'active' : ''}`} onClick={() => setView('sent')}>
            <Send size={18} className="stat-icon" />
            <span className="stat-count">{sent.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <Link to="/profile" className="view-profile-btn">
          Manage Profile <ChevronRight size={16} />
        </Link>

        <div className="dynamic-list-container">
          <h4 className="list-title">{view.toUpperCase()}</h4>
          <div className="mini-list">

            {/* INBOUND REQUESTS */}
            {view === 'requests' && inbound.map((req) => (
              <div key={req.id} className="mini-list-item">
                <img
                  src={req.sender?.profileImage || `https://ui-avatars.com/api/?name=${req.sender?.f_name}+${req.sender?.l_name}&background=random`}
                  className="item-img-avatar"
                  alt={req.sender?.f_name}
                  onClick={() => navigate(`/profile/${req.sender?.id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="item-text">
                  <span className="item-name">{req.sender?.f_name} {req.sender?.l_name}</span>
                  <span className="item-meta">{req.sender?.course || 'Student'}</span>
                </div>
                <div className="request-actions">
                  <button className="accept-btn" onClick={() => handleRespond(req.id, 'accepted')}>
                    <Check size={14} />
                  </button>
                  <button className="decline-btn" onClick={() => handleRespond(req.id, 'rejected')}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* CONNECTIONS */}
            {view === 'connections' && connections.map((conn, i) => (
              <div key={i} className="mini-list-item" onClick={() => navigate(`/profile/${conn.id}`)} style={{ cursor: 'pointer' }}>
                <img
                  src={conn.profileImage || `https://ui-avatars.com/api/?name=${conn.f_name}+${conn.l_name}&background=random`}
                  className="item-img-avatar"
                  alt={conn.f_name}
                />
                <div className="item-text">
                  <span className="item-name">{conn.f_name} {conn.l_name}</span>
                  <span className="item-meta">{conn.course || 'Student'}</span>
                </div>
              </div>
            ))}

            {/* SENT REQUESTS */}
            {view === 'sent' && sent.map((req) => (
              <div key={req.id} className="mini-list-item">
                <img
                  src={req.receiver?.profileImage || `https://ui-avatars.com/api/?name=${req.receiver?.f_name}+${req.receiver?.l_name}&background=random`}
                  className="item-img-avatar"
                  alt={req.receiver?.f_name}
                />
                <div className="item-text">
                  <span className="item-name">{req.receiver?.f_name} {req.receiver?.l_name}</span>
                  <span className="item-meta">Pending</span>
                </div>
              </div>
            ))}

            {/* EMPTY STATES */}
            {view === 'requests' && inbound.length === 0 && (
              <p className="empty-state">No pending requests</p>
            )}
            {view === 'connections' && connections.length === 0 && (
              <p className="empty-state">No connections yet</p>
            )}
            {view === 'sent' && sent.length === 0 && (
              <p className="empty-state">No sent requests</p>
            )}

          </div>
        </div>
      </div>
    </aside>
  );
}
