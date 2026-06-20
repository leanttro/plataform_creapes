import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, getVersions } from '../services/api'

const STATUS_LABEL = {
  em_andamento: { label: 'Em Andamento', color: '#3B82F6' },
  pendente_aprovacao: { label: 'Revisão Pendente', color: '#8B5CF6' },
  aprovado: { label: 'Aprovado', color: '#10B981' },
  bloqueado: { label: 'Bloqueado', color: '#EF4444' }
}

export default function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then(res => setProjects(Array.isArray(res) ? res : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function openProject(project) {
    try {
      const res = await getVersions(project.id)
      const versions = Array.isArray(res) ? res : []
      if (versions.length > 0) {
        navigate(`/player/${versions[0].id}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div style={styles.loading}>Carregando projetos...</div>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Projetos</h1>
        <p style={styles.subtitle}>{projects.length} projeto{projects.length !== 1 ? 's' : ''} encontrado{projects.length !== 1 ? 's' : ''}</p>
      </div>

      {projects.length === 0 ? (
        <div style={styles.empty}>
          <i className="ph ph-folder-open" style={{ fontSize: '3rem', color: '#2D2D30' }} />
          <p style={{ color: '#A0A0A5', marginTop: 16 }}>Nenhum projeto ainda.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {projects.map(project => {
            const statusInfo = STATUS_LABEL[project.status] || STATUS_LABEL.em_andamento
            return (
              <div key={project.id} style={styles.card} onClick={() => openProject(project)}>
                {project.thumbnail_url && (
                  <img src={project.thumbnail_url} alt={project.title} style={styles.cardBg} />
                )}
                <div style={styles.cardOverlay} />
                <div style={styles.playOverlay}>
                  <i className="ph-fill ph-play" />
                </div>
                <div style={styles.cardContent}>
                  <span style={{ ...styles.cardTag, backgroundColor: statusInfo.color }}>
                    {statusInfo.label}
                  </span>
                  <h3 style={styles.cardTitle}>{project.title}</h3>
                  <div style={styles.cardMeta}>
                    <span><i className="ph ph-clock" /> {new Date(project.updated_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 64, position: 'relative', zIndex: 1 },
  loading: { padding: 64, color: '#A0A0A5' },
  header: { marginBottom: 40 },
  title: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff 0%, #A0A0A5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#A0A0A5', fontSize: '1.1rem', marginTop: 8 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 32 },
  card: {
    backgroundColor: '#161618', borderRadius: 12, overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
    position: 'relative', aspectRatio: '16/9', display: 'flex',
    alignItems: 'flex-end', padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease'
  },
  cardBg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 },
  cardOverlay: {
    position: 'absolute', inset: 0, zIndex: 1,
    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)'
  },
  playOverlay: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%) scale(0.8)',
    width: 72, height: 72, background: '#8B5CF6', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2.5rem', color: '#fff', zIndex: 3, opacity: 0,
    transition: 'all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)'
  },
  cardContent: { position: 'relative', zIndex: 2, width: '100%' },
  cardTag: {
    color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '6px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 12,
    textTransform: 'uppercase', letterSpacing: '0.08em'
  },
  cardTitle: { fontSize: '1.4rem', fontWeight: 600, marginBottom: 6, letterSpacing: '-0.01em' },
  cardMeta: { fontSize: '0.85rem', color: '#A0A0A5', display: 'flex', gap: 12, alignItems: 'center' }
}
