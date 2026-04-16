
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Remedies', path: '/remedies' }
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: '1.25rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 2.5rem)',
      maxWidth: '1200px',
      zIndex: 1000,
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      borderRadius: '1.25rem',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* ── Logo ── */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{
          width: '2rem', height: '2rem', borderRadius: '0.6rem',
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.125rem', boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
        }}>🩺</div>
        <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em' }}>
          Health<span style={{ color: 'var(--primary)' }}>IQ</span>
        </span>
      </Link>

      {/* ── Links & Toggle ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0,0,0,0.03)', 
          padding: '0.25rem', 
          borderRadius: '0.75rem',
          marginRight: '0.5rem'
        }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.6rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  transition: '0.3s',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--bg-main)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
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
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-main)',
            color: 'var(--text-main)',
            fontSize: '1.125rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: '0.3s transform'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  )
}
