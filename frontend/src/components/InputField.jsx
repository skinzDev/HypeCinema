import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Reusable Input field component with floating label and optional password toggle.
 */
export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  name,
  required = false,
  error = '',
  placeholder = '',
  icon: Icon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''}`}>
      {label && (
        <label className="input-field-label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="input-field-wrapper">
        {Icon && <Icon size={18} className="input-field-icon" />}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder || label}
          className="input-field-input"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-field-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="input-field-error">{error}</span>}
    </div>
  )
}
