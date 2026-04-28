import React from 'react';
import { Image, Video, BarChart2, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import './amebofeed.css';
import PostItem from './PostItem';



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

// --- MAIN FEED ---
export default function AmeboFeed({ user }) {
  // Sample data to show what it looks like

 const posts = [
  {
    id: "1",
    userName: "Jonathan Ikenna",
    userImg: "https://ui-avatars.com/api/?name=Jonathan+Ikenna&background=3b82f6&color=fff",
    timestamp: "12 mins ago",
    content: "Does anyone know if the SIWES orientation is happening tomorrow? The portal is saying one thing, the group chat is saying another. 🤦‍♂️",
    likes: 12,
    comments: 4,
    postImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500"
  },
  {
    id: "2",
    userName: "Sarah Chidi",
    userImg: "https://ui-avatars.com/api/?name=Sarah+Chidi&background=ec4899&color=fff",
    timestamp: "45 mins ago",
    content: "The jollof rice at the cafeteria today is actually a 10/10. I'm shocked. Who cooked it? 😂",
    likes: 85,
    comments: 15,
    postImage: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=500"
  },
  {
    id: "3",
    userName: "Emeka Rollin",
    userImg: "https://ui-avatars.com/api/?name=Emeka+Rollin&background=10b981&color=fff",
    timestamp: "2 hours ago",
    content: "Final year project is showing me pepper. I just need 5 hours of sleep and a miracle.",
    likes: 120,
    comments: 32
  },
  {
    id: "4",
    userName: "Amina Yusuf",
    userImg: "https://ui-avatars.com/api/?name=Amina+Yusuf&background=f59e0b&color=fff",
    timestamp: "3 hours ago",
    content: "Who has the PDF for MTH 202? Please help a sister out, exam is next week! 😭",
    likes: 45,
    comments: 18
  },
  {
    id: "5",
    userName: "Gifted Hands",
    userImg: "https://ui-avatars.com/api/?name=Gifted+Hands&background=8b5cf6&color=fff",
    timestamp: "5 hours ago",
    content: "Just finished this UI design for a crypto app. What do you guys think?",
    likes: 210,
    comments: 25,
    postImage: "https://images.unsplash.com/photo-1551288049-bbbda5366392?q=80&w=500"
  },
  {
    id: "6",
    userName: "Tobi Tech",
    userImg: "https://ui-avatars.com/api/?name=Tobi+Tech&background=06b6d4&color=fff",
    timestamp: "6 hours ago",
    content: "Coding at 3 AM hits different. The bugs are sleeping, so I can finally work in peace.",
    likes: 67,
    comments: 9
  },
  {
    id: "7",
    userName: "Precious Okafor",
    userImg: "https://ui-avatars.com/api/?name=Precious+Okafor&background=ef4444&color=fff",
    timestamp: "8 hours ago",
    content: "Lost my ID card around the School of Engineering. If anyone finds it, please DM! It has a red lanyard.",
    likes: 34,
    comments: 5
  },
  {
    id: "8",
    userName: "Daniel Vibe",
    userImg: "https://ui-avatars.com/api/?name=Daniel+Vibe&background=4b5563&color=fff",
    timestamp: "Yesterday",
    content: "The heat in this lecture hall is not for humans. We need more fans or we'll melt.",
    likes: 156,
    comments: 40,
    postImage: "https://images.unsplash.com/photo-1523240715639-99f840e46a8d?q=80&w=500"
  },
  {
    id: "9",
    userName: "Bose Fashion",
    userImg: "https://ui-avatars.com/api/?name=Bose+Fashion&background=db2777&color=fff",
    timestamp: "Yesterday",
    content: "New thrift arrivals! Check my status to shop. Affordable and classy. ✨",
    likes: 92,
    comments: 11
  },
  {
    id: "10",
    userName: "Prince Chinedu",
    userImg: "https://ui-avatars.com/api/?name=Prince+Chinedu&background=2563eb&color=fff",
    timestamp: "2 days ago",
    content: "Who's ready for the Departmental Week? The jersey designs just dropped and they are 🔥!",
    likes: 300,
    comments: 88,
    postImage: "https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?q=80&w=500"
  }
];

  return (
    <div className="amebo-main-feed">
      <PostBox user={user} />
      
      <div className="feed-container">
        {posts.map((p) => (
          <PostItem key={p.id} post={p} currentUser={user} />
        ))}
        
        
        {/* Placeholder for more posts */}
        <div className="feed-status">No more Gist for now.</div>
      </div>
    </div>
  );
}