import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flightService } from '../services/api';
import { FiArrowLeft } from 'react-icons/fi';

const FlightForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    flightNumber: '', origin: '', destination: '', departureDate: '', arrivalDate: '',
    totalSeats: '', availableSeats: '', price: '', status: 'scheduled'
  });

  useEffect(() => {
    if (isEdit) {
      flightService.getById(id).then(r => {
        const f = r.data.data;
        setForm({
          flightNumber: f.flightNumber, origin: f.origin, destination: f.destination,
          departureDate: f.departureDate?.slice(0, 16), arrivalDate: f.arrivalDate?.slice(0, 16),
          totalSeats: f.totalSeats, availableSeats: f.availableSeats, price: f.price, status: f.status
        });
      }).catch(() => navigate('/admin/flights'));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isEdit) await flightService.update(id, form);
      else await flightService.create(form);
      navigate('/admin/flights');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.details?.[0]?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/flights')} style={{marginBottom:16}}><FiArrowLeft /> Volver</button>
        <h1 className="page-title">{isEdit ? 'Editar Vuelo' : 'Crear Nuevo Vuelo'}</h1>
      </div>
      <div className="card" style={{maxWidth:700}}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Número de Vuelo</label><input name="flightNumber" className="form-input" value={form.flightNumber} onChange={handleChange} placeholder="AG-001" required /></div>
            <div className="form-group"><label className="form-label">Estado</label><select name="status" className="form-select" value={form.status} onChange={handleChange}><option value="scheduled">Programado</option><option value="cancelled">Cancelado</option><option value="completed">Completado</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Origen</label><input name="origin" className="form-input" value={form.origin} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Destino</label><input name="destination" className="form-input" value={form.destination} onChange={handleChange} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Fecha de Salida</label><input type="datetime-local" name="departureDate" className="form-input" value={form.departureDate} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Fecha de Llegada</label><input type="datetime-local" name="arrivalDate" className="form-input" value={form.arrivalDate} onChange={handleChange} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Asientos Totales</label><input type="number" name="totalSeats" className="form-input" value={form.totalSeats} onChange={handleChange} min="1" required /></div>
            <div className="form-group"><label className="form-label">Asientos Disponibles</label><input type="number" name="availableSeats" className="form-input" value={form.availableSeats} onChange={handleChange} min="0" required /></div>
          </div>
          <div className="form-group"><label className="form-label">Precio por Asiento</label><input type="number" name="price" className="form-input" value={form.price} onChange={handleChange} step="0.01" min="0" required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading ? 'Guardando...' : isEdit ? 'Actualizar Vuelo' : 'Crear Vuelo'}</button>
        </form>
      </div>
    </div>
  );
};

export default FlightForm;
