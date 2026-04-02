import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Onboard.css';


const Onboard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    institution: "",
    course: "",
    interests: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to localStorage for now (replace with backend later)
    localStorage.setItem("userOnboarding", JSON.stringify(formData));

    // Navigate to profile
    navigate("/profile");
  };

  return (
    <div className="onboarding-container">
      <h2>Let’s personalize your experience</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="institution"
          placeholder="Your Institution"
          value={formData.institution}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Your Course / Program"
          value={formData.course}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="interests"
          placeholder="Your Interests (comma separated)"
          value={formData.interests}
          onChange={handleChange}
        />

        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default Onboard;