import { FiClock, FiShield, FiWind, FiGlobe } from 'react-icons/fi';

const features = [
  { 
    icon: <FiClock />, 
    title: "Puntualidad", 
    text: "El 98% de nuestros vuelos llegan a tiempo." 
  },
  { 
    icon: <FiShield />, 
    title: "Seguridad", 
    text: "Certificación internacional en todos nuestros procesos." 
  },
  { 
    icon: <FiWind />, 
    title: "Confort", 
    text: "Asientos premium con el mayor espacio de la industria." 
  },
  { 
    icon: <FiGlobe />, 
    title: "Destinos", 
    text: "Más de 50 destinos nacionales e internacionales." 
  }
];

const WhyFly = () => {
  return (
    <section className="features-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">¿Por qué volar con Horizon Air?</h2>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
              <div className="feature-icon">{f.icon}</div>
              <h4 className="feature-title">{f.title}</h4>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFly;
