import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ message, type = 'info', isVisible, onClose, duration = 4000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: <CheckCircle2 size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  }

  return (
    <div className="toast-container">
      <div className={`toast toast--${type} toast--visible`}>
        <span className="toast-icon">{icons[type] || icons.info}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose} aria-label="Zatvori">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
