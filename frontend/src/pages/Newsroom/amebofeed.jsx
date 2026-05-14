import React from 'react';
import { Image, Video, BarChart2, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import './amebofeed.css';
import PostItem from './postItem';


const PostBox = ({ user }) => {
  const [content, setContent] = React.useState('');
  const displayName = `${user?.f_name || ''} ${user?.l_name || ''}`.trim() || "Student";
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [image, setImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef(null);


    const handleImageSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImage(file);
  setImagePreview(URL.createObjectURL(file));
};

const handleRemoveImage = () => {
  setImage(null);
  setImagePreview(null);
  fileInputRef.current.value = null;
};

const handlePost = async () => {
  if (!content.trim() && !image) return;
  const token = localStorage.getItem("token");

  let imageUrl = null;

  if (image) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "your_upload_preset"); // ← from Cloudinary
    formData.append("folder", "studenthub");

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const cloudData = await cloudRes.json();
    imageUrl = cloudData.secure_url;
    setUploading(false);
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, image: imageUrl }),
  });

  if (res.ok) {
    setContent('');
    setImage(null);
    setImagePreview(null);
    window.location.reload();
  } else {
    alert("Failed to post");
  }
};



return (
  <div className="amebo-post-card">
    <div className="post-input-row">
      <img
        src={
          storedUser?.profile_pic ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`
        }
        className="comment-avatar"
        alt="User"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`;
        }}
      />
      <textarea
        placeholder={`What's the Gist Today, ${displayName.split(' ')[0]}?`}
        rows="2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>

    {imagePreview && (
      <div className="image-preview">
        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />
        <button type="button" onClick={handleRemoveImage} style={{ marginTop: '4px', color: 'red' }}>
          Remove
        </button>
      </div>
    )}

    <div className="post-actions-row">
      <div className="action-icons">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />
        <button type="button" onClick={() => fileInputRef.current.click()}>
          <Image size={18} /> <span>Image</span>
        </button>
        <button type="button"><Video size={18} /> <span>Video</span></button>
        <button type="button"><BarChart2 size={18} /> <span>Poll</span></button>
      </div>
      <button className="post-submit-btn" onClick={handlePost}>
        {uploading ? 'Uploading...' : 'Post'}
      </button>
    </div>
  </div>
)};

// --- MAIN FEED ---
export default function AmeboFeed({ user }) {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
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