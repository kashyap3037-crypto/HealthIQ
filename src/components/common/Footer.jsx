
export default function Footer() {
  return (
    <footer style={{
      padding: '5rem 0 3rem',
      background: 'var(--white)',
      borderTop: '1px solid var(--border-color)',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '1.5rem', opacity: 0.8 }}>
          <div style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', color: '#fff'
          }}>🩺</div>
          <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>
            Health<span style={{ color: 'var(--primary)' }}>IQ</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Terms</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Contact</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>GitHub</a>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          © {new Date().getFullYear()} HealthIQ AI. This platform provides AI-generated health information and is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </footer>
  )
}
