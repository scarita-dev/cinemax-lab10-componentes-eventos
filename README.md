# CineMax — Laboratorio 11: Comunicación entre componentes

Aplicación de cartelera de cine construida con **React 19 + Vite 8**. Este laboratorio
parte del proyecto acumulativo del Laboratorio 10 y añade la comunicación entre
componentes hermanos, hooks propios reutilizables, la integración de la biblioteca de
interfaz del proyecto y la resolución de los estados de carga y de error.

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

## Requerimientos del Laboratorio 11

| Paso | Requerimiento | Dónde está implementado |
| ---- | ------------- | ------------------------ |
| 1 | Partir de la cartelera del Laboratorio 10 y crear la rama de trabajo | Proyecto acumulativo; rama sugerida: `lab11-comunicacion-componentes` |
| 2 | Ampliar estilos con tipografía y utilidades nuevas | `src/styles/base/typography.css`, `utilities.css`, `variables.css` |
| 3 | Utilidad adaptadora de los datos de una película | `src/utils/movieAdapter.js`; la cartelera se adapta en `App.jsx` |
| 4 | Aviso emergente al marcar/desmarcar una favorita sin que la tarjeta sepa cómo se muestra | `ToastProvider`, `Toast` y `useToast`; `App.jsx` decide el mensaje |
| 5 | Hook propio `useDebounce` en el buscador | `src/hooks/useDebounce.js`, usado en `App.jsx` |
| 6 | Hook propio `useWindowSize` para decidir tarjetas por fila | `src/hooks/useWindowSize.js`, usado en `MovieList.jsx` y `PremieresCarousel.jsx` |
| 7 | Hook `usePremieres` con estados cargando, datos y error | `src/hooks/usePremieres.js` |
| 8 | Esqueleto de carga y carrusel de estrenos montados en una sección | `Skeleton`, `PremieresCarousel`, `PremiereCard` y `PremieresSection` |
| 9 | Contador de favoritas elevado a la raíz y visible en la cabecera, sin pasar la lista | `App.jsx` pasa `favoriteCount`; `Header.jsx` solo recibe el número |
| 10 | Botón que limpia el filtro desde el banner y mantiene buscador y listado sincronizados | `Hero.jsx` → `onClearQuery`; `App.jsx` → `clearQuery` |
| 11 | Árbol de componentes, dato por nivel y explicación del contador | [`ENTREGABLE-S11.md`](./ENTREGABLE-S11.md) |
| 12 | Repositorio y entregable | Este repositorio + [`ENTREGABLE-S11.md`](./ENTREGABLE-S11.md) |

## Estructura

```text
src/
├── components/          # una carpeta por componente
│   ├── Button/Button.jsx
│   ├── Footer/Footer.jsx
│   ├── Header/Header.jsx                 # recibe favoriteCount, no la lista
│   ├── Hero/Hero.jsx                     # banner + buscador + Limpiar filtro
│   ├── MovieCard/MovieCard.jsx           # tarjeta + botón de favorita
│   ├── MovieList/MovieList.jsx           # filtro, columnas y estado vacío
│   ├── MovieSearch/MovieSearch.jsx
│   ├── PremiereCard/PremiereCard.jsx
│   ├── PremieresCarousel/PremieresCarousel.jsx
│   ├── PremieresSection/PremieresSection.jsx
│   ├── Skeleton/Skeleton.jsx
│   ├── Toast/Toast.jsx
│   └── ToastProvider/ToastProvider.jsx
├── context/toastContext.js
├── data/                # datos "de API" y datos generales del cine
│   ├── cinema.js
│   ├── movies.js
│   └── premieres.js
├── hooks/
│   ├── useDebounce.js
│   ├── usePremieres.js
│   ├── useToast.js
│   └── useWindowSize.js
├── utils/
│   ├── layout.js        # columnas por ancho de ventana
│   └── movieAdapter.js  # patrón adaptador
├── styles/              # arquitectura CSS
├── App.jsx              # composición y estado compartido
└── main.jsx             # montaje de React + ToastProvider
```

## Hooks y componentes reutilizables

| Elemento | Responsabilidad |
| -------- | --------------- |
| `useDebounce` | Devuelve una copia retardada de un valor y permite aplicarla o limpiarla de inmediato. |
| `useWindowSize` | Escucha el tamaño de la ventana; se usa en dos componentes. |
| `usePremieres` | Simula la petición de estrenos y expone `loading`, `success` y `error`. |
| `useToast` | Acceso al aviso emergente desde cualquier componente dentro del proveedor. |
| `Skeleton` | Esqueleto animado que avisa mientras carga. |
| `PremieresCarousel` | Carrusel horizontal con controles accesibles y elementos por vista según el ancho. |
| `Button` | Biblioteca de interfaz del proyecto: variantes `primary`, `secondary`, `ghost` y `favorite`. |

## Estado compartido

El estado compartido vive en `App`, el ancestro común de los componentes que lo
necesitan:

- `favorites`: `MovieList` lo lee, `MovieCard` lo pinta y `Header` recibe solo
  `favorites.length`.
- `query`: lo escribe `Hero` y lo usa `MovieList` para filtrar.
- `debouncedQuery`: valor derivado con `useDebounce`, usado para filtrar sin recorrer
  la cartelera en cada pulsación.
- `simulateError`: estado local de `PremieresSection` para poder demostrar el estado
  de error sin tocar la lógica del hook.

El árbol de componentes, el dato que vive en cada nivel y la justificación del
contador están en [`ENTREGABLE-S11.md`](./ENTREGABLE-S11.md).

## Notas de la práctica

- El código, los identificadores y los comentarios están en inglés; la interfaz y la
  documentación están en español, según las normas de la guía.
- Los datos de `src/data/movies.js` y `src/data/premieres.js` usan nombres de campos
  de API (`poster_path`, `vote_average`, `release_date`); el adaptador los traduce al
  modelo único que consumen los componentes.
- Las capturas del Laboratorio 11 están en [`evidencias/`](./evidencias/):
  `11-toast-favorita.jpg`, `12-estrenos-cargando.jpg`, `13-estrenos-error.jpg`,
  `14-busqueda-limpiar.jpg`, `15-pantalla-completa.jpg` y
  `16-estructura-proyecto.txt`.
- Para demostrar el estado de error de los estrenos, pulsa **Simular error** en la
  sección *Próximos estrenos*; **Reintentar** repite la petición y
  **Ver datos de ejemplo** vuelve al estado con datos.
- El entregable completo está en [`ENTREGABLE-S11.md`](./ENTREGABLE-S11.md).
