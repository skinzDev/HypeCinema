import { useState } from 'react'
import { User, Lock, Mail, UserPlus, LogIn } from 'lucide-react'
import Modal from './Modal'
import InputField from './InputField'
import Button from './Button'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
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
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Došlo je do neočekivane greške')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? 'Prijava na profil' : 'Kreirajte nalog'}
      maxWidth="440px"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error-banner">{error}</div>}

        {!isLogin && (
          <div className="auth-form-row">
            <InputField
              label="Ime"
              name="firstName"
              placeholder="Marko"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Prezime"
              name="lastName"
              placeholder="Marković"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <InputField
          label="Korisničko ime"
          name="username"
          placeholder="korisnik123"
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
            placeholder="marko@example.com"
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
