import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight } from 'react-icons/fi';

import Hero from '../components/Hero';
import FlightSearch from '../components/FlightSearch';
import WhyFly from '../components/WhyFly';
import Offers from '../components/home/Offers';
import PopularFlights from '../components/home/PopularFlights';
import TravelSteps from '../components/home/TravelSteps';
import Testimonials from '../components/home/Testimonials';
import AppDownload from '../components/home/AppDownload';
import Newsletter from '../components/home/Newsletter';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ origin: '', destination: '', date: '', available: '' });
  const { isClient } = useAuth();
  const navigate = useNavigate();

  const fetchFlights = async (customFilters) => {
    setLoading(true);
    try {
      const activeFilters = customFilters || filters;
      const params = {};
      if (activeFilters.origin) params.origin = activeFilters.origin;
      if (activeFilters.destination) params.destination = activeFilters.destination;
      if (activeFilters.date) params.date = activeFilters.date;
      if (activeFilters.available) params.available = activeFilters.available;
      
      const res = await flightService.getAll(params);
      setFlights(res.data.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchFlights(); 
  }, []);

  const handleSearch = (searchData) => {
    setFilters({ ...filters, ...searchData });
    fetchFlights(searchData);
    const resultsElement = document.getElementById('results-section');
    if (resultsElement) resultsElement.scrollIntoView({ behavior: 'smooth' });
  };

  const fmt = (d) => new Date(d).toLocaleDateString('es-ES', { 
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="fade-in">
      {/* 1. Navbar (Sticky en Layout) */}
      
      {/* 2. Hero + Buscador */}
      <Hero />
      <FlightSearch onSearch={handleSearch} />
      
      {/* 3. Ofertas del Momento */}
      <Offers />

      {/* 4. Vuelos Populares */}
      <PopularFlights />

      {/* 5. ¿Por qué AntiGravity? */}
      <WhyFly />

      {/* 6. Experiencia de Viaje */}
      <TravelSteps />

      {/* 7. Testimonios */}
      <Testimonials />

      {/* 8. App Download */}
      <AppDownload />

      {/* 9. Newsletter */}
      <Newsletter />

      {/* Listado de vuelos (Resultados de búsqueda) */}
      <div id="results-section" className="section-container" style={{paddingTop: '80px'}}>
        <div className="section-header" style={{textAlign: 'left', marginBottom: '30px'}}>
          <h2 className="section-title">Vuelos Disponibles</h2>
          <p style={{color: 'var(--color-gray-text)'}}>Selecciona tu próximo destino con Horizon Air.</p>
        </div>

        {loading ? (
          <div className="loading" style={{minHeight: '300px'}}><div className="spinner"></div></div>
        ) : flights.length === 0 ? (
          <div className="empty-state" style={{minHeight: '300px'}}>
            <div className="empty-icon" style={{color: 'var(--color-primary)'}}>✈</div>
            <div className="empty-title">No se encontraron vuelos</div>
            <div className="empty-text">Intenta con otros filtros de búsqueda.</div>
          </div>
        ) : (
          <div className="flights-grid">
            {flights.map(f => (
              <div key={f.id} className="flight-card fadeInUp" style={{background: 'white', border: '1px solid #eee', position: 'relative'}}>
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--color-primary)'}}></div>
                <div className="flight-number" style={{fontWeight: '700', marginBottom: '15px'}}>{f.flightNumber}</div>
                <div className="flight-route" style={{marginBottom: '20px'}}>
                  <div className="flight-city">
                    <div className="flight-city-name">{f.origin}</div>
                    <div className="flight-city-label">Origen</div>
                  </div>
                  <FiArrowRight style={{color: 'var(--color-primary)', fontSize: '20px'}} />
                  <div className="flight-city">
                    <div className="flight-city-name">{f.destination}</div>
                    <div className="flight-city-label">Destino</div>
                  </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px 0', borderTop: '1px solid #f5f5f5'}}>
                  <div>
                    <div style={{fontSize: '11px', color: '#888', textTransform: 'uppercase'}}>Salida</div>
                    <div style={{fontSize: '13px', fontWeight: '600'}}>{fmt(f.departureDate)}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '11px', color: '#888', textTransform: 'uppercase'}}>Llegada</div>
                    <div style={{fontSize: '13px', fontWeight: '600'}}>{fmt(f.arrivalDate)}</div>
                  </div>
                </div>
                <div className="flight-footer" style={{marginTop: '15px', borderTop: '1px solid #f5f5f5', paddingTop: '15px'}}>
                  <div>
                    <div style={{fontSize: '22px', fontWeight: '800', color: 'var(--color-secondary)'}}>
                      ${Number(f.price).toLocaleString()}
                    </div>
                    <div style={{fontSize: '11px', color: '#888'}}>Precio final</div>
                  </div>
                  {isClient && f.status === 'scheduled' && f.availableSeats > 0 && (
                    <button 
                      className="btn btn-primary" 
                      style={{borderRadius: '4px', padding: '10px 20px'}}
                      onClick={() => navigate(`/flights/${f.id}/book`)}
                    >
                      Reservar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;
