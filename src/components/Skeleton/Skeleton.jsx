function Skeleton({ count = 3, label = 'Cargando contenido…' }) {
  const items = Array.from({ length: count }, (_, index) => (
    <div className="skeleton" key={index} aria-hidden="true">
      <div className="skeleton__media" />
      <div className="skeleton__body">
        <span className="skeleton__line skeleton__line--short" />
        <span className="skeleton__line skeleton__line--title" />
        <span className="skeleton__line" />
        <span className="skeleton__line skeleton__line--medium" />
      </div>
    </div>
  ))

  return (
    <div
      className="skeleton-group"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {items}
    </div>
  )
}

export default Skeleton
