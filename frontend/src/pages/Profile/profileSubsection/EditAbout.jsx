import React, { useState } from 'react';
import './EditAbout.css'

export default function EditAbout({ initialData, onSave, onCancel }) {
  // Local state to hold changes before saving
  const [formData, setFormData] = useState({
    bio: initialData.bio || '',
    course: initialData.course || '',
    location: initialData.location || '',
    email: initialData.email || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="info-box about-box editing">
      <div className="box-header">
        <h2>Edit About Details</h2>
      </div>
      
      <div className="edit-form-stack">
        <div className="form-group">
          <label>Bio</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            rows="3" 
          />
        </div>

        <div className="input-grid">
          <div className="form-group">
            <label>Course</label>
            <input 
              name="course" 
              value={formData.course} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="edit-about-actions">
        <button className="btn-cancel-link" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-save-bio" onClick={() => onSave(formData)}>
          Save Changes
        </button>
      </div>
    </div>
  );
}