import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

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
        <label className="input-field-label" style={error ? { color: '#ef4444' } : {}}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <div
        className="input-field-wrapper"
        style={error ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.04)' } : {}}
      >
        {Icon && <Icon size={18} className="input-field-icon" style={error ? { color: '#ef4444' } : {}} />}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field-input"
          {...props}
        />
        {error && (
          <div
            title={error}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              marginLeft: '6px',
              flexShrink: 0,
            }}
          >
            <AlertCircle size={20} />
          </div>
        )}
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
      {error && (
        <span
          className="input-field-error"
          style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {error}
        </span>
      )}
    </div>
  )
}

