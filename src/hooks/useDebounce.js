import { useCallback, useEffect, useRef, useState } from 'react'

// Keeps a delayed copy of a value. The hook is used by the search input in App
// and can be reused by any other control that needs a debounce.
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef(null)
  const pendingValueRef = useRef(value)

  useEffect(() => {
    pendingValueRef.current = value
    console.info(`[useDebounce] keystroke -> "${value}"`)

    timeoutRef.current = setTimeout(() => {
      console.info(`[useDebounce] applied -> "${value}"`)
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeoutRef.current)
  }, [value, delay])

  // Apply the latest text immediately (banner CTA).
  const flush = useCallback((nextValue = pendingValueRef.current) => {
    clearTimeout(timeoutRef.current)
    pendingValueRef.current = nextValue
    setDebouncedValue(nextValue)
  }, [])

  // Clear both the input value and the delayed value (banner clear button).
  const reset = useCallback((nextValue = '') => {
    clearTimeout(timeoutRef.current)
    pendingValueRef.current = nextValue
    setDebouncedValue(nextValue)
  }, [])

  return {
    debouncedValue,
    isPending: value !== debouncedValue,
    flush,
    reset,
  }
}
