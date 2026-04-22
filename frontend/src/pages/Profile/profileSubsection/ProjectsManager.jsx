import React, { useEffect, useState, useRef } from 'react';
import './ProjectsManager.css';
import { FaXmark, FaPlus, FaTrash, FaImage } from 'react-icons/fa6';

export default function ProjectsManager({ isOpen, projects = [], onSave, onClose }) {
  const [draft, setDraft] = useState(Array.isArray(projects) ? projects.map(p=>({...p})) : []);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(Array.isArray(projects) ? projects.map(p=>({ ...p })) : []);
      setEditingId(null);
    }
  }, [isOpen, projects]);

  if (!isOpen) return null;

  const addNew = () => {
    const next = {
      id: Date.now(),
      title: 'New Project',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      description: 'Describe your project...',
      skills: [],
    };
    setDraft((d) => [next, ...d]);
    setEditingId(next.id);
  };

  const removeProject = (id) => {
    setDraft((d) => d.filter(p => p.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateField = (id, field, value) => {
    setDraft((d) => d.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addSkill = (id, skill) => {
    const s = skill.trim();
    if (!s) return;
    setDraft((d) => d.map(p => p.id === id ? { ...p, skills: Array.from(new Set([...(p.skills||[]), s])) } : p));
  };

  const removeSkill = (id, skill) => {
    setDraft((d) => d.map(p => p.id === id ? { ...p, skills: (p.skills||[]).filter(s => s !== skill) } : p));
  };

  const handleImageFile = (id, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateField(id, 'image', url);
  };

  const handleSave = () => {
    onSave(draft.map((p, i) => ({ ...p, id: p.id || i + 1 })));
  };

  return (
    <div className="projects-overlay" onClick={onClose}>
      <div className="projects-modal" onClick={(e) => e.stopPropagation()}>
        <div className="projects-header">
          <div>
            <h2>Projects & Portfolios</h2>
            <p>Edit existing projects or create new ones. Add skill tags and images.</p>
          </div>
          <div className="header-actions">
            <button className="add-btn" onClick={addNew}><FaPlus /> New Project</button>
            <button className="close-btn" onClick={onClose}><FaXmark /></button>
          </div>
        </div>

        <div className="projects-body">
          <aside className="project-list">
            {draft.map((p) => (
              <button key={p.id} className={`project-list-item ${editingId===p.id? 'active':''}`} onClick={() => setEditingId(p.id)}>
                <img src={p.image} alt={p.title} />
                <div>
                  <strong>{p.title}</strong>
                  <span>{(p.description || '').slice(0, 60)}</span>
                </div>
                <button className="remove-inline" onClick={(e) => { e.stopPropagation(); removeProject(p.id); }} aria-label="Remove project"><FaTrash /></button>
              </button>
            ))}
          </aside>

          <section className="project-editor">
            {editingId == null ? (
              <div className="empty-edit">Select a project or create a new one to edit.</div>
            ) : (
              draft.filter(p => p.id === editingId).map((p) => (
                <div key={p.id} className="editor-card">
                  <div className="image-row">
                    <img src={p.image} alt={p.title} />
                    <div className="image-controls">
                      <input type="file" accept="image/*" style={{display:'none'}} ref={fileInputRef} onChange={(e)=> handleImageFile(p.id, e.target.files?.[0])} />
                      <button onClick={() => fileInputRef.current?.click()} className="btn">Upload Image</button>
                      <button onClick={() => updateField(p.id, 'image', '')} className="btn">Clear</button>
                    </div>
                  </div>

                  <label>Title</label>
                  <input value={p.title} onChange={(e)=> updateField(p.id, 'title', e.target.value)} />

                  <label>Description</label>
                  <textarea value={p.description} onChange={(e)=> updateField(p.id, 'description', e.target.value)} />

                  <label>Skill Tags</label>
                  <div className="tags-row">
                    {(p.skills||[]).map((s, idx) => (
                      <span key={idx} className="tag-pill">{s} <button className="tag-x" onClick={()=> removeSkill(p.id, s)}>×</button></span>
                    ))}
                  </div>

                  <div className="add-tag-row">
                    <input placeholder="Add tag e.g. React" onKeyDown={(e)=>{
                      if(e.key === 'Enter') { addSkill(p.id, e.target.value); e.target.value = ''; }
                    }} />
                    <button className="btn" onClick={(e)=>{
                      const input = e.target.previousElementSibling; if(input) { addSkill(p.id, input.value); input.value=''; }
                    }}>Add Tag</button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        <div className="projects-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
