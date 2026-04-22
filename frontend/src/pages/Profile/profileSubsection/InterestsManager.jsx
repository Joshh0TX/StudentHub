import React, { useEffect, useState } from 'react';
import './InterestsManager.css';
import { FaXmark, FaPlus, FaTrash } from 'react-icons/fa6';

export default function InterestsManager({ isOpen, interests = [], onSave, onClose }) {
  const [draft, setDraft] = useState(Array.isArray(interests) ? [...interests] : []);
  const [inputValue, setInputValue] = useState('');
  const MAX = 7;

  useEffect(() => {
    if (isOpen) {
      setDraft(Array.isArray(interests) ? [...interests] : []);
      setInputValue('');
    }
  }, [isOpen, interests]);

  if (!isOpen) return null;

  const handleAdd = () => {
    const v = inputValue.trim();
    if (!v) return;
    if (draft.length >= MAX) return;
    if (draft.includes(v)) {
      setInputValue('');
      return;
    }
    setDraft((d) => [...d, v]);
    setInputValue('');
  };

  const handleRemove = (idx) => {
    setDraft((d) => d.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onSave(draft.slice(0, MAX));
  };

  return (
    <div className="interests-overlay" onClick={onClose}>
      <div className="interests-modal" onClick={(e) => e.stopPropagation()}>
        <div className="interests-header">
          <div>
            <h2>Edit Interests</h2>
            <p>Tell us what you like doing for fun. You can have up to {MAX} interests.</p>
          </div>
          <button className="close-btn" onClick={onClose}><FaXmark /></button>
        </div>

        <div className="interests-body">
          <section className="input-panel">
            <label htmlFor="interest-input">What do you like doing for fun?</label>
            <div className="input-row">
              <input id="interest-input" placeholder="e.g. Hiking" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <button className="add-btn" onClick={handleAdd}><FaPlus /> Add</button>
            </div>
            <p className="hint">You can add up to {MAX} interests. Current: {draft.length}/{MAX}.</p>
          </section>

          <section className="current-list">
            <h3>Your Interests</h3>
            <div className="interest-items">
              {draft.map((it, idx) => (
                <div key={idx} className="interest-item">
                  <span>{it}</span>
                  <div className="actions">
                    <button className="remove-btn" onClick={() => handleRemove(idx)} aria-label={`Remove ${it}`}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="interests-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
