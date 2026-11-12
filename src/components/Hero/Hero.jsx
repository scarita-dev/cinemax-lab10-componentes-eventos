import Button from '../Button/Button'
import MovieSearch from '../MovieSearch/MovieSearch'

function Hero({ featuredMovie, query, onQueryChange, onSearch, onClearQuery }) {
  const hasQuery = query.trim() !== ''

  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        src={featuredMovie.image}
        alt={`Póster de ${featuredMovie.title}`}
        className="hero__image"
      />
      <div className="hero__content">
        <p className="eyebrow">Película destacada</p>
        <h2 className="hero__title" id="hero-title">
          {featuredMovie.title}
        </h2>
        <p className="hero__synopsis">{featuredMovie.synopsis}</p>
        <form
          className="hero__search"
          onSubmit={(event) => {
            event.preventDefault()
            onSearch?.()
          }}
        >
          <MovieSearch value={query} onChange={onQueryChange} />
          <div className="hero__actions">
            <Button type="submit" variant="primary">
              Buscar
            </Button>
            {hasQuery && (
              <Button variant="secondary" onClick={onClearQuery}>
                Limpiar filtro
              </Button>
            )}
          </div>
        </form>
        {hasQuery && (
          <p className="hero__filter-note" role="status">
            Filtro activo: «{query}»
          </p>
        )}
      </div>
    </section>
  )
}

export default Hero
