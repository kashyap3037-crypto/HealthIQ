import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar.jsx'
import Home from './pages/Home.jsx'
import ResultPage from './pages/ResultPage.jsx'
import RemediesPage from './pages/RemediesPage.jsx'

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-main)', 
        color: 'var(--text-main)', 
        position: 'relative',
        transition: 'background 0.3s, color 0.3s'
      }}>
        
        <style>{`
          @keyframes spin    { to { transform: rotate(360deg); } }
          @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
          .fade-in { animation: fadeUp 0.4s ease forwards; }
        `}</style>

        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disease/:name" element={<ResultPage />} />
          <Route path="/remedies" element={<RemediesPage />} />
          <Route path="*" element={<Home />} />
        </Routes>

      </div>
    </Router>
  )
}
