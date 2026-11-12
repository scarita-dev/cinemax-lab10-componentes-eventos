const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function formatReleaseDate(value) {
  if (!value) return 'Fecha por confirmar'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'Fecha por confirmar'

  return dateFormatter.format(date)
}

function PremiereCard({ premiere }) {
  return (
    <article className="premiere-card">
      <img
        className="premiere-card__poster"
        src={premiere.image}
        alt={`Póster de ${premiere.title}`}
        loading="lazy"
      />
      <div className="premiere-card__body">
        <div className="premiere-card__meta">
          <span className="premiere-card__badge">Estreno</span>
          <time dateTime={premiere.releaseDate ?? undefined}>
            {formatReleaseDate(premiere.releaseDate)}
          </time>
        </div>
        <h3 className="premiere-card__title">{premiere.title}</h3>
        <p className="premiere-card__synopsis">{premiere.synopsis}</p>
        <div className="premiere-card__footer">
          <span className="premiere-card__classification">
            {premiere.classification}
          </span>
          <span className="premiere-card__rating">
            {premiere.rating.toFixed(1)} ★
          </span>
        </div>
      </div>
    </article>
  )
}

export default PremiereCard
