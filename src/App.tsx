import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegisterFormDemo from './pages/auth/register'
import LoginFormDemo from './pages/auth/login'
import ProfileSetup from './pages/auth/profilesetup'


function App() {

  return (
  <div>
    <Router>
    <Routes>
      <Route path="/" element={<RegisterFormDemo />} />
      <Route path="/login" element={<LoginFormDemo />} />
      <Route path="/profilesetup" element={<ProfileSetup />} />
    </Routes>
    </Router>
  </div>
  )
}

export default App
