// src/components/ui.jsx
// Small reusable components used across the app

export function Badge({ label, color }) {
  if (!label) return null
  return (
    <span
      style={{
        background: color + '20',
        color,
        border: `1px solid ${color}50`,
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 700,
        padding: '2px 9px',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  )
}

export function SectionCard({ icon, title, accent, children }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid #e2e8f0`,
        borderRadius: 20,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: `1px solid ${accent}15`,
          paddingBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 16,
            background: accent + '10',
            borderRadius: 10,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${accent}25`,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <h3
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            color: accent,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

export function Bullet({ color = '#0ea5e9', children }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ color, fontSize: 8, marginTop: 7, flexShrink: 0 }}>●</span>
      <span style={{ color: '#475569', fontSize: 13, lineHeight: 1.7 }}>{children}</span>
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: '80px 0',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '4px solid #f1f5f9',
          borderTop: '4px solid #0ea5e9',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: '#64748b', fontSize: 14, margin: 0, fontWeight: 500 }}>
        Consulting medical databases...
      </p>
    </div>
  )
}

export function ErrorBanner({ message, onRetry }) {
  const messages = {
    API_KEY_MISSING:
      'No API key found. Create a .env file with VITE_GEMINI_API_KEY=your_key (see .env.example).',
    API_KEY_INVALID:
      'Invalid API key. Check your .env file and make sure the key is correct.',
    RATE_LIMIT: 'Too many requests. Wait a moment and try again.',
    PARSE_ERROR: 'Unexpected response from AI. Please try again.',
    NO_RESPONSE: 'AI returned an empty response. Please try again.',
    API_ERROR: 'API error. Check your internet connection and try again.',
    SYSTEM_OVERLOADED: 'All AI models are currently busy due to high demand. Please try again in 1-2 minutes.',
  }

  const display = messages[message] || message || 'Something went wrong. Please try again.'

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        background: '#fef2f2',
        border: '1px solid #fee2e2',
        borderRadius: 24,
      }}
    >
      <div style={{ fontSize: 48 }}>⚠️</div>
      <p
        style={{
          color: '#991b1b',
          fontSize: 15,
          maxWidth: 480,
          lineHeight: 1.7,
          margin: 0,
          fontWeight: 600,
        }}
      >
        {display}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 8,
            padding: '8px 24px',
            background: '#991b1b',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(153, 27, 27, 0.2)'
          }}
        >
          Try Again Now
        </button>
      )}
    </div>
  )
}
