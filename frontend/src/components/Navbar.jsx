import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiChevronDown, FiUser, FiLogOut, FiMenu, FiX, FiCalendar } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const navigateTo = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo-container">
        <span className="logo-icon">✈</span>
        <span className="logo-text">Horizon Air</span>
      </Link>

      <ul className="nav-links">
        <li><NavLink to="/flights" className="nav-link">Vuelos</NavLink></li>
        <li><NavLink to="/destinations" className="nav-link">Destinos</NavLink></li>
        {user && <li><NavLink to="/my-bookings" className="nav-link">Mis Reservas</NavLink></li>}
        <li><NavLink to="/about" className="nav-link">Sobre Nosotros</NavLink></li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button 
              className="user-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FiUser />
              <span>{user.role === 'admin' ? 'Administrador' : user.name.split(' ')[0]}</span>
              <FiChevronDown style={{transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.3s'}} />
            </button>
            
            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <button onClick={() => navigateTo('/profile')} className="dropdown-item">
                  <FiUser /> Mi Perfil
                </button>
                <button onClick={() => navigateTo('/my-bookings')} className="dropdown-item">
                  <FiCalendar /> Mis Reservas
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">
                  <FiLogOut /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
          </>
        )}
        <button className="mobile-menu-btn" style={{display: 'none'}} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
