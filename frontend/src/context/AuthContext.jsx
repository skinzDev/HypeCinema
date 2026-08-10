import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

/**
 * Authentication context provider.
 * Manages JWT token, user info, login/logout state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('jwt_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Decode JWT payload to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({
          id: payload.id,
          username: payload.sub,
          email: payload.email,
          role: payload.role,
          firstName: payload.firstName,
          lastName: payload.lastName,
          loyaltyPoints: payload.loyaltyPoints ?? 120, // Demo početni poeni za testiranje
          tier: payload.tier || 'BRONZE',
        })
      } catch (err) {
        console.error('Invalid JWT token:', err)
        logout()
      }
    }
    setLoading(false)
  }, [token])

  const login = (jwtToken) => {
    localStorage.setItem('jwt_token', jwtToken)
    setToken(jwtToken)
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    setToken(null)
    setUser(null)
  }

  const isAdmin = () => user?.role === 'ROLE_ADMIN'
  const isAuthenticated = () => !!user

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAdmin, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
