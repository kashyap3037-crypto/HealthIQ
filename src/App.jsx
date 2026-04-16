import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ResultPage from './pages/ResultPage.jsx'

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', position: 'relative' }}>
        
        <style>{`
          @keyframes spin    { to { transform: rotate(360deg); } }
          @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
          .fade-in { animation: fadeUp 0.4s ease forwards; }
        `}</style>

        {/* ── Minimalist Branding in Corner ── */}
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
