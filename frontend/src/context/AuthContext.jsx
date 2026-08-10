import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({
          username: decoded.sub,
          role: decoded.role || 'USER',
          firstName: decoded.firstName || '',
          lastName: decoded.lastName || '',
          email: decoded.email || '',
          loyaltyPoints: decoded.loyaltyPoints ?? 0,
          tier: decoded.tier || 'BRONZE',
        })
      } catch (err) {
        console.error('Invalid token', err)
        logout()
      }
    } else {
      setUser(null)
    }
  }, [token])

  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = () => !!token
  const isAdmin = () => user?.role === 'ADMIN'

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
