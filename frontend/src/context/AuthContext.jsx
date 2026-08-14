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
    username: 'korisnik',
    role: 'ROLE_USER',
    firstName: 'Korisnik',
    lastName: '',
    email: 'korisnik@hypecinema.rs',
    city: 'Beograd',
    address: '',
    birthDate: '',
    phone: '',
    loyaltyPoints: 0,
    tier: 'BRONZE',
  }

  const [user, setUser] = useState(() => {
    return getStoredProfile() || null
  })

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const saved = getStoredProfile() || {}
        setUser({
          username: decoded.sub || saved.username || 'korisnik',
          role: decoded.role || decoded.roles || saved.role || 'ROLE_USER',
          firstName: decoded.firstName || saved.firstName || 'Korisnik',
          lastName: decoded.lastName || saved.lastName || '',
          email: decoded.email || saved.email || 'korisnik@hypecinema.rs',
          city: decoded.city || saved.city || 'Beograd',
          address: decoded.address || saved.address || '',
          birthDate: decoded.birthDate || saved.birthDate || '',
          phone: decoded.phone || saved.phone || '',
          loyaltyPoints: decoded.loyaltyPoints ?? saved.loyaltyPoints ?? 0,
          tier: decoded.tier || saved.tier || 'BRONZE',
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
      const newUser = { ...(prev || {}), ...updatedFields }
      localStorage.setItem('user_profile', JSON.stringify(newUser))
      if (newUser.username || newUser.email) {
        try {
          const registered = JSON.parse(localStorage.getItem('registered_users') || '{}')
          if (newUser.username) registered[newUser.username.toLowerCase()] = newUser
          if (newUser.email) registered[newUser.email.toLowerCase()] = newUser
          localStorage.setItem('registered_users', JSON.stringify(registered))
        } catch (e) {
          console.error('Error saving to registered_users', e)
        }
      }
      return newUser
    })
  }

  const getRegisteredUser = (usernameOrEmail) => {
    try {
      const registered = JSON.parse(localStorage.getItem('registered_users') || '{}')
      const key = (usernameOrEmail || '').trim().toLowerCase()
      if (registered[key]) return registered[key]

      if (key === 'admin' || key === 'admin@hypecinema.rs') {
        return {
          username: 'admin',
          password: 'admin',
          role: 'ROLE_ADMIN',
          firstName: 'Admin',
          lastName: 'Administrator',
          email: 'admin@hypecinema.rs',
          city: 'Beograd',
          address: 'Knez Mihailova 1',
          birthDate: '01.01.1990',
          phone: '+381 11 100 200',
          loyaltyPoints: 0,
          tier: 'BRONZE',
        }
      }

      if (key === 'andrija_m' || key === 'aandrijq@gmail.com') {
        return {
          username: 'andrija_m',
          password: '123456',
          role: 'ROLE_USER',
          firstName: 'Andrija',
          lastName: 'Milovanovic',
          email: 'aandrijq@gmail.com',
          city: 'Beograd',
          address: 'Bulevar Mihajla Pupina 10',
          birthDate: '15.05.1998',
          phone: '+381 64 123 4567',
          loyaltyPoints: 0,
          tier: 'BRONZE',
        }
      }

      return null
    } catch (e) {
      return null
    }
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
      role: 'ROLE_ADMIN',
      firstName: 'Admin',
      lastName: 'Administrator',
      email: 'admin@hypecinema.rs',
      city: 'Beograd',
      address: 'Knez Mihailova 1',
      birthDate: '01.01.1990',
      phone: '+381 11 100 200',
      loyaltyPoints: 0,
      tier: 'BRONZE',
    }
    updateUserProfile(adminUser)
  }

  const loginAsDemoUser = () => {
    const demoUser = {
      username: 'andrija_m',
      role: 'ROLE_USER',
      firstName: 'Andrija',
      lastName: 'Milovanovic',
      email: 'aandrijq@gmail.com',
      city: 'Beograd',
      address: 'Bulevar Mihajla Pupina 10',
      birthDate: '15.05.1998',
      phone: '+381 64 123 4567',
      loyaltyPoints: 0,
      tier: 'BRONZE',
    }
    updateUserProfile(demoUser)
  }



  const isAuthenticated = () => !!user || !!token
  const isAdmin = () => user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        loginAsAdmin,
        loginAsDemoUser,
        updateUserProfile,
        getRegisteredUser,
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
