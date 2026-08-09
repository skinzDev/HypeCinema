import { useState } from 'react'
import Modal from './Modal'
import InputField from './InputField'
import Button from './Button'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, UserPlus } from 'lucide-react'

/**
 * Combined Login & Register modal component.
 * Toggles between Login and Register views.
 */
export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = 'Korisničko ime je obavezno'
    if (!formData.password.trim()) newErrors.password = 'Lozinka je obavezna'
    if (formData.password.length < 6) newErrors.password = 'Lozinka mora imati bar 6 karaktera'
    if (!isLogin) {
      if (!formData.email.trim()) newErrors.email = 'Email je obavezan'
      if (!formData.firstName.trim()) newErrors.firstName = 'Ime je obavezno'
      if (!formData.lastName.trim()) newErrors.lastName = 'Prezime je obavezno'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin
        ? { username: formData.username, password: formData.password }
        : formData

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Greška pri autentifikaciji')
      }

      const data = await res.json()
      login(data.token)
      onClose()
      setFormData({ username: '', email: '', password: '', firstName: '', lastName: '' })
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? 'Prijava' : 'Registracija'}
      maxWidth="440px"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {errors.general && (
          <div className="auth-error-banner">{errors.general}</div>
        )}

        <InputField
          label="Korisničko ime"
          name="username"
          value={formData.username}
          onChange={handleChange}
          icon={User}
          error={errors.username}
          required
        />

        {!isLogin && (
          <>
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              error={errors.email}
              required
            />
            <div className="auth-form-row">
              <InputField
                label="Ime"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <InputField
                label="Prezime"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>
          </>
        )}

        <InputField
          label="Lozinka"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          error={errors.password}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Učitavanje...' : isLogin ? 'Prijavi se' : 'Registruj se'}
        </Button>

        <div className="auth-switch">
          <span className="auth-switch-text">
            {isLogin ? 'Nemaš nalog?' : 'Već imaš nalog?'}
          </span>
          <button type="button" className="auth-switch-btn" onClick={switchMode}>
            {isLogin ? 'Registruj se' : 'Prijavi se'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
