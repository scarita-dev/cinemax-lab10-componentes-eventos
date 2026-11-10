# Entregable — Laboratorio 10: Componentes y eventos

## Datos del alumno

| Campo | Valor |
| ----- | ----- |
| **Nombre** | Michael Montgomery Rosell |
| **Curso** | Desarrollo de Aplicaciones Empresariales |
| **Sección** | 4-C24-A |
| **Laboratorio** | N.° 10 — Componentes y eventos |
| **Proyecto** | CineMax (cartelera de cine) |
| **Repositorio** | Proyecto acumulativo del Laboratorio 9 |

---

## 1. Captura del resultado

| Evidencia | Archivo |
| --------- | ------- |
| Pantalla completa de la aplicación | [`evidencias/07-pantalla-completa.png`](./evidencias/07-pantalla-completa.png) |
| Close-up del banner con el buscador y su CTA | [`evidencias/02-hero.png`](./evidencias/02-hero.png) |
| Close-up de las tarjetas con el botón de favorita | [`evidencias/10-favorita.png`](./evidencias/10-favorita.png) |
| Búsqueda por título (`orion`) | [`evidencias/09-busqueda-orion.png`](./evidencias/09-busqueda-orion.png) |
| Estado vacío del buscador | [`evidencias/08-estado-vacio-buscador.png`](./evidencias/08-estado-vacio-buscador.png) |
| Consola sin errores | [`evidencias/04-consola-sin-errores.png`](./evidencias/04-consola-sin-errores.png) |
| Estructura de commits | [`evidencias/05-commits.png`](./evidencias/05-commits.png) |

---

## 2. Código implementado

### 2.1 Componente reutilizable `Button` (paso 3)

Recibe el contenido por `children` y el aspecto por `variant`. El mismo componente se
usa en el banner, en la tarjeta y en el estado vacío.

```jsx
// src/components/Button/Button.jsx
function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
```

Las variantes se definen una sola vez en `src/styles/components/button.css`
(`primary`, `secondary`, `ghost` y `favorite`) y se importan desde `main.css`.

### 2.2 Estado de favoritas y comunicación hacia arriba (pasos 4 y 5)

```jsx
// src/App.jsx
const [favorites, setFavorites] = useState(loadFavorites)

const toggleFavorite = (movieId) => {
  setFavorites((current) =>
    current.includes(movieId)
      ? current.filter((id) => id !== movieId)
      : [...current, movieId],
  )
}
```

`App` pasa `onToggleFavorite` a `MovieList`, que a su vez la pasa a cada `MovieCard`.
El hijo avisa al padre por la función recibida y **no toca el estado ajeno**:

```jsx
// src/components/MovieCard/MovieCard.jsx
<Button
  variant={isFavorite ? 'favorite' : 'ghost'}
  aria-pressed={isFavorite}
  aria-label={isFavorite ? `Quitar ${movie.title} de favoritas` : `Añadir ${movie.title} a favoritas`}
  onClick={() => onToggleFavorite(movie.id)}
>
  {isFavorite ? '★ Favorita' : '☆ Favorita'}
</Button>
```

### 2.3 Entrada controlada y retardo del buscador (pasos 6 y 7)

```jsx
// src/components/MovieSearch/MovieSearch.jsx
<input
  className="movie-search__input"
  type="search"
  value={value}
  onChange={(event) => onChange(event.target.value)}
/>
```

```jsx
// src/App.jsx
const [query, setQuery] = useState('')
const [debouncedQuery, setDebouncedQuery] = useState('')

useEffect(() => {
  console.info(`[MovieSearch] keystroke -> "${query}"`)

  timerRef.current = setTimeout(() => {
    console.info(`[Filter] applied with "${query}"`)
    setDebouncedQuery(query)
  }, SEARCH_DELAY_MS)

  return () => clearTimeout(timerRef.current)
}, [query])
```

### 2.4 Filtrado y estado vacío (paso 8)

```jsx
// src/components/MovieList/MovieList.jsx
const text = query.trim().toLowerCase()
const filtered =
  text === ''
    ? moviesProp
    : moviesProp.filter(
        (movie) =>
          stripAccents(movie.title).includes(stripAccents(text)) ||
          stripAccents(movie.synopsis).includes(stripAccents(text)),
      )

if (filtered.length === 0) {
  return (
    <div className="movie-list__empty" role="status">
      <p className="lead">No hay películas que coincidan con “{query}”.</p>
      <Button variant="secondary" onClick={onClearQuery}>
        Limpiar búsqueda
      </Button>
    </div>
  )
}
```

### 2.5 Persistencia de favoritas (paso 10)

```jsx
// src/App.jsx
const FAVORITES_STORAGE_KEY = 'cinemax:favorites'

function loadFavorites() {
  try {
    const stored =
      localStorage.getItem(FAVORITES_STORAGE_KEY) ??
      localStorage.getItem('cinemax:favoritas')
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const [favorites, setFavorites] = useState(loadFavorites)

useEffect(() => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // Storage unavailable: the app keeps working without persistence.
  }
}, [favorites])
```

---

## 3. Explicación del resultado

1. **Componente reutilizable:** `Button` se usa en tres contextos distintos cambiando
   solo `children`, `variant` y sus manejadores. No hay botones escritos a mano en los
   componentes de la interfaz.
