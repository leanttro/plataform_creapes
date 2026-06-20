import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cp_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cp_token')
    if (token) {
      getMe()
        .then(u => { setUser(u); localStorage.setItem('cp_user', JSON.stringify(u)) })
        .catch(() => { localStorage.removeItem('cp_token'); localStorage.removeItem('cp_user'); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginUser = (token, userData) => {
    localStorage.setItem('cp_token', token)
    localStorage.setItem('cp_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('cp_token')
    localStorage.removeItem('cp_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
