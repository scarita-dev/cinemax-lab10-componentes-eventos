import { useState } from 'react'
import Button from '../Button/Button'
import PremieresCarousel from '../PremieresCarousel/PremieresCarousel'
import Skeleton from '../Skeleton/Skeleton'
import usePremieres, { PREMIERES_STATUS } from '../../hooks/usePremieres'

function PremieresSection() {
  const [simulateError, setSimulateError] = useState(false)
  const { status, items, error, retry } = usePremieres({ shouldFail: simulateError })

  const isLoading = status === PREMIERES_STATUS.LOADING
  const isError = status === PREMIERES_STATUS.ERROR
  const hasData = status === PREMIERES_STATUS.SUCCESS

  return (
    <section
      className="premieres"
      aria-labelledby="premieres-title"
      aria-busy={isLoading}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Antes del estreno</p>
          <h2 className="section-title" id="premieres-title">
            Próximos estrenos
          </h2>
          <p className="section-subtitle">
            Una muestra de lo que llegará a CineMax en las próximas semanas.
          </p>
        </div>
        <Button
          variant="ghost"
          className="premieres__demo"
          onClick={() => setSimulateError((current) => !current)}
          aria-pressed={simulateError}
        >
          {simulateError ? 'Quitar error simulado' : 'Simular error'}
        </Button>
      </div>

      {isLoading && (
        <Skeleton count={3} label="Cargando próximos estrenos…" />
      )}

      {isError && (
        <div className="premieres__error" role="alert">
          <span className="premieres__error-icon" aria-hidden="true">
            !
          </span>
          <div className="premieres__error-copy">
            <h3>No se pudieron cargar los estrenos</h3>
            <p>{error}</p>
            <div className="cluster">
              <Button variant="primary" onClick={retry}>
                Reintentar
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSimulateError(false)}
              >
                Ver datos de ejemplo
              </Button>
            </div>
          </div>
        </div>
      )}

      {hasData && <PremieresCarousel premieres={items} />}
    </section>
  )
}

export default PremieresSection
