
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHomeRemedies } from '../api/gemini.js'
import { LoadingSpinner } from '../components/common/UI.jsx'

const STATIC_REMEDIES = [
  {
    category: "Cough & Throat",
    icon: "🍯",
    items: [
      { name: "Honey & Ginger", use: "Mix 1 spoon honey with ginger juice for instant cough relief.", benefit: "Soothing & Antibacterial" },
      { name: "Salt Water Gargle", use: "Gargle with warm salt water 3 times a day.", benefit: "Reduces throat inflammation" },
      { name: "Turmeric Milk", use: "Drink warm milk with half a spoon of turmeric before bed.", benefit: "Natural antibiotic properties" }
    ]
  },
  {
    category: "Digestion & Nausea",
    icon: "🍃",
    items: [
      { name: "Jeera (Cumin) Water", use: "Boil cumin seeds in water, cool and drink.", benefit: "Relieves bloating & acidity" },
      { name: "Peppermint Tea", use: "Sip warm peppermint tea after meals.", benefit: "Relaxes digestive muscles" },
      { name: "Fennel Seeds", use: "Chew half a spoon of fennel (Saunf) after eating.", benefit: "Prevents indigestion" }
    ]
  }
]

export default function RemediesPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const data = await fetchHomeRemedies(query)
      if (data.error) {
        setError(data.error)
        setResults(null)
      } else {
        setResults(data)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '6rem 1.5rem 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="fade-in">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Natural Home Remedies</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            Find time-tested natural solutions. Enter symptoms in English, Hindi, Gujarati, or Hinglish.
          </p>

          {/* ── Search Bar ── */}
          <form onSubmit={handleSearch} style={{
            maxWidth: '600px', margin: '0 auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '1.25rem',
            padding: '0.5rem',
            display: 'flex',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. 'Bukhar', 'Pet dard', 'Cough'..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                padding: '0.75rem 1rem', color: 'var(--text-main)', fontSize: '1rem', outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--primary)', color: 'white', border: 'none',
                borderRadius: '0.875rem', padding: '0 1.5rem', fontWeight: 700,
                fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>
        </div>

        {loading && <LoadingSpinner />}

        {error && (
            <div style={{ textAlign: 'center', color: '#dc2626', padding: '2rem', background: '#fef2f2', borderRadius: '1rem', border: '1px solid #fee2e2' }}>
                {error}
            </div>
        )}

        {/* ── Dynamic Search Results ── */}
        {!loading && results && (
            <div className="fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🔍</span>
                    <h2 style={{ fontSize: '1.25rem' }}>Remedies for: <span style={{ color: 'var(--primary)' }}>{results.query}</span></h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {results.remedies.map((item, i) => (
                        <div key={i} className="remedy-card">
                            <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>{item.name}</h3>
                            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{item.use}</p>
                            <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>
                                Benefit: {item.benefit}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* ── Initial/Static Content (Only if no results) ── */}
        {!loading && !results && (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {STATIC_REMEDIES.map((section, idx) => (
                <div key={idx} style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '1.5rem', 
                padding: '2rem'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>{section.icon}</span>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{section.category}</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {section.items.map((item, i) => (
                    <div key={i} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{item.name}</div>
                        <p style={{ margin: 0, fontSize: '0.8125rem', opacity: 0.9 }}>{item.use}</p>
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
            ← Back to Analysis
          </Link>
        </div>

      </div>

      <style>{`
        .remedy-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 1.25rem;
            padding: 1.75rem;
            box-shadow: var(--shadow-sm);
            transition: transform 0.3s;
        }
        .remedy-card:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
        }
      `}</style>
    </div>
  )
}
