import { useState, useEffect } from 'react'
import { User, Lock, Mail, UserPlus, LogIn, Zap, CheckCircle2 } from 'lucide-react'
import Modal from './Modal'
import InputField from './InputField'
import Button from './Button'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { loginAsDemoUser, updateUserProfile, getRegisteredUser, loginAsAdmin } = useAuth()
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [authSuccessInfo, setAuthSuccessInfo] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login')
      setError('')
      setFieldErrors({})
      setAuthSuccessInfo(null)
    }
  }, [initialMode, isOpen])
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    city: '',
    address: '',
    birthDate: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const errs = {}
    if (!isLogin) {
      if (!formData.firstName?.trim()) errs.firstName = 'Ime je obavezno'
      if (!formData.lastName?.trim()) errs.lastName = 'Prezime je obavezno'
      if (!formData.city?.trim()) errs.city = 'Grad je obavezan'
      if (!formData.address?.trim()) errs.address = 'Adresa je obavezna'
      if (!formData.phone?.trim()) errs.phone = 'Telefon je obavezan'
      if (!formData.username?.trim()) {
        errs.username = 'Korisničko ime je obavezno'
      } else if (formData.username.trim().length < 3) {
        errs.username = 'Mora imati bar 3 karaktera'
      }
      if (!formData.email?.trim()) {
        errs.email = 'Email adresa je obavezna'
      } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
        errs.email = 'Unesite ispravnu email adresu (npr. me@domain.com)'
      }
      if (!formData.password) {
        errs.password = 'Lozinka je obavezna'
      } else if (formData.password.length < 6) {
        errs.password = 'Lozinka mora imati bar 6 karaktera'
      }
    } else {
      if (!formData.username?.trim()) errs.username = 'Unesite korisničko ime ili email'
      if (!formData.password) errs.password = 'Unesite lozinku'
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      setError('Molimo vas da popravite polja označena crvenim krugom.')
      return false
    }
    return true
  }

  const handleDemoLogin = () => {
    loginAsDemoUser()
    setAuthSuccessInfo({
      title: 'Uspešna prijava!',
      subtitle: 'Prijavljeni ste kao Andrija Milovanović (Demo nalog).',
      type: 'login',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (!validateForm()) return

    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin
        ? {
            usernameOrEmail: formData.username,
            username: formData.username,
            password: formData.password,
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: `${formData.firstName} ${formData.lastName}`.trim() || formData.username,
            phoneNumber: formData.phone || '',
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let data = null
      try {
        data = await response.json()
      } catch (e) {}

      if (response.status >= 400 && response.status < 500 && data && data.message) {
        const errMsg = data.message
        setError(errMsg)
        if (errMsg.toLowerCase().includes('korisničko ime')) {
          setFieldErrors((prev) => ({ ...prev, username: errMsg }))
        } else if (errMsg.toLowerCase().includes('email')) {
          setFieldErrors((prev) => ({ ...prev, email: errMsg }))
        } else if (errMsg.toLowerCase().includes('lozinka')) {
          setFieldErrors((prev) => ({ ...prev, password: errMsg }))
        }
        setLoading(false)
        return
      }

      if (!response.ok || !data) {
        throw new Error('Backend is offline')
      }


      if (data && data.token) {
        if (onSuccess) onSuccess(data.token)
        const userObj = {
          username: data.username || formData.username,
          role: data.role || 'ROLE_USER',
          firstName: formData.firstName || data.fullName?.split(' ')[0] || data.username,
          lastName: formData.lastName || data.fullName?.split(' ').slice(1).join(' ') || '',
          email: data.email || formData.email,
          city: formData.city || 'Beograd',
          address: formData.address || '',
          birthDate: formData.birthDate || '',
          phone: formData.phone || '',
          loyaltyPoints: data.loyaltyPoints ?? 0,
          tier: data.loyaltyTier || 'BRONZE',
        }
        updateUserProfile(userObj)
        setAuthSuccessInfo({
          title: isLogin ? 'Uspešna prijava!' : 'Uspešna registracija!',
          subtitle: isLogin
            ? `Dobrodošli nazad, ${userObj.firstName || userObj.username}!`
            : `Vaš nalog za ${userObj.email} je spreman za korišćenje.`,
          type: isLogin ? 'login' : 'register',
        })
      }


    } catch (err) {
      // Local mode validation fallback when backend endpoint is not active
      const inputName = (formData.username || '').trim()
      const inputPass = (formData.password || '').trim()

      if (isLogin) {
        if (inputName.toLowerCase() === 'admin') {
          if (inputPass && inputPass !== 'admin') {
            setError('Neispravna lozinka za admin nalog.')
            setFieldErrors({ password: 'Neispravna lozinka' })
            setLoading(false)
            return
          }
          loginAsAdmin()
          setAuthSuccessInfo({
            title: 'Uspešna prijava!',
            subtitle: 'Prijavljeni ste kao Administrator.',
            type: 'login',
          })
          setLoading(false)
          return
        }

        const existingUser = getRegisteredUser(inputName)
        if (!existingUser) {
          setError('Korisnički nalog ne postoji u bazi.')
          setFieldErrors({ username: 'Korisnički nalog ne postoji u bazi' })
          setLoading(false)
          return
        }

        if (existingUser.password && existingUser.password !== inputPass) {
          setError('Neispravna lozinka. Molimo vas pokušajte ponovo.')
          setFieldErrors({ password: 'Pogrešna lozinka' })
          setLoading(false)
          return
        }

        updateUserProfile(existingUser)
        setAuthSuccessInfo({
          title: 'Uspešna prijava!',
          subtitle: `Dobrodošli nazad, ${existingUser.firstName || existingUser.username}!`,
          type: 'login',
        })
      } else {
        const existingUserByUsername = getRegisteredUser(inputName)
        const existingUserByEmail = formData.email ? getRegisteredUser(formData.email) : null

        if (existingUserByUsername) {
          setError('Korisničko ime je već u upotrebi.')
          setFieldErrors({ username: 'Korisničko ime je već zauzeto' })
          setLoading(false)
          return
        }

        if (existingUserByEmail) {
          setError('Email adresa je već u upotrebi.')
          setFieldErrors({ email: 'Email adresa je već u upotrebi' })
          setLoading(false)
          return
        }

        const newRegUser = {
          username: inputName || 'korisnik',
          password: inputPass,
          role: 'ROLE_USER',
          firstName: formData.firstName || inputName || 'Novi',
          lastName: formData.lastName || 'Korisnik',
          email: formData.email || `${inputName}@example.com`,
          city: formData.city || 'Beograd',
          address: formData.address || '',
          birthDate: formData.birthDate || '',
          phone: formData.phone || '',
          loyaltyPoints: 0,
          tier: 'BRONZE',
        }
        updateUserProfile(newRegUser)
        setAuthSuccessInfo({
          title: 'Uspešna registracija!',
          subtitle: `Dobrodošli u HypeCinema, ${newRegUser.firstName}! Vaš nalog sa email adresom ${newRegUser.email} je kreiran.`,
          type: 'register',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setAuthSuccessInfo(null)
        setFieldErrors({})
        setError('')
        onClose()
      }}
      title={authSuccessInfo ? authSuccessInfo.title : isLogin ? 'Prijava na profil' : 'Kreirajte nalog'}
      maxWidth="500px"
    >
      {authSuccessInfo ? (
        <div style={{ textAlign: 'center', padding: '24px 12px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#10b981',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
            {authSuccessInfo.title}
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
            {authSuccessInfo.subtitle}
          </p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => {
              setAuthSuccessInfo(null)
              setFieldErrors({})
              setError('')
              onClose()
            }}
          >
            Nastavi sa korišćenjem
          </Button>
        </div>
      ) : (

        <>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error-banner">{error}</div>}

            {!isLogin && (
              <>
                <div className="auth-form-row">
                  <InputField
                    label="Ime"
                    name="firstName"
                    placeholder="Andrija"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={fieldErrors.firstName}
                    required
                  />
                  <InputField
                    label="Prezime"
                    name="lastName"
                    placeholder="Milovanovic"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={fieldErrors.lastName}
                    required
                  />
                </div>

                <div className="auth-form-row">
                  <InputField
                    label="Grad"
                    name="city"
                    placeholder="Beograd"
                    value={formData.city}
                    onChange={handleChange}
                    error={fieldErrors.city}
                    required
                  />
                  <InputField
                    label="Adresa"
                    name="address"
                    placeholder="Bulevar Mihajla Pupina 10"
                    value={formData.address}
                    onChange={handleChange}
                    error={fieldErrors.address}
                    required
                  />
                </div>

                <div className="auth-form-row">
                  <InputField
                    label="Datum rođenja"
                    name="birthDate"
                    type="date"
                    placeholder="15.05.1998"
                    value={formData.birthDate}
                    onChange={handleChange}
                    error={fieldErrors.birthDate}
                    required
                  />
                  <InputField
                    label="Telefon"
                    name="phone"
                    placeholder="+381 64 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    error={fieldErrors.phone}
                    required
                  />
                </div>
              </>
            )}

            <InputField
              label="Korisničko ime"
              name="username"
              placeholder="aandrijq"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              error={fieldErrors.username}
              required
            />

            {!isLogin && (
              <InputField
                label="Email adresa"
                name="email"
                type="email"
                placeholder="aandrijq@gmail.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
                required
              />
            )}

            <InputField
              label="Lozinka"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {isLogin ? (
                <>
                  <LogIn size={18} /> {loading ? 'Prijava...' : 'Prijavi se'}
                </>
              ) : (
                <>
                  <UserPlus size={18} /> {loading ? 'Registracija...' : 'Registruj se'}
                </>
              )}
            </Button>

            <div className="auth-switch">
              <span className="auth-switch-text">
                {isLogin ? 'Nemate nalog?' : 'Već imate nalog?'}
              </span>
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setFieldErrors({})
                }}
              >
                {isLogin ? 'Registrujte se' : 'Prijavite se'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}
