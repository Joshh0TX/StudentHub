import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout/Layout.jsx";
import AcademicHome from "./pages/Academic/AcademicHome";
import StudyGroups from "./pages/Academic/StudyGroups";
import GroupDetail from "./pages/Academic/GroupDetail";
import Resources from "./pages/Academic/Resources";
import Login from "./pages/Login/Login.jsx";
import Onboard from "./pages/Onboarding/Onboard.jsx";
import MarketHome from "./pages/Marketplace/MarketHome.jsx";
import Storefront from "./pages/Marketplace/Storefront.jsx";
import ProductDetail from "./pages/Marketplace/ProductDetail.jsx";
import ProductReviews from "./pages/Marketplace/ProductReviews.jsx";
import StoreView from "./pages/Marketplace/StoreView.jsx";
import SearchPage from "./pages/Marketplace/SearchPage.jsx";
import MyOrders from "./pages/Marketplace/MyOrders.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import NewsHome from "./pages/Newsroom/NewsHome.jsx";
import Timetable from "./pages/Academic/Timetable.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx";
import Landing from "./pages/Landing/Landing.jsx";
import NotificationsPage from "./pages/Notifications/NotificationsPage.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";

function App() {
  return (
    <Routes>
      {/* These pages have NO bottom nav */}
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboard" element={<Onboard />} />
      <Route path="/landingpage" element={<Landing/>} />

      {/* Everything inside Layout gets the bottom nav */}
      <Route element={<Layout />}>
        <Route path="/marketplace" element={<MarketHome />} />
        <Route path="/marketplace/search" element={<SearchPage />} />
        <Route path="/marketplace/:productId" element={<ProductDetail />} />
        <Route path="/marketplace/:productId/reviews" element={<ProductReviews />} />
        <Route path="/marketplace/orders" element={<MyOrders />} />
        <Route path="/store/:storeId" element={<StoreView />} />
        <Route path="/storefront" element={<Storefront />} />
        <Route path="/academy" element={<AcademicHome />}>
          <Route index element={<Timetable />} />
          <Route path="timetables" element={<Timetable />} />
          <Route path="study-groups" element={<StudyGroups />} />
          <Route path="study-groups/:id" element={<GroupDetail />} />
          <Route path="resources" element={<Resources />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<NotificationsPage/>} />
        <Route path="/newsroom" element={<NewsHome />} />
      </Route>
    </Routes>
  );
}

export default App;
