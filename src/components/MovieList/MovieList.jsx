import { useMemo } from 'react'
import MovieCard from '../MovieCard/MovieCard'
import Button from '../Button/Button'
import useWindowSize from '../../hooks/useWindowSize'
import { getMovieColumns } from '../../utils/layout'

function MovieList({ movies: moviesProp, query, favorites, onToggleFavorite, onClearQuery }) {
  const { width } = useWindowSize()
  const columns = getMovieColumns(width)
  const text = query.trim().toLowerCase()
  const isFiltering = text !== ''

  const filtered = useMemo(
    () =>
      text === ''
        ? moviesProp
        : moviesProp.filter(
            (movie) =>
              stripAccents(movie.title).includes(stripAccents(text)) ||
              stripAccents(movie.synopsis).includes(stripAccents(text)),
          ),
    [moviesProp, text],
  )

  return (
    <section className="movie-section" id="cartelera" aria-labelledby="cartelera-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">En cartelera</p>
          <h2 className="section-title" id="cartelera-title">
            Cartelera
          </h2>
        </div>
        <p className="section-count" role="status">
          {filtered.length} de {moviesProp.length} películas
          {isFiltering ? ` para «${query}»` : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="movie-list__empty" role="status">
          <p className="lead">No hay películas que coincidan con “{query}”.</p>
          <Button variant="secondary" onClick={onClearQuery}>
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <ul
          className="movie-list"
          style={{ '--movie-columns': columns }}
          data-columns={columns}
        >
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
      )}
    </section>
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
