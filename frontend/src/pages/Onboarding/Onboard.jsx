import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaCamera } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi"; 
import "./Onboard.css";

const OnboardingInfo = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  
  const [formData, setFormData] = useState({
    course: "",
    level: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log("Saving Step 1 Data:", formData);
    navigate("/onboarding/step-2");
  };

  return (
    <div className="auth-wrapper onboarding-wrapper">
      <div className="onboarding-branding">
        <h1 className="stuudo-logo">stuudo<span>.</span></h1>
        <p className="login-subtitle">Let's complete your profile</p>
      </div>

      <div className="auth-card onboarding-card">
        <form onSubmit={handleNext}>
          
          {/* PROFILE UPLOAD */}
          <div className="profile-upload-container">
            <div className="image-preview">
              {profileImage ? (
                <img src={profileImage} alt="Preview" />
              ) : (
                <FaCamera size={30} color="#94a3b8" />
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} id="img-upload" hidden />
              <label htmlFor="img-upload" className="upload-label">+</label>
            </div>
            <p className="upload-text">Upload Profile Picture</p>
          </div>

          {/* ACADEMIC INFO */}
          <div className="input-group">
            <input
              type="text"
              name="course"
              placeholder="Course of Study (e.g., IFT)"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <select name="level" onChange={handleChange} required className="styled-select">
              <option value="" disabled selected>Current Level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
            </select>
          </div>

          {/* CONNECT SOCIALS SECTION (OPTION 3) */}
          <p className="section-label">Connect your socials</p>
          <div className="social-connect-list">
            
            <div className="connect-row">
              <div className="platform-brand">
                <div className="brand-icon ig"><FaInstagram /></div>
                <span>Instagram</span>
              </div>
              <input 
                name="instagram" 
                placeholder="@username" 
                onChange={handleChange} 
              />
            </div>

            <div className="connect-row">
              <div className="platform-brand">
                <div className="brand-icon tw"><FaTwitter /></div>
                <span>Twitter (X)</span>
              </div>
              <input 
                name="twitter" 
                placeholder="@username" 
                onChange={handleChange} 
              />
            </div>

            <div className="connect-row">
              <div className="platform-brand">
                <div className="brand-icon in"><FaLinkedin /></div>
                <span>LinkedIn</span>
              </div>
              <input 
                name="linkedin" 
                placeholder="Profile name/link" 
                onChange={handleChange} 
              />
            </div>

          </div>

          <button type="submit" className="submit-btn next-btn">
            Next Step <HiOutlineArrowRight style={{marginLeft: '8px'}} />
          </button>
        </form>

        <div className="step-indicator">
          <span className="step active"></span>
          <span className="step"></span>
          <span className="step"></span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingInfo;