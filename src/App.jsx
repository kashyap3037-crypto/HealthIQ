import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ResultPage from './pages/ResultPage.jsx'

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
        
        <style>{`
          @keyframes spin    { to { transform: rotate(360deg); } }
          @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
          .fade-in { animation: fadeUp 0.4s ease forwards; }
        `}</style>

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
