import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '../Button/Button'
import PremiereCard from '../PremiereCard/PremiereCard'
import useWindowSize from '../../hooks/useWindowSize'
import { getPremiereItemsPerView } from '../../utils/layout'

function PremieresCarousel({ premieres }) {
  const { width } = useWindowSize()
  const itemsPerView = getPremiereItemsPerView(width)
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    setCanScrollLeft(track.scrollLeft > 1)
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    updateScrollButtons()
    track.addEventListener('scroll', updateScrollButtons, { passive: true })
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      track.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [itemsPerView, premieres.length, updateScrollButtons])

  const scrollByCard = (direction) => {
    const track = trackRef.current
    if (!track) return

    const card = track.querySelector('.premiere-card')
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
    const step = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8

    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div
      className="premieres-carousel"
      aria-roledescription="carrusel"
      aria-label="Próximos estrenos"
    >
      <div className="premieres-carousel__controls">
        <Button
          variant="secondary"
          className="premieres-carousel__button"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollLeft}
          aria-label="Ver estrenos anteriores"
        >
          <span aria-hidden="true">←</span>
        </Button>
        <Button
          variant="secondary"
          className="premieres-carousel__button"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollRight}
          aria-label="Ver más estrenos"
        >
          <span aria-hidden="true">→</span>
        </Button>
      </div>

      <ul
        className="premieres-carousel__track"
        ref={trackRef}
        style={{ '--premiere-items': itemsPerView }}
      >
        {premieres.map((premiere) => (
          <li className="premieres-carousel__item" key={premiere.id}>
            <PremiereCard premiere={premiere} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PremieresCarousel
