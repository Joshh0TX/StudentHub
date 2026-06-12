import React, { useState, useEffect } from 'react';
import { Image, Video, BarChart2, Heart, MessageCircle, Share2, Send, Trash2 } from 'lucide-react';
import './amebofeed.css';
import PostItem from './postItem';


const PostBox = ({ user }) => {
  const [content, setContent] = React.useState('');
  const displayName = `${user?.f_name || ''} ${user?.l_name || ''}`.trim() || "Student";
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [image, setImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [video, setVideo] = React.useState(null);
  const [videoPreview, setVideoPreview] = React.useState(null);
  const videoInputRef = React.useRef(null);
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

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(null);
    setImagePreview(null);
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setVideoPreview(null);
    videoInputRef.current.value = null;
  };

const handlePost = async () => {
  if (!content.trim() && !image && !video) return;
  const token = localStorage.getItem("token");

  try {
    setUploading(true);

    let imageUrl = null;
    let videoUrl = null;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "stuudo_uploads");
      formData.append("folder", "studenthub");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Image upload failed");
      imageUrl = cloudData.secure_url;
    }

    if (video) {
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", "stuudo_uploads");
      formData.append("folder", "studenthub");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData }
      );
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Video upload failed");
      videoUrl = cloudData.secure_url;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: content.trim() || "", image: imageUrl, video: videoUrl }),
    });

    if (!res.ok) throw new Error("Failed to post");

    setContent('');
    setImage(null);
    setImagePreview(null);
    setVideo(null);
    setVideoPreview(null);
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert(err.message || "Something went wrong");
  } finally {
    setUploading(false);
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
  <div className="media-preview-wrapper">
    <img src={imagePreview} alt="Preview" className="media-preview-square" />
    <button type="button" className="media-delete-icon-btn" onClick={handleRemoveImage} title="Remove image">
      <Trash2 size={16} />
    </button>
  </div>
)}

{videoPreview && (
  <div className="media-preview-wrapper">
    <video src={videoPreview} controls className="media-preview-square" />
    <button type="button" className="media-delete-icon-btn" onClick={handleRemoveVideo} title="Remove video">
      <Trash2 size={16} />
    </button>
  </div>
)}

    <div className="post-actions-row">
      <div className="action-icons">
  {/* Image input */}
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

  {/* Video input */}
  <input
    type="file"
    accept="video/*"
    ref={videoInputRef}
    style={{ display: 'none' }}
    onChange={handleVideoSelect}
  />
  <button type="button" onClick={() => videoInputRef.current.click()}>
    <Video size={18} /> <span>Video</span>
  </button>

  <button type="button"><BarChart2 size={18} /> <span>Poll</span></button>
</div>
      <button className="post-submit-btn" onClick={handlePost}>
        {uploading ? ('Uploading...' ): (
          <>
            <span className="submit-btn-text">Post</span>
            <Send size={15} className="submit-btn-icon" />
          </>
        )}
      </button>
    </div>
  </div>
)};

// --- MAIN FEED ---
export default function AmeboFeed({ user }) {
  const [posts, setPosts] = React.useState([]);
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

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
          postVideo: p.video,
          likes: p._count.likes || 0,
          isLiked: p.likes.some((l) => l.userId === storedUser?.id) || false,
          comments: p._count.comments || 0,
        }} currentUser={user} />
      ))}
        
      </div>
    </div>
  );
}
