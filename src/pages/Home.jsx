
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUGGESTIONS, TAGLINE, SITE_NAME } from '../config/constants.js'

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(name) {
    const q = (name || query).trim()
    if (!q) return
    navigate(`/disease/${encodeURIComponent(q)}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', overflowX: 'hidden' }}>

      {/* ── Background Decoration ── */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)', zIndex: 0
      }} />

      <main className="container" style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem 8rem' }}>


        {/* ── Hero Section ── */}
        <header style={{ textAlign: 'center', marginBottom: '5rem' }} className="fade-in">
          <h1 style={{ marginBottom: '1.25rem', letterSpacing: '-0.02em', fontSize: '3rem' }}>
            Instant, Accurate & <br />
            <span style={{
              background: 'linear-gradient(to right, #0ea5e9, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Professional</span> Medical Insights
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 3rem', fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {TAGLINE}
          </p>

          {/* ── Search Bar ── */}
          <div className="search-box" style={{
            maxWidth: '720px', margin: '0 auto',
            background: 'var(--white)',
            border: '1px solid var(--border-color)',
            borderRadius: '1.5rem',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', color: 'var(--text-muted)' }}>🔍</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search condition e.g. Hypertension, Malaria..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                padding: '0.75rem 0.5rem', color: 'var(--text-main)', fontSize: '1.125rem', outline: 'none'
              }}
            />
            <button
              onClick={() => handleSearch()}
              style={{
                background: 'var(--primary)', color: 'white', border: 'none',
                borderRadius: '1rem', padding: '0 2.5rem', fontWeight: 700,
                fontSize: '1rem', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(14,165,233,0.2)'
              }}
              className="search-btn"
            >
              Analyze Now
            </button>
          </div>

          {/* Suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', width: '100%', marginBottom: '0.25rem' }}>Popular searches:</span>
            {(SUGGESTIONS || []).map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                style={{
                  background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border-color)',
                  borderRadius: '1rem', padding: '0.5rem 1.25rem', fontSize: '0.875rem',
                  color: 'var(--text-muted)', backdropFilter: 'blur(4px)'
                }}
                className="chip"
              >
                {s}
              </button>
            ))}
          </div>
        </header>

        {/* ── Features ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          {[
            { tag: '🧠', title: 'Clinical Rigor', desc: 'Structured, actionable insights designed to simplify medical understanding' },
            { tag: '⚡', title: 'Lightning Fast', desc: 'Fast, responsive analysis powered by advanced AI for instant clarity.' },
            { tag: '🛡️', title: 'Safe & Private', desc: 'Built with privacy-first principles and responsible AI practices.' }
          ].map((f, i) => (
            <div key={i} style={{
              padding: '2.5rem', background: 'var(--white)', border: '1px solid var(--border-color)',
              borderRadius: '2rem', transition: 'all 0.4s', boxShadow: 'var(--shadow-sm)'
            }} className="feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{f.tag}</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </section>

      </main>


      <style>{`
        .search-box:focus-within {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 6px rgba(14,165,233,0.1) !important;
          transform: translateY(-2px);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(14,165,233,0.4);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05);
        }

        @media (max-width: 640px) {
          header h1 { font-size: 2.25rem; }
          .search-box {
            flex-direction: column !important;
            padding: 0.75rem !important;
            border-radius: 1.5rem !important;
          }
          .search-btn {
             width: 100%;
             padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}
