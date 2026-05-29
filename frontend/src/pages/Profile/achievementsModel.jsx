import React, { useState, useEffect } from 'react';
import { X, Award, Trophy, ShieldCheck, Medal } from 'lucide-react';

const AchievementModal = ({ isOpen, onClose, onSave, achievementToEdit }) => {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [meta, setMeta] = useState('');
  const [badgeType, setBadgeType] = useState('award');

  useEffect(() => {
    if (isOpen) {
      if (achievementToEdit) {
        setTitle(achievementToEdit.title);
        setIssuer(achievementToEdit.issuer);
        setMeta(achievementToEdit.meta || '');
        setBadgeType(achievementToEdit.badgeType || 'award');
      } else {
        setTitle('');
        setIssuer('');
        setMeta('');
        setBadgeType('award');
      }
    }
  }, [isOpen, achievementToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: achievementToEdit ? achievementToEdit.id : Date.now(),
      title,
      issuer,
      meta,
      badgeType
    });
    onClose();
  };

  return (
    <div className="modal-overlay-backdrop">
      <div className="modal-sheet-container" style={{ maxWidth: '480px' }}>
        
        <div className="modal-sheet-header">
          <h2>{achievementToEdit ? 'Edit Milestone Entry' : 'Log New Achievement'}</h2>
          <button type="button" onClick={onClose} className="modal-close-naked-btn"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-scroll-body" style={{ gap: '16px' }}>
          
          {/* Badge Visual Picker Option Set */}
          <div className="modal-input-field">
            <label>Select Badge Presentation Format</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {[
                { key: 'award', icon: <Award size={16} />, label: 'Standard' },
                { key: 'trophy', icon: <Trophy size={16} />, label: 'Contest' },
                { key: 'security', icon: <ShieldCheck size={16} />, label: 'Security' },
                { key: 'medal', icon: <Medal size={16} />, label: 'Honor' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setBadgeType(opt.key)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid',
                    fontFamily: 'inherit',
                    fontSize: '11px',
                    cursor: 'pointer',
                    backgroundColor: badgeType === opt.key ? 'transparent' : 'var(--btn-toggle-bg)',
                    borderColor: badgeType === opt.key ? 'var(--accent-color)' : 'var(--border-card)',
                    color: badgeType === opt.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-input-field">
            <label>Milestone Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chair at IEEE SIGHT Chapter" required />
          </div>

          <div className="modal-input-field">
            <label>Issuing Authority / Organization</label>
            <input type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="e.g., IEEE Humanitarian Technology Committee" required />
          </div>

          <div className="modal-input-field">
            <label>Meta Description / Timeline Stamp</label>
            <input type="text" value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="e.g., Executive Committee Leadership • 2026" />
          </div>

          <div className="modal-sheet-footer" style={{ padding: '8px 0 0 0', borderTop: 'none' }}>
            <button type="button" onClick={onClose} className="modal-cancel-btn">Cancel</button>
            <button type="submit" className="modal-save-submit-btn">Save Entry</button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AchievementModal;