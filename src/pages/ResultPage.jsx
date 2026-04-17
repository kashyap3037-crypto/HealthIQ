
import { useEffect, useState, useRef } from 'react'
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
  const fetchingRef = useRef(false)

  async function getInfo() {
    if (!name || fetchingRef.current) return
    fetchingRef.current = true
    
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
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
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
      <main className="container" style={{ padding: '6rem 1.5rem 6rem' }}>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)',
              borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600,
              boxShadow: 'var(--shadow-sm)', minHeight: 'auto'
            }}
          >
            ← Back
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {data && (
              <button
                onClick={handleDownload}
                style={{
                  background: 'var(--primary)', color: '#fff', 
                  border: 'none', borderRadius: '0.75rem', padding: '0.625rem 1.5rem', fontSize: '0.875rem', 
                  fontWeight: 700, boxShadow: 'var(--shadow-md)', minHeight: 'auto'
                }}
              >
                📊 Save PDF
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
            <LoadingSpinner />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', letterSpacing: '0.05em' }}>PREPARING CLINICAL DATA...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
            <ErrorBanner message={error} onRetry={getInfo} />
            
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/')}
                style={{ 
                  background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', 
                  borderRadius: '0.75rem', padding: '0.75rem 1.5rem',
                  fontWeight: 600, fontSize: '0.875rem'
                }}
              >
                Go Home
              </button>
            </div>
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
          .container { padding: 4rem 1rem 4rem; }
        }
      `}</style>
    </div>
  )
}
