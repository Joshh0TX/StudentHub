import React from 'react';
import { Plus, Award, Trophy, ShieldCheck, Medal, PenLine, Trash2 } from 'lucide-react';
import './achievementsTab.css';

const AchievementsTab = ({ isOwner, achievementsData, onOpenAddModal, onOpenEditModal, onDeleteAchievement }) => {
  
  // Icon switcher resolver based on form selections
  const renderBadgeIcon = (type) => {
    switch (type) {
      case 'trophy': return <Trophy size={20} strokeWidth={1.8} />;
      case 'security': return <ShieldCheck size={20} strokeWidth={1.8} />;
      case 'medal': return <Medal size={20} strokeWidth={1.8} />;
      default: return <Award size={20} strokeWidth={1.8} />;
    }
  };

  return (
    <div className="achievements-tab-wrapper">
      
      {/* Tab Master Header Module */}
      <div className="achievements-tab-master-header">
        <h2>Achievements</h2>
        {isOwner && (
          <button className="achievements-master-add-naked-btn" onClick={onOpenAddModal} aria-label="Add achievement entry">
            <Plus className="master-add-svg" />
          </button>
        )}
      </div>

      {/* Stacked Showcase Canvas List */}
      <div className="achievements-timeline-track">
        {achievementsData && achievementsData.length > 0 ? (
          achievementsData.map((item, index) => (
  <div key={item.id ?? index} className="achievement-showcase-row">
              
              <div className="achievement-left-content-core">
                {/* Render corresponding visual portfolio badge */}
                <div className="achievement-visual-badge-frame">
                  {renderBadgeIcon(item.badgeType)}
                </div>
                
                <div className="achievement-text-details">
                  <h4>{item.title || "Untitled Achievement"}</h4>
                  <p>{item.issuer || "No registration tracking authority recorded."}</p>
                  <span className="achievement-meta-plain-text">{item.meta || "General Milestone"}</span>
                </div>
              </div>

              {/* CONDITIONAL ACTIONS: Exposed strictly to authorized Profile Owners */}
              {isOwner && (
                <div className="achievement-row-right-actions">
                  <button className="achieve-inline-naked-btn" onClick={() => onOpenEditModal(item)} aria-label="Edit achievement">
                    <PenLine size={14} />
                  </button>
                  <button className="achieve-inline-naked-btn delete-type" onClick={() => onDeleteAchievement(item.id)} aria-label="Delete achievement">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="placeholder-panel-text" style={{ padding: '40px 0', textAlign: 'center' }}>
            <p>No credential or tracking milestones registered for this category profile yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AchievementsTab;