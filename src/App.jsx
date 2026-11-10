import { useEffect, useRef, useState } from 'react'
import movies from './data/movies'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import MovieList from './components/MovieList/MovieList'
import Footer from './components/Footer/Footer'

const SEARCH_DELAY_MS = 300 // milliseconds to wait before filtering
const FAVORITES_STORAGE_KEY = 'cinemax:favorites'
const LEGACY_FAVORITES_STORAGE_KEY = 'cinemax:favoritas'

// Step 10: read the saved favorites. Returns [] when there is nothing stored,
// when the browser blocks storage, or when the stored value is corrupted.
function loadFavorites() {
  try {
    const stored =
      localStorage.getItem(FAVORITES_STORAGE_KEY) ??
      localStorage.getItem(LEGACY_FAVORITES_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  // Step 4: favorites list. It lives in App because MovieCard (grandchild)
  // renders it and MovieList (child) iterates over it: state is lifted to the
  // closest common ancestor.
  // Step 10: the initial value is read lazily from localStorage, only the first
  // time the component mounts, so favorites survive page reloads.
  const [favorites, setFavorites] = useState(loadFavorites)

  // Step 10: every time favorites change, persist them in the browser.
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Storage unavailable (private mode, full quota...): the app keeps
      // working, just without persistence.
    }
  }, [favorites])

  // Step 6: search text. It lives in App because Hero (banner) writes it and
  // MovieList reads it to filter: state lifted to the common ancestor.
  const [query, setQuery] = useState('')

  // Step 7: delayed copy of the text. This is the value the filter actually
  // uses, so every keystroke only repaints the input and does not walk the
  // movie list.
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    console.info(`[MovieSearch] keystroke -> "${query}"`)

    timerRef.current = setTimeout(() => {
      console.info(`[Filter] applied with "${query}"`)
      setDebouncedQuery(query)
    }, SEARCH_DELAY_MS)

    return () => clearTimeout(timerRef.current)
  }, [query])

  const toggleFavorite = (movieId) => {
    setFavorites((current) =>
      current.includes(movieId)
        ? current.filter((id) => id !== movieId)
        : [...current, movieId],
    )
  }

  // Clearing should not wait for the delay: it removes the text and the
  // result immediately.
  const clearQuery = () => {
    clearTimeout(timerRef.current)
    setQuery('')
    setDebouncedQuery('')
  }

  // Banner call to action: it skips the delay and filters right away.
  const applySearchNow = () => {
    clearTimeout(timerRef.current)
    setDebouncedQuery(query)
  }

  return (
    <>
      <Header />
      <main className="main container">
        <Hero
          featuredMovie={movies[0]}
          query={query}
          onQueryChange={setQuery}
          onSearch={applySearchNow}
        />
        <MovieList
          movies={movies}
          query={debouncedQuery}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onClearQuery={clearQuery}
        />
      </main>
      <Footer />
    </>
  )
}

export default App
