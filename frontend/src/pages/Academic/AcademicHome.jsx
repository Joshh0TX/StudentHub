import React from "react";
import "./AcademicHome.css";
import { Outlet, NavLink } from "react-router-dom";
import { BookText, Users, BookOpen, Link } from "lucide-react";

export default function AcademicHome() {
  return (
    <>
      <div className="academic-layout">
        {/* ── Top Header ── */}
        <header className="header">
          <div className="brand">
            <div className="brand-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">Study Corner</span>
              <span className="brand-sub">Computer Science - Year 2</span>
            </div>
          </div>

          <div className="program-badge">
            Computer Science, Year 2
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </header>

        {/* ── Tab Navigation ── */}
        <nav className="tab-nav">
          <NavLink to="/academy/study-materials">
            <BookText size={16} /> Study Materials
          </NavLink>
          <NavLink to="/academy/study-groups">
            <Users size={16} /> Study Groups
          </NavLink>
          <NavLink to="/academy/exam-schedule">
            <BookOpen size={16} /> Exam Schedule
          </NavLink>
          <NavLink to="/academy/resources">
            <Link size={16} /> Resources
          </NavLink>
        </nav>

        {/* ── Page Content ── */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
