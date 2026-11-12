import { useCallback, useEffect, useState } from 'react'
import premieres from '../data/premieres'
import { adaptMovies } from '../utils/movieAdapter'

export const PREMIERES_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

const PREMIERES_DELAY_MS = 2200
const PREMIERES_ERROR_MESSAGE =
  'La solicitud de estrenos falló. Revisa la conexión e inténtalo de nuevo.'

// Simulates a network request and exposes the three UI states that the
// component has to handle: loading, success and error. The request is
// cancelled on unmount so no state is written after the section disappears.
export default function usePremieres({ shouldFail = false, delay = PREMIERES_DELAY_MS } = {}) {
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${shouldFail ? 'error' : 'data'}:${attempt}`

  // The stored result belongs to a request key. While the key of the current
  // render does not match, the hook reports "loading" without setting state
  // synchronously inside the effect.
  const [result, setResult] = useState({
    key: requestKey,
    status: PREMIERES_STATUS.LOADING,
    items: [],
    error: null,
  })

  useEffect(() => {
    let isActive = true

    const timer = setTimeout(() => {
      if (!isActive) return

      setResult({
        key: requestKey,
        status: shouldFail ? PREMIERES_STATUS.ERROR : PREMIERES_STATUS.SUCCESS,
        items: shouldFail ? [] : adaptMovies(premieres),
        error: shouldFail ? PREMIERES_ERROR_MESSAGE : null,
      })
    }, delay)

    return () => {
      isActive = false
      clearTimeout(timer)
    }
  }, [delay, requestKey, shouldFail])

  const isCurrentRequest = result.key === requestKey

  const retry = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  return {
    status: isCurrentRequest ? result.status : PREMIERES_STATUS.LOADING,
    items: isCurrentRequest ? result.items : [],
    error: isCurrentRequest ? result.error : null,
    retry,
  }
}
