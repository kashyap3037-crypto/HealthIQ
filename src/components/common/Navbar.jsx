
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Remedies', path: '/remedies' }
  ]

  return (
    <nav className="navbar" style={{
      position: 'fixed',
      top: '1.25rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 1.5rem)',
      maxWidth: '1200px',
      zIndex: 2000,
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      borderRadius: '1.25rem',
      padding: '0.625rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.4s ease'
    }}>
      {/* ── Logo ── */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem',
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
        }}>🩺</div>
        <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em' }}>
          Health<span style={{ color: 'var(--primary)' }}>IQ</span>
        </span>
      </Link>

      {/* ── Links & Toggle ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0,0,0,0.03)', 
          padding: '0.2rem', 
          borderRadius: '0.6rem'
        }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  transition: '0.3s',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--bg-main)' : 'transparent',
                }}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        <button
          onClick={toggleTheme}
          style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '0.6rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-main)',
            color: 'var(--text-main)',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .navbar { 
            padding: 0.5rem 1rem !important;
            top: 0.75rem !important;
          }
          .navbar span { display: none; }
          .navbar a { font-size: 0.7rem !important; padding: 0.3rem 0.6rem !important; }
        }
      `}</style>
    </nav>
  )
}
