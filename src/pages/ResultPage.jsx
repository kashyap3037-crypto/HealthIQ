
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchDiseaseInfo } from '../api/gemini.js'
import DiseaseResult from '../components/disease/DiseaseResult.jsx'
import { LoadingSpinner, ErrorBanner } from '../components/common/UI.jsx'
import { generateHealthReport } from '../services/pdfService.js'

export default function ResultPage() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function getInfo() {
    if (!name) return
    setLoading(true)
    setError('')
    try {
      const result = await fetchDiseaseInfo(decodeURIComponent(name))
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
      }
    } catch (e) {
      setError(e.message || 'API_ERROR')
    }
    setLoading(false)
  }

  const handleDownload = () => {
    if (!data) return
    generateHealthReport(data, decodeURIComponent(name))
  }

  useEffect(() => {
    getInfo()
  }, [name])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', overflowX: 'hidden' }}>
      
      {/* ── Main content ── */}
      <main className="container" style={{ padding: '2rem 1.5rem 6rem' }}>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'var(--white)', color: 'var(--primary)', border: '1px solid var(--border-color)',
              borderRadius: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.875rem', fontWeight: 600,
              boxShadow: 'var(--shadow-sm)', minHeight: 'auto'
            }}
          >
            ← Back to Search
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {data && (
              <button
                onClick={handleDownload}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', 
                  border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1.25rem', fontSize: '0.875rem', 
                  fontWeight: 600, boxShadow: 'var(--shadow-md)', minHeight: 'auto'
                }}
              >
                📊 Download Report
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '6rem 0' }}>
            <LoadingSpinner />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Consulting HealthIQ database...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
            <ErrorBanner message={error} />
            <button
              onClick={() => navigate('/')}
              style={{ 
                background: 'var(--primary)', color: 'white', border: 'none', 
                borderRadius: '0.5rem', padding: '0.75rem 1.5rem', marginTop: '1.5rem',
                fontWeight: 600
              }}
            >
              Return Home
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="fade-in">
             <DiseaseResult data={data} />
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 480px) {
          .container { padding: 0 1rem; }
        }
      `}</style>
    </div>
  )
}
