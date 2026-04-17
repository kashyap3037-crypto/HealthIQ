
import { Badge } from '../common/UI.jsx'

const SEV_COLOR = { mild: '#16a34a', moderate: '#d97706', severe: '#dc2626' }

export default function DiseaseResult({ data }) {
  if (!data) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }} className="doctor-report">
      
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid var(--text-main)', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Clinical Analysis Report</h1>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', opacity: 0.7 }}>Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} | Date: {new Date().toLocaleDateString()}</p>
      </div>

      {/* ── Section: Patient Summary ── */}
      <section>
        <div className="section-header"><span className="section-num">01</span><h2 className="section-title">Case Overview</h2></div>
        <div className="report-card">
          <label className="field-label">Primary Condition / Assessment</label>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>{data.disease_name}</div>
          <div style={{ marginTop: '1rem' }}>
            <label className="field-label">General Overview</label>
            <p style={{ margin: '0.25rem 0 0', lineHeight: 1.6, fontSize: '0.9375rem' }}>{data.overview}</p>
          </div>
        </div>
      </section>

      {/* ── Section: 02 Analysis ── */}
      <section>
        <div className="section-header"><span className="section-num">02</span><h2 className="section-title">Clinical Analysis</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }} className="grid-stack">
          <div className="report-card">
             <label className="field-label">Symptoms Analysis — With severity indicators</label>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {data.symptoms?.map((s, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{s.name}</span>
                    <Badge label={s.severity} color={SEV_COLOR[s.severity]} />
                  </div>
                  <p style={{ fontSize: '0.75rem', margin: '0.25rem 0 0', opacity: 0.8 }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="report-card">
              <label className="field-label">⏱️ Recovery Timeline — Estimated healing duration</label>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="time-row"><span>Mild Case</span><strong>{data.recovery_timeline?.mild_case}</strong></div>
                <div className="time-row"><span>Severe Case</span><strong>{data.recovery_timeline?.severe_case}</strong></div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                    Factors: {data.recovery_timeline?.factors}
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* ── Section: 03 Pharma ── */}
      <section>
        <div className="section-header"><span className="section-num">03</span><h2 className="section-title">Medical Guidance</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
           <div className="report-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <label className="field-label">💊 Medicines & Warnings — Safe usage guidance</label>
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {data.medicines?.map((m, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'rgba(0,165,233,0.05)', borderRadius: '0.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{m.name} <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>({m.type})</span></div>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.8125rem' }}>{m.purpose}</p>
                    {m.note && <div style={{ color: '#dc2626', fontSize: '0.6875rem', fontWeight: 600 }}>⚠️ {m.note}</div>}
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── Section: 04 Action ── */}
      <section>
        <div className="section-header"><span className="section-num">04</span><h2 className="section-title">Action Steps</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-stack">
           <div className="report-card" style={{ borderLeft: '4px solid #16a34a' }}>
              <label className="field-label" style={{ color: '#16a34a' }}>✅ What To Do</label>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                 {data.what_to_do?.map((item, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{item}</li>)}
              </ul>
           </div>
           <div className="report-card" style={{ borderLeft: '4px solid #dc2626' }}>
              <label className="field-label" style={{ color: '#dc2626' }}>🚫 What Not To Do — Clear action steps</label>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                 {data.what_not_to_do?.map((item, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{item}</li>)}
              </ul>
           </div>
        </div>
      </section>

      {/* ── Section: 05 Lifestyle ── */}
      <section>
        <div className="section-header"><span className="section-num">05</span><h2 className="section-title">Dietary & Home Remedies</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
           <div className="report-card">
              <label className="field-label">🥗 Foods to eat / Food to avoid</label>
              <div style={{ marginTop: '1rem' }}>
                 <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.5rem' }}>RECOMMENDED:</div>
                    {data.food_to_eat?.map((f, i) => <div key={i} style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>● <strong>{f.food}</strong>: {f.reason}</div>)}
                 </div>
                 <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', marginBottom: '0.5rem' }}>AVOID:</div>
                    {data.food_to_avoid?.map((f, i) => <div key={i} style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>● <strong>{f.food}</strong>: {f.reason}</div>)}
                 </div>
              </div>
           </div>
           <div className="report-card">
              <label className="field-label">🌿 Home Remedies</label>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {data.home_remedies?.map((r, i) => (
                   <div key={i} style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '0.4rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{r.remedy}</div>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', opacity: 0.8 }}>{r.how_to_use}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── Section: 06 Prevention ── */}
      <section>
        <div className="section-header"><span className="section-num">06</span><h2 className="section-title">Prevention & Warning</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
           <div className="report-card">
              <label className="field-label">🛡️ Prevention Tips — Stay protected</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                 {data.prevention_tips?.map((t, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8125rem' }}>
                       <strong>{t.tip}</strong> <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>[{t.importance.toUpperCase()}]</span>
                    </div>
                 ))}
              </div>
           </div>

           {data.emergency_signs && data.emergency_signs.length > 0 && (
             <div className="report-card" style={{ background: '#fef2f2', border: '1px solid #fee2e2' }}>
               <label className="field-label" style={{ color: '#991b1b' }}>🚨 Emergency Signs — Identify critical conditions</label>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                 {data.emergency_signs.map((e, i) => (
                   <div key={i} style={{ fontSize: '0.8125rem', color: '#991b1b', background: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px dashed #fee2e2' }}>
                     <strong>{e.sign}</strong>: {e.action}
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
      </section>

      {/* ── Footer ── */}
      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', opacity: 0.6, fontSize: '0.75rem', fontStyle: 'italic' }}>
        {data.disclaimer}
      </div>

      <style>{`
        .doctor-report { font-family: 'Inter', sans-serif; color: var(--text-main); }
        .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .section-num { 
          font-size: 0.75rem; font-weight: 900; background: var(--text-main); color: var(--bg-main);
          width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; border-radius: 4px;
        }
        .section-title { margin: 0; font-size: 1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .report-card { background: var(--bg-card); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 0.5rem; }
        .field-label { display: block; font-size: 0.625rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.5; margin-bottom: 0.25rem; }
        .time-row { display: flex; justify-content: space-between; padding: 0.5rem; background: rgba(0,0,0,0.02); border-radius: 0.25rem; font-size: 0.8125rem; }
        @media (max-width: 600px) {
           .grid-stack { grid-template-columns: 1fr !important; }
           .report-card { padding: 1rem !important; }
           h1 { font-size: 1.25rem !important; }
        }
      `}</style>
    </div>
  )
}
