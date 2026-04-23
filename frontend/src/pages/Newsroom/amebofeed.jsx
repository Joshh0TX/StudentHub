import React from 'react';
import { Image, Video, BarChart2 } from 'lucide-react';
import './AmeboFeed.css';

const PostBox = ({ user }) => {
  const displayName = user?.name || "Fred Henry";
  const profileImg = user?.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

  return (
    <div className="amebo-post-card">
      <div className="post-input-row">
        <img src={profileImg} className="mini-avatar" alt={displayName} />
        <textarea 
          placeholder={`What's the Gist Today, ${displayName.split(' ')[0]}?`} 
          rows="2" 
        />
      </div>
      
      <div className="post-actions-row">
        <div className="action-icons">
          <button type="button"><Image size={18} /> <span>Image</span></button>
          <button type="button"><Video size={18} /> <span>Video</span></button>
          <button type="button"><BarChart2 size={18} /> <span>Poll</span></button>
        </div>
        <button className="post-submit-btn">
          Post
        </button>
      </div>
    </div>
  );
};

export default function AmeboFeed({ user }) {
  return (
    <div className="amebo-main-feed">
      <PostBox user={user} />
      
      {/* Posts list container */}
      <div className="feed-container">
        {/* Map through posts here later */}
        <div className="feed-status">No new amebo yet. Start a conversation!</div>
      </div>
    </div>
  );
}