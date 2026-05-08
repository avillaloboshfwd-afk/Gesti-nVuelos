import { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { FiArrowRight } from 'react-icons/fi';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { setLoading(true); bookingService.getAll().then(r => setBookings(r.data.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try { await bookingService.cancel(id); fetch(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header"><h1 className="page-title">Gestión de Reservas</h1><p className="page-subtitle">Todas las reservas del sistema</p></div>
      {bookings.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">Sin reservas</div></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Cliente</th><th>Vuelo</th><th>Ruta</th><th>Asientos</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.user?.name}<br/><span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{b.user?.email}</span></td>
                  <td style={{fontWeight:600,color:'var(--accent)'}}>{b.flight?.flightNumber}</td>
                  <td>{b.flight?.origin} <FiArrowRight style={{verticalAlign:'middle'}} /> {b.flight?.destination}</td>
                  <td>{b.seatsReserved}</td>
                  <td style={{fontWeight:600}}>${Number(b.totalPrice).toLocaleString()}</td>
                  <td><span className={`badge ${b.status==='confirmed'?'badge-success':b.status==='cancelled'?'badge-danger':'badge-warning'}`}>{b.status}</span></td>
                  <td>{fmt(b.createdAt)}</td>
                  <td>{b.status !== 'cancelled' && <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancelar</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
