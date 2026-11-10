import cinema from '../../data/cinema'

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="footer__inner container">
        <section>
          <h3 className="footer__title">{cinema.name}</h3>
          <p>Tu cine de siempre, con la mejor cartelera de la ciudad.</p>
        </section>
        <section>
          <h3 className="footer__title">Contacto</h3>
          <ul className="footer__list">
            <li>{cinema.address}</li>
            <li>Tel: {cinema.phone}</li>
            <li>{cinema.email}</li>
          </ul>
        </section>
        <section>
          <h3 className="footer__title">Información</h3>
          <ul className="footer__list">
            <li>{cinema.hours}</li>
            <li>Funciones numeradas y salas 3D</li>
          </ul>
        </section>
      </div>
      <p className="footer__copy">
        © {currentYear} {cinema.name}. Todos los derechos reservados.
      </p>
    </footer>
  )
}

export default Footer
