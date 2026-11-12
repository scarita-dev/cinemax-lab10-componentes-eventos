import cinema from '../../data/cinema'

function Header({ favoriteCount = 0 }) {
  return (
    <header className="header">
      <div className="header__inner container">
        <a href="#" className="header__logo">
          Cine<span>Max</span>
        </a>
        <nav className="header__nav" aria-label="Principal">
          <ul>
            {cinema.navigation.map((item) => (
              <li key={item.href}>
                <a className="header__link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <span
            className="header__favorites"
            aria-live="polite"
            aria-label={`${favoriteCount} ${
              favoriteCount === 1 ? 'película favorita' : 'películas favoritas'
            }`}
          >
            <span className="header__favorites-star" aria-hidden="true">
              ★
            </span>
            <span className="header__favorites-label">Favoritas</span>
            <span className="header__favorites-count">{favoriteCount}</span>
          </span>
        </nav>
      </div>
    </header>
  )
}

export default Header
