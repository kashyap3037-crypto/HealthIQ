
import { Badge } from '../common/UI.jsx'

const SEV_COLOR = { mild: '#15803d', moderate: '#b45309', severe: '#be123c' }

export default function DiseaseResult({ data }) {
  if (!data) return null

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      maxWidth: '850px',
      margin: '0 auto',
      paddingBottom: '4rem'
    }} className="professional-report">

      {/* ── Condition Header ── */}
      <div style={{
        borderLeft: '6px solid var(--primary)',
        paddingLeft: '1.5rem',
        marginBottom: '1rem',
        marginTop: '1rem'
      }}>
        <label className="field-label" style={{ border: 'none', padding: 0, marginBottom: '0.25rem' }}>Primary Assessment</label>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>{data.disease_name}</h1>
      </div>

      {/* ── Overview ── */}
      <section className="report-card">
        <label className="field-label">General Medical Overview</label>
        <p style={{ margin: 0, lineHeight: 1.7, fontSize: '1rem', color: 'var(--text-main)' }}>{data.overview}</p>
      </section>

      {/* ── Symptoms & Timeline ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-stack">
        <section className="report-card">
          <label className="field-label">Symptom Insights</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {data.symptoms?.map((s, i) => (
              <div key={i} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{s.name}</span>
                  <Badge label={s.severity} color={SEV_COLOR[s.severity]} />
                </div>
                <p style={{ fontSize: '0.8125rem', margin: 0, color: 'var(--text-muted)' }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="report-card">
          <label className="field-label">⏱️Recovery Timeline</label>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="data-row"><span>Mild Case Recovery</span><strong>{data.recovery_timeline?.mild_case}</strong></div>
            <div className="data-row"><span>Severe Case Recovery</span><strong>{data.recovery_timeline?.severe_case}</strong></div>
            <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>PROGNOSTIC FACTORS</span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>{data.recovery_timeline?.factors}</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Pharmaceutical Guidance ── */}
      <section className="report-card" style={{ borderTop: '4px solid var(--primary)' }}>
        <label className="field-label">💊 Medicines & Warnings</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
          {data.medicines?.map((m, i) => (
            <div key={i} style={{ border: '1px solid #f1f5f9', padding: '1rem', borderRadius: '0.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
                {m.name} <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>{m.type}</span>
              </div>
              <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text-main)' }}>{m.purpose}</p>
              {m.note && <div style={{ color: '#be123c', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: '#fff1f2', borderRadius: '0.25rem', display: 'inline-block' }}>⚠️ PRECAUTION: {m.note}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Action Steps ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-stack">
        <section className="report-card" style={{ borderTop: '4px solid #15803d' }}>
          <label className="field-label" style={{ color: '#15803d' }}>✅Corrective Actions (what to Do)</label>
          <ul style={{ paddingLeft: '1.125rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
            {data.what_to_do?.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9375rem' }}>{item}</li>)}
          </ul>
        </section>
        <section className="report-card" style={{ borderTop: '4px solid #be123c' }}>
          <label className="field-label" style={{ color: '#be123c' }}>🚫Prohibited Actions (Don't Do)</label>
          <ul style={{ paddingLeft: '1.125rem', marginTop: '0.5rem', color: 'var(--text-main)' }}>
            {data.what_not_to_do?.map((item, i) => <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9375rem' }}>{item}</li>)}
          </ul>
        </section>
      </div>

      {/* ── Diet & Support ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <section className="report-card">
          <label className="field-label">🥗Diet Recommendations</label>
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#15803d', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Foods to Eat</div>
              {data.food_to_eat?.map((f, i) => <div key={i} style={{ fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>• <strong>{f.food}</strong>: {f.reason}</div>)}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#be123c', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Foods to Avoid</div>
              {data.food_to_avoid?.map((f, i) => <div key={i} style={{ fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>• <strong>{f.food}</strong>: {f.reason}</div>)}
            </div>
          </div>
        </section>

        <section className="report-card">
          <label className="field-label">🌿 Home Remedies</label>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.home_remedies?.map((r, i) => (
              <div key={i} style={{ padding: '0.75rem', border: '1px solid #f1f5f9', borderRadius: '0.5rem', background: '#f8fafc' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{r.remedy}</div>
                <p style={{ margin: 0, fontSize: '0.8125rem', lineHeight: 1.5 }}>{r.how_to_use}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Prevention & Urgent Care ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="report-card">
          <label className="field-label">🛡️ Prevention Tips</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.75rem' }}>
            {data.prevention_tips?.map((t, i) => (
              <div key={i} style={{
                border: '1px solid #e2e8f0',
                padding: '0.4rem 0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                background: '#fff'
              }}>
                <span style={{ fontWeight: 700 }}>{t.tip}</span>
                <span style={{ marginLeft: '0.5rem', opacity: 0.4, fontSize: '0.7rem' }}>| {t.importance.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {data.emergency_signs && data.emergency_signs.length > 0 && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fda4af',
            padding: '1.5rem',
            borderRadius: '0.75rem'
          }}>
            <label className="field-label" style={{ color: '#9f1239', borderBottomColor: '#fecdd3' }}>🚨 Clinical Red Flags (Seek Immediate Medical Attention)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {data.emergency_signs.map((e, i) => (
                <div key={i} style={{
                  fontSize: '0.875rem',
                  color: '#9f1239',
                  background: 'rgba(255,255,255,0.7)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #fecdd3'
                }}>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{e.sign}</strong>
                  {e.action}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Disclaimer ── */}
      <footer style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#f1f5f9',
        borderRadius: '0.75rem',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        lineHeight: 1.6
      }}>
        <strong>MEDICAL DISCLAIMER:</strong> {data.disclaimer}
      </footer>

      <style>{`
        .professional-report { 
          font-family: 'Inter', -apple-system, sans-serif; 
          color: var(--text-main); 
        }
        .report-card { 
          background: #fff; 
          border: 1px solid #e2e8f0; 
          padding: 1.5rem; 
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .field-label { 
          display: block; 
          font-size: 0.65rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 0.075em; 
          color: var(--text-muted);
          margin-bottom: 0.75rem; 
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 0.5rem;
        }
        .data-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 0.625rem 0; 
          border-bottom: 1px dashed #e2e8f0; 
          font-size: 0.875rem; 
        }
        .data-row:last-of-type { border: none; }
        
        @media (max-width: 650px) {
           .grid-stack { grid-template-columns: 1fr !important; }
           .report-card { padding: 1.25rem !important; }
           h1 { font-size: 1.75rem !important; }
        }
      `}</style>
    </div>
  )
}
