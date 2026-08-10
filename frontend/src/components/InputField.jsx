import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`.trim()}>
      {label && (
        <label className="input-field-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="input-field-wrapper">
        {Icon && <Icon size={18} className="input-field-icon" />}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field-input"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-field-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span className="input-field-error">{error}</span>}
    </div>
  )
}
