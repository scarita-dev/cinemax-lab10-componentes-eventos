# CineMax — Laboratorio 10: Componentes y eventos

Aplicación de cartelera de cine construida con **React 19 + Vite 8**. Este laboratorio
parte del proyecto de cartelera del Laboratorio 9 y añade el componente reutilizable
`Button`, el estado de favoritas, el buscador controlado con retardo, el filtrado de la
cartelera y la persistencia de las favoritas en `localStorage`.

## Requisitos

- Node.js v20.19.0 (o superior)
- npm 11.19.0

## Puesta en marcha

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # build de producción en dist/
npm run lint    # lint con oxlint
```

## Requerimientos del Laboratorio 10

| Paso | Requerimiento | Dónde está implementado |
| ---- | ------------- | ------------------------ |
| 1 | Partir de la cartelera del Laboratorio 9 | `src/App.jsx`, `src/data/` |
| 2 | Ampliar los estilos base (formularios, tipografía y utilidades) | `src/styles/base/forms.css`, `typography.css`, `utilities.css` |
| 3 | `Button` reutilizable con `children` y `variant` | `src/components/Button/Button.jsx` y `src/styles/components/button.css` |
| 4 | Estado de favoritas y función para agregar/quitar | `App.jsx`: `favorites`, `setFavorites`, `toggleFavorite` |
| 5 | Pasar la función a `MovieCard` y pintar el botón de favorita | `MovieList.jsx` → `MovieCard.jsx` |
| 6 | `MovieSearch` como entrada controlada | `MovieSearch.jsx` (`value` + `onChange`) |
| 7 | Retardo del buscador y diferencia visible en consola | `App.jsx`: `query`, `debouncedQuery`, `SEARCH_DELAY_MS` |
| 8 | `MovieList` filtra y muestra estado vacío | `MovieList.jsx` |
| 9 | Buscador integrado en el banner con su CTA | `Hero.jsx` (`onSearch`) |
| 10 | Persistencia de favoritas en el navegador | `App.jsx`: `loadFavorites` + `useEffect` |
| 11 | Registro de cada dato y su componente | [`estado-y-persistencia.md`](./estado-y-persistencia.md) |
| 12 | Repositorio y entregable | Este repositorio + [`ENTREGABLE-S10.md`](./ENTREGABLE-S10.md) |

## Estructura

```
src/
├── components/          # componentes de la interfaz
│   ├── Button/Button.jsx             # botón reutilizable (children + variant)
│   ├── Header/Header.jsx
│   ├── Hero/Hero.jsx                 # banner + buscador con su CTA
│   ├── MovieSearch/MovieSearch.jsx   # entrada controlada
│   ├── MovieCard/MovieCard.jsx       # tarjeta + botón de favorita
│   ├── MovieList/MovieList.jsx       # filtrado + estado vacío
│   └── Footer/Footer.jsx
├── data/                # datos de la aplicación
│   ├── cinema.js        # datos generales del cine
│   └── movies.js        # cartelera (9 películas)
├── styles/              # arquitectura CSS
│   ├── base/            # variables, reset, tipografía, formularios, utilidades
│   ├── layout/          # contenedor y disposición general
│   ├── components/      # estilos de cada componente (incluye button.css)
│   └── main.css         # punto de entrada (ordena los imports)
├── App.jsx              # composición + estado (favoritas y búsqueda)
└── main.jsx             # montaje de React en el DOM
```

## Componentes

| Componente     | Responsabilidad |
| -------------- | --------------- |
| `Button`       | Botón reutilizable: contenido por `children` y aspecto por la prop `variant` (`primary`, `secondary`, `ghost`, `favorite`). Se usa en el banner, en la tarjeta y en el estado vacío. |
| `Header`       | Logo del cine y navegación, leyendo los enlaces de `cinema.js`. |
| `Hero`         | Banner de la película destacada (`featuredMovie`) con el buscador y su CTA *Buscar*. |
| `MovieSearch`  | Entrada controlada: el texto vive en el estado de `App` y `onChange` lo actualiza. |
| `MovieCard`    | Tarjeta individual (imagen, título, valoración, horarios) con el botón de favorita. Recibe `isFavorite` y `onToggleFavorite`. |
| `MovieList`    | Filtra la cartelera por el texto, dibuja una `MovieCard` por película con `key={movie.id}` y muestra el estado vacío. |
| `Footer`       | Datos de contacto e información general del cine. |

## Estado y persistencia

El estado (`favorites`, `query` y `debouncedQuery`) vive en `App`, el ancestro común de
los componentes que lo usan. Las favoritas se guardan en `localStorage` con la clave
`cinemax:favorites` y se recuperan al cargar la página, por lo que sobreviven a una
recarga. El detalle de **cada dato, en qué componente está y por qué** está en
[estado-y-persistencia.md](./estado-y-persistencia.md).

## Notas de la práctica

- Las películas se pasan por props desde `src/data/movies.js`; ningún componente tiene
  los datos hardcodeados.
- `MovieList` usa `key={movie.id}` para que React identifique cada tarjeta.
- El filtrado ignora mayúsculas y acentos (`orion` encuentra «Rumbo a Orión») y aplica
  un retardo de 300 ms para no filtrar con cada letra.
- El código, los identificadores y los comentarios están en inglés; los textos de la
  interfaz y la documentación están en español, según las normas de la guía.
- Los errores típicos practicados (`class`, dos nodos raíz y `key` faltante) están
  documentados en [errores-react.md](./errores-react.md).
- Las capturas de evidencias están en [evidencias/](./evidencias/).
- El entregable con el formato solicitado (nombre, título, capturas, código,
  explicación y casos de prueba) está en [ENTREGABLE-S10.md](./ENTREGABLE-S10.md).
