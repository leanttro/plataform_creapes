import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const navItems = [
  { path: '/dashboard', icon: 'ph-house', title: 'Início' },
  { path: '/projects', icon: 'ph-squares-four', title: 'Projetos' },
  { path: '/calendar', icon: 'ph-calendar-blank', title: 'Cronograma' },
  { path: '/files', icon: 'ph-files', title: 'Arquivos' },
  { path: '/settings', icon: 'ph-gear', title: 'Configurações' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { client } = useApp()

  const accentColor = client?.accent_color || '#8B5CF6'

  return (
    <aside style={styles.sidebar}>
      <div
        style={{ ...styles.logo, backgroundColor: accentColor }}
        onClick={() => navigate('/dashboard')}
        title="Creapes"
      >
        {client?.logo_url
          ? <img src={client.logo_url} alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          : 'C'
        }
      </div>

      <nav style={styles.nav}>
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              title={item.title}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                color: isActive ? '#EDEDED' : '#A0A0A5',
                backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent'
              }}
            >
              <i className={`ph ${item.icon}`} />
            </button>
          )
        })}
      </nav>

      <div style={styles.avatar} title="Perfil" />
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 72,
    backgroundColor: '#161618',
    borderRight: '1px solid #2D2D30',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 0',
    justifyContent: 'space-between',
    flexShrink: 0,
    zIndex: 100
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.2rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(139,92,246,0.4)'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },
  navItem: {
    width: 48,
    height: 48,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    transition: 'all 0.2s ease'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#232326',
    backgroundImage: 'url(https://i.pravatar.cc/150?img=11)',
    backgroundSize: 'cover',
    border: '2px solid #2D2D30',
    cursor: 'pointer'
  }
}
