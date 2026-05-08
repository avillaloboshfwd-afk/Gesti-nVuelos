import { useState } from 'react';
import { FiMapPin, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';

const FlightSearch = ({ onSearch }) => {
  const [tripType, setTripType] = useState('round');
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(formData);
  };

  return (
    <div className="search-widget-container">
      <div className="search-widget">
        <div className="search-tabs">
          <div className="search-tab" onClick={() => setTripType('round')}>
            <input type="radio" checked={tripType === 'round'} readOnly /> 🔘 Ida y vuelta
          </div>
          <div className="search-tab" onClick={() => setTripType('one')}>
            <input type="radio" checked={tripType === 'one'} readOnly /> ○ Solo ida
          </div>
        </div>

        <form className="search-grid" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Origen</label>
            <div className="input-wrapper">
              <FiMapPin className="input-icon" />
              <input 
                name="origin" 
                className="search-input" 
                placeholder="¿Desde dónde?" 
                value={formData.origin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Destino</label>
            <div className="input-wrapper">
              <FiMapPin className="input-icon" />
              <input 
                name="destination" 
                className="search-input" 
                placeholder="¿Hacia dónde?" 
                value={formData.destination}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Salida</label>
            <div className="input-wrapper">
              <FiCalendar className="input-icon" />
              <input 
                type="date" 
                name="departureDate" 
                className="search-input" 
                value={formData.departureDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {tripType === 'round' && (
            <div className="input-group">
              <label className="input-label">Regreso</label>
              <div className="input-wrapper">
                <FiCalendar className="input-icon" />
                <input 
                  type="date" 
                  name="returnDate" 
                  className="search-input" 
                  value={formData.returnDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Pasajeros</label>
            <div className="input-wrapper">
              <FiUsers className="input-icon" />
              <input 
                type="number" 
                name="passengers" 
                className="search-input" 
                min="1" 
                value={formData.passengers}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-search">
            Buscar Vuelos <FiArrowRight style={{marginLeft: '8px'}} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlightSearch;
