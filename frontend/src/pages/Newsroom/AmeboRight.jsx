import React from 'react';
import { Flame, UserPlus, Hash, MoreHorizontal } from 'lucide-react';
import './AmeboRight.css';

// Single Responsibility: Data should be fetched or passed, but we'll define it here for clarity
const TRENDING_DATA = [
  { id: 1, tag: 'LagosLife', count: '120k' },
  { id: 2, tag: 'TechAmebo', count: '85k' },
  { id: 3, tag: 'Wizkid', count: '200k' },
  { id: 4, tag: 'CampusGist', count: '45k' },
];

const SUGGESTED_DATA = [
  { id: 1, name: 'Tunde Voltage', bio: 'Tech & Vibes', img: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Chioma Gist', bio: 'Entertainment', img: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Derick Dev', bio: 'Building things', img: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Aisha Law', bio: 'Opinionated', img: 'https://i.pravatar.cc/150?u=4' },
];

// Open/Closed: These sub-components are focused and reusable
const TrendingCard = () => (
  <div className="right-rail-card">
    <div className="rail-card-header">
      <div className="header-title">
        <Flame size={18} className="text-orange" />
        <span>Top Trending</span>
      </div>
      <MoreHorizontal size={18} className="text-muted" />
    </div>
    <div className="rail-card-content">
      {TRENDING_DATA.map((item) => (
        <div key={item.id} className="trend-row">
          <Hash size={14} className="text-muted" />
          <div className="trend-details">
            <span className="trend-name">#{item.tag}</span>
            <span className="trend-meta">{item.count} amebo</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SuggestedCard = () => (
  <div className="right-rail-card suggested-internal-scroll">
    <div className="rail-card-header">
      <div className="header-title">
        <span>Suggested</span>
      </div>
    </div>
    <div className="rail-card-content scrollable-area">
      {SUGGESTED_DATA.map((user) => (
        <div key={user.id} className="suggested-row">
          <img src={user.img} alt={user.name} className="user-avatar-sm" />
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-bio">{user.bio}</span>
          </div>
          <button className="follow-action-btn">
            <UserPlus size={14} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default function TrendingRightRail() {
  return (
    <div className="right-rail-container">
      <TrendingCard />
      <SuggestedCard />
    </div>
  );
}