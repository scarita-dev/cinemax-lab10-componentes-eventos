import { useEffect, useState } from 'react'
import rawMovies from './data/movies'
import { adaptMovies } from './utils/movieAdapter'
import useDebounce from './hooks/useDebounce'
import useToast from './hooks/useToast'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import PremieresSection from './components/PremieresSection/PremieresSection'
import MovieList from './components/MovieList/MovieList'
import Footer from './components/Footer/Footer'

const SEARCH_DELAY_MS = 300 // milliseconds to wait before filtering
const FAVORITES_STORAGE_KEY = 'cinemax:favorites'
const LEGACY_FAVORITES_STORAGE_KEY = 'cinemax:favoritas'

// Step 3: the raw catalog is adapted once, outside the component, so every
// render receives the same application model.
const movies = adaptMovies(rawMovies)

// Read the saved favorites. Returns [] when there is nothing stored, when the
// browser blocks storage, or when the stored value is corrupted.
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
  // Favorites live in App because MovieList reads them, MovieCard paints them
  // and Header only needs the count: App is the closest common ancestor.
  const [favorites, setFavorites] = useState(loadFavorites)
  const [query, setQuery] = useState('')
  const { debouncedValue: debouncedQuery, flush, reset } = useDebounce(
    query,
    SEARCH_DELAY_MS,
  )
  const { showToast } = useToast()

  // Persist favorites every time they change.
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Storage unavailable (private mode, full quota...): the app keeps
      // working, just without persistence.
    }
  }, [favorites])

  // Step 4: the card only calls this handler. It does not import the toast,
  // so the card has no idea how (or where) the confirmation is displayed.
  const toggleFavorite = (movieId) => {
    const wasFavorite = favorites.includes(movieId)
    const movie = movies.find((item) => item.id === movieId)
    const title = movie?.title ?? 'La película'

    setFavorites((current) =>
      current.includes(movieId)
        ? current.filter((id) => id !== movieId)
        : [...current, movieId],
    )

    showToast({
      message: wasFavorite
        ? `«${title}» se quitó de favoritas.`
        : `«${title}» se añadió a favoritas.`,
      tone: wasFavorite ? 'info' : 'success',
    })
  }

  // Step 10: clearing from the banner updates the input and the list at the
  // same time, without waiting for the debounce.
  const clearQuery = () => {
    setQuery('')
    reset('')
  }

  // The banner CTA applies the current text immediately.
  const applySearchNow = () => flush(query)

  return (
    <>
      <Header favoriteCount={favorites.length} />
      <main className="main container">
        <Hero
          featuredMovie={movies[0]}
          query={query}
          onQueryChange={setQuery}
          onSearch={applySearchNow}
          onClearQuery={clearQuery}
        />
        <PremieresSection />
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
