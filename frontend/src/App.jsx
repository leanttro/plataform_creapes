import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Player from './pages/Player'
import Calendar from './pages/Calendar'
import Files from './pages/Files'
import Settings from './pages/Settings'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <div style={blobStyle(1)} />
      <div style={blobStyle(2)} />
      <Sidebar />
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative' }}>
        {children}
      </main>
    </div>
  )
}

function blobStyle(n) {
  const base = {
    position: 'fixed',
    borderRadius: '50%',
    zIndex: 0,
    pointerEvents: 'none',
    animation: `blobMove ${n === 1 ? 15 : 20}s infinite ${n === 2 ? 'alternate-reverse' : 'alternate'} ease-in-out`
  }
  if (n === 1) return {
    ...base,
    top: '-10%', right: '-10%',
    width: '50vw', height: '50vw',
    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)'
  }
  return {
    ...base,
    bottom: '-20%', left: '-10%',
    width: '40vw', height: '40vw',
    background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)'
  }
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/player/:versionId" element={<Layout><Player /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
          <Route path="/files" element={<Layout><Files /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
