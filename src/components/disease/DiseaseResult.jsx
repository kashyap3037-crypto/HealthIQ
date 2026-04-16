import { Badge, SectionCard, Bullet } from '../common/UI.jsx'

const SEV_COLOR = { mild: '#16a34a', moderate: '#d97706', severe: '#dc2626' }
const IMP_COLOR = { high: '#dc2626', medium: '#d97706', low: '#16a34a' }
const EFF_COLOR = { proven: '#0891b2', traditional: '#7c3aed', anecdotal: '#64748b' }

export default function DiseaseResult({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Overview Card ── */}
      <section style={{
        background: 'var(--white)',
        border: '1px solid var(--border-color)',
        borderRadius: '1.25rem',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🦠</span>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{data.disease_name}</h2>
        </div>
        <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>{data.overview}</p>
      </section>

      {/* ── EMERGENCY SIGN (High Priority) ── */}
      <section style={{
        background: '#fef2f2',
        border: '1px solid #fee2e2',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#991b1b' }}>
          <span style={{ fontSize: '1.5rem' }}>🚨</span>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>Emergency Signs — Seek Help If:</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {data.emergency_signs?.map((e, i) => (
            <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #fee2e2' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#991b1b', marginBottom: '0.25rem' }}>{e.sign}</div>
              <p style={{ fontSize: '0.8125rem', color: '#4b5563' }}>{e.action}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Data Grid ── */}
      <div className="result-grid">

        {/* Symptoms */}
        <SectionCard icon="🌡️" title="Symptoms" accent="#d97706">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.symptoms?.map((s, i) => (
              <div key={i} className="mini-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.name}</span>
                  <Badge label={s.severity} color={SEV_COLOR[s.severity]} />
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{s.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Medicines */}
        <SectionCard icon="💊" title="Medicines" accent="#0ea5e9">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            {data.medicines?.map((m, i) => (
              <div key={i} className="mini-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0369a1' }}>{m.name}</span>
                  <Badge label={m.type} color="#0ea5e9" />
                </div>
                <p style={{ fontSize: '0.8125rem' }}>{m.purpose}</p>
                {m.note && (
                  <div style={{ fontSize: '0.75rem', color: '#9a3412', padding: '0.5rem', background: '#fff7ed', borderRadius: '0.5rem', border: '1px solid #ffedd5', marginTop: '0.5rem' }}>
                    ⚠ {m.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Home Remedies */}
        <SectionCard icon="🌿" title="Home Remedies" accent="#7c3aed">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.home_remedies?.map((r, i) => (
              <div key={i} className="mini-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#5b21b6' }}>{r.remedy}</span>
                  <Badge label={r.effectiveness} color={EFF_COLOR[r.effectiveness]} />
                </div>
                <p style={{ fontSize: '0.8125rem' }}>{r.how_to_use}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Food Guidelines ── */}
        <SectionCard icon="🥘" title="Diet: What To Eat" accent="#16a34a">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.food_to_eat?.map((f, i) => (
              <div key={i} className="mini-card">
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#166534', marginBottom: '0.25rem' }}>{f.food}</div>
                <p style={{ fontSize: '0.8125rem' }}>{f.reason}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon="🚫" title="Diet: Avoid" accent="#dc2626">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.food_to_avoid?.map((f, i) => (
              <div key={i} className="mini-card">
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#991b1b', marginBottom: '0.25rem' }}>{f.food}</div>
                <p style={{ fontSize: '0.8125rem' }}>{f.reason}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Recovery & Timeline ── */}
        <SectionCard icon="⏱️" title="Recovery Timeline" accent="#0891b2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { l: 'Mild', v: data.recovery_timeline?.mild_case, c: '#16a34a' },
                { l: 'Mod', v: data.recovery_timeline?.moderate_case, c: '#d97706' },
                { l: 'Sev', v: data.recovery_timeline?.severe_case, c: '#dc2626' }
              ].map((t, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '0.75rem 0.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: `1px solid ${t.c}20` }}>
                  <div style={{ color: t.c, fontWeight: 800, fontSize: '0.875rem' }}>{t.v}</div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.l}</div>
                </div>
              ))}
            </div>
            <div className="mini-card" style={{ fontSize: '0.8125rem' }}>
              <strong style={{ color: '#0891b2' }}>Factors: </strong> {data.recovery_timeline?.factors}
            </div>
          </div>
        </SectionCard>

        {/* ── Prevention Tips ── */}
        <SectionCard icon="🛡️" title="Prevention Tips" accent="#4f46e5">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.prevention_tips?.map((p, i) => (
              <div key={i} className="mini-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.875rem', margin: 0, paddingRight: '0.5rem' }}>{p.tip}</p>
                <Badge label={p.importance} color={IMP_COLOR[p.importance]} />
              </div>
            ))}
          </div>
        </SectionCard>

      </div>

      <style>{`
        .result-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .result-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .mini-card {
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          transition: 0.2s;
        }
        
        .mini-card:hover {
          background: #fff;
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </div>
  )
}
