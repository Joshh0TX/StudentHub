import { Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login.jsx'
import Onboard from "./pages/Onboarding/Onboard.jsx";
function App() {


  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/Onboard" element={<Onboard />} />
    </Routes>
  )
}

export default App;