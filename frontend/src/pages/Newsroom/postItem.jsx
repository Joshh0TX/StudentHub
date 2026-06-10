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

// Add this above PostItem component:
const CommentNode = ({ comment, postId, currentUserId, depth = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.some(l => l.userId === currentUserId) || false
  );
  const [likeCount, setLikeCount] = useState(comment._count?.likes || 0);
  

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleLikeComment = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/posts/comments/${comment.id}/like`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      setIsLiked(data.liked);
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: replyText, parentId: comment.id })
      }
    );
    if (res.ok) {
      const newReply = await res.json();
      setReplies(prev => [...prev, newReply]);
      setReplyText('');
      setShowReplyInput(false);
      setShowReplies(true);
    }
  };

  const handleDeleteComment = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/posts/comments/${comment.id}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      // parent handles removal from list
    }
  };

  return (
    <div className={`comment-node depth-${Math.min(depth, 3)}`}>
      <div className="comment-item">
        <img
          src={
            comment.user?.profileImage ||
            `https://ui-avatars.com/api/?name=${comment.user?.f_name}+${comment.user?.l_name}&background=random`
          }
          className="comment-avatar"
          alt={comment.user?.f_name}
        />
        <div className="comment-content">
          <div className="comment-author-row">
            <span className="comment-author">{comment.user?.f_name} {comment.user?.l_name}</span>
            <span className="comment-timestamp">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="comment-text">{comment.content}</p>

          {/* Actions row */}
          <div className="comment-actions-row">
            <button
              className={`comment-action-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeComment}
            >
              <Heart size={12} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
              <span>{likeCount > 0 ? likeCount : ''}</span>
            </button>

            <button
              className="comment-action-btn"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </button>

            {replies.length > 0 && (
              <button
                className="comment-action-btn"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide' : `View ${replies.length} repl${replies.length > 1 ? 'ies' : 'y'}`}
              </button>
            )}

            {comment.userId === currentUserId && (
              <button className="comment-action-btn delete-type" onClick={handleDeleteComment}>
                <Trash2 size={12} />
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <form className="reply-form" onSubmit={handleReplySubmit}>
              <input
                type="text"
                placeholder={`Reply to ${comment.user?.f_name}...`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              {replyText.trim() && (
                <button type="submit"><Send size={12} /></button>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {showReplies && replies.length > 0 && (
        <div className="comment-replies">
          {replies.map(reply => (
            <CommentNode
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostItem = ({ post, currentUser }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(Number(post.likes) || 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  // 🛠️ PASTE THIS inside the start of PostItem component:
  
  const CHARACTER_LIMIT = 180;
  const isLongPost = post.content?.length > CHARACTER_LIMIT;

  const getRenderedContent = () => {
    if (!post.content) return "";
    if (!isLongPost || isExpanded) return post.content;
    return `${post.content.substring(0, CHARACTER_LIMIT)}...`;
  };

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

  const handleLike = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) {
    const data = await res.json();
    setIsLiked(data.liked);
    setLikeCount((prev) => data.liked ? prev + 1 : prev - 1);
  }
};

  const handleDeletePost = async () => {
  if (!window.confirm('Delete this post?')) return;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`Failed to delete: ${data.message}`);
    }
  } catch (err) {
    console.error('Delete error:', err);
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

  {/* NEW WRAPPER BLOCK FOR THE OPTIONS AND DROPDOWN */}
  <div className="post-menu-wrapper">
    <button className="more-options" onClick={() => setShowMenu(!showMenu)}>
      <MoreHorizontal size={18} />
    </button>
    
    {showMenu && (
      <div className="post-dropdown-menu">
        {post.userId === storedUser?.id && (
          <button 
            className="dropdown-item delete-item" 
            onClick={() => {
              handleDeletePost();
              setShowMenu(false);
            }}
          >
            <Trash2 size={14} />
            <span>Delete Post</span>
          </button>
        )}
        {/* You can easily drop more options here in the future like Edit or Report */}
      </div>
    )}
  </div>
</div>

      {/* Body */}
      <div className="post-body">
        {/* 🛠️ REPLACE YOUR ENTIRE EXISTING <p className="post-text"> CODE WITH THIS: */}
        <p className="post-text">
          {renderContentWithHashtags(getRenderedContent(), navigate) || ""}
          
          {isLongPost && (
            <button 
              type="button" 
              className="text-expand-toggle-link"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? " Show Less" : " Read More"}
            </button>
          )}
        </p>
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
      <CommentNode
        key={c.id}
        comment={c}
        postId={post.id}
        currentUserId={storedUser?.id}
        depth={0}
      />
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