import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="logo-container" style={{marginBottom: '20px'}}>
            <span className="logo-icon" style={{color: 'white'}}>✈</span>
            <span className="logo-text" style={{color: 'white'}}>Horizon Air</span>
          </div>
          <p style={{fontSize: '14px', color: 'var(--color-gray-text)', maxWidth: '250px'}}>
            Llevándote a los destinos de tus sueños con la mayor seguridad y confort del mercado.
          </p>
        </div>

        <div className="footer-col">
          <h4>Links Rápidos</h4>
          <ul className="footer-links">
            <li><Link to="/flights">Vuelos</Link></li>
            <li><Link to="/destinations">Destinos</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
            <li><Link to="/my-bookings">Mis Reservas</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Soporte</h4>
          <ul className="footer-links">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Privacidad</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Redes Sociales</h4>
          <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
            <a href="#" style={{fontSize: '20px', color: 'white'}}><FiInstagram /></a>
            <a href="#" style={{fontSize: '20px', color: 'white'}}><FiFacebook /></a>
            <a href="#" style={{fontSize: '20px', color: 'white'}}><FiTwitter /></a>
            <a href="#" style={{fontSize: '20px', color: 'white'}}><FiLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Horizon Air Flight System. Todos los derechos reservados. Inspirado en la excelencia.
      </div>
    </footer>
  );
};

export default Footer;
