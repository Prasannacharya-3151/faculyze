import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegisterFormDemo from './pages/auth/register'
import LoginFormDemo from './pages/auth/login'


function App() {

  return (
  <div>
    <Router>
    <Routes>
      <Route path="/" element={<RegisterFormDemo />} />
      <Route path="/login" element={<LoginFormDemo />} />
    </Routes>
    </Router>
  </div>
  )
}

export default App
