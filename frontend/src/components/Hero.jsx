import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    title: "Vuela sin límites",
    subtitle: "Descubre el mundo con Horizon Air, tu aerolínea de confianza.",
    image: "/assets/hero_new_york.png",
    cta: "Buscar vuelos",
    badge: null
  },
  {
    title: "Ofertas especiales esta temporada",
    subtitle: "Aprovecha descuentos increíbles en vuelos internacionales.",
    image: "/assets/hero_airplane.png",
    cta: "Ver ofertas",
    badge: "Hasta 40% OFF"
  },
  {
    title: "Experiencia Premium",
    subtitle: "Viaja en primera clase con el máximo confort y elegancia.",
    image: "/assets/hero_luxury.png",
    cta: "Conoce más",
    badge: "Premium Class"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <section className="hero-carousel">
      {slides.map((slide, index) => (
        <div key={index} className={`slide ${index === current ? 'active' : ''}`}>
          <div className="slide-bg" style={{ backgroundImage: `url(${slide.image})` }}></div>
          <div className="slide-overlay"></div>
          <div className="slide-content">
            {slide.badge && <span className="badge-offer">{slide.badge}</span>}
            <h1 className="slide-title">{slide.title}</h1>
            <p className="slide-subtitle">{slide.subtitle}</p>
            <button className="btn btn-primary" style={{padding: '16px 40px', fontSize: '16px'}}>{slide.cta}</button>
          </div>
        </div>
      ))}
      
      <button className="carousel-btn prev" onClick={prevSlide} style={{position: 'absolute', left: '20px', top: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', zIndex: 11, display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '24px'}}>
        <FiChevronLeft style={{margin: '0 auto'}} />
      </button>
      <button className="carousel-btn next" onClick={nextSlide} style={{position: 'absolute', right: '20px', top: '50%', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', zIndex: 11, display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '24px'}}>
        <FiChevronRight style={{margin: '0 auto'}} />
      </button>

      <div className="carousel-dots" style={{position: 'absolute', bottom: '110px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 11}}>
        {slides.map((_, i) => (
          <div 
            key={i} 
            onClick={() => setCurrent(i)}
            style={{
              width: '12px', height: '12px', borderRadius: '50%', 
              background: i === current ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', transition: '0.3s'
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
