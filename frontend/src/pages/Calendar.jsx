export default function Calendar() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Cronograma</h1>
        <p style={styles.subtitle}>Gantt e linha do tempo dos projetos</p>
      </div>
      <div style={styles.placeholder}>
        <i className="ph ph-calendar-blank" style={{ fontSize: '4rem', color: '#2D2D30' }} />
        <p style={{ color: '#A0A0A5', marginTop: 20, fontSize: '1.1rem' }}>Gantt em construção</p>
        <p style={{ color: '#A0A0A5', fontSize: '0.875rem', marginTop: 8 }}>Em breve: cronograma arrastável com tarefas e responsáveis.</p>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 64, position: 'relative', zIndex: 1 },
  header: { marginBottom: 40 },
  title: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff 0%, #A0A0A5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#A0A0A5', fontSize: '1.1rem', marginTop: 8 },
  placeholder: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: 400,
    backgroundColor: '#161618', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.05)'
  }
}
