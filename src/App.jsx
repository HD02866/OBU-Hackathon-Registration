import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import RegistrationPage from './pages/RegistrationPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('obu-dark-mode')
    if (saved !== null) return JSON.parse(saved)
    return true // Default to dark mode
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('obu-dark-mode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <div className="transition-colors duration-300">
      <Routes>
        <Route path="/" element={<RegistrationPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/admin" element={<AdminLoginPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
