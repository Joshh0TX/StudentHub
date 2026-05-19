import React, { useState, useEffect } from 'react';
import { Flame, UserPlus, Hash, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AmeboRight.css';

const SUGGESTED_DATA = [
  { id: 1, name: 'Tunde Voltage', bio: 'Tech & Vibes', img: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Chioma Gist', bio: 'Entertainment', img: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Derick Dev', bio: 'Building things', img: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Aisha Law', bio: 'Opinionated', img: 'https://i.pravatar.cc/150?u=4' },
];

const TrendingCard = () => {
  const [trending, setTrending] = useState([]);
  const [period, setPeriod] = useState('7d');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/trending?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTrending(data);
    };
    fetchTrending();
  }, [period]);

  return (
    <div className="right-rail-card">
      <div className="rail-card-header">
        <div className="header-title">
          <Flame size={18} className="text-orange" />
          <span>Top Trending</span>
        </div>
        <div className="period-toggle">
          <button
            className={`toggle-btn ${period === '24h' ? 'active' : ''}`}
            onClick={() => setPeriod('24h')}
          >
            24h
          </button>
          <button
            className={`toggle-btn ${period === '7d' ? 'active' : ''}`}
            onClick={() => setPeriod('7d')}
          >
            7d
          </button>
        </div>
      </div>
      <div className="rail-card-content">
        {trending.length === 0 ? (
          <p className="no-trends">No trending topics yet.</p>
        ) : (
          trending.map((item, i) => (
            <div
              key={item.tag}
              className="trend-row"
              onClick={() => navigate(`/newsroom/hashtag/${item.tag}`)}
              style={{ cursor: 'pointer' }}
            >
              <span className="trend-rank">#{i + 1}</span>
              <div className="trend-details">
                <span className="trend-name">#{item.tag}</span>
                <span className="trend-meta">{item.count} post{item.count !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SuggestedCard = () => {
  const [suggested, setSuggested] = useState([]);
  const [sent, setSent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggested = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/suggested`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSuggested(Array.isArray(data) ? data : []);
    };
    fetchSuggested();
  }, []);

  const handleFollow = async (userId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/friend-request/${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setSent((prev) => ({ ...prev, [userId]: true }));
    }
  };

  return (
    <div className="right-rail-card suggested-internal-scroll">
      <div className="rail-card-header">
        <div className="header-title">
          <span>Suggested</span>
        </div>
      </div>
      <div className="rail-card-content scrollable-area">
        {suggested.length === 0 ? (
          <p className="no-trends">No suggestions yet.</p>
        ) : (
          suggested.map((user) => (
            <div key={user.id} className="suggested-row">
              <img
                src={
                  user.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.f_name} ${user.l_name}`)}&background=random`
                }
                alt={user.f_name}
                className="user-avatar-sm"
                onClick={() => navigate(`/profile/${user.id}`)}
                style={{ cursor: 'pointer' }}
              />
              <div className="user-details" onClick={() => navigate(`/profile/${user.id}`)} style={{ cursor: 'pointer' }}>
                <span className="user-name">{user.f_name} {user.l_name}</span>
                <span className="user-bio">{user.course || user.department || 'Student'}</span>
              </div>
              <button
                className={`follow-action-btn ${sent[user.id] ? 'sent' : ''}`}
                onClick={() => handleFollow(user.id)}
                disabled={sent[user.id]}
              >
                {sent[user.id] ? '✓' : <UserPlus size={14} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function TrendingRightRail() {
  return (
    <div className="right-rail-container">
      <TrendingCard />
      <SuggestedCard />
    </div>
  );
}