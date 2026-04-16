
import { Link } from 'react-router-dom'

const REMEDIES = [
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
  },
  {
    category: "Immunity & Cold",
    icon: "🍋",
    items: [
      { name: "Lemon & Honey", use: "Fresh lemon juice with warm water and honey.", benefit: "Vitamin C boost" },
      { name: "Tulsi (Basil) Tea", use: "Boil 5-6 Tulsi leaves in water and sip.", benefit: "Anti-viral properties" },
      { name: "Giloy Decoction", use: "Boil Giloy stems in water until it reduces to half.", benefit: "Increases platelet count & immunity" }
    ]
  },
  {
    category: "Skin & Burns",
    icon: "🌵",
    items: [
      { name: "Aloe Vera Gel", use: "Apply fresh gel directly on burns or rashes.", benefit: "Cooling & healing" },
      { name: "Coconut Oil", use: "Massage virgin coconut oil on dry skin areas.", benefit: "Hydrating & anti-fungal" }
    ]
  }
]

export default function RemediesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '6rem 1.5rem 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="fade-in">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Natural Home Remedies</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Explore time-tested natural solutions for common health issues. 
            Remember, these are for mild relief; consult a doctor for severe symptoms.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {REMEDIES.map((section, idx) => (
            <div key={idx} className="fade-in" style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '1.5rem', 
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
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
                    <div style={{ 
                      fontSize: '0.625rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      marginTop: '0.5rem', 
                      color: 'var(--primary)',
                      fontWeight: 700
                    }}>
                      Benefit: {item.benefit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <Link to="/" style={{ 
            background: 'var(--primary)', color: 'white', textDecoration: 'none',
            padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 700
          }}>
            Back to Symptom Analysis
          </Link>
        </div>

      </div>
    </div>
  )
}
