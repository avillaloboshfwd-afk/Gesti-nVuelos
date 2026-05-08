import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const FlightDetail = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isClient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    flightService.getById(id).then(r => setFlight(r.data.data)).catch(() => navigate('/flights')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!flight) return null;

  const fmt = (d) => new Date(d).toLocaleDateString('es-ES', { weekday:'long', day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/flights')} style={{marginBottom:16}}><FiArrowLeft /> Volver</button>
        <h1 className="page-title">Vuelo {flight.flightNumber}</h1>
        <p className="page-subtitle">{flight.origin} → {flight.destination}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Información del Vuelo</h3>
            <span className={`badge ${flight.status==='scheduled'?'badge-success':flight.status==='cancelled'?'badge-danger':'badge-warning'}`}>{flight.status}</span>
          </div>
          <div className="flight-route" style={{marginBottom:20}}>
            <div className="flight-city"><div className="flight-city-name">{flight.origin}</div><div className="flight-city-label">Origen</div></div>
            <FiArrowRight className="flight-arrow" />
            <div className="flight-city"><div className="flight-city-name">{flight.destination}</div><div className="flight-city-label">Destino</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div><div className="flight-detail-label">Salida</div><div className="flight-detail-value">{fmt(flight.departureDate)}</div></div>
            <div><div className="flight-detail-label">Llegada</div><div className="flight-detail-value">{fmt(flight.arrivalDate)}</div></div>
          </div>
        </div>
        <div className="card">
          <h3 className="card-title" style={{marginBottom:20}}>Disponibilidad y Precio</h3>
          <div className="stat-value" style={{fontSize:'2.5rem',marginBottom:8}}>${Number(flight.price).toLocaleString()}</div>
          <div style={{color:'var(--text-muted)',marginBottom:24}}>por asiento</div>
          <div style={{display:'flex',gap:24,marginBottom:24}}>
            <div><div className="flight-detail-label">Asientos Totales</div><div className="flight-detail-value" style={{fontSize:'1.5rem'}}>{flight.totalSeats}</div></div>
            <div><div className="flight-detail-label">Disponibles</div><div className="flight-detail-value" style={{fontSize:'1.5rem',color:'var(--success)'}}>{flight.availableSeats}</div></div>
          </div>
          {isClient && flight.status === 'scheduled' && flight.availableSeats > 0 && (
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => navigate(`/flights/${flight.id}/book`)}>Reservar Este Vuelo</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
