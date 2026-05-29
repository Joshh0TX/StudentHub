import React, { useState, useEffect, useRef } from 'react';
import { X, Image } from 'lucide-react';
import './projectModel.css';


const ProjectModal = ({ isOpen, onClose, onSave, projectToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        setTitle(projectToEdit.title);
        setDescription(projectToEdit.description);
        setLink(projectToEdit.link || '');
        setImage(projectToEdit.image || null);
      } else {
        setTitle('');
        setDescription('');
        setLink('');
        setImage(null);
      }
    }
  }, [isOpen, projectToEdit]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: projectToEdit ? projectToEdit.id : Date.now(),
      title,
      description,
      link,
      image
    });
    onClose();
  };

  return (
    <div className="modal-overlay-backdrop">
      <div className="modal-sheet-container" style={{ maxWidth: '500px' }}>
        
        <div className="modal-sheet-header">
          <h2>{projectToEdit ? 'Edit Project Profiles' : 'Register New Deployment'}</h2>
          <button type="button" onClick={onClose} className="modal-close-naked-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-scroll-body" style={{ gap: '16px' }}>
          
          <div className="modal-input-field">
            <label>Project Cover Image Preview</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{
                width: '100%',
                height: '140px',
                backgroundColor: 'var(--btn-toggle-bg)',
                border: '1px dashed var(--border-card)',
                borderRadius: '12px',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {image ? (
                /* FIX: Changed object-fit to camelCase objectFit */
                <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <Image size={20} strokeWidth={1.5} />
                  <span>Upload Showcase Canvas</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
          </div>

          <div className="modal-input-field">
            <label>Project Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Stuudo Platform Campus Hub" required />
          </div>

          <div className="modal-input-field">
            <label>Documentation Logs (Description)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide core development architecture details and feature parameters..." rows={4} required />
          </div>

          <div className="modal-input-field">
            <label>Live Deployment Endpoint URL</label>
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://yourdeployedapp.com" />
          </div>

          <div className="modal-sheet-footer" style={{ padding: '8px 0 0 0', borderTop: 'none' }}>
            <button type="button" onClick={onClose} className="modal-cancel-btn">Cancel</button>
            <button type="submit" className="modal-save-submit-btn">Save Deployment</button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ProjectModal;