import { useState, useRef, useEffect } from "react";

const ME = { name: "Adeola Obi", handle: "@adeola_o", initials: "AO", color: "#3B82F6" };

const INITIAL_POSTS = [
  {
    id: 1, name: "Chioma Eze", handle: "@chioma_e", initials: "CE", color: "#7C3AED",
    time: "2m ago",
    text: "Just finished my Chemistry assignment — the mole concept finally clicked! 🎉 Anyone else struggling with stoichiometry? I'm down to start a study group this week. Drop a comment if you're in. #StudyGroup #Chemistry",
    audience: "school", likes: 14, comments: 5, reposts: 3, liked: false, reposted: false,
    commentList: ["Great idea! I need help with this too 🙏", "I'm in! Let's do it Saturday."],
    showComments: false, repostedByName: null, media: [],
  },
  {
    id: 2, name: "Emeka Nwosu", handle: "@emeka_n", initials: "EN", color: "#0891B2",
    time: "15m ago",
    text: "The inter-house sports finals are THIS FRIDAY! 🏆 Our house is going all out. Everyone needs to come out and show support — this is what school spirit is about. Don't miss it! #FootballGala",
    audience: "public", likes: 42, comments: 11, reposts: 18, liked: false, reposted: false,
    commentList: ["House Sapphire all the way!! 💙", "Can't wait, this is going to be epic!"],
    showComments: false, repostedByName: null, media: [],
  },
  {
    id: 3, name: "Fatima Bello", handle: "@fatima_b", initials: "FB", color: "#D97706",
    time: "1h ago",
    text: "Reminder: Science Fair project submissions are due NEXT MONDAY. Mr. Okafor confirmed late submissions will NOT be accepted. Please don't wait until the last minute — start now! #ScienceFair #FinalExams2025",
    audience: "school", likes: 31, comments: 7, reposts: 9, liked: false, reposted: false,
    commentList: ["Thank you for the reminder!!", "Working on mine right now 😅"],
    showComments: false, repostedByName: null, media: [],
  },
  {
    id: 4, name: "David Adeleke", handle: "@davide", initials: "DA", color: "#059669",
    time: "3h ago",
    text: "Our debate team just won the state championship!! 🏆🎉 We are going to NATIONALS. Three years of hard work and it finally paid off. So incredibly proud of every single person on this team. We did it!",
    audience: "public", likes: 198, comments: 47, reposts: 63, liked: true, reposted: false,
    commentList: ["Congratulations!! You all deserved this 🔥", "Nationals here we come!! 🙌", "Proud of you guys so much!!"],
    showComments: false, repostedByName: "Amara F.", media: [],
  },
  {
    id: 5, name: "Grace Adeyemi", handle: "@grace_a", initials: "GA", color: "#E11D48",
    time: "5h ago",
    text: "PSA: The school library now has extended hours — open until 8pm on weekdays. Perfect for those of us cramming for finals 📚 Spread the word! #FinalExams2025",
    audience: "school", likes: 67, comments: 12, reposts: 24, liked: false, reposted: false,
    commentList: ["This is so needed! Thank you for sharing 🙏"],
    showComments: false, repostedByName: null, media: [],
  },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
// Every SVG now carries explicit width/height so it always renders at the
// intended size regardless of its container.
const Icon = {
  Book:     () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>),
  Search:   () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Bell:     () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>),
  Msg:      () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>),
  Bookmark: () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>),
  User:     () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Settings: () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>),
  Plus:     () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Globe:    () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>),
  Home:     () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>),
  Heart:    ({ filled }) => (<svg width="100%" height="100%" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>),
  Comment:  () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>),
  Repost:   () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><polyline points="17,1 21,5 17,9"/><path d="M3,11V9a4,4,0,0,1,4-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21,13v2a4,4,0,0,1-4,4H3"/></svg>),
  Share:    () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>),
  Refresh:  () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>),
  Close:    () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Dots:     () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>),
  Image:    () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>),
  Video:    () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><rect x="2" y="5" width="15" height="14" rx="2"/><path d="M17 9l5-3v12l-5-3V9z"/></svg>),
  Chart:    () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  Gif:      () => (<svg width="100%" height="100%" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M10 9v6m-2-3h3"/><path d="M16 9h-2a2 2 0 000 4h1v1"/></svg>),
  Play:     () => (<svg width="100%" height="100%" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>),
};

