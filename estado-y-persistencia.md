# Estado y hooks (Laboratorio 11)

Este documento registra **dónde vive cada dato** y **qué hook propio** se encarga de
la lógica reutilizable. La regla común es elevar el estado al **ancestro común** de los
componentes que lo necesitan y mantener un flujo de datos unidireccional.

---

## 1. Lista de favoritas — `favorites`

- **Componente:** `App` (`src/App.jsx`), con `useState`.
- **Por qué ahí:** la lista la pinta `MovieCard` (nieto), la recorre `MovieList` (hijo)
  y `Header` necesita el total. `App` es el ancestro común.
- **Cómo cambia:** `toggleFavorite(movieId)` agrega o quita el id y muestra el aviso
  emergente. `MovieCard` solo llama a `onToggleFavorite(movie.id)`.
- **Persistencia:** se guarda en `localStorage` con la clave `cinemax:favorites`.
  - Se lee con el inicializador perezoso `useState(loadFavorites)`.
  - Se escribe en un `useEffect` que se dispara cuando cambia `favorites`.
  - También se lee la clave antigua `cinemax:favoritas` como respaldo.
  - `loadFavorites()` valida el JSON y captura excepciones.

## 2. Texto del buscador — `query`

- **Componente:** `App`, con `useState`.
- **Por qué ahí:** lo escribe `Hero` (el `MovieSearch` vive dentro del banner) y lo lee
  `MovieList` para filtrar. `App` es el ancestro común.
- **Entrada controlada:** `MovieSearch` recibe `value` y `onChange`; el texto vive en
  el estado y cada pulsación lo actualiza.

## 3. Texto con retardo — `debouncedValue` de `useDebounce`

- **Hook:** `src/hooks/useDebounce.js`, usado en `App`.
- **Por qué:** separa el texto que se pinta en el input del texto que filtra. Cada
  pulsación solo repinta el input; el filtro se aplica 300 ms después de la última
  tecla.
- **API:** devuelve `debouncedValue`, `isPending`, `flush` y `reset`.
  - `flush(query)` aplica el texto de inmediato (CTA **Buscar**).
  - `reset('')` vacía el valor pendiente y el aplicado (botón **Limpiar filtro**).
- **Comprobación en consola:** `[useDebounce] keystroke -> "…"` se registra en cada
  tecla; `[useDebounce] applied -> "…"` aparece una sola vez, con el retardo.

## 4. Tamaño de ventana — `useWindowSize`

- **Hook:** `src/hooks/useWindowSize.js`.
- **Se usa en:** `MovieList` y `PremieresCarousel`.
- **Por qué:** decide cuántas tarjetas se muestran por fila (1, 2, 3 o 4) y cuántos
  estrenos se ven por vista (1, 2 o 3). Los breakpoints están en `utils/layout.js`.
- **Detalle:** se suscribe a `resize` y `orientationchange` y limpia los listeners al
  desmontar.

## 5. Estrenos — `usePremieres`

- **Hook:** `src/hooks/usePremieres.js`.
- **Se usa en:** `PremieresSection`.
- **Estados:** `loading`, `success` y `error`.
- **Cómo funciona:** simula una petición con `setTimeout` de 2.2 s, cancela el
  temporizador al desmontar y devuelve `status`, `items`, `error` y `retry`.
- **Demostración:** el botón **Simular error** cambia `shouldFail`; **Reintentar**
  incrementa el intento; **Ver datos de ejemplo** desactiva el error simulado.

## 6. Avisos emergentes — `ToastProvider` y `useToast`

- **Componentes:** `ToastProvider` mantiene la lista de avisos y `Toast` los pinta.
- **Hook:** `useToast` expone `showToast` y `removeToast`.
- **Por qué así:** `MovieCard` no conoce el toast. Solo llama a `onToggleFavorite`; es
  `App` quien decide el mensaje y `ToastProvider` quien lo muestra. Así la tarjeta no
  sabe cómo se presenta el aviso.
- **Accesibilidad:** el contenedor usa `aria-live="polite"` y cada aviso `role="status"`.

## 7. Error simulado de estrenos — `simulateError`

- **Componente:** `PremieresSection`, con `useState`.
- **Por qué ahí:** es un control de demostración local; ningún otro componente lo
  necesita. No contamina el estado global de la aplicación.

---

## Cuadro resumen

| Dato | Dónde vive | Mecanismo | Por qué |
| ---- | ---------- | --------- | ------- |
| `favorites` | `App` | `useState` + `useEffect` | Ancestro común; se pinta, se recorre y se cuenta desde ahí. |
| `query` | `App` | `useState` | `Hero` escribe y `MovieList` lee. |
| `debouncedValue` | `useDebounce` (en `App`) | `useState` + `useEffect` + refs | Evita filtrar en cada pulsación y permite aplicar/limpiar al instante. |
| `favoriteCount` | Derivado en `App` | `favorites.length` | La cabecera solo necesita el número, no la lista. |
| `windowSize` | `useWindowSize` | `useState` + listeners | Columnas y elementos por vista responsive. |
| `premieres` y su estado | `usePremieres` | `useState` + `useEffect` | Simula la petición y muestra carga, datos o error. |
| `toasts` | `ToastProvider` | `useState` + `useRef` | Avisos transversales sin acoplar las tarjetas. |
| `simulateError` | `PremieresSection` | `useState` | Control local para demostrar el estado de error. |

---

## Árbol de componentes

```text
ToastProvider [toasts]
└── App [favorites, query, debouncedQuery]
    ├── Header [favoriteCount]
    ├── Hero [featuredMovie, query, onQueryChange, onSearch, onClearQuery]
    │   ├── MovieSearch [value, onChange]
    │   └── Button
    ├── PremieresSection [simulateError; usePremieres]
    │   ├── Skeleton
    │   └── PremieresCarousel [premieres, itemsPerView]
    │       └── PremiereCard [premiere]
    ├── MovieList [movies, query, favorites, columns]
    │   └── MovieCard [movie, isFavorite, onToggleFavorite]
    └── Footer
```

## Por qué el contador de favoritas no vive en la cabecera

`Header` es hermano de `MovieList` y de `MovieCard`, no su ancestro. Si guardara el
contador habría dos fuentes de verdad (la lista de favoritas y el número de la
cabecera) que podrían desincronizarse. Además, la cabecera tendría que recibir la
lista completa o una cadena de callbacks que no le corresponde. La solución es elevar
`favorites` a `App` y pasarle a `Header` solo `favorites.length`.
