import { useState, useRef, useEffect } from "react";
import "./NewsHome.css";

const ME = { name: "Adeola Obi", handle: "@adeola_o", initials: "AO", color: "#3B82F6" };

const INITIAL_POSTS = [
  {
    id: 1,
    name: "Chioma Eze", handle: "@chioma_e", initials: "CE", color: "#7C3AED",
    time: "2m ago",
    text: "Just finished my Chemistry assignment — the mole concept finally clicked! 🎉 Anyone else struggling with stoichiometry? I'm down to start a study group this week. Drop a comment if you're in. #StudyGroup #Chemistry",
    audience: "school",
    likes: 14, comments: 5, reposts: 3,
    liked: false, reposted: false,
    commentList: ["Great idea! I need help with this too 🙏", "I'm in! Let's do it Saturday."],
    showComments: false,
    repostedByName: null,
  },
  {
    id: 2,
    name: "Emeka Nwosu", handle: "@emeka_n", initials: "EN", color: "#0891B2",
    time: "15m ago",
    text: "The inter-house sports finals are THIS FRIDAY! 🏆 Our house is going all out. Everyone needs to come out and show support — this is what school spirit is about. Don't miss it! #FootballGala",
    audience: "public",
    likes: 42, comments: 11, reposts: 18,
    liked: false, reposted: false,
    commentList: ["House Sapphire all the way!! 💙", "Can't wait, this is going to be epic!"],
    showComments: false,
    repostedByName: null,
  },
  {
    id: 3,
    name: "Fatima Bello", handle: "@fatima_b", initials: "FB", color: "#D97706",
    time: "1h ago",
    text: "Reminder: Science Fair project submissions are due NEXT MONDAY. Mr. Okafor confirmed late submissions will NOT be accepted. Please don't wait until the last minute — start now! #ScienceFair #FinalExams2025",
    audience: "school",
    likes: 31, comments: 7, reposts: 9,
    liked: false, reposted: false,
    commentList: ["Thank you for the reminder!!", "Working on mine right now 😅"],
    showComments: false,
    repostedByName: null,
  },
  {
    id: 4,
    name: "David Adeleke", handle: "@davide", initials: "DA", color: "#059669",
    time: "3h ago",
    text: "Our debate team just won the state championship!! 🏆🎉 We are going to NATIONALS. Three years of hard work and it finally paid off. So incredibly proud of every single person on this team. We did it!",
    audience: "public",
    likes: 198, comments: 47, reposts: 63,
    liked: true, reposted: false,
    commentList: ["Congratulations!! You all deserved this 🔥", "Nationals here we come!! 🙌", "Proud of you guys so much!!"],
    showComments: false,
    repostedByName: "Amara F.",
  },
  {
    id: 5,
    name: "Grace Adeyemi", handle: "@grace_a", initials: "GA", color: "#E11D48",
    time: "5h ago",
    text: "PSA: The school library now has extended hours — open until 8pm on weekdays. Perfect for those of us cramming for finals 📚 Spread the word! #FinalExams2025",
    audience: "school",
    likes: 67, comments: 12, reposts: 24,
    liked: false, reposted: false,
    commentList: ["This is so needed! Thank you for sharing 🙏"],
    showComments: false,
    repostedByName: null,
  },
];

// ── Icons ──────────────────────────────────────────────────────────
const Icon = {
  Book: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  Search: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  Msg: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Bookmark: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  ),
  User: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Settings: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Plus: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Globe: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
  Home: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  Heart: ({ filled }) => (
    <svg fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Comment: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Repost: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <polyline points="17,1 21,5 17,9" /><path d="M3,11V9a4,4,0,0,1,4-4h14" />
      <polyline points="7,23 3,19 7,15" /><path d="M21,13v2a4,4,0,0,1-4,4H3" />
    </svg>
  ),
  Share: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Refresh: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  ),
  Close: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Dots: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  ),
  Image: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  ),
  Chart: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Gif: () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M10 9v6m-2-3h3" /><path d="M16 9h-2a2 2 0 000 4h1v1" />
    </svg>
  ),
};

// ── Avatar ─────────────────────────────────────────────────────────
function Avatar({ initials, color, size = "md" }) {
  return (
    <div className={`avatar avatar-${size}`} style={{ background: color }}>
      {initials}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return <div className={`toast ${visible ? "show" : ""}`}>{message}</div>;
}

// ── Post Card ──────────────────────────────────────────────────────
function PostCard({ post, onLike, onToggleComments, onRepost, onShare, onSendComment }) {
  const [commentText, setCommentText] = useState("");

  const processText = (text) =>
    text.split(/(\s)/g).map((word, i) =>
      word.startsWith("#") ? (
        <span key={i} className="hashtag">{word}</span>
      ) : (
        word
      )
    );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (commentText.trim()) {
        onSendComment(post.id, commentText.trim());
        setCommentText("");
      }
    }
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      onSendComment(post.id, commentText.trim());
      setCommentText("");
    }
  };

  return (
    <div className="newsmain" style={{width:'100%'}}>
      {post.repostedByName && (
        <div className="repost-label">
          <Icon.Repost />
          {post.repostedByName} reposted
        </div>
      )}
      <article className="post-card">
        <Avatar initials={post.initials} color={post.color} size="md" />
        <div className="post-main">
          <div className="post-meta">
            <span className="post-name">{post.name}</span>
            <span className="post-handle">{post.handle}</span>
            <span className="meta-dot">·</span>
            <span className="post-time">{post.time}</span>
            {post.audience === "public" ? (
              <span className="audience-pill pill-public">
                <Icon.Globe />Public
              </span>
            ) : (
              <span className="audience-pill pill-school">
                <Icon.Home />School Only
              </span>
            )}
          </div>
          <p className="post-text">{processText(post.text)}</p>
          <div className="post-actions">
            <button
              className={`action-btn like ${post.liked ? "on" : ""}`}
              onClick={() => onLike(post.id)}
            >
              <Icon.Heart filled={post.liked} />
              <span className="action-count">{post.likes}</span>
            </button>
            <button className="action-btn comment" onClick={() => onToggleComments(post.id)}>
              <Icon.Comment />
              <span className="action-count">{post.comments}</span>
            </button>
            <button
              className={`action-btn repost ${post.reposted ? "on" : ""}`}
              onClick={() => onRepost(post.id)}
            >
              <Icon.Repost />
              <span className="action-count">{post.reposts}</span>
            </button>
            <button className="action-btn share" onClick={() => onShare()}>
              <Icon.Share />
            </button>
          </div>

          {post.showComments && (
            <div className="comment-box open">
              <Avatar initials={ME.initials} color={ME.color} size="sm" />
              <input
                className="comment-input"
                placeholder="Write a reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button className="comment-send" onClick={handleSendComment}>Reply</button>
            </div>
          )}

          {post.showComments &&
            post.commentList.map((c, i) => (
              <div key={i} className="comment-row">
                <div className="avatar avatar-sm" style={{ background: "var(--blue)" }} />
                <p className="comment-text">{c}</p>
              </div>
            ))}
        </div>
      </article>
    </div>
  );
}

