import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './postItem.css';

const renderContentWithHashtags = (content, navigate) => {
  if (!content) return null;
  const parts = content.split(/(#[a-zA-Z0-9_]+)/g);
  return parts.map((part, i) =>
    part.startsWith('#') ? (
      <span
        key={i}
        className="hashtag-link"
        onClick={() => navigate(`/newsroom/hashtag/${part.slice(1).toLowerCase()}`)}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};

const PostItem = ({ post, currentUser }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Number(post.likes) || 0);
  const navigate = useNavigate();

  // Fetch comments when expanded
  useEffect(() => {
    if (!showComments) return;
    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(data);
    };
    fetchComments();
  }, [showComments, post.id]);

  const handleLike = (e) => {
    e.preventDefault();
    setLikeCount((prev) => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const handleDeletePost = async () => {
  if (!window.confirm('Delete this post?')) return;
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) {
    window.location.reload();
  }
};

  const handleProfileClick = () => {
    if (post.userId === currentUser?.id) {
      navigate('/profile');
    } else {
      navigate(`/profile/${post.userId}`);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: comment })
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setComment("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="amebo-post-item">
  {/* Header */}
  <div className="post-header">
    <img
      src={post.userImg}
      alt={post.userName}
      className="mini-avatar"
      onClick={handleProfileClick}
      style={{ cursor: 'pointer' }}
    />
    <div className="user-meta">
      <h4 className="user-name" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        {post.userName}
      </h4>
      <span className="post-time">{post.timestamp}</span>
    </div>
    {post.userId === storedUser?.id && (
      <button className="delete-post-btn" onClick={handleDeletePost}>
        <Trash2 size={16} />
      </button>
    )}
    <button className="more-options"><MoreHorizontal size={18} /></button>
  </div>

      {/* Body */}
      <div className="post-body">
        <p className="post-text">{renderContentWithHashtags(post.content, navigate) || ""}</p>
        {post.postImage && (
          <div className="post-media">
            <img src={post.postImage} alt="Post content" loading="lazy" />
          </div>
        )}
      </div>

      {post.postVideo && (
  <div className="post-media">
    <video src={post.postVideo} controls style={{ width: '100%', borderRadius: '12px' }} />
  </div>
)}

      {/* Interactions */}
      <div className="post-interactions">
        <button
          type="button"
          className={`interact-btn ${isLiked ? 'active-like' : ''}`}
          onClick={handleLike}
        >
          <Heart size={18} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "currentColor"} />
          <span>{likeCount}</span>
        </button>

        <button className="interact-btn" type="button" onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={18} /> <span>{comments.length || post.comments}</span>
        </button>

        <button className="interact-btn" type="button">
          <Share2 size={18} /> <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <img
                src={
                  c.user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(`${c.user?.f_name || ''} ${c.user?.l_name || ''}`)}&background=random`
                }
                className="comment-avatar"
                alt={c.user?.f_name}
              />
              <div className="comment-content">
                <span className="comment-author">{c.user?.f_name} {c.user?.l_name}</span>
                <p className="comment-text">{c.content}</p>
              </div>
              {c.userId === storedUser?.id && (
                <button
                  className="delete-comment-btn"
                  onClick={() => handleDeleteComment(c.id)}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comment Input */}
      <div className="post-comment-section">
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
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {comment.trim() && (
            <button type="submit" className="comment-send-btn">
              <Send size={16} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostItem;