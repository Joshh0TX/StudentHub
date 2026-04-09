import { useState } from "react";
import "./AcademicHome.css";
import { Outlet, NavLink } from "react-router-dom";
import { BookText, Users, BookOpen, Link } from "lucide-react";
import TopNavbar from "../../components/topNavBar";

const programs = {
  Accounting: { years: [1, 2, 3] },
  Agriculture: { years: [1, 2, 3] },
  Anatomy: { years: [1, 2, 3] },
  Biochemistry: { years: [1, 2, 3] },
  Biology: { years: [1, 2, 3] },
  "Business Administration": { years: [1, 2, 3] },
  "Business Education": { years: [1, 2, 3] },
  Chemistry: { years: [1, 2, 3] },
  "Computer Science": { years: [1, 2, 3] },
  Economics: { years: [1, 2, 3] },
  "Education and English Language": { years: [1, 2, 3] },
  "Educational Administration and Planning": { years: [1, 2, 3] },
  "English and Literary Studies": { years: [1, 2, 3] },
  "English Studies": { years: [1, 2, 3] },
  Finance: { years: [1, 2, 3] },
  French: { years: [1, 2, 3] },
  "French and International Relations": { years: [1, 2, 3] },
  "Guidance and Counseling": { years: [1, 2, 3] },
  "History and International Studies": { years: [1, 2, 3] },
  "Information Resource Management": { years: [1, 2, 3] },
  "Information Technology": { years: [1, 2, 3] },
  Law: { years: [1, 2, 3] },
  Marketing: { years: [1, 2, 3] },
  "Mass Communication": { years: [1, 2, 3] },
  Mathematics: { years: [1, 2, 3] },
  "Medical Laboratory Science": { years: [1, 2, 3] },
  "Medicine and Surgery": { years: [1, 2, 3] },
  Microbiology: { years: [1, 2, 3] },
  Music: { years: [1, 2, 3] },
  "Nursing Science": { years: [1, 2, 3] },
  "Nutrition and Dietics": { years: [1, 2, 3] },
  "Physics with Electronics": { years: [1, 2, 3] },
  Physiology: { years: [1, 2, 3] },
  "Political Science": { years: [1, 2, 3] },
  "Political Science / International Law and Diplomacy": { years: [1, 2, 3] },
  "Public Administration": { years: [1, 2, 3] },
  "Public Health": { years: [1, 2, 3] },
  "Religious Studies": { years: [1, 2, 3] },
  "Social Works": { years: [1, 2, 3] },
  "Software Engineering": { years: [1, 2, 3] },
  "Teaching Education Science": { years: [1, 2, 3] },
  "Christain Religious Studies (CRS)": { years: [1, 2, 3] },
};

export default function AcademicHome() {
  const [selectedProgram, setSelectedProgram] = useState("Agriculture");
  const [selectedYear, setSelectedYear] = useState(1);

  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
    setSelectedYear(1);
  };

  // Pass selection down to pages as URL state
  const navState = { selectedProgram, selectedYear };

  return (
    <>
      <div className="academic-layout">
        <TopNavbar />
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
              <span className="brand-sub">
                {selectedProgram} - Year {selectedYear}
              </span>
            </div>
          </div>
          <div className="program-selects">
            <select
              className="program-select"
              value={selectedProgram}
              onChange={handleProgramChange}
            >
              {Object.keys(programs).map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>

            <select
              className="program-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {programs[selectedProgram].years.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* ── Tab Navigation ── */}
        <nav className="tab-nav">
          <NavLink to="/academy/study-materials" state={navState}>
            <BookText size={16} /> Study Materials
          </NavLink>
          <NavLink to="/academy/study-groups" state={navState}>
            <Users size={16} /> Study Groups
          </NavLink>
          <NavLink to="/academy/exam-schedule" state={navState}>
            <BookOpen size={16} /> Exam Schedule
          </NavLink>
          <NavLink to="/academy/resources" state={navState}>
            <Link size={16} /> Resources
          </NavLink>
        </nav>

        {/* ── Page Content ── */}
        <main className="page-content">
          <Outlet context={{ selectedProgram, selectedYear }} />
        </main>
      </div>
    </>
  );
}
