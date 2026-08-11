import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  
  const getStoredProfile = () => {
    try {
      const saved = localStorage.getItem('user_profile')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Error reading stored profile', e)
    }
    return null
  }

  const defaultProfile = {
    username: 'andrija_m',
    role: 'USER',
    firstName: 'Andrija',
    lastName: 'Milovanovic',
    email: 'aandrijq@gmail.com',
    city: 'Beograd',
    address: 'Bulevar Mihajla Pupina 10',
    birthDate: '15.05.1998',
    phone: '+381 64 123 4567',
    loyaltyPoints: 1450,
    tier: 'SILVER',
  }

  const [user, setUser] = useState(() => {
    const saved = getStoredProfile()
    return saved || defaultProfile
  })

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const saved = getStoredProfile() || {}
        setUser({
          username: decoded.sub || 'andrija_m',
          role: decoded.role || 'USER',
          firstName: decoded.firstName || saved.firstName || 'Andrija',
          lastName: decoded.lastName || saved.lastName || 'Milovanovic',
          email: decoded.email || saved.email || 'aandrijq@gmail.com',
          city: decoded.city || saved.city || 'Beograd',
          address: decoded.address || saved.address || 'Bulevar Mihajla Pupina 10',
          birthDate: decoded.birthDate || saved.birthDate || '15.05.1998',
          phone: decoded.phone || saved.phone || '+381 64 123 4567',
          loyaltyPoints: decoded.loyaltyPoints ?? saved.loyaltyPoints ?? 1450,
          tier: decoded.tier || saved.tier || 'SILVER',
        })
      } catch (err) {
        console.error('Invalid token', err)
      }
    }
  }, [token])

  const login = (newToken, customUserData = null) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    if (customUserData) {
      updateUserProfile(customUserData)
    }
  }

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields }
      localStorage.setItem('user_profile', JSON.stringify(newUser))
      return newUser
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_profile')
    setToken(null)
    setUser(null)
  }

  const loginAsAdmin = () => {
    const adminUser = {
      username: 'admin',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Administrator',
      email: 'admin@hypecinema.rs',
      city: 'Beograd',
      address: 'Knez Mihailova 1',
      birthDate: '01.01.1990',
      phone: '+381 11 100 200',
      loyaltyPoints: 9999,
      tier: 'GOLD',
    }
    setUser(adminUser)
    localStorage.setItem('user_profile', JSON.stringify(adminUser))
  }

  const loginAsDemoUser = () => {
    const demoUser = {
      username: 'andrija_m',
      role: 'USER',
      firstName: 'Andrija',
      lastName: 'Milovanovic',
      email: 'aandrijq@gmail.com',
      city: 'Beograd',
      address: 'Bulevar Mihajla Pupina 10',
      birthDate: '15.05.1998',
      phone: '+381 64 123 4567',
      loyaltyPoints: 1450,
      tier: 'SILVER',
    }
    setUser(demoUser)
    localStorage.setItem('user_profile', JSON.stringify(demoUser))
  }

  const isAuthenticated = () => !!user || !!token
  const isAdmin = () => user?.role === 'ADMIN'

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        loginAsAdmin,
        loginAsDemoUser,
        updateUserProfile,
        logout,
        isAuthenticated,
        isAdmin,
      }}
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
