import React, { useState } from 'react';
import './EditAbout.css';

export default function EditAbout({ initialData, onSave, onCancel }) {
  // Safeguard against missing nested social links in initialData
  const initialSocials = initialData.socials || {};

  const [formData, setFormData] = useState({
    bio: initialData.bio || '',
    course: initialData.course || '',
    location: initialData.location || '',
    email: initialData.email || '',
    socials: {
      linkedin: initialSocials.linkedin || '',
      instagram: initialSocials.instagram || '',
      github: initialSocials.github || ''
    }
  });

  // Handles top-level inputs (bio, course, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles nested social media links
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // This now includes the socials object
      });

      if (!res.ok) {
        alert("Failed to save changes");
        return;
      }

      onSave(formData);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving.");
    }
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

        {/* --- Socials Section --- */}
        <div className="socials-edit-section">
          <hr className="form-divider" />
          <h3>Social Profiles</h3>
          
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input 
              type="url"
              name="linkedin" 
              placeholder="https://linkedin.com/in/username"
              value={formData.socials.linkedin} 
              onChange={handleSocialChange} 
            />
          </div>

          <div className="form-group">
            <label>Instagram URL</label>
            <input 
              type="url"
              name="instagram" 
              placeholder="https://instagram.com/username"
              value={formData.socials.instagram} 
              onChange={handleSocialChange} 
            />
          </div>

          <div className="form-group">
            <label>GitHub URL</label>
            <input 
              type="url"
              name="github" 
              placeholder="https://github.com/username"
              value={formData.socials.github} 
              onChange={handleSocialChange} 
            />
          </div>
        </div>
      </div>

      <div className="edit-about-actions">
        <button className="btn-cancel-link" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-save-bio" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}