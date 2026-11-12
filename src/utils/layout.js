// Responsive helpers shared by MovieList and PremieresCarousel. Keeping the
// breakpoints in one place means both components react to the same widths and
// useWindowSize remains a generic hook.
export function getMovieColumns(width) {
  if (width >= 1080) return 4
  if (width >= 780) return 3
  if (width >= 520) return 2
  return 1
}

export function getPremiereItemsPerView(width) {
  if (width >= 960) return 3
  if (width >= 620) return 2
  return 1
}
