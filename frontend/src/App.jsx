import { Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login.jsx'
import Onboard from "./pages/Onboarding/Onboard.jsx";
import MarketHome from './pages/Marketplace/MarketHome.jsx';
function App() {


  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/Onboard" element={<Onboard />} />
      <Route path="/marketplace" element={<MarketHome />} />
    </Routes>
  )
}

export default App;