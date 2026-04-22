import React, { useEffect, useState } from 'react';
import './SkillsManager.css';
import { FaXmark, FaPlus, FaTrash, FaGripLines } from 'react-icons/fa6';

export default function SkillsManager({ isOpen, skills = [], onSave, onClose }) {
  const [draftSkills, setDraftSkills] = useState(Array.isArray(skills) ? skills : []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(60);

  useEffect(() => {
    if (isOpen) {
      setDraftSkills(Array.isArray(skills) ? skills.map(s => ({ ...s })) : []);
      setNewSkillName('');
      setNewSkillLevel(60);
    }
  }, [isOpen, skills]);

  if (!isOpen) return null;

  const coreCount = draftSkills.filter(s => s.core).length;

  const toggleCore = (id) => {
    setDraftSkills((current) =>
      current.map((s) => {
        if (s.id !== id) return s;
        if (!s.core && coreCount >= 4) return s; // limit 4 cores
        return { ...s, core: !s.core };
      })
    );
  };

  const updateLevel = (id, level) => {
    const clamped = Math.max(0, Math.min(100, Number(level)));
    setDraftSkills((curr) => curr.map(s => s.id === id ? { ...s, level: clamped } : s));
  };

  const updateName = (id, name) => {
    setDraftSkills((curr) => curr.map(s => s.id === id ? { ...s, name } : s));
  };

  const handleAdd = () => {
    const name = newSkillName.trim();
    if (!name) return;
    const nextId = Date.now();
    setDraftSkills((curr) => [
      ...curr,
      { id: nextId, name, level: Number(newSkillLevel) || 0, core: coreCount < 4 },
    ]);
    setNewSkillName('');
    setNewSkillLevel(60);
  };

  const handleRemove = (id) => {
    setDraftSkills((curr) => curr.filter(s => s.id !== id));
  };

  const handleSave = () => {
    onSave(draftSkills);
  };

  return (
    <div className="skills-overlay" onClick={onClose}>
      <div className="skills-modal" onClick={(e) => e.stopPropagation()}>
        <div className="skills-header">
          <div>
            <h2>Manage Skills</h2>
            <p>Add skills, update proficiency and choose up to 4 core skills to display on your profile.</p>
          </div>
          <button className="close-btn" onClick={onClose}><FaXmark /></button>
        </div>

        <div className="skills-body">
          <section className="add-skill">
            <h3>Add Skill</h3>
            <div className="add-row">
              <input placeholder="Skill name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} />
              <input type="number" min={0} max={100} value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} />
              <button className="add-btn" onClick={handleAdd}><FaPlus /> Add</button>
            </div>
            <p className="hint">Tip: You can mark up to 4 skills as "core" — these show on your profile.</p>
          </section>

          <section className="skills-list-panel">
            <h3>Your Skills</h3>
            <div className="skills-list">
              {draftSkills.map((s) => (
                <div key={s.id} className="skill-row">
                  <div className="drag-handle"><FaGripLines /></div>
                  <input className="name-input" value={s.name} onChange={(e) => updateName(s.id, e.target.value)} />
                  <div className="level-column">
                    <input type="range" min={0} max={100} value={s.level} onChange={(e) => updateLevel(s.id, e.target.value)} />
                    <input type="number" min={0} max={100} value={s.level} onChange={(e) => updateLevel(s.id, e.target.value)} />
                  </div>
                  <button className={`core-btn ${s.core ? 'active' : ''}`} onClick={() => toggleCore(s.id)}>{s.core ? 'Core' : 'Make Core'}</button>
                  <button className="remove-btn" onClick={() => handleRemove(s.id)} aria-label="Remove skill"><FaTrash /></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="skills-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
