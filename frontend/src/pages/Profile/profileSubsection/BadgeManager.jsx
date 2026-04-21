import React, { useEffect, useState } from 'react';
import './BadgeManager.css';
import {
  FaXmark,
  FaPlus,
  FaCircleCheck,
  FaAward,
  FaTrophy,
  FaStar,
  FaBolt,
  FaMedal,
  FaGithub,
  FaCode,
  FaUsers,
  FaBook,
  FaReact,
  FaShieldHalved,
} from 'react-icons/fa6';

const ICON_COMPONENTS = {
  FaAward,
  FaTrophy,
  FaStar,
  FaBolt,
  FaMedal,
  FaGithub,
  FaCode,
  FaUsers,
  FaBook,
  FaReact,
  FaShieldHalved,
};

export default function BadgeManager({
  isOpen,
  badges = [],
  achievements = [],
  iconOptions = [],
  onSave,
  onClose,
}) {
  const [draftBadges, setDraftBadges] = useState(Array.isArray(badges) ? badges : []);
  const [badgeName, setBadgeName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]?.key || 'FaAward');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDraftBadges(Array.isArray(badges) ? badges : []);
      setBadgeName('');
      setSelectedIcon(iconOptions[0]?.key || 'FaAward');
      setSearchTerm('');
    }
  }, [isOpen, badges, iconOptions]);

  if (!isOpen) {
    return null;
  }

  const visibleIconOptions = iconOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBadgeSelection = (id) => {
    setDraftBadges((currentBadges) =>
      currentBadges.map((badge) => {
        if (badge.id !== id) {
          return badge;
        }

        const selectedCount = currentBadges.filter((entry) => entry.selected).length;

        if (!badge.selected && selectedCount >= 4) {
          return badge;
        }

        return { ...badge, selected: !badge.selected };
      })
    );
  };

  const handleAddBadge = () => {
    if (!badgeName.trim()) {
      return;
    }

    const selectedIconOption = iconOptions.find((option) => option.key === selectedIcon) || iconOptions[0];

    setDraftBadges((currentBadges) => [
      ...currentBadges,
      {
        id: Date.now(),
        name: badgeName.trim(),
        icon: selectedIconOption?.key || 'FaAward',
        color: selectedIconOption?.color || '#3b82f6',
        selected: currentBadges.filter((badge) => badge.selected).length < 4,
      },
    ]);

    setBadgeName('');
    setSelectedIcon(iconOptions[0]?.key || 'FaAward');
  };

  const handleSave = () => {
    onSave(draftBadges);
  };

  return (
    <div className="badge-manager-overlay" onClick={onClose}>
      <div className="badge-manager-modal" onClick={(event) => event.stopPropagation()}>
        <div className="manager-header">
          <div>
            <h2>Badges & Achievements</h2>
            <p>Pick an icon, name the achievement, and choose which badges show on your profile.</p>
          </div>
          <button type="button" className="badge-close-btn" onClick={onClose} aria-label="Close badge editor">
            <FaXmark />
          </button>
        </div>

        <div className="manager-body">
          <section className="creation-panel">
            <h3>Add Badge</h3>
            <label className="field-label" htmlFor="badge-name">Achievement name</label>
            <input
              id="badge-name"
              type="text"
              placeholder="E.g. Hackathon Winner"
              value={badgeName}
              onChange={(event) => setBadgeName(event.target.value)}
            />

            <div className="icon-picker-block">
              <div className="section-row">
                <span className="field-label">Choose an icon</span>
                <input
                  type="search"
                  placeholder="Search icons"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="icon-grid">
                {visibleIconOptions.map((option) => {
                  const Icon = ICON_COMPONENTS[option.key] || FaAward;
                  const isActive = selectedIcon === option.key;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      className={`icon-option ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedIcon(option.key)}
                      aria-pressed={isActive}
                      title={option.label}
                    >
                      <Icon style={{ color: option.color }} />
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="button" className="add-badge-btn" onClick={handleAddBadge}>
              <FaPlus /> Add to collection
            </button>
          </section>

          <section className="inventory-panel">
            <h3>Your Badges</h3>
            <p className="subtitle">Click a badge to show or hide it on the profile.</p>
            <div className="inventory-list">
              {draftBadges.map((badge) => {
                const Icon = ICON_COMPONENTS[badge.icon] || FaCircleCheck;
                const isSelected = Boolean(badge.selected);

                return (
                  <button
                    key={badge.id}
                    type="button"
                    className={`inventory-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleBadgeSelection(badge.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="card-icon" style={{ color: badge.color || '#3b82f6' }}>
                      <Icon />
                    </span>
                    <span className="card-info">
                      <strong>{badge.name}</strong>
                    </span>
                    <span className="selection-indicator">
                      {isSelected ? 'Displayed' : 'Hidden'}
                    </span>
                  </button>
                );
              })}

              <div className="inventory-summary">
                <strong>Achievements</strong>
                <ul>
                  {achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="manager-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}