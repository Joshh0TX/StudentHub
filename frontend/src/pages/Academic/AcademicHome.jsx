import { useState } from "react";
import "./AcademicHome.css";
import { Outlet, NavLink } from "react-router-dom";
import { Users, BookOpen, Link, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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
  const { user } = useAuth();

  // Pre-fill selects from the user's registered department and year
  const [selectedProgram, setSelectedProgram] = useState(
    user?.department || "Computer Science",
  );
  const [selectedYear, setSelectedYear] = useState(user?.year || 1);

  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
    setSelectedYear(1);
  };

  // Pass selection down to pages as URL state
  const navState = { selectedProgram, selectedYear };

  return (
    <>
      <div className="academic-layout">
        {/* ── Top Header ── */}
        <header className="header">
          <div className="brand">
            <span className="brand-sub">
              {selectedProgram} - Year {selectedYear}
            </span>
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
          <NavLink to="/academy/timetables" state={navState}>
            <Calendar size={16} /> Timetables
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
