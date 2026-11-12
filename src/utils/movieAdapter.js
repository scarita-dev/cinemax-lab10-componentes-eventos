// Adapter pattern: translate the API payload into the single movie model the
// UI understands. Components never read API field names such as poster_path or
// vote_average; they only receive id, title, image, synopsis, classification,
// rating, showtimes and (for premieres) releaseDate.
const FALLBACK_POSTER = '/posters/pelicula-1.svg'

function pickShowtimes(rawMovie) {
  if (Array.isArray(rawMovie.schedule)) return rawMovie.schedule
  if (Array.isArray(rawMovie.showtimes)) return rawMovie.showtimes
  return []
}

export function adaptMovie(rawMovie) {
  if (!rawMovie || typeof rawMovie !== 'object') {
    throw new TypeError('adaptMovie expects a movie object')
  }

  const rawRating = Number(rawMovie.vote_average ?? rawMovie.rating ?? 0)

  return {
    id: rawMovie.id,
    title: rawMovie.title ?? 'Sin título',
    image: rawMovie.poster_path ?? rawMovie.image ?? FALLBACK_POSTER,
    synopsis: rawMovie.overview ?? rawMovie.synopsis ?? '',
    classification: rawMovie.age_rating ?? rawMovie.classification ?? 'APT',
    rating: Number.isFinite(rawRating) ? rawRating : 0,
    showtimes: pickShowtimes(rawMovie),
    releaseDate: rawMovie.release_date ?? null,
  }
}

export function adaptMovies(rawMovies = []) {
  if (!Array.isArray(rawMovies)) return []
  return rawMovies.map(adaptMovie)
}
