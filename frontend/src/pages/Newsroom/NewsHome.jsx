import React from 'react';
import { Plus } from 'lucide-react';
import AmeboSidebar from './AmeboSidebar';
import { useNavigate } from 'react-router-dom'
import './NewsHome.css';
import AmeboFeed from './amebofeed.jsx';
import AmeboRight from './AmeboRight.jsx';

export default function AmeboLayout({ user }) {
  const navigate = useNavigate();
  const safeUser = {
    name: user?.name || "Amebo Chief",
    profileImg: user?.profileImg || "https://ui-avatars.com/api/?name=Amebo+Chief&background=3b82f6&color=fff",
    coverImg: user?.coverImage || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500",
    email: user?.email || "chief@stuudo.app"
  };

  const handleMobilePostClick = () => {
    navigate('/newsroom/create'); 
  };

  return (
    <div className="amebo-shell">
      <div className="amebo-content-grid">
        {/* LEFT COLUMN */}
        <div className="column-left">
          <AmeboSidebar user={user} />
        </div>

        {/* CENTER COLUMN */}
        <div className="column-center">
         <AmeboFeed user={user} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="column-right">
          <AmeboRight />
        </div>
      </div>
      {/* 🎯 NEW: FLOATING ACTION BUTTON FOR MOBILE POSTS */}
      <button 
        className="mobile-floating-post-btn" 
        onClick={handleMobilePostClick}
        aria-label="Create a new post"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}