import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Player from './pages/Player'
import Calendar from './pages/Calendar'
import Files from './pages/Files'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import Login from './pages/Login'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Carregando...</div>
    </div>
  )

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

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
    position: 'fixed', borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
    animation: `blobMove ${n === 1 ? 15 : 20}s infinite ${n === 2 ? 'alternate-reverse' : 'alternate'} ease-in-out`
  }
  if (n === 1) return { ...base, top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)' }
  return { ...base, bottom: '-20%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)' }
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Layout><Projects /></Layout></PrivateRoute>} />
      <Route path="/player/:versionId" element={<PrivateRoute><Layout><Player /></Layout></PrivateRoute>} />
      <Route path="/calendar" element={<PrivateRoute><Layout><Calendar /></Layout></PrivateRoute>} />
      <Route path="/files" element={<PrivateRoute><Layout><Files /></Layout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute adminOnly><Layout><Admin /></Layout></PrivateRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
