# Entregable — Laboratorio 11: Comunicación entre componentes

## Datos del alumno

| Campo | Valor |
| ----- | ----- |
| **Nombre** | Sofia Cindell Carita Quispe |
| **Curso** | Desarrollo de Aplicaciones Empresariales |
| **Sección** | 4-C24-A |
| **Laboratorio** | N.° 11 — Comunicación entre componentes |
| **Proyecto** | CineMax (cartelera de cine) |
| **Rama de trabajo** | `lab11-comunicacion-componentes` |
| **Repositorio** | Proyecto acumulativo del Laboratorio 10 |

---

## 1. Captura del resultado

| Evidencia | Archivo |
| --------- | ------- |
| Pantalla completa con cabecera, estrenos y cartelera | [`evidencias/15-pantalla-completa.jpg`](./evidencias/15-pantalla-completa.jpg) |
| Aviso emergente al marcar una favorita y contador en la cabecera | [`evidencias/11-toast-favorita.jpg`](./evidencias/11-toast-favorita.jpg) |
| Esqueleto de carga de los estrenos | [`evidencias/12-estrenos-cargando.jpg`](./evidencias/12-estrenos-cargando.jpg) |
| Estado de error de los estrenos con acciones de recuperación | [`evidencias/13-estrenos-error.jpg`](./evidencias/13-estrenos-error.jpg) |
| Buscador con el botón **Limpiar filtro** del banner | [`evidencias/14-busqueda-limpiar.jpg`](./evidencias/14-busqueda-limpiar.jpg) |
| Estructura del proyecto | [`evidencias/16-estructura-proyecto.txt`](./evidencias/16-estructura-proyecto.txt) |
| Consola sin errores y verificaciones | [`evidencias/17-consola-sin-errores.txt`](./evidencias/17-consola-sin-errores.txt) |

---

## 2. Desarrollo

### 2.1 Punto de partida y rama de trabajo (paso 1)

El proyecto parte de la cartelera del Laboratorio 10: `Button`, favoritas persistentes,
buscador controlado, filtrado y estado vacío siguen funcionando. La rama de trabajo de
esta sesión es:

```bash
git switch -c lab11-comunicacion-componentes
```

> El entorno de entrega es una copia del proyecto sin la carpeta `.git`; por eso la
> rama se documenta con el comando que se ejecuta en el repositorio del equipo antes
> de subir los cambios.

### 2.2 Tipografía y utilidades nuevas (paso 2)

Se ampliaron las variables, la tipografía y las utilidades sin romper los componentes
del Laboratorio 10.

```css
/* src/styles/base/variables.css */
:root {
  --font-display: 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif;
  --color-surface-raised: #242641;
  --color-success: #3ddc97;
  --color-info: #6db8ff;
  --color-danger: #ff6b6b;
  --radius-pill: 999px;
  --shadow-soft: 0 16px 40px rgba(0, 0, 0, 0.28);
}
```

```css
/* src/styles/base/utilities.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.stack > * + * {
  margin-top: var(--space-3);
}

.cluster {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}
```

Se añadió `.eyebrow` para los rótulos de sección y se unificaron los encabezados con
`--font-display`. La cabecera, el banner, las tarjetas, el buscador y el pie se
revisaron en el navegador y siguen viéndose bien.

### 2.3 Patrón adaptador para los datos de las películas (paso 3)

Los datos crudos usan nombres de una API (`poster_path`, `overview`, `age_rating`,
`vote_average`, `schedule`, `release_date`). El adaptador los traduce al modelo único
que consumen todos los componentes.

```js
// src/utils/movieAdapter.js
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
```

```jsx
// src/App.jsx
const movies = adaptMovies(rawMovies)
```

La cartelera y los estrenos pasan por el mismo adaptador, por lo que una película se
presenta igual venga de la fuente que venga. Los componentes no conocen los nombres de
la API: solo reciben `image`, `synopsis`, `rating`, etc.

**Resultado:** la cartelera conserva sus 9 películas y los estrenos reciben el mismo
modelo sin duplicar el mapeo.

### 2.4 Aviso emergente al marcar o desmarcar una favorita (paso 4)

