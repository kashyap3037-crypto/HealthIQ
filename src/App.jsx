import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ResultPage from './pages/ResultPage.jsx'

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

        {/* ── Minimalist Branding ── */}
        <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 100 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem'
            }}>🩺</div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em' }}>
              Health<span style={{ color: 'var(--primary)' }}>IQ</span>
            </span>
          </Link>
        </div>

        {/* ── Dark Mode Toggle ── */}
        <button 
          onClick={toggleTheme}
          style={{
            position: 'absolute', top: '1.75rem', right: '2rem', zIndex: 100,
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '0.75rem', width: '2.5rem', height: '2.5rem', fontSize: '1.125rem',
            color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)'
          }}
          title="Toggle Dark Mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disease/:name" element={<ResultPage />} />
          {/* Fallback for safety */}
          <Route path="*" element={<Home />} />
        </Routes>

      </div>
    </Router>
  )
}
