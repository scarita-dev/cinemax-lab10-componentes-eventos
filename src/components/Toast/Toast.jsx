function Toast({ message, tone = 'success', onDismiss }) {
  const icon = tone === 'success' ? '★' : tone === 'error' ? '!' : 'i'

  return (
    <div className={`toast toast--${tone}`} role="status">
      <span className="toast__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="toast__message">{message}</p>
      <button
        type="button"
        className="toast__close"
        onClick={onDismiss}
        aria-label="Cerrar aviso"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