`MovieCard` sigue llamando únicamente a `onToggleFavorite(movie.id)`. No importa el
toast, no conoce su diseño y no sabe dónde se muestra. `App` decide el mensaje y el
proveedor lo pinta.

```jsx
// src/App.jsx
const toggleFavorite = (movieId) => {
  const wasFavorite = favorites.includes(movieId)
  const movie = movies.find((item) => item.id === movieId)
  const title = movie?.title ?? 'La película'

  setFavorites((current) =>
    current.includes(movieId)
      ? current.filter((id) => id !== movieId)
      : [...current, movieId],
  )

  showToast({
    message: wasFavorite
      ? `«${title}» se quitó de favoritas.`
      : `«${title}» se añadió a favoritas.`,
    tone: wasFavorite ? 'info' : 'success',
  })
}
```

```jsx
// src/main.jsx
<StrictMode>
  <ToastProvider>
    <App />
  </ToastProvider>
</StrictMode>
```

```jsx
// src/components/ToastProvider/ToastProvider.jsx
const showToast = useCallback(({ message, tone = 'success' }) => {
  nextIdRef.current += 1
  const id = nextIdRef.current
  setToasts((current) => [...current, { id, message, tone }].slice(-3))
  const timer = setTimeout(() => removeToast(id), TOAST_DURATION_MS)
  timersRef.current.set(id, timer)
}, [removeToast])
```

**Explicación:** la tarjeta solo comunica el evento; la presentación del aviso es una
responsabilidad de la capa de aplicación. Así se puede cambiar el toast por otro
sistema de notificaciones sin tocar `MovieCard`.

**Prueba:** al pulsar `☆ Favorita` aparece el aviso y el contador de la cabecera pasa
a `1`; al pulsar de nuevo aparece el aviso de que se quitó y el contador vuelve a `0`.

### 2.5 Hook `useDebounce` en el buscador (paso 5)

Se eliminó el `setTimeout` escrito a mano en `App` y se extrajo a un hook propio.

```js
// src/hooks/useDebounce.js
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef(null)
  const pendingValueRef = useRef(value)

  useEffect(() => {
    pendingValueRef.current = value
    console.info(`[useDebounce] keystroke -> "${value}"`)

    timeoutRef.current = setTimeout(() => {
      console.info(`[useDebounce] applied -> "${value}"`)
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeoutRef.current)
  }, [value, delay])

  const flush = useCallback((nextValue = pendingValueRef.current) => {
    clearTimeout(timeoutRef.current)
    pendingValueRef.current = nextValue
    setDebouncedValue(nextValue)
  }, [])

  const reset = useCallback((nextValue = '') => {
    clearTimeout(timeoutRef.current)
    pendingValueRef.current = nextValue
    setDebouncedValue(nextValue)
  }, [])

  return { debouncedValue, isPending: value !== debouncedValue, flush, reset }
}
```

```jsx
// src/App.jsx
const { debouncedValue: debouncedQuery, flush, reset } = useDebounce(
  query,
  SEARCH_DELAY_MS,
)

const applySearchNow = () => flush(query)

const clearQuery = () => {
  setQuery('')
  reset('')
}
```

**Explicación:** `query` controla el input; `debouncedQuery` es el valor que filtra.
El CTA **Buscar** usa `flush` para aplicar el texto de inmediato y **Limpiar filtro**
usa `reset` para vaciar input y listado a la vez.

**Prueba:** al escribir `orion` la consola muestra
`[useDebounce] keystroke -> "orion"` y, 300 ms después,
`[useDebounce] applied -> "orion"`.

### 2.6 Hook `useWindowSize` para las tarjetas por fila (paso 6)

```js
// src/hooks/useWindowSize.js
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(readWindowSize)

  useEffect(() => {
    const handleResize = () => setWindowSize(readWindowSize())

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return windowSize
}
```

```jsx
// src/components/MovieList/MovieList.jsx
const { width } = useWindowSize()
const columns = getMovieColumns(width)

<ul className="movie-list" style={{ '--movie-columns': columns }}>
```

```css
/* src/styles/components/movie-list.css */
.movie-list {
  display: grid;
  grid-template-columns: repeat(var(--movie-columns, 1), minmax(0, 1fr));
  gap: var(--space-4);
}
```

