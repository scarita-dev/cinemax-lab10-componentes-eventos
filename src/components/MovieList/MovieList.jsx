import MovieCard from '../MovieCard/MovieCard'
import Button from '../Button/Button'

function MovieList({ movies: moviesProp, query, favorites, onToggleFavorite, onClearQuery }) {
  const text = query.trim().toLowerCase()
  const filtered =
    text === ''
      ? moviesProp
      : moviesProp.filter(
          (movie) =>
            stripAccents(movie.title).includes(stripAccents(text)) ||
            stripAccents(movie.synopsis).includes(stripAccents(text)),
        )

  // Step 8: empty state when no movie matches the search.
  if (filtered.length === 0) {
    return (
      <div className="movie-list__empty" role="status">
        <p className="lead">
          No hay películas que coincidan con “{query}”.
        </p>
        <Button variant="secondary" onClick={onClearQuery}>
          Limpiar búsqueda
        </Button>
      </div>
    )
  }

  return (
    <ul className="movie-list">
      {filtered.map((movie) => (
        <li key={movie.id}>
          <MovieCard
            movie={movie}
            isFavorite={favorites.includes(movie.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  )
}

// Case-insensitive and accent-insensitive comparison: "orion" finds "Orión".
// \p{M} are the Unicode marks (accents) that NFD separates from the letter.
function stripAccents(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export default MovieList
