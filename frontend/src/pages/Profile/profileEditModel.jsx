import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Plus, Trash2 } from 'lucide-react';
import './profileEditModel.css';

const ProfileEditModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [activeFormTab, setActiveFormTab] = useState('profile');
  const [formData, setFormData] = useState(initialData);

  // with your main state container whenever the modal triggers open.
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
  };

  // --- DYNAMIC ARRAY HANDLING FUNCTIONS ---
  const handleArrayChange = (index, field, value, type) => {
    const updatedArray = [...formData[type]];
    updatedArray[index][field] = value;
    setFormData((prev) => ({ ...prev, [type]: updatedArray }));
  };

  const addArrayItem = (type) => {
    const newItem = type === 'education' 
      ? { id: Date.now(), degree: '', school: '', meta: '' }
      : { id: Date.now(), title: '', authority: '', meta: '' };
    
    setFormData((prev) => ({ ...prev, [type]: [...prev[type], newItem] }));
  };

  const removeArrayItem = (index, type) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [type]: updatedArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay-backdrop">
      <div className="modal-sheet-container large-modal">
        
        {/* Header */}
        <div className="modal-sheet-header">
          <h2>Edit Information</h2>
          <button onClick={onClose} className="modal-close-naked-btn">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="modal-form-tabs-row">
          <button 
            type="button"
            className={`modal-tab-btn ${activeFormTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => setActiveFormTab('profile')}
          >
            <User size={14} />
            <span>Profile Card</span>
          </button>
          <button 
            type="button"
            className={`modal-tab-btn ${activeFormTab === 'about' ? 'is-active' : ''}`}
            onClick={() => setActiveFormTab('about')}
          >
            <BookOpen size={14} />
            <span>About Content</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="modal-form-scroll-body">
          {activeFormTab === 'profile' ? (
            <div className="modal-form-group-cluster">
              <div className="modal-input-field">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="modal-input-field">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="modal-input-field">
                <label>Date of Birth</label>
                <input type="text" name="dob" value={formData.dob} onChange={handleChange} />
              </div>
              <div className="modal-input-field">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div className="modal-input-field">
                <label>LinkedIn Link</label>
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              </div>
              <div className="modal-input-field">
                <label>Instagram Link</label>
                <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} />
              </div>
            </div>
          ) : (
            <div className="modal-form-group-cluster">
              <div className="modal-input-field">
                <label>Overview</label>
                <textarea name="overview" value={formData.overview} onChange={handleChange} rows={4} />
              </div>
              
              <div className="modal-input-field">
                <label>Skills (Comma separated)</label>
                <input type="text" value={formData.skills.join(', ')} onChange={handleSkillsChange} />
              </div>

              {/* DYNAMIC EDUCATION MANAGEMENT */}
              <div className="form-section-header-row">
                <span className="form-section-divider-label">Education History</span>
                <button type="button" onClick={() => addArrayItem('education')} className="form-add-row-btn">
                  <Plus size={14} /> Add School
                </button>
              </div>
              
              {formData.education.map((edu, index) => (
                <div key={edu.id} className="modal-array-repeater-row">
                  <div className="repeater-inputs-grid">
                    <div className="modal-input-field">
                      <input type="text" placeholder="Degree / Course Name" value={edu.degree} onChange={(e) => handleArrayChange(index, 'degree', e.target.value, 'education')} />
                    </div>
                    <div className="modal-input-field">
                      <input type="text" placeholder="University / Institution" value={edu.school} onChange={(e) => handleArrayChange(index, 'school', e.target.value, 'education')} />
                    </div>
                    <div className="modal-input-field">
                      <input type="text" placeholder="Level / Meta Tag (e.g., 400 Level)" value={edu.meta} onChange={(e) => handleArrayChange(index, 'meta', e.target.value, 'education')} />
                    </div>
                  </div>
                  {formData.education.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(index, 'education')} className="form-delete-row-btn">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}

              {/* DYNAMIC CERTIFICATIONS MANAGEMENT */}
              <div className="form-section-header-row">
                <span className="form-section-divider-label">Certifications</span>
                <button type="button" onClick={() => addArrayItem('certifications')} className="form-add-row-btn">
                  <Plus size={14} /> Add Certificate
                </button>
              </div>

              {formData.certifications.map((cert, index) => (
                <div key={cert.id} className="modal-array-repeater-row">
                  <div className="repeater-inputs-grid">
                    <div className="modal-input-field">
                      <input type="text" placeholder="Certification Title" value={cert.title} onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'certifications')} />
                    </div>
                    <div className="modal-input-field">
                      <input type="text" placeholder="Issuing Organization" value={cert.authority} onChange={(e) => handleArrayChange(index, 'authority', e.target.value, 'certifications')} />
                    </div>
                    <div className="modal-input-field">
                      <input type="text" placeholder="Certification Meta Tag" value={cert.meta} onChange={(e) => handleArrayChange(index, 'meta', e.target.value, 'certifications')} />
                    </div>
                  </div>
                  {formData.certifications.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem(index, 'certifications')} className="form-delete-row-btn">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Pinned Action Footer */}
        <div className="modal-sheet-footer">
          <button type="button" onClick={onClose} className="modal-cancel-btn">Cancel</button>
          <button type="button" onClick={handleSubmit} className="modal-save-submit-btn">Save Changes</button>
        </div>

      </div>
    </div>
  );
};

export default ProfileEditModal;