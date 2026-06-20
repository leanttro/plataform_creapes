import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login({ email, password })
      loginUser(data.token, data.user)
      navigate('/dashboard')
    } catch {
      setError('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', position: 'relative', overflow: 'hidden'
    }}>
      {/* blobs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400,
        backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            Creapes<span style={{ color: '#8B5CF6' }}>.</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>
            Plataforma de aprovação de vídeo
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
              }}
              placeholder="admin@creapes.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>Senha</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#8B5CF6', border: 'none', borderRadius: 8,
            padding: '12px', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s'
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
