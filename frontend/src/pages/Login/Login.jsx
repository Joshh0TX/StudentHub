import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css";
const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }

    alert("Registered successfully");
  };


  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),     
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "/profile";
  };

  return (
    <div className="auth-wrapper">
      <div className="login-branding">
         <h1 className="stuudo-logo">stuudo<span>.</span></h1>
         <p className="login-subtitle">Your campus hub, simplified.</p>
      </div>
      <div className="auth-card">
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

          <div className="input-group password-group">
             <input
               type={showPassword ? "text" : "password"} // Dynamic type
               name="password"
               placeholder="Enter your password"
               onChange={handleChange}
               required
             />
             <button 
               type="button" 
               className="toggle-password"
               onClick={() => setShowPassword(!showPassword)}
             >
               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
           </div>

          {!isLogin && (
            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"} // Using the same state to toggle both
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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
              New to Stuudo?{" "}
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