**Explicación:** el ancho de la ventana decide 4, 3, 2 o 1 columnas mediante
`getMovieColumns`. El hook se reutiliza en `PremieresCarousel` para decidir cuántos
estrenos se ven por vista, por lo que no es un hook de un solo uso.

**Prueba:** con una ventana de 912 px la cartelera usa `data-columns="3"`; al cambiar
el ancho, la cuadrícula se recalcula sin recargar.

### 2.7 Hook `usePremieres` con los tres estados (paso 7)

```js
// src/hooks/usePremieres.js
export const PREMIERES_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function usePremieres({ shouldFail = false, delay = 2200 } = {}) {
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${shouldFail ? 'error' : 'data'}:${attempt}`

  const [result, setResult] = useState({
    key: requestKey,
    status: PREMIERES_STATUS.LOADING,
    items: [],
    error: null,
  })

  useEffect(() => {
    let isActive = true

    const timer = setTimeout(() => {
      if (!isActive) return

      setResult({
        key: requestKey,
        status: shouldFail ? PREMIERES_STATUS.ERROR : PREMIERES_STATUS.SUCCESS,
        items: shouldFail ? [] : adaptMovies(premieres),
        error: shouldFail ? PREMIERES_ERROR_MESSAGE : null,
      })
    }, delay)

    return () => {
      isActive = false
      clearTimeout(timer)
    }
  }, [delay, requestKey, shouldFail])

  const isCurrentRequest = result.key === requestKey

  const retry = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  return {
    status: isCurrentRequest ? result.status : PREMIERES_STATUS.LOADING,
    items: isCurrentRequest ? result.items : [],
    error: isCurrentRequest ? result.error : null,
    retry,
  }
}
```

**Explicación:** el hook simula una petición con retardo, cancela el temporizador al
desmontar y devuelve `status`, `items`, `error` y `retry`. El estado `loading` se
deriva del cambio de `requestKey`, sin escribir estado síncronamente dentro del
efecto.

### 2.8 Esqueleto de carga y carrusel de estrenos (paso 8)

```jsx
// src/components/Skeleton/Skeleton.jsx
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
    <div className="skeleton-group" role="status" aria-live="polite" aria-label={label}>
      {items}
    </div>
  )
}
```

```jsx
// src/components/PremieresSection/PremieresSection.jsx
const [simulateError, setSimulateError] = useState(false)
const { status, items, error, retry } = usePremieres({ shouldFail: simulateError })

{isLoading && <Skeleton count={3} label="Cargando próximos estrenos…" />}

{isError && (
  <div className="premieres__error" role="alert">
    <h3>No se pudieron cargar los estrenos</h3>
    <p>{error}</p>
    <Button onClick={retry}>Reintentar</Button>
    <Button variant="secondary" onClick={() => setSimulateError(false)}>
      Ver datos de ejemplo
    </Button>
  </div>
)}

{hasData && <PremieresCarousel premieres={items} />}
```

`PremieresCarousel` usa `useWindowSize` para mostrar 1, 2 o 3 estrenos por vista y
tiene controles anterior/siguiente accesibles. `PremiereCard` presenta póster, fecha
de estreno, clasificación, valoración y sinopsis.

**Prueba de los estados:**

1. Al recargar, se ven tres esqueletos animados y `aria-busy="true"`.
2. A los 2.2 s aparecen las 6 tarjetas de estreno.
3. Al pulsar **Simular error**, se muestra el panel de error con **Reintentar** y
   **Ver datos de ejemplo**.
4. **Ver datos de ejemplo** vuelve a cargar las tarjetas; **Reintentar** repite la
   petición.

### 2.9 Contador de favoritas en la cabecera (paso 9)

```jsx
// src/App.jsx
<Header favoriteCount={favorites.length} />
```

```jsx
// src/components/Header/Header.jsx
function Header({ favoriteCount = 0 }) {
  return (
    <header className="header">
      <div className="header__inner container">
        <a href="#" className="header__logo">Cine<span>Max</span></a>
        <nav className="header__nav" aria-label="Principal">
          <ul>{/* enlaces de cinema.navigation */}</ul>
          <span
            className="header__favorites"
            aria-live="polite"
            aria-label={`${favoriteCount} ${
              favoriteCount === 1 ? 'película favorita' : 'películas favoritas'
            }`}
          >
            <span aria-hidden="true">★</span>
            <span className="header__favorites-label">Favoritas</span>
            <span className="header__favorites-count">{favoriteCount}</span>
          </span>
        </nav>
      </div>
    </header>
  )
}
```

**Explicación:** la cabecera recibe un número derivado, no el arreglo `favorites`. El
estado sigue viviendo una sola vez en `App`.

### 2.10 Botón para limpiar el filtro desde el banner (paso 10)

```jsx
// src/components/Hero/Hero.jsx
{hasQuery && (
  <Button variant="secondary" onClick={onClearQuery}>
    Limpiar filtro
  </Button>
)}
```

```jsx
// src/App.jsx
const clearQuery = () => {
  setQuery('')
  reset('')
}
```

```jsx
// src/App.jsx
<Hero
  featuredMovie={movies[0]}
  query={query}
  onQueryChange={setQuery}
  onSearch={applySearchNow}
  onClearQuery={clearQuery}
