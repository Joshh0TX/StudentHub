import React from 'react';
import { Image, Video, BarChart2, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import './amebofeed.css';
import PostItem from './postItem';



const PostBox = ({ user }) => {
  const [content, setContent] = React.useState('');
  const displayName = `${user?.f_name || ''} ${user?.l_name || ''}`.trim() || "Student";
  const profileImg = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

  const handlePost = async () => {
    if (!content.trim()) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setContent('');
      window.location.reload();
    } else {
      alert("Failed to post");
    }
  };

  return (
    <div className="amebo-post-card">
      <div className="post-input-row">
        <img src={profileImg} className="mini-avatar" alt={displayName} />
        <textarea
          placeholder={`What's the Gist Today, ${displayName.split(' ')[0]}?`}
          rows="2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="post-actions-row">
        <div className="action-icons">
          <button type="button"><Image size={18} /> <span>Image</span></button>
          <button type="button"><Video size={18} /> <span>Video</span></button>
          <button type="button"><BarChart2 size={18} /> <span>Poll</span></button>
        </div>
        <button className="post-submit-btn" onClick={handlePost}>Post</button>
      </div>
    </div>
  );
};

// --- MAIN FEED ---
export default function AmeboFeed({ user }) {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://stuudo.onrender.com/api/posts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="amebo-main-feed">
      <PostBox user={user} />
      <div className="feed-container">
        {posts.map((p) => (
        <PostItem key={p.id} post={{
          id: p.id,
          userId: p.user.id,  // ADD THIS
          userName: `${p.user.f_name} ${p.user.l_name}`,
          userImg: p.user.profileImage || `https://ui-avatars.com/api/?name=${p.user.f_name}+${p.user.l_name}&background=3b82f6&color=fff`,
          timestamp: new Date(p.createdAt).toLocaleString(),
          content: p.content,
          postImage: p.image,
          likes: 0,
          comments: 0,
        }} currentUser={user} />
      ))}
        <div className="feed-status">No more Gist for now.</div>
      </div>
    </div>
  );
}