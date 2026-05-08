import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = () => { setLoading(true); flightService.getAll().then(r => setFlights(r.data.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este vuelo?')) return;
    try { await flightService.delete(id); fetch(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
        <div><h1 className="page-title">Gestión de Vuelos</h1><p className="page-subtitle">Administra los vuelos del sistema</p></div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/flights/new')}><FiPlus /> Nuevo Vuelo</button>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Número</th><th>Origen</th><th>Destino</th><th>Salida</th><th>Asientos</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {flights.map(f => (
              <tr key={f.id}>
                <td style={{fontWeight:600,color:'var(--accent)'}}>{f.flightNumber}</td>
                <td>{f.origin}</td>
                <td>{f.destination}</td>
                <td>{fmt(f.departureDate)}</td>
                <td>{f.availableSeats}/{f.totalSeats}</td>
                <td>${Number(f.price).toLocaleString()}</td>
                <td><span className={`badge ${f.status==='scheduled'?'badge-success':f.status==='cancelled'?'badge-danger':'badge-warning'}`}>{f.status}</span></td>
                <td style={{display:'flex',gap:8}}>
                  <button className="btn btn-secondary btn-icon" onClick={() => navigate(`/admin/flights/edit/${f.id}`)}><FiEdit2 /></button>
                  <button className="btn btn-danger btn-icon" onClick={() => handleDelete(f.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFlights;