/>
```

**Explicación:** `clearQuery` vacía el texto controlado y el valor con retardo en la
misma acción. El input, el aviso de filtro activo y el listado quedan sincronizados de
inmediato.

**Prueba:** escribir `orion` deja una tarjeta; pulsar **Limpiar filtro** devuelve el
input vacío y las 9 tarjetas.

---

## 3. Árbol de componentes y dato que vive en cada nivel (paso 11)

```text
ToastProvider  [toasts]
└── App  [favorites, query, debouncedQuery]
    ├── Header  [favoriteCount = favorites.length]
    ├── main
    │   ├── Hero  [featuredMovie, query, handlers]
    │   │   ├── MovieSearch  [value, onChange]
    │   │   └── Button
    │   ├── PremieresSection  [simulateError; usePremieres → status, items, error]
    │   │   ├── Skeleton  [count, label]
    │   │   └── PremieresCarousel  [premieres, itemsPerView]
    │   │       └── PremiereCard  [premiere]
    │   └── MovieList  [movies, query, favorites, filtered, columns]
    │       └── MovieCard  [movie, isFavorite, onToggleFavorite]
    └── Footer  []
```

| Nivel | Dato que vive ahí | Por qué |
| ----- | ----------------- | ------- |
| `App` | `favorites`, `query`, `debouncedQuery` | Es el ancestro común de los componentes que escriben y leen esos datos. |
| `ToastProvider` | `toasts` | Es una responsabilidad transversal: cualquier componente puede pedir un aviso sin conocer su presentación. |
| `Header` | `favoriteCount` (solo el número) | Necesita mostrar el total, no recorrer ni modificar la lista. |
| `Hero` | `query` por props y `hasQuery` derivado | El input es controlado; el estado real está elevado a `App`. |
| `PremieresSection` | `simulateError` | Es un control de demostración local; no lo necesita ningún otro componente. |
| `PremieresCarousel` | `itemsPerView` derivado de `useWindowSize` | Presentación responsive local. |
| `MovieList` | `filtered`, `columns` derivados | Filtra la lista recibida y elige las columnas según el ancho. |
| `MovieCard` | `isFavorite` por props | Solo pinta el estado que recibe y avisa del clic. |
| `Footer` | Sin estado | Solo presenta datos de `cinema.js`. |

### ¿Por qué el contador de favoritas no puede vivir en la cabecera?

Porque `Header` es **hermano** de `MovieList` y de `MovieCard`, no su ancestro. La
tarjeta es quien recibe el clic, pero el contador debe reflejar la lista completa, que
se usa en la cartelera. Si `Header` guardara el contador:

- necesitaría recibir la lista completa o que `MovieCard` le avisara por una cadena de
  props que no le corresponde;
- existirían dos fuentes de verdad (la lista en `MovieList`/`App` y el contador en
  `Header`) que podrían desincronizarse al marcar, desmarcar o recargar;
- la cabecera quedaría acoplada a la lógica de favoritas, cuando su responsabilidad es
  solo presentar el total.

La solución correcta es elevar `favorites` al ancestro común (`App`), que ya conoce la
lista y puede derivar `favorites.length`. `Header` recibe **solo el número**, no la
lista, y se mantiene como un componente de presentación.

---

## 4. Hooks propios y observaciones

| Hook | Se usa en | Lógica extraída | Observación |
| ---- | --------- | --------------- | ----------- |
| `useDebounce` | `App` | Temporizador, valor pendiente, `flush` y `reset` | Sustituye el retardo manual del Laboratorio 10 y permite aplicar o limpiar el filtro sin esperar. |
| `useWindowSize` | `MovieList`, `PremieresCarousel` | Suscripción a `resize` y `orientationchange` | Se usa en más de un componente; los breakpoints viven en `utils/layout.js`. |
| `usePremieres` | `PremieresSection` | Petición simulada, cancelación, reintento y estados | Mantiene la sección limpia y demuestra `loading`, `success` y `error`. |
| `useToast` | `App` | Acceso al contexto de avisos | `MovieCard` no lo usa: la tarjeta no sabe cómo se muestra el aviso. |

**Qué lógica se extrajo y qué componentes la comparten:** el retardo del buscador se
extrajo de `App` a `useDebounce`; la medición del ancho se extrajo a `useWindowSize` y
la comparten la cartelera y el carrusel; la simulación de la petición de estrenos se
extrajo a `usePremieres`; la presentación de avisos se extrajo a `ToastProvider` y
`Toast`, que comparten todas las acciones que necesiten confirmación.

---

## 5. Integración de la biblioteca de interfaz y estados de carga/error

La biblioteca de interfaz del proyecto queda integrada por componentes reutilizables
con una carpeta por componente:

- `Button` (variantes `primary`, `secondary`, `ghost`, `favorite`).
- `Skeleton` para el estado de carga.
- `Toast` y `ToastProvider` para los avisos.
- `PremiereCard`, `PremieresCarousel` y `PremieresSection` para el carrusel.
- `MovieCard`, `MovieList`, `MovieSearch`, `Hero`, `Header` y `Footer` del proyecto
  acumulativo.

Los estados de la petición de estrenos se resuelven así:

| Estado | Interfaz |
| ------ | -------- |
| `loading` | Tres esqueletos animados con `role="status"` y el texto accesible «Cargando próximos estrenos…». |
| `success` | Carrusel con 6 tarjetas, controles y datos adaptados. |
| `error` | Panel `role="alert"` con explicación del error, **Reintentar** y **Ver datos de ejemplo**. |

---

## 6. Casos de prueba

| # | Caso | Pasos | Resultado esperado | Resultado obtenido |
| - | ---- | ----- | ------------------ | ------------------ |
| 1 | Marcar favorita | Clic en `☆ Favorita` de una tarjeta | Aviso «se añadió a favoritas», contador `1`, `aria-pressed="true"` | Cumple |
| 2 | Desmarcar favorita | Clic de nuevo en `★ Favorita` | Aviso «se quitó de favoritas», contador `0` | Cumple |
| 3 | Persistencia | Recargar después de marcar | La favorita y el contador se mantienen | Cumple |
| 4 | Cabecera sin lista | Revisar props de `Header` | Solo recibe `favoriteCount` | Cumple |
| 5 | Retardo del buscador | Escribir `orion` y mirar la consola | Varias líneas `keystroke` y una sola `applied` 300 ms después | Cumple |
| 6 | Búsqueda | Escribir `orion` | Solo «Rumbo a Orión» | Cumple |
| 7 | Limpiar filtro | Pulsar **Limpiar filtro** en el banner | Input vacío, 9 tarjetas, botón oculto | Cumple |
| 8 | Columnas por ancho | Redimensionar la ventana | Cambia `data-columns` y la cuadrícula | Cumple |
| 9 | Estado de carga | Recargar la página | Esqueletos visibles mientras carga | Cumple |
| 10 | Estado con datos | Esperar 2.2 s | 6 tarjetas de estreno en el carrusel | Cumple |
| 11 | Estado de error | Pulsar **Simular error** | Panel de error con mensaje y acciones | Cumple |
| 12 | Reintentar | En error, pulsar **Reintentar** | Vuelve a intentar la petición | Cumple |
| 13 | Volver a datos | En error, pulsar **Ver datos de ejemplo** | Carga las 6 tarjetas | Cumple |
| 14 | Carrusel | Pulsar siguiente/anterior | El carrusel se desplaza y deshabilita el control en el extremo | Cumple |
| 15 | Adaptador | Revisar `movies` en `App` | Los campos son `image`, `synopsis`, `classification`, `rating`, `showtimes` | Cumple |
| 16 | Lint y build | `npm run lint` y `npm run build` | Sin errores ni advertencias; build correcto | Cumple |
| 17 | Consola | Abrir DevTools y recorrer la app | Sin errores ni advertencias de React | Cumple |

---

## 7. Estructura del proyecto

```text
cinemax-lab10-componentes-eventos-main/
├── evidencias/
│   ├── 11-toast-favorita.jpg
│   ├── 12-estrenos-cargando.jpg
│   ├── 13-estrenos-error.jpg
│   ├── 14-busqueda-limpiar.jpg
│   ├── 15-pantalla-completa.jpg
│   ├── 16-estructura-proyecto.txt
│   └── 17-consola-sin-errores.txt
├── public/
│   └── posters/                    # 9 carteles SVG
├── src/
│   ├── components/
│   │   ├── Button/Button.jsx
│   │   ├── Footer/Footer.jsx
│   │   ├── Header/Header.jsx
│   │   ├── Hero/Hero.jsx
│   │   ├── MovieCard/MovieCard.jsx
│   │   ├── MovieList/MovieList.jsx
│   │   ├── MovieSearch/MovieSearch.jsx
│   │   ├── PremiereCard/PremiereCard.jsx
│   │   ├── PremieresCarousel/PremieresCarousel.jsx
│   │   ├── PremieresSection/PremieresSection.jsx
│   │   ├── Skeleton/Skeleton.jsx
│   │   ├── Toast/Toast.jsx
│   │   └── ToastProvider/ToastProvider.jsx
│   ├── context/toastContext.js
│   ├── data/
│   │   ├── cinema.js
│   │   ├── movies.js
│   │   └── premieres.js
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── usePremieres.js
│   │   ├── useToast.js
│   │   └── useWindowSize.js
│   ├── styles/
│   │   ├── base/
│   │   ├── components/
│   │   ├── layout/
│   │   └── main.css
│   ├── utils/
│   │   ├── layout.js
│   │   └── movieAdapter.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

