import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import "./topNavBar.css";

export default function TopNavbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className="top-navbar">
      {/* Left side */}
      <div className="navbar-left">
        <h1 className="logo">StudentHub</h1>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}