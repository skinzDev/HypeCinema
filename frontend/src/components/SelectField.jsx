import { ChevronDown } from 'lucide-react'

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  children,
  required = false,
  className = '',
  disabled = false,
  icon: Icon,
  placeholder,
  error,
  ...props
}) {
  return (
    <div className={`select-field ${error ? 'select-field--error' : ''} ${className}`.trim()}>
      {label && (
        <label className="input-field-label" style={error ? { color: '#ef4444' } : {}}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <div className="select-field-wrapper">
        {Icon && <Icon size={16} className="select-field-icon" />}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`select-field-input ${Icon ? 'has-icon' : ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children
            ? children
            : options.map((opt) => {
                const val = typeof opt === 'object' ? opt.value : opt
                const lab = typeof opt === 'object' ? opt.label : opt
                return (
                  <option key={val} value={val}>
                    {lab}
                  </option>
                )
              })}
        </select>
        <div className="select-field-chevron-box">
          <ChevronDown size={15} className="select-field-chevron" />
        </div>
      </div>
      {error && <span className="input-field-error">{error}</span>}
    </div>
  )
}
