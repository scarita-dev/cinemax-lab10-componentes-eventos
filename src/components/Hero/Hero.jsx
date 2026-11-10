import Button from '../Button/Button'
import MovieSearch from '../MovieSearch/MovieSearch'

function Hero({ featuredMovie, query, onQueryChange, onSearch }) {
  return (
    <section className="hero">
      <img
        src={featuredMovie.image}
        alt={featuredMovie.title}
        className="hero__image"
      />
      <div className="hero__content">
        <p className="hero__eyebrow">Película destacada</p>
        <h2 className="hero__title">{featuredMovie.title}</h2>
        <p className="hero__synopsis">{featuredMovie.synopsis}</p>
        <form
          className="hero__search"
          onSubmit={(event) => {
            event.preventDefault()
            onSearch?.()
          }}
        >
          <MovieSearch value={query} onChange={onQueryChange} />
          <Button type="submit" variant="primary">
            Buscar
          </Button>
        </form>
      </div>
    </section>
  )
}

export default Hero