2. **Estado con `useState`:** `App` guarda las favoritas, el texto del buscador y la
   copia con retardo. Cada evento de la interfaz actualiza el estado y React vuelve a
   pintar sin recargar la página.
3. **Comunicación hacia arriba:** `MovieCard` y `MovieList` no modifican el estado del
   padre; reciben funciones (`onToggleFavorite`, `onQueryChange`, `onClearQuery`,
   `onSearch`) y las llaman cuando ocurre el evento.
4. **Buscador controlado:** el valor del input siempre viene de `query`; `onChange`
   actualiza el estado en cada pulsación.
5. **Retardo:** el filtro usa `debouncedQuery`, que se actualiza 300 ms después de la
   última tecla. La consola muestra una línea por pulsación y una sola línea de
   filtrado, lo que demuestra la diferencia.
6. **Estado vacío:** cuando ninguna película coincide, se muestra un mensaje y el botón
   **Limpiar búsqueda** en lugar de una lista vacía.
7. **Persistencia:** las favoritas se guardan en `localStorage` y se leen al montar la
   aplicación, por lo que sobreviven a una recarga.

---

## 4. Casos de prueba

| # | Caso | Pasos | Resultado esperado | Resultado obtenido |
| - | ---- | ----- | ------------------ | ------------------ |
| 1 | Reutilización de `Button` | Revisar el banner, una tarjeta y el estado vacío | Los tres usan el mismo componente `Button` con distinta `variant` | Cumple |
| 2 | Agregar favorita | Clic en `☆ Favorita` de una tarjeta | El botón cambia a `★ Favorita` y `aria-pressed` pasa a `true` | Cumple |
| 3 | Quitar favorita | Clic de nuevo en `★ Favorita` | El botón vuelve a `☆ Favorita` y `aria-pressed` pasa a `false` | Cumple |
| 4 | Persistencia | Marcar favoritas, recargar la página (F5) | Las favoritas siguen marcadas | Cumple |
| 5 | Búsqueda por título | Escribir `orion` | Se muestra «Rumbo a Orión» | Cumple |
| 6 | Búsqueda con acentos | Escribir `orion` o `Orión` | Ambos textos encuentran la misma película | Cumple |
| 7 | Retardo | Escribir `zzz` y mirar la consola | Varias líneas `keystroke` y una sola línea `Filter` 300 ms después | Cumple |
| 8 | CTA del banner | Escribir un texto y pulsar **Buscar** | El filtro se aplica de inmediato, sin esperar el retardo | Cumple |
| 9 | Estado vacío | Escribir `zzz` | Mensaje «No hay películas que coincidan con “zzz”» y botón **Limpiar búsqueda** | Cumple |
| 10 | Limpiar búsqueda | Clic en **Limpiar búsqueda** | Se borra el texto y vuelven las 9 tarjetas | Cumple |
| 11 | Sin errores en consola | Abrir DevTools → Console y recargar | Sin errores ni advertencias de React | Cumple |

---

## 5. Estructura del proyecto

```text
Lab09-Desarrollo-de-Aplicaciones-empresariales-main/
├── public/
│   └── posters/                     # 9 carteles SVG
├── src/
│   ├── components/
│   │   ├── Button/Button.jsx
│   │   ├── Footer/Footer.jsx
│   │   ├── Header/Header.jsx
│   │   ├── Hero/Hero.jsx
│   │   ├── MovieCard/MovieCard.jsx
│   │   ├── MovieList/MovieList.jsx
│   │   └── MovieSearch/MovieSearch.jsx
│   ├── data/
│   │   ├── cinema.js
│   │   └── movies.js
│   ├── styles/
│   │   ├── base/                    # variables, reset, tipografía, formularios, utilidades
│   │   ├── components/              # estilos de cada componente (incluye button.css)
│   │   ├── layout/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── evidencias/                      # capturas y fuentes de evidencia
├── ENTREGABLE-S10.md
├── estado-y-persistencia.md
├── errores-react.md
├── index.html
├── package.json
└── vite.config.js
```

---

## 6. Observaciones

- **Componente reutilizable:** `Button` es reutilizable porque recibe su contenido por
  `children` y su aspecto por `variant`; no está acoplado a una pantalla concreta.
- **Estado en el ancestro común:** `favorites`, `query` y `debouncedQuery` viven en
  `App` porque lo necesitan componentes de distintas ramas del árbol.
- **Flujo de datos unidireccional:** los hijos reciben datos por props y notifican
  eventos con funciones; el estado solo cambia en `App`.
- **Persistencia tolerante a fallos:** `loadFavorites` valida el JSON y captura
  excepciones; si `localStorage` no está disponible, la aplicación sigue funcionando.
- **Nombres y comentarios:** el código, los identificadores y los comentarios están en
  inglés; la interfaz y la documentación están en español, según las normas de la guía.

---

## 7. Cómo ejecutar y verificar

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

Prueba rápida en la consola del navegador:

```js
// 1. Favoritas persistidas
localStorage.getItem('cinemax:favorites')

// 2. Estado vacío
document.querySelector('.movie-search__input').value // "zzz"
document.querySelector('.movie-list__empty').innerText
document.querySelectorAll('.movie-card').length // 0

// 3. Botones reutilizables
document.querySelectorAll('.button').length
```
