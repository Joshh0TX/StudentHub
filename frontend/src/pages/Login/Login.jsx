import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (isLogin) {
      navigate("/newsroom");
    } else {
      navigate("/onboard");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="logo">🎓 Student<span style={{color:'#3B82F6'}}>Hub</span></h1>

        {/* Toggle Tabs */}
        <div className="tabs">
          <button
            className={isLogin ? "tab active" : "tab"}
            onClick={() => setIsLogin(true)}
            style={{margin:'5px',borderRadius:'10px', boxShadow:'none'}}
          >
            Sign In
          </button>
          <button
            className={!isLogin ? "tab active" : "tab"}
            onClick={() => setIsLogin(false)}
            style={{margin:'5px', borderRadius:'10px', boxShadow:'none'}}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="you@school.edu"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={handleChange}
                required
              />
            </div>
          )}

          {isLogin && (
            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span className="forgot">Forgot password?</span>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? "Sign In →" : "Create Account"}
          </button>
        </form>

        <p className="bottom-text">
          {isLogin ? (
            <>
              New to Students Hub?{" "}
              <span onClick={() => setIsLogin(false)} style={{color:'#3B82F6'}}>
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)} style={{color:'#3B82F6'}}>Sign In</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;