// ── Repost Modal ───────────────────────────────────────────────────
function RepostModal({ post, onClose, onConfirm }) {
  const [quoteText, setQuoteText] = useState("");
  if (!post) return null;

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Repost to your followers</span>
          <button className="modal-close" onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="modal-body">
          <div className="quoted-post">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Avatar initials={post.initials} color={post.color} size="sm" />
              <span className="post-name" style={{ fontSize: 13 }}>{post.name}</span>
              <span className="post-handle" style={{ fontSize: 12 }}>{post.handle}</span>
            </div>
            <p className="post-text" style={{ fontSize: 13, margin: 0 }}>
              {post.text.substring(0, 120)}{post.text.length > 120 ? "…" : ""}
            </p>
          </div>
          <textarea
            className="composer-textarea quote-textarea"
            placeholder="Add a comment (optional)..."
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={() => { onConfirm(post.id, quoteText.trim()); onClose(); }}>
            Repost
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────
export default function StudentHub() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentTab, setCurrentTab] = useState("all");
  const [currentAudience, setCurrentAudience] = useState("public");
  const [composerText, setComposerText] = useState("");
  const [repostPost, setRepostPost] = useState(null);
  const [activePage, setActivePage] = useState("newsroom");
  const [following, setFollowing] = useState({});
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimer = useRef(null);
  const composerRef = useRef(null);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ message: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  const filteredPosts =
    currentTab === "school" ? posts.filter((p) => p.audience === "school") :
    currentTab === "public" ? posts.filter((p) => p.audience === "public") :
    posts;

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
    );
  };

  const handleToggleComments = (id) => {
    setPosts((prev) =>
      prev.map((p) => p.id === id ? { ...p, showComments: !p.showComments } : p)
    );
  };

  const handleSendComment = (id, text) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, commentList: [text, ...p.commentList], comments: p.comments + 1 } : p
      )
    );
    showToast("Reply posted!");
  };

  const handleRepostOpen = (id) => {
    const p = posts.find((x) => x.id === id);
    setRepostPost(p || null);
  };

  const handleRepostConfirm = (id, quoteText) => {
    setPosts((prev) =>
      prev.map((p) => p.id === id && !p.reposted ? { ...p, reposted: true, reposts: p.reposts + 1 } : p)
    );
    if (quoteText) {
      const p = posts.find((x) => x.id === id);
      const newPost = {
        id: Date.now(),
        name: ME.name, handle: ME.handle, initials: ME.initials, color: ME.color,
        time: "just now", text: quoteText, audience: p.audience,
        likes: 0, comments: 0, reposts: 0,
        liked: false, reposted: false, commentList: [], showComments: false, repostedByName: null,
      };
      setPosts((prev) => [newPost, ...prev]);
    }
    showToast(quoteText ? "Quote post shared!" : "Reposted successfully!");
  };

  const handleSubmitPost = () => {
    const text = composerText.trim();
    if (!text) return;
    const newPost = {
      id: Date.now(),
      name: ME.name, handle: ME.handle, initials: ME.initials, color: ME.color,
      time: "just now", text, audience: currentAudience,
      likes: 0, comments: 0, reposts: 0,
      liked: false, reposted: false, commentList: [], showComments: false, repostedByName: null,
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposerText("");
    showToast(`Post shared ${currentAudience === "school" ? "with your school" : "publicly"}!`);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmitPost();
  };

  const toggleFollow = (key) => {
    setFollowing((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(next[key] ? "Now following!" : "Unfollowed");
      return next;
    });
  };

  const navItems = [
    { key: "newsroom", label: "Newsroom", Icon: Icon.Book },
    { key: "explore", label: "Explore", Icon: Icon.Search },
    { key: "notifications", label: "Notifications", Icon: Icon.Bell, badge: 4 },
    { key: "messages", label: "Messages", Icon: Icon.Msg },
    { key: "bookmarks", label: "Bookmarks", Icon: Icon.Bookmark },
  ];

  const suggestions = [
    { key: "tk", initials: "TK", color: "#7C3AED", name: "Tunde Kamara", role: "SS3 · Science" },
    { key: "af", initials: "AF", color: "#0891B2", name: "Amara Fasola", role: "SS2 · Arts" },
    { key: "mo", initials: "MO", color: "#D97706", name: "Mr. Okafor", role: "Chemistry Teacher" },
    { key: "bi", initials: "BI", color: "#E11D48", name: "Blessing Ike", role: "SS1 · Commercial" },
  ];

  const trends = [
    { cat: "Trending in Science", tag: "#FinalExams2025", vol: "248 posts" },
    { cat: "Campus News", tag: "#ScienceFair", vol: "134 posts" },
    { cat: "Student Life", tag: "#FootballGala", vol: "97 posts" },
    { cat: "Academics", tag: "#StudyGroup", vol: "61 posts" },
    { cat: "School Info", tag: "#AssemblyAnnouncement", vol: "39 posts" },
  ];

  return (
    <>
      <Toast message={toast.message} visible={toast.visible} />

      {repostPost && (
        <RepostModal
          post={repostPost}
          onClose={() => setRepostPost(null)}
          onConfirm={handleRepostConfirm}
        />
      )}

      <div className="app-shell">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <a href="#" className="logo">
            <div className="logo-mark"><Icon.Book /></div>
            <span className="logo-text">Student<span>Hub</span></span>
          </a>

          <div className="school-chip">
            <Icon.Home />
            Lagos State Model College
          </div>

          <div style={{ marginTop: 8 }} />

          {navItems.map(({ key, label, Icon: NavIcon, badge }) => (
            <button
              key={key}
              className={`nav-link ${activePage === key ? "active" : ""}`}
              onClick={() => {
                setActivePage(key);
                if (key !== "newsroom") showToast(`${label} page coming soon`);
              }}
            >
              <NavIcon />
              {label}
              {badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}

          <hr className="sidebar-divider" />

          <button
            className={`nav-link ${activePage === "profile" ? "active" : ""}`}
            onClick={() => { setActivePage("profile"); showToast("Profile page coming soon"); }}
          >
            <Icon.User />Profile
          </button>
          <button
            className={`nav-link ${activePage === "settings" ? "active" : ""}`}
            onClick={() => { setActivePage("settings"); showToast("Settings page coming soon"); }}
          >
            <Icon.Settings />Settings
          </button>

          <button className="post-fab" onClick={() => composerRef.current?.focus()}>
            <Icon.Plus />New Post
          </button>

          <div className="sidebar-user">
            <Avatar initials={ME.initials} color={ME.color} size="sm" />
            <div className="u-info">
              <div className="u-name">{ME.name}</div>
              <div className="u-handle">{ME.handle}</div>
            </div>
            <div className="u-more"><Icon.Dots /></div>
          </div>
        </aside>

        {/* ── Feed ── */}
        <main className="feed-col">
          <div className="feed-header">
            <div className="feed-title-row">
              <h1 className="feed-title">Newsroom</h1>
              <button className="feed-icon-btn" onClick={() => showToast("Feed refreshed")}>
                <Icon.Refresh />
              </button>
            </div>
            <div className="feed-tabs">
              {[["all", "For You"], ["school", "My School"], ["public", "Public"]].map(([val, label]) => (
                <button
                  key={val}
                  className={`tab-btn ${currentTab === val ? "active" : ""}`}
                  onClick={() => setCurrentTab(val)}
                  style={{borderRadius:'none', textDecoration:'none'}}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="composer">
            <Avatar initials={ME.initials} color={ME.color} size="md" />
            <div className="composer-body">
              <textarea
                ref={composerRef}
                className="composer-textarea"
                placeholder="What's happening at school today?"
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
              />
              <div className="composer-divider" />
              <div className="composer-toolbar">
                <button className="toolbar-btn" onClick={() => showToast("Image upload coming soon")}>
                  <Icon.Image />
                </button>
                <button className="toolbar-btn" onClick={() => showToast("GIF support coming soon")}>
                  <Icon.Gif />
                </button>
                <button className="toolbar-btn" onClick={() => showToast("Polls coming soon")}>
                  <Icon.Chart />
                </button>
                <div className="composer-actions">
                  <div className="audience-picker">
                    <button
                      className={`aud-opt ${currentAudience === "public" ? "active-public" : ""}`}
                      onClick={() => setCurrentAudience("public")}
                    >
                      <Icon.Globe />Public
                    </button>
                    <button
                      className={`aud-opt ${currentAudience === "school" ? "active-school" : ""}`}
                      onClick={() => setCurrentAudience("school")}
                    >
                      <Icon.Home />School Only
                    </button>
                  </div>
                  <button
                    className="submit-btn"
                    onClick={handleSubmitPost}
                    disabled={!composerText.trim()}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed List */}
          <div id="feedList">
            {filteredPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Icon.Book /></div>
                <p className="empty-title">Nothing here yet</p>
                <p className="empty-sub">Be the first to post something for this audience.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onToggleComments={handleToggleComments}
                  onRepost={handleRepostOpen}
                  onShare={() => showToast("Link copied to clipboard!")}
                  onSendComment={handleSendComment}
                />
              ))
            )}
          </div>
        </main>

        {/* ── Right Panel ── */}
        <aside className="right-col">
          <div className="search-bar">
            <Icon.Search />
            <input type="text" placeholder="Search Student Hub..." />
          </div>

          <div className="widget">
            <p className="widget-heading">Trending at School</p>
            {trends.map((t) => (
              <div key={t.tag} className="trend-row" onClick={() => showToast(t.tag)}>
                <div className="trend-cat">{t.cat}</div>
                <div className="trend-tag"><span>{t.tag}</span></div>
                <div className="trend-volume">{t.vol}</div>
              </div>
            ))}
          </div>

          <div className="widget">
            <p className="widget-heading">Who to Follow</p>
            {suggestions.map((s) => (
              <div key={s.key} className="suggest-row">
                <Avatar initials={s.initials} color={s.color} size="sm" />
                <div className="sug-info">
                  <div className="sug-name">{s.name}</div>
                  <div className="sug-role">{s.role}</div>
                </div>
                <button
                  className={`follow-btn ${following[s.key] ? "following" : ""}`}
                  onClick={() => toggleFollow(s.key)}
                >
                  {following[s.key] ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

          <p className="footer-note">
            Student Hub · Privacy · Terms · Help<br />
            © 2025 Student Hub
          </p>
        </aside>
      </div>

      {/* Mobile Nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          <button className="mob-nav-btn active"><Icon.Book /><span>Feed</span></button>
          <button className="mob-nav-btn"><Icon.Search /><span>Explore</span></button>
          <button className="mob-nav-btn mob-fab" onClick={() => composerRef.current?.focus()}>
            <div className="mob-fab-inner"><Icon.Plus /></div>
          </button>
          <button className="mob-nav-btn" style={{ position: "relative" }}>
            <Icon.Bell /><span className="mob-badge">4</span><span>Alerts</span>
          </button>
          <button className="mob-nav-btn"><Icon.User /><span>Profile</span></button>
        </div>
      </nav>
    </>
  );
}