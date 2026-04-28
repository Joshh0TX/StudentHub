import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import './postItem.css';

const PostItem = ({ post, currentUser }) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Number(post.likes) || 0);

  const handleLike = (e) => {
    e.preventDefault();
    console.log("Button clicked! Current likes:", likeCount); // Debug line

    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="amebo-post-item">
      {/* Header */}
      <div className="post-header">
        <img src={post.userImg} alt={post.userName} className="mini-avatar" />
        <div className="user-meta">
          <h4 className="user-name">{post.userName}</h4>
          <span className="post-time">{post.timestamp}</span>
        </div>
        <button className="more-options"><MoreHorizontal size={18} /></button>
      </div>

      {/* Body */}
      <div className="post-body">
        <p className="post-text">{post.content}</p>
        {post.postImage && (
          <div className="post-media">
            <img src={post.postImage} alt="Post content" loading="lazy" />
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="post-interactions">
        <button 
          type="button"
          className={`interact-btn ${isLiked ? 'active-like' : ''}`} 
          onClick={handleLike}
        >
          <Heart 
            size={18} 
            fill={isLiked ? "#ef4444" : "none"} 
            color={isLiked ? "#ef4444" : "currentColor"} 
          /> 
          <span>{likeCount}</span>
        </button>

        <button className="interact-btn" type="button">
          <MessageCircle size={18} /> <span>{post.comments}</span>
        </button>

        <button className="interact-btn" type="button">
          <Share2 size={18} /> <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      <div className="post-comment-section">
        <img 
          src={currentUser?.profileImg || `https://ui-avatars.com/api/?name=User`} 
          className="comment-avatar" 
          alt="User" 
        />
        <form className="comment-form" onSubmit={(e) => e.preventDefault()}>
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