import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Toast from '../Toast/Toast'
import { ToastContext } from '../../context/toastContext'

const TOAST_DURATION_MS = 5000
const MAX_VISIBLE_TOASTS = 3

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextIdRef = useRef(0)
  const timersRef = useRef(new Map())

  const removeToast = useCallback((id) => {
    const timer = timersRef.current.get(id)
    if (timer) clearTimeout(timer)
    timersRef.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ message, tone = 'success' }) => {
      nextIdRef.current += 1
      const id = nextIdRef.current
      const toast = { id, message, tone }

      setToasts((current) => [...current, toast].slice(-MAX_VISIBLE_TOASTS))

      const timer = setTimeout(() => removeToast(id), TOAST_DURATION_MS)
      timersRef.current.set(id, timer)
    },
    [removeToast],
  )

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = useMemo(
    () => ({ showToast, removeToast }),
    [showToast, removeToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            tone={toast.tone}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