La captura completa del árbol está en
[`evidencias/16-estructura-proyecto.txt`](./evidencias/16-estructura-proyecto.txt).

---

## 8. Cómo ejecutar y verificar

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

Secuencia rápida de verificación:

1. Recargar y observar los esqueletos de **Próximos estrenos**.
2. Esperar a que aparezcan las 6 tarjetas.
3. Pulsar **Simular error** → comprobar el panel de error.
4. Pulsar **Ver datos de ejemplo** → vuelven las tarjetas.
5. Marcar una favorita → comprobar el aviso y el contador de la cabecera.
6. Escribir `orion` → comprobar el filtro y el botón **Limpiar filtro**.
7. Pulsar **Limpiar filtro** → comprobar que input y listado vuelven a su estado inicial.

---

## 9. Observaciones y conclusiones

- El estado compartido se elevó **solo hasta el ancestro común**: `App`. No se subió
  toda la aplicación a un único contexto global innecesario.
- `Header` recibe un número derivado (`favoriteCount`) y no la lista, lo que evita
  duplicar la fuente de verdad.
- Los hooks propios dejan los componentes más limpios y se reutilizan: `useWindowSize`
  se usa en dos componentes y `useDebounce` sustituye la lógica manual del laboratorio
  anterior.
- La simulación de la petición permite demostrar de forma reproducible los estados de
  carga, éxito y error, incluyendo acciones de recuperación.
- El adaptador aísla el modelo de la API del modelo de la interfaz; si cambian los
  nombres de los campos, solo se modifica `movieAdapter.js`.
- La biblioteca de interfaz del proyecto se integra en todos los estados: botones
  reutilizables, esqueleto, avisos y tarjetas del carrusel comparten estilos y
  comportamiento.
