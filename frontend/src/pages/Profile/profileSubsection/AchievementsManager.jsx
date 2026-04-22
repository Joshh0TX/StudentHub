import React, { useEffect, useState } from 'react';
import './AchievementsManager.css';
import { FaXmark, FaPlus, FaTrash } from 'react-icons/fa6';

export default function AchievementsManager({ isOpen, achievements = [], onSave, onClose }) {
  const [draft, setDraft] = useState(Array.isArray(achievements) ? [...achievements] : []);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDraft(Array.isArray(achievements) ? [...achievements] : []);
      setInput('');
    }
  }, [isOpen, achievements]);

  if (!isOpen) return null;

  const handleAdd = () => {
    const v = input.trim();
    if (!v) return;
    setDraft((d) => [...d, v]);
    setInput('');
  };

  const handleRemove = (idx) => {
    setDraft((d) => d.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onSave(draft);
  };

  return (
    <div className="achievements-overlay" onClick={onClose}>
      <div className="achievements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="achievements-header">
          <div>
            <h2>Edit Achievements</h2>
            <p>Add or remove notable achievements shown on your profile.</p>
          </div>
          <button className="close-btn" onClick={onClose}><FaXmark /></button>
        </div>

        <div className="achievements-body">
          <section className="input-panel">
            <label htmlFor="ach-input">Add achievement</label>
            <div className="input-row">
              <input id="ach-input" placeholder="e.g. Winner - Hackathon 2026" value={input} onChange={(e) => setInput(e.target.value)} />
              <button className="add-btn" onClick={handleAdd}><FaPlus /> Add</button>
            </div>
            <p className="hint">These appear on your profile as notable achievements.</p>
          </section>

          <section className="current-list">
            <h3>Your Achievements</h3>
            <div className="achievement-items">
              {draft.map((it, idx) => (
                <div key={idx} className="achievement-item-row">
                  <span className="ach-text">{it}</span>
                  <button className="remove-btn" onClick={() => handleRemove(idx)} aria-label={`Remove ${it}`}><FaTrash /></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="achievements-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
