import { useState } from 'react'
import { User, Lock, Mail, UserPlus, LogIn, Zap } from 'lucide-react'
import Modal from './Modal'
import InputField from './InputField'
import Button from './Button'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { loginAsDemoUser, updateUserProfile } = useAuth()
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
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
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleDemoLogin = () => {
    loginAsDemoUser()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Greška pri autentičnosti')
      }

      if (data.token) {
        if (onSuccess) onSuccess(data.token)
        updateUserProfile(formData)
        onClose()
      }
    } catch (err) {
      // Fallback for local demo mode testing
      if (!isLogin) {
        updateUserProfile({
          username: formData.username || 'korisnik',
          firstName: formData.firstName || 'Andrija',
          lastName: formData.lastName || 'Milovanovic',
          email: formData.email || 'aandrijq@gmail.com',
          city: formData.city || 'Beograd',
          address: formData.address || 'Bulevar Mihajla Pupina 10',
          birthDate: formData.birthDate || '15.05.1998',
          phone: formData.phone || '+381 64 123 4567',
        })
      } else {
        loginAsDemoUser()
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? 'Prijava na profil' : 'Kreirajte nalog'}
      maxWidth="500px"
    >
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleDemoLogin}
          style={{ borderColor: 'var(--color-accent-primary)', color: '#ffffff' }}
        >
          <Zap size={16} /> 1-Klik Prijava ako se prijavljujete kao korisnik
        </Button>
      </div>

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
                required
              />
              <InputField
                label="Prezime"
                name="lastName"
                placeholder="Milovanovic"
                value={formData.lastName}
                onChange={handleChange}
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
                required
              />
              <InputField
                label="Adresa"
                name="address"
                placeholder="Bulevar Mihajla Pupina 10"
                value={formData.address}
                onChange={handleChange}
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
                required
              />
              <InputField
                label="Telefon"
                name="phone"
                placeholder="+381 64 123 4567"
                value={formData.phone}
                onChange={handleChange}
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
            }}
          >
            {isLogin ? 'Registrujte se' : 'Prijavite se'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
