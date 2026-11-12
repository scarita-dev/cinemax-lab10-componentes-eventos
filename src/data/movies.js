// Raw movie catalog, shaped like the payload returned by the cinema API.
// The application never consumes this shape directly: App runs it through
// src/utils/movieAdapter.js so every component works with the same model.
const movies = [
  {
    id: 1,
    title: 'Sombras del Alba',
    poster_path: '/posters/pelicula-1.svg',
    overview:
      'Una detective investiga desapariciones en un pueblo donde el sol nunca termina de salir.',
    age_rating: '+14',
    vote_average: 4.3,
    schedule: ['15:30', '18:00', '21:15'],
  },
  {
    id: 2,
    title: 'Rumbo a Orión',
    poster_path: '/posters/pelicula-2.svg',
    overview:
      'Una tripulación internacional viaja hacia una estrella lejana para salvar a la humanidad.',
    age_rating: 'APT',
    vote_average: 4.6,
    schedule: ['14:00', '17:00', '20:00'],
  },
  {
    id: 3,
    title: 'La Última Cosecha',
    poster_path: '/posters/pelicula-3.svg',
    overview:
      'Una familia de agricultores lucha por conservar sus tierras durante un año de sequía.',
    age_rating: '+7',
    vote_average: 4.0,
    schedule: ['16:00', '19:00'],
  },
  {
    id: 4,
    title: 'Risas en Cadena',
    poster_path: '/posters/pelicula-4.svg',
    overview:
      'Cinco amigos intentan organizar la boda perfecta y todo sale mal de las formas más graciosas.',
    age_rating: 'APT',
    vote_average: 3.8,
    schedule: ['15:00', '17:30', '20:30'],
  },
  {
    id: 5,
    title: 'Código Fantasma',
    poster_path: '/posters/pelicula-5.svg',
    overview:
      'Un hacker descubre un programa que predice crímenes antes de que ocurran.',
    age_rating: '+14',
    vote_average: 4.4,
    schedule: ['18:30', '21:00', '23:00'],
  },
  {
    id: 6,
    title: 'El Faro Olvidado',
    poster_path: '/posters/pelicula-6.svg',
    overview:
      'Un guardafaros solitario descubre que la luz que cuida guía algo más que barcos.',
    age_rating: '+18',
    vote_average: 4.1,
    schedule: ['19:30', '22:00'],
  },
  {
    id: 7,
    title: 'Corazón de Tango',
    poster_path: '/posters/pelicula-7.svg',
    overview:
      'Dos bailarines rivales se enamoran en las milongas de Buenos Aires de los años 40.',
    age_rating: '+14',
    vote_average: 4.2,
    schedule: ['16:30', '19:15'],
  },
  {
    id: 8,
    title: 'Mundo Pixelado',
    poster_path: '/posters/pelicula-8.svg',
    overview:
      'Una niña queda atrapada dentro de su videojuego favorito y debe llegar al nivel final.',
    age_rating: 'APT',
    vote_average: 4.7,
    schedule: ['13:00', '15:15', '17:45'],
  },
  {
    id: 9,
    title: 'Tormenta Eterna',
    poster_path: '/posters/pelicula-9.svg',
    overview:
      'Un grupo de cazatormentas persigue un huracán que parece tener voluntad propia.',
    age_rating: '+7',
    vote_average: 3.9,
    schedule: ['14:30', '18:15', '21:30'],
  },
]

export default movies
