import { useEffect, useState } from 'react'

function readWindowSize() {
  if (typeof window === 'undefined') {
    return { width: 1280, height: 800 }
  }

  return { width: window.innerWidth, height: window.innerHeight }
}

// Subscribes to viewport changes. MovieList uses it to choose the number of
// cards per row and PremieresCarousel uses it to choose the visible slides.
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(readWindowSize)

  useEffect(() => {
    const handleResize = () => setWindowSize(readWindowSize())

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return windowSize
}
