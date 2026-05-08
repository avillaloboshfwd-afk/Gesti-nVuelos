import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiMap, FiBookOpen, FiUsers, FiSettings, FiLogOut, FiPlus } from 'react-icons/fi';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">✈</div>
          <div className="sidebar-logo-text">
            <h2>AntiGravity</h2>
            <span>FLIGHT SYSTEM</span>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Principal</div>
          <NavLink to="/flights" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiMap /> Vuelos
          </NavLink>
          {!isAdmin && (
            <NavLink to="/my-bookings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FiBookOpen /> Mis Reservas
            </NavLink>
          )}
        </div>
        {isAdmin && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Administración</div>
            <NavLink to="/admin/flights" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FiSettings /> Gestión Vuelos
            </NavLink>
            <NavLink to="/admin/flights/new" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FiPlus /> Crear Vuelo
            </NavLink>
            <NavLink to="/admin/bookings" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FiBookOpen /> Reservas
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FiUsers /> Usuarios
            </NavLink>
          </div>
        )}
      </nav>
      <div className="sidebar-footer">
        <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:8}}>{user?.name}</div>
        <button className="btn-logout" onClick={handleLogout}><FiLogOut /> Cerrar Sesión</button>
      </div>
    </aside>
  );
};

export default Sidebar;
