import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, getVersions } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const pending = projects.filter(p => p.status === 'pendente_aprovacao')
  const approved = projects.filter(p => p.status === 'aprovado')
  const featured = pending[0] || projects[0]

  if (loading) return <div style={styles.loading}>Carregando...</div>

  return (
    <div style={styles.page}>

      {/* HERO */}
      {featured && (
        <div style={{ ...styles.hero, backgroundImage: `url(${featured.thumbnail_url || 'https://vumbnail.com/1148242730.jpg'})` }}>
          <div style={styles.heroGradient} />
          <div style={styles.heroContent}>
            <span style={styles.heroTag}>Ação Necessária</span>
            <h1 style={styles.heroTitle}>{featured.title}</h1>
            <p style={styles.heroDesc}>{featured.description || 'Nova versão disponível para revisão.'}</p>
            <div style={styles.heroActions}>
              <button style={styles.btnPrimary} onClick={() => navigate(`/projects`)}>
                <i className="ph-fill ph-play" /> Revisar Agora
              </button>
              <button style={styles.btnSecondary} onClick={() => navigate('/projects')}>
                <i className="ph ph-info" /> Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARROSSEL: Para Aprovar */}
      {pending.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Para Aprovar</h2>
          <div style={styles.carousel}>
            {pending.map(p => (
              <div key={p.id} style={styles.carouselItem} onClick={() => navigate('/projects')}>
                <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=400'} alt={p.title} style={styles.carouselImg} />
                <span style={{ ...styles.carouselTag, background: 'rgba(139,92,246,0.9)' }}>Revisão Pendente</span>
                <div style={styles.carouselInfo}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{p.title}</h4>
                  <div style={styles.carouselMeta}><i className="ph-bold ph-clock" /> Pendente</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CARROSSEL: Aprovados */}
      {approved.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Aprovados Recentemente</h2>
          <div style={styles.carousel}>
            {approved.map(p => (
              <div key={p.id} style={styles.carouselItem} onClick={() => navigate('/projects')}>
                <img src={p.thumbnail_url || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400'} alt={p.title} style={styles.carouselImg} />
                <span style={{ ...styles.carouselTag, background: 'rgba(16,185,129,0.9)' }}><i className="ph-bold ph-check" /> Aprovado</span>
                <div style={styles.carouselInfo}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{p.title}</h4>
                  <div style={styles.carouselMeta}><i className="ph-bold ph-check-circle" /> Aprovado</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Visão Geral</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total de Projetos</h3>
            <div style={styles.statNumber}>{projects.length}</div>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Pendentes</h3>
            <div style={{ ...styles.statNumber, color: '#8B5CF6' }}>{pending.length}</div>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Aprovados</h3>
            <div style={{ ...styles.statNumber, color: '#10B981' }}>{approved.length}</div>
          </div>
        </div>
      </section>

    </div>
  )
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', paddingBottom: 64, position: 'relative', zIndex: 1 },
  loading: { padding: 64, color: '#A0A0A5' },
  hero: {
    position: 'relative', width: '100%', height: '65vh',
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', alignItems: 'flex-end', marginBottom: 40
  },
  heroGradient: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to right, rgba(15,15,17,1) 0%, rgba(15,15,17,0.4) 50%, transparent 100%), linear-gradient(to top, rgba(15,15,17,1) 0%, transparent 40%)'
  },
  heroContent: { position: 'relative', zIndex: 2, padding: 48, maxWidth: 800 },
  heroTag: {
    display: 'inline-block', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px',
    borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: 16
  },
  heroTitle: { fontSize: '4rem', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.03em' },
  heroDesc: { fontSize: '1.2rem', color: '#A0A0A5', marginBottom: 32, maxWidth: 600 },
  heroActions: { display: 'flex', gap: 16 },
  btnPrimary: {
    background: '#fff', color: '#000', padding: '14px 32px', borderRadius: 8,
    fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
  },
  btnSecondary: {
    background: 'rgba(109,109,110,0.7)', color: '#fff', padding: '14px 32px',
    borderRadius: 8, fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
  },
  section: { marginBottom: 48 },
  sectionTitle: { fontSize: '1.4rem', fontWeight: 600, marginBottom: 16, padding: '0 48px' },
  carousel: { display: 'flex', gap: 20, overflowX: 'auto', padding: '0 48px 24px', scrollSnapType: 'x mandatory' },
  carouselItem: {
    minWidth: 320, height: 180, borderRadius: 8, backgroundColor: '#161618',
    scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0
  },
  carouselImg: { width: '100%', height: '100%', objectFit: 'cover' },
  carouselTag: {
    position: 'absolute', top: 12, left: 12, padding: '4px 8px',
    borderRadius: 4, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', zIndex: 2
  },
  carouselInfo: {
    position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 2,
    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', paddingTop: 20
  },
  carouselMeta: { fontSize: '0.75rem', color: '#A0A0A5', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: '0 48px' },
  statCard: {
    background: '#161618', border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 32
  },
  statLabel: { fontSize: '1rem', color: '#A0A0A5', fontWeight: 500, marginBottom: 16 },
  statNumber: { fontSize: '3.5rem', fontWeight: 700, lineHeight: 1 }
}
