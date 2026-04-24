import React from 'react';
import AmeboSidebar from './AmeboSidebar';
import './NewsHome.css';
import AmeboFeed from './amebofeed.jsx';
import AmeboRight from './AmeboRight.jsx';

export default function AmeboLayout({ user }) {
  const safeUser = {
    name: user?.name || "Amebo Chief",
    profileImg: user?.profileImg || "https://ui-avatars.com/api/?name=Amebo+Chief&background=3b82f6&color=fff",
    coverImg: user?.coverImg || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500",
    email: user?.email || "chief@stuudo.app"
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
    </div>
  );
}