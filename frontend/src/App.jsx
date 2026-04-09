import { Route, Routes } from "react-router-dom";
import "./App.css";
import AcademicHome from "./pages/Academic/AcademicHome";
import StudyMaterials from "./pages/Academic/StudyMaterials";
import StudyGroups from "./pages/Academic/StudyGroups";
import ExamSchedule from "./pages/Academic/ExamSchedule";
import Resources from "./pages/Academic/Resources";
import Login from "./pages/Login/Login.jsx";
import Onboard from "./pages/Onboarding/Onboard.jsx";
import MarketHome from "./pages/Marketplace/MarketHome.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Onboard" element={<Onboard />} />
      <Route path="/marketplace" element={<MarketHome />} />
      <Route path="/academy" element={<AcademicHome />}>
        <Route index element={<StudyMaterials />} />
        <Route path="study-materials" element={<StudyMaterials />} />
        <Route path="study-groups" element={<StudyGroups />} />
        <Route path="exam-schedule" element={<ExamSchedule />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
