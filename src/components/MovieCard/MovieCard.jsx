import Button from '../Button/Button'

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  return (
    <div className="movie-card">
      <img
        src={movie.image}
        alt={movie.title}
        className="movie-card__image"
      />
      <div className="movie-card__info">
        <div className="movie-card__header">
          <h3 className="movie-card__title">{movie.title}</h3>
          <Button
            variant={isFavorite ? 'favorite' : 'ghost'}
            className="movie-card__favorite"
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Quitar ${movie.title} de favoritas`
                : `Añadir ${movie.title} a favoritas`
            }
            onClick={() => onToggleFavorite(movie.id)}
          >
            {isFavorite ? '★ Favorita' : '☆ Favorita'}
          </Button>
        </div>
        <div className="movie-card__rating">{movie.rating} ⭐</div>
        <p className="movie-card__showtimes">
          {movie.showtimes.map((showtime) => (
            <span key={showtime} className="movie-card__showtime">
              {showtime}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
