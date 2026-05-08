import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightService, bookingService } from '../services/api';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const BookFlight = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    flightService.getById(id).then(r => setFlight(r.data.data)).catch(() => navigate('/flights')).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      await bookingService.create({ flightId: parseInt(id), seatsReserved: seats });
      setSuccess('¡Reserva creada exitosamente!');
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear reserva');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!flight) return null;

  const total = (Number(flight.price) * seats).toLocaleString();

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{marginBottom:16}}><FiArrowLeft /> Volver</button>
        <h1 className="page-title">Reservar Vuelo</h1>
        <p className="page-subtitle">{flight.flightNumber} — {flight.origin} → {flight.destination}</p>
      </div>
      <div style={{maxWidth:600}}>
        <div className="card" style={{marginBottom:20}}>
          <div className="flight-route" style={{marginBottom:16}}>
            <div className="flight-city"><div className="flight-city-name">{flight.origin}</div></div>
            <FiArrowRight className="flight-arrow" />
            <div className="flight-city"><div className="flight-city-name">{flight.destination}</div></div>
          </div>
          <div style={{display:'flex',gap:24,color:'var(--text-muted)',fontSize:'0.85rem'}}>
            <span>Precio: ${Number(flight.price).toLocaleString()}/asiento</span>
            <span>Disponibles: {flight.availableSeats}</span>
          </div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Cantidad de Asientos</label>
              <input type="number" className="form-input" min="1" max={flight.availableSeats} value={seats} onChange={e => setSeats(Math.max(1, parseInt(e.target.value) || 1))} required />
            </div>
            <div style={{padding:20,background:'var(--bg-glass)',borderRadius:8,marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'var(--text-muted)'}}>Total a pagar</span>
              <span style={{fontSize:'1.5rem',fontWeight:700,background:'var(--gradient-1)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>${total}</span>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={submitting}>
              {submitting ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFlight;
