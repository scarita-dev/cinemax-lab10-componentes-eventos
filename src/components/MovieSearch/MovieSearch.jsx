function MovieSearch({ value, onChange }) {
  return (
    <div className="movie-search">
      <label className="movie-search__label" htmlFor="movie-search-input">
        Buscar película
      </label>
      <input
        id="movie-search-input"
        className="movie-search__input"
        type="search"
        placeholder="Título o sinopsis…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default MovieSearch
