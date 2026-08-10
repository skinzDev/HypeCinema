export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClass = 'btn'
  const variantClass = `btn--${variant}`
  const sizeClass = `btn--${size}`
  const fullClass = fullWidth ? 'btn--full' : ''

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${fullClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