function Avatar({ initials, color, size = "md" }) {
  const s = { sm: [32,12], md: [40,14], lg: [48,16] }[size];
  return (
    <div style={{ width: s[0], height: s[0], borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: "white", fontSize: s[1], flexShrink: 0, userSelect: "none" }}>
      {initials}
    </div>
  );
}

function Toast({ message, visible }) {
  return (
    <div style={{ position: "fixed", bottom: 80, left: "50%", transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`, background: "#0F172A", color: "white", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 500, opacity: visible ? 1 : 0, transition: "all 0.25s ease", zIndex: 200, pointerEvents: "none", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
      {message}
    </div>
  );
}

function MediaGrid({ media, onRemove, onClickItem }) {
  if (!media || media.length === 0) return null;
  const count = media.length;
  return (
    <div style={{
      display: "grid", gap: 3, borderRadius: 12, overflow: "hidden", marginTop: 10,
      gridTemplateColumns: count === 1 ? "1fr" : "1fr 1fr",
      gridTemplateRows: count === 4 ? "160px 160px" : count === 3 ? "200px" : "auto",
    }}>
      {media.slice(0, 4).map((item, i) => (
        <div key={i} onClick={() => onClickItem && onClickItem(i)} style={{
          position: "relative",
          aspectRatio: count === 1 ? "16/9" : "1/1",
          background: "#0F172A", overflow: "hidden",
          cursor: onClickItem ? "zoom-in" : "default",
          gridColumn: count === 3 && i === 0 ? "1 / 2" : "auto",
          gridRow: count === 3 && i === 0 ? "1 / 3" : "auto",
        }}>
          {item.type === "image" ? (
            <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <>
              <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} muted playsInline />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.28)" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 20, height: 20, color: "#0F172A", paddingLeft: 2 }}><Icon.Play /></div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 6, right: 8, background: "rgba(0,0,0,0.65)", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>VIDEO</div>
            </>
          )}
          {i === 3 && media.length > 4 && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, fontWeight: 700 }}>+{media.length - 4}</div>
          )}
          {onRemove && (
            <button onClick={e => { e.stopPropagation(); onRemove(i); }} style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", zIndex: 2 }}>
              <div style={{ width: 13, height: 13 }}><Icon.Close /></div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function Lightbox({ media, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const item = media[idx];
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") setIdx(i => Math.min(i+1, media.length-1)); if (e.key === "ArrowLeft") setIdx(i => Math.max(i-1, 0)); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [media.length, onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.12)", border: "none", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 20, height: 20 }}><Icon.Close /></div>
      </button>
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i-1); }} style={{ position: "absolute", left: 16, background: "rgba(255,255,255,0.12)", border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
      )}
      {idx < media.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i+1); }} style={{ position: "absolute", right: 16, background: "rgba(255,255,255,0.12)", border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", color: "white", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      )}
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: "88vw", maxHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {item.type === "image"
          ? <img src={item.url} alt="" style={{ maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 10, boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }} />
          : <video src={item.url} controls autoPlay style={{ maxWidth: "88vw", maxHeight: "88vh", borderRadius: 10 }} />}
      </div>
      {media.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, display: "flex", gap: 8 }}>
          {media.map((_, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }} style={{ width: i===idx ? 22 : 8, height: 8, borderRadius: 4, background: i===idx ? "white" : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.2s" }} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onToggleComments, onRepost, onShare, onSendComment }) {
  const [commentText, setCommentText] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const processText = text => text.split(/(\s)/g).map((w, i) => w.startsWith("#") ? <span key={i} style={{ color: "#3B82F6", fontWeight: 500 }}>{w}</span> : w);
  const handleKeyDown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (commentText.trim()) { onSendComment(post.id, commentText.trim()); setCommentText(""); } } };
  return (
    <>
      {lightbox !== null && post.media?.length > 0 && <Lightbox media={post.media} startIndex={lightbox} onClose={() => setLightbox(null)} />}
      <div>
        {post.repostedByName && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8", padding: "10px 20px 0 72px" }}>
            <div style={{ width: 13, height: 13, color: "#16A34A" }}><Icon.Repost /></div>
            {post.repostedByName} reposted
          </div>
        )}
        <article style={{ padding: "14px 20px 12px", borderBottom: "1px solid #F1F5F9", display: "flex", gap: 12, transition: "background 0.18s", animation: "fadeIn 0.25s ease forwards" }}
          onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Avatar initials={post.initials} color={post.color} size="md" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 700 }}>{post.name}</span>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>{post.handle}</span>
              <span style={{ color: "#94A3B8", fontSize: 12 }}>·</span>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>{post.time}</span>
              {post.audience === "public"
                ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "#EFF6FF", color: "#1D4ED8" }}><div style={{ width: 10, height: 10 }}><Icon.Globe /></div>Public</span>
                : <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "#F0FDF4", color: "#16A34A", border: "1px solid #86EFAC" }}><div style={{ width: 10, height: 10 }}><Icon.Home /></div>School Only</span>}
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#0F172A", marginBottom: post.media?.length ? 0 : 12, wordBreak: "break-word" }}>{processText(post.text)}</p>
            {post.media?.length > 0 && (
              <div style={{ marginBottom: 12 }} onClick={e => e.stopPropagation()}>
                <MediaGrid media={post.media} onClickItem={i => setLightbox(i)} />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {[
                { key: "like", icon: <Icon.Heart filled={post.liked} />, count: post.likes, hc: "#E11D48", hbg: "#FFF1F2", on: post.liked, fn: () => onLike(post.id) },
                { key: "comment", icon: <Icon.Comment />, count: post.comments, hc: "#3B82F6", hbg: "#EFF6FF", fn: () => onToggleComments(post.id) },
                { key: "repost", icon: <Icon.Repost />, count: post.reposts, hc: "#16A34A", hbg: "#F0FDF4", on: post.reposted, fn: () => onRepost(post.id) },
                { key: "share", icon: <Icon.Share />, count: null, hc: "#3B82F6", hbg: "#EFF6FF", fn: () => onShare() },
              ].map(({ key, icon, count, hc, hbg, on, fn }) => (
                <button key={key} onClick={fn} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 999, border: "none", background: "none", cursor: "pointer", color: on ? hc : "#94A3B8", fontSize: 13, fontFamily: "'DM Sans',sans-serif", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = hc; e.currentTarget.style.background = hbg; }}
                  onMouseLeave={e => { e.currentTarget.style.color = on ? hc : "#94A3B8"; e.currentTarget.style.background = "none"; }}
                >
                  <div style={{ width: 16, height: 16 }}>{icon}</div>
                  {count !== null && <span style={{ fontWeight: 500 }}>{count}</span>}
                </button>
              ))}
            </div>
            {post.showComments && (
              <div style={{ display: "flex", gap: 10, margin: "8px 0 4px" }}>
                <Avatar initials={ME.initials} color={ME.color} size="sm" />
                <input style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 999, padding: "8px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#0F172A", background: "#F1F5F9", outline: "none", transition: "all 0.18s" }}
                  placeholder="Write a reply..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={handleKeyDown} autoFocus
                  onFocus={e => { e.target.style.borderColor = "#3B82F6"; e.target.style.background = "white"; }}
                  onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#F1F5F9"; }}
                />
                <button onClick={() => { if (commentText.trim()) { onSendComment(post.id, commentText.trim()); setCommentText(""); } }} style={{ padding: "8px 16px", background: "#3B82F6", color: "white", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Reply</button>
              </div>
            )}
            {post.showComments && post.commentList.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderTop: "1px solid #F1F5F9" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#3B82F6", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#475569", paddingTop: 2 }}>{c}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}

function RepostModal({ post, onClose, onConfirm }) {
  const [qt, setQt] = useState("");
  if (!post) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.35)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}>
      <div style={{ background: "white", borderRadius: 20, width: 520, maxWidth: "95vw", boxShadow: "0 4px 12px rgba(15,23,42,.08)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 700 }}>Repost to your followers</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 18, height: 18 }}><Icon.Close /></div></button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 14, padding: "12px 14px", marginBottom: 12, background: "#F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Avatar initials={post.initials} color={post.color} size="sm" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>{post.name}</span>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>{post.handle}</span>
            </div>
            <p style={{ fontSize: 13, margin: 0 }}>{post.text.substring(0, 120)}{post.text.length > 120 ? "…" : ""}</p>
          </div>
          <textarea style={{ width: "100%", minHeight: 70, border: "1px solid #E2E8F0", borderRadius: 14, padding: "10px 12px", fontSize: 14, background: "#F1F5F9", fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "none", color: "#0F172A" }} placeholder="Add a comment (optional)..." value={qt} onChange={e => setQt(e.target.value)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: "1px solid #F1F5F9" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", border: "1px solid #E2E8F0", borderRadius: 999, background: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#475569" }}>Cancel</button>
          <button onClick={() => { onConfirm(post.id, qt.trim()); onClose(); }} style={{ padding: "8px 20px", background: "#3B82F6", color: "white", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Repost</button>
        </div>
      </div>
    </div>
  );
}

export default function StudentHub() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentTab, setCurrentTab] = useState("all");
  const [currentAudience, setCurrentAudience] = useState("public");
  const [composerText, setComposerText] = useState("");
  const [composerMedia, setComposerMedia] = useState([]);
  const [repostPost, setRepostPost] = useState(null);
  const [activePage, setActivePage] = useState("newsroom");
  const [following, setFollowing] = useState({});
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimer = useRef(null);
  const composerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const showToast = msg => { clearTimeout(toastTimer.current); setToast({ message: msg, visible: true }); toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500); };
  const filteredPosts = currentTab === "school" ? posts.filter(p => p.audience === "school") : currentTab === "public" ? posts.filter(p => p.audience === "public") : posts;
  const handleLike = id => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes-1 : p.likes+1 } : p));
  const handleToggleComments = id => setPosts(prev => prev.map(p => p.id === id ? { ...p, showComments: !p.showComments } : p));
  const handleSendComment = (id, text) => { setPosts(prev => prev.map(p => p.id === id ? { ...p, commentList: [text, ...p.commentList], comments: p.comments+1 } : p)); showToast("Reply posted!"); };
  const handleRepostOpen = id => { const p = posts.find(x => x.id === id); setRepostPost(p || null); };
  const handleRepostConfirm = (id, qt) => {
    setPosts(prev => prev.map(p => p.id === id && !p.reposted ? { ...p, reposted: true, reposts: p.reposts+1 } : p));
    if (qt) { const p = posts.find(x => x.id === id); setPosts(prev => [{ id: Date.now(), name: ME.name, handle: ME.handle, initials: ME.initials, color: ME.color, time: "just now", text: qt, audience: p.audience, likes: 0, comments: 0, reposts: 0, liked: false, reposted: false, commentList: [], showComments: false, repostedByName: null, media: [] }, ...prev]); }
    showToast(qt ? "Quote post shared!" : "Reposted successfully!");
  };

  const handleMediaFiles = (files, type) => {
    const remaining = 4 - composerMedia.length;
    if (remaining <= 0) { showToast("Max 4 media items per post"); return; }
    const allowed = Array.from(files).slice(0, remaining);
    Promise.all(allowed.map(file => new Promise(res => {
      const r = new FileReader();
      r.onload = e => res({ type, url: e.target.result, name: file.name });
      r.readAsDataURL(file);
    }))).then(results => { setComposerMedia(prev => [...prev, ...results]); showToast(`${results.length} ${type}${results.length > 1 ? "s" : ""} added`); });
  };

  const handleImageChange = e => { if (e.target.files?.length) handleMediaFiles(e.target.files, "image"); e.target.value = ""; };
  const handleVideoChange = e => { if (e.target.files?.length) handleMediaFiles(e.target.files, "video"); e.target.value = ""; };
  const removeComposerMedia = idx => setComposerMedia(prev => prev.filter((_, i) => i !== idx));

  const handleSubmitPost = () => {
    const text = composerText.trim();
    if (!text && composerMedia.length === 0) return;
    setPosts(prev => [{ id: Date.now(), name: ME.name, handle: ME.handle, initials: ME.initials, color: ME.color, time: "just now", text: text || "", audience: currentAudience, likes: 0, comments: 0, reposts: 0, liked: false, reposted: false, commentList: [], showComments: false, repostedByName: null, media: composerMedia }, ...prev]);
    setComposerText(""); setComposerMedia([]);
    showToast(`Post shared ${currentAudience === "school" ? "with your school" : "publicly"}!`);
  };

  const canPost = composerText.trim() || composerMedia.length > 0;
  const toggleFollow = key => setFollowing(prev => { const next = { ...prev, [key]: !prev[key] }; showToast(next[key] ? "Now following!" : "Unfollowed"); return next; });

  const navItems = [
    { key: "newsroom", label: "Newsroom", I: Icon.Book },
    { key: "explore", label: "Explore", I: Icon.Search },
    { key: "notifications", label: "Notifications", I: Icon.Bell, badge: 4 },
    { key: "messages", label: "Messages", I: Icon.Msg },
    { key: "bookmarks", label: "Bookmarks", I: Icon.Bookmark },
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#F8FAFC;color:#0F172A;line-height:1.6;-webkit-font-smoothing:antialiased}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:4px}
        .nl{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;cursor:pointer;color:#475569;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;border:none;background:none;width:100%;text-align:left;transition:all 0.18s}
        .nl:hover{background:#F1F5F9;color:#0F172A}.nl.active{background:#EFF6FF;color:#3B82F6;font-weight:600}
        .tb{padding:7px 18px;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;cursor:pointer;color:#475569;border:none;background:none;border-radius:999px;transition:all 0.18s}
        .tb:hover{background:#F1F5F9;color:#0F172A}.tb.active{background:#3B82F6;color:white;font-weight:600;box-shadow:0 2px 8px rgba(59,130,246,.3)}

        /* ── Toolbar buttons: key fix ──────────────────────────────────────
           The wrapper <div> constrains size; svg must fill it completely.   */
        .tbtn{
          width:34px;height:34px;border-radius:6px;border:none;background:none;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;color:#3B82F6;transition:background 0.18s;
          padding:0;
        }
        .tbtn:hover{background:#EFF6FF}
        .tbtn:disabled{opacity:0.4;cursor:not-allowed}
        /* Make every SVG inside a toolbar button fill its container div */
        .tbtn > div { display:flex;align-items:center;justify-content:center; }
        .tbtn > div > svg { display:block;width:100%;height:100%; }

        .fbtn{padding:5px 14px;border:1.5px solid #3B82F6;color:#3B82F6;background:none;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;transition:all 0.18s}
        .fbtn:hover{background:#3B82F6;color:white}.fbtn.following{background:#3B82F6;color:white}.fbtn.following:hover{background:#E11D48;border-color:#E11D48}
        @media(max-width:1100px){.rc{display:none!important}.shell{grid-template-columns:260px 1fr!important}}
        @media(max-width:680px){.shell{grid-template-columns:1fr!important}.sb{display:none!important}.fc{padding-bottom:72px}.mn{display:block!important}}
      `}</style>

      <Toast message={toast.message} visible={toast.visible} />
      {repostPost && <RepostModal post={repostPost} onClose={() => setRepostPost(null)} onConfirm={handleRepostConfirm} />}
      <input ref={imageInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageChange} />
      <input ref={videoInputRef} type="file" accept="video/*" multiple style={{ display: "none" }} onChange={handleVideoChange} />

      <div className="shell" style={{ display: "grid", gridTemplateColumns: "260px 1fr 280px", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside className="sb" style={{ position: "sticky", top: 0, height: "100vh", padding: "24px 16px 24px 20px", display: "flex", flexDirection: "column", gap: 6, borderRight: "1px solid #E2E8F0", background: "white", overflowY: "auto" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", marginBottom: 20, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, background: "#3B82F6", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(59,130,246,.35)" }}><div style={{ width: 20, height: 20, color: "white" }}><Icon.Book /></div></div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Student<span style={{ color: "#3B82F6" }}>Hub</span></span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "8px 10px", fontSize: 12, fontWeight: 500, color: "#1D4ED8", marginBottom: 8 }}>
            <div style={{ width: 14, height: 14 }}><Icon.Home /></div>Lagos State Model College
          </div>
          {navItems.map(({ key, label, I, badge }) => (
            <button key={key} className={`nl ${activePage === key ? "active" : ""}`} onClick={() => { setActivePage(key); if (key !== "newsroom") showToast(`${label} page coming soon`); }}>
              <div style={{ width: 18, height: 18, flexShrink: 0 }}><I /></div>{label}
              {badge && <span style={{ marginLeft: "auto", background: "#3B82F6", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>{badge}</span>}
            </button>
          ))}
          <hr style={{ border: "none", borderTop: "1px solid #F1F5F9", margin: "10px 0" }} />
          <button className={`nl ${activePage === "profile" ? "active" : ""}`} onClick={() => { setActivePage("profile"); showToast("Profile page coming soon"); }}><div style={{ width: 18, height: 18 }}><Icon.User /></div>Profile</button>
          <button className={`nl ${activePage === "settings" ? "active" : ""}`} onClick={() => { setActivePage("settings"); showToast("Settings page coming soon"); }}><div style={{ width: 18, height: 18 }}><Icon.Settings /></div>Settings</button>
          <button onClick={() => composerRef.current?.focus()} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "auto", padding: "12px 16px", background: "#3B82F6", color: "white", border: "none", borderRadius: 999, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,.4)" }}>
            <div style={{ width: 16, height: 16 }}><Icon.Plus /></div>New Post
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginTop: 8 }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <Avatar initials={ME.initials} color={ME.color} size="sm" />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{ME.name}</div><div style={{ fontSize: 12, color: "#94A3B8" }}>{ME.handle}</div></div>
            <div style={{ width: 16, height: 16, color: "#94A3B8" }}><Icon.Dots /></div>
          </div>
        </aside>

        {/* Feed */}
        <main className="fc" style={{ borderRight: "1px solid #E2E8F0", background: "white", minHeight: "100vh" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", padding: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 12px" }}>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px" }}>Newsroom</h1>
              <button onClick={() => showToast("Feed refreshed")} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}><div style={{ width: 18, height: 18 }}><Icon.Refresh /></div></button>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "10px 0" }}>
              {[["all","For You"],["school","My School"],["public","Public"]].map(([v,l]) => (
                <button key={v} className={`tb ${currentTab === v ? "active" : ""}`} onClick={() => setCurrentTab(v)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", gap: 12, background: "white" }}>
            <Avatar initials={ME.initials} color={ME.color} size="md" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <textarea ref={composerRef} style={{ width: "100%", border: "none", background: "transparent", color: "#0F172A", fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.6, resize: "none", outline: "none", minHeight: 60, maxHeight: 200 }}
                placeholder="What's happening at school today?" value={composerText} onChange={e => setComposerText(e.target.value)} onKeyDown={e => { if ((e.ctrlKey||e.metaKey) && e.key === "Enter") handleSubmitPost(); }} rows={2} />
              {composerMedia.length > 0 && <MediaGrid media={composerMedia} onRemove={removeComposerMedia} />}
              <div style={{ borderTop: "1px solid #F1F5F9", margin: "10px 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                {/* ── Toolbar buttons with correctly-sized icon wrappers ── */}
                <button className="tbtn" onClick={() => imageInputRef.current?.click()} title="Add photos" disabled={composerMedia.length >= 4}>
                  <div style={{ width: 17, height: 17 }}><Icon.Image /></div>
                </button>
                <button className="tbtn" onClick={() => videoInputRef.current?.click()} title="Add video" disabled={composerMedia.length >= 4}>
                  <div style={{ width: 17, height: 17 }}><Icon.Video /></div>
                </button>
                <button className="tbtn" onClick={() => showToast("GIF support coming soon")} title="Add GIF">
                  <div style={{ width: 17, height: 17 }}><Icon.Gif /></div>
                </button>
                <button className="tbtn" onClick={() => showToast("Polls coming soon")} title="Create poll">
                  <div style={{ width: 17, height: 17 }}><Icon.Chart /></div>
                </button>
                {composerMedia.length > 0 && <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 4, fontWeight: 500 }}>{composerMedia.length}/4</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                  <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 999, padding: 3, gap: 2 }}>
                    {[["public","Public",<Icon.Globe />,"#3B82F6"],["school","School Only",<Icon.Home />,"#16A34A"]].map(([v,l,ic,ac]) => (
                      <button key={v} onClick={() => setCurrentAudience(v)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, border: "none", background: currentAudience === v ? ac : "none", color: currentAudience === v ? "white" : "#475569", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.18s" }}>
                        <div style={{ width: 12, height: 12 }}>{ic}</div>{l}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleSubmitPost} disabled={!canPost} style={{ padding: "8px 20px", background: "#3B82F6", color: "white", border: "none", borderRadius: 999, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 700, cursor: canPost ? "pointer" : "not-allowed", opacity: canPost ? 1 : 0.45, boxShadow: "0 2px 8px rgba(59,130,246,.3)" }}>Post</button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed list */}
          <div>
            {filteredPosts.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", gap: 12, textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 26, height: 26, color: "#3B82F6" }}><Icon.Book /></div></div>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 700 }}>Nothing here yet</p>
                <p style={{ fontSize: 14, color: "#475569", maxWidth: 280 }}>Be the first to post something for this audience.</p>
              </div>
            ) : filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} onToggleComments={handleToggleComments} onRepost={handleRepostOpen} onShare={() => showToast("Link copied to clipboard!")} onSendComment={handleSendComment} />
            ))}
          </div>
        </main>

        {/* Right panel */}
        <aside className="rc" style={{ padding: "20px 16px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F1F5F9", borderRadius: 999, padding: "9px 14px", marginBottom: 20 }}>
            <div style={{ width: 16, height: 16, color: "#94A3B8" }}><Icon.Search /></div>
            <input type="text" placeholder="Search Student Hub..." style={{ flex: 1, border: "none", background: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: "none" }} />
          </div>
          <div style={{ background: "#F1F5F9", borderRadius: 20, padding: 16, marginBottom: 16 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Trending at School</p>
            {trends.map(t => (
              <div key={t.tag} onClick={() => showToast(t.tag)} style={{ padding: "8px 0", borderBottom: "1px solid #E2E8F0", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.opacity="0.7"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>{t.cat}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#3B82F6" }}>{t.tag}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{t.vol}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#F1F5F9", borderRadius: 20, padding: 16, marginBottom: 16 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Who to Follow</p>
            {suggestions.map(s => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <Avatar initials={s.initials} color={s.color} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{s.role}</div></div>
                <button className={`fbtn ${following[s.key] ? "following" : ""}`} onClick={() => toggleFollow(s.key)}>{following[s.key] ? "Following" : "Follow"}</button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#94A3B8", padding: "0 4px", lineHeight: 1.7 }}>Student Hub · Privacy · Terms · Help<br/>© 2025 Student Hub</p>
        </aside>
      </div>

      {/* Mobile nav */}
      <nav className="mn" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "white", borderTop: "1px solid #E2E8F0", padding: "8px 0 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[
            { icon: <Icon.Book />, label: "Feed", active: true },
            { icon: <Icon.Search />, label: "Explore" },
            { fab: true },
            { icon: <Icon.Bell />, label: "Alerts", badge: true },
            { icon: <Icon.User />, label: "Profile" },
          ].map((item, i) => (
            <button key={i} onClick={item.fab ? () => composerRef.current?.focus() : undefined} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 16px", border: "none", background: "none", cursor: "pointer", color: item.active ? "#3B82F6" : "#94A3B8", fontSize: 10, position: "relative" }}>
              {item.fab ? (
                <div style={{ width: 46, height: 46, background: "#3B82F6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(59,130,246,.4)", marginTop: -18 }}><div style={{ width: 22, height: 22, color: "white" }}><Icon.Plus /></div></div>
              ) : (
                <><div style={{ width: 22, height: 22 }}>{item.icon}</div>{item.badge && <div style={{ position: "absolute", top: 2, right: 10, width: 16, height: 16, background: "#3B82F6", color: "white", borderRadius: "50%", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>4</div>}<span>{item.label}</span></>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}