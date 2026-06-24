import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Uploads from "./pages/Uploads";
import Settings from "./pages/Settings";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/uploads" element={<Uploads />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;