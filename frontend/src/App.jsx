import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout/Layout.jsx";
import AcademicHome from "./pages/Academic/AcademicHome";
import StudyGroups from "./pages/Academic/StudyGroups";
import GroupDetail from "./pages/Academic/GroupDetail";
import ExamSchedule from "./pages/Academic/ExamSchedule";
import Resources from "./pages/Academic/Resources";
import Login from "./pages/Login/Login.jsx";
import Onboard from "./pages/Onboarding/Onboard.jsx";
import MarketHome from "./pages/Marketplace/MarketHome.jsx";
import Storefront from "./pages/Marketplace/Storefront.jsx";
import ProductDetail from "./pages/Marketplace/ProductDetail.jsx";
import StoreView from "./pages/Marketplace/StoreView.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import NewsHome from "./pages/Newsroom/NewsHome.jsx";
import Timetable from "./pages/Academic/Timetable.jsx";

function App() {
  return (
    <Routes>
      {/* These pages have NO bottom nav */}
      <Route path="/" element={<Login />} />
      <Route path="/onboard" element={<Onboard />} />

      {/* Everything inside Layout gets the bottom nav */}
      <Route element={<Layout />}>
        <Route path="/marketplace" element={<MarketHome />} />
        <Route path="/marketplace/:productId" element={<ProductDetail />} />
        <Route path="/store/:storeId" element={<StoreView />} />
        <Route path="/storefront" element={<Storefront />} />
        <Route path="/academy" element={<AcademicHome />}>
          <Route index element={<Timetable />} />
          <Route path="timetables" element={<Timetable />} />
          <Route path="study-groups" element={<StudyGroups />} />
          <Route path="study-groups/:id" element={<GroupDetail />} />
          <Route path="exam-schedule" element={<ExamSchedule />} />
          <Route path="resources" element={<Resources />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/newsroom" element={<NewsHome />} />
      </Route>
    </Routes>
  );
}

export default App;
