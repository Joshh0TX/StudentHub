import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, BarChart2, Trash2, ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

export default function CreatePost() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  
  // 🛠️ BACKEND MATCH: Pull directly from localStorage exactly like the PostBox
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = `${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`.trim() || "Student";

  // Media upload and preview states matching amebofeed
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Input element refs matching amebofeed
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-focus engine to trigger mobile keyboard instantly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // 🛠️ MATCHING MEDIA SELECTION HANDLERS FROM POSTBOX
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(null);
    setVideoPreview(null);
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
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
    if (videoInputRef.current) videoInputRef.current.value = null;
  };

  // 🛠️ MATCHING CLOUDINARY + BACKEND POSTING HANDLER FROM POSTBOX
  const handlePostSubmit = async () => {
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
      
      // Clean up local states and redirect to main amebo feed layout view
      setContent('');
      setImage(null);
      setImagePreview(null);
      setVideo(null);
      setVideoPreview(null);
      navigate('/newsroom');
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mobile-create-post-screen">
      {/* 1. TOP APP CONTROL BAR */}
      <header className="create-post-header">
        <button className="back-dismiss-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        
        <button 
          className="mobile-submit-post-btn" 
          onClick={handlePostSubmit}
          disabled={uploading || (!content.trim() && !image && !video)}
        >
          {uploading ? "Posting..." : "Post"}
        </button>
      </header>

      {/* 2. INPUT WORKSPACE CHASSIS */}
      <div className="create-post-body">
        <div className="author-avatar-aside">
          {/* 🛠️ BACKEND MATCH: Exact image source routing & onError placeholder avatar token setup */}
          <img
            src={
              storedUser?.profile_pic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`
            }
            className="avatar-round-fluid"
            alt="User"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`;
            }}
          />
        </div>

        <div className="editor-input-column">
          <div className="audience-pill-badge">
            <Globe size={12} />
            <span>Everyone can reply</span>
          </div>

          <textarea
            ref={textareaRef}
            placeholder={`What's the Gist Today, ${displayName.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={600}
          />

          {/* Inline Media Previews with exact same delete callbacks */}
          {imagePreview && (
            <div className="editor-media-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" className="media-clear-badge" onClick={handleRemoveImage}>
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {videoPreview && (
            <div className="editor-media-preview">
              <video src={videoPreview} controls />
              <button type="button" className="media-clear-badge" onClick={handleRemoveVideo}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. FIXED BOTTOM ACTIONS TOOLBAR FOOTER */}
      <footer className="keyboard-attach-toolbar">
        <div className="toolbar-left-icons">
          {/* Hidden Image Input */}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageSelect} 
          />
          <button type="button" className="toolbar-action-icon-btn" onClick={() => fileInputRef.current.click()}>
            <Image size={20} />
          </button>

          {/* Hidden Video Input */}
          <input 
            type="file" 
            accept="video/*" 
            ref={videoInputRef} 
            className="hidden" 
            onChange={handleVideoSelect} 
          />
          <button type="button" className="toolbar-action-icon-btn" onClick={() => videoInputRef.current.click()}>
            <Video size={20} />
          </button>

          <button type="button" className="toolbar-action-icon-btn">
            <BarChart2 size={20} />
          </button>
        </div>

        <div className="character-budget-counter">
          <span className={content.length > 550 ? "warning-limit" : ""}>
            {600 - content.length}
          </span>
        </div>
      </footer>
    </div>
  );
}