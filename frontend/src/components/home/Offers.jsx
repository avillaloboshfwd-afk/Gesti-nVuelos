import { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';

const offers = [
  {
    id: 1,
    origin: 'San José',
    destination: 'Cancún',
    discount: '-35% OFF',
    originalPrice: 450,
    newPrice: 292,
    dateRange: 'Jun - Ago',
    type: 'Directo',
    image: '/assets/dest_cancun.png'
  },
  {
    id: 2,
    origin: 'Bogotá',
    destination: 'Buenos Aires',
    discount: '-20% OFF',
    originalPrice: 520,
    newPrice: 416,
    dateRange: 'Jul - Sep',
    type: 'Directo',
    image: '/assets/hero_airplane.png'
  },
  {
    id: 3,
    origin: 'Lima',
    destination: 'Miami',
    discount: '-40% OFF',
    originalPrice: 650,
    newPrice: 390,
    dateRange: 'Ago - Oct',
    type: '1 Escala',
    image: '/assets/hero_new_york.png'
  }
];

const Offers = () => {
  const [timeLeft, setTimeLeft] = useState('02:45:30');

  useEffect(() => {
    // Simple timer simulation
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const [h, m, s] = prev.split(':').map(Number);
        let totalSeconds = h * 3600 + m * 60 + s - 1;
        if (totalSeconds < 0) return '00:00:00';
        const newH = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const newM = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const newS = (totalSeconds % 60).toString().padStart(2, '0');
        return `${newH}:${newM}:${newS}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-title font-bold text-secondary mb-4">Ofertas del Momento</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="mt-4 text-gray-500 font-semibold">Ofertas que no puedes perder</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Badge Superior */}
                <div className="flex justify-between items-center p-4 bg-gray-50">
                  <span className="flex items-center gap-2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
                    OFERTA LIMITADA
                  </span>
                  <span className="text-primary font-bold text-sm">{offer.discount}</span>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-secondary">
                      {offer.origin} <FiArrowRight className="inline mx-2 text-primary" /> {offer.destination}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">✈ {offer.type}</span>
                      <span>|</span>
                      <span className="flex items-center gap-1">📅 {offer.dateRange}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-gray-400 line-through text-lg">${offer.originalPrice}</span>
                    <span className="text-3xl font-extrabold text-primary">${offer.newPrice}</span>
                    <span className="text-xs text-gray-500 font-medium">por persona</span>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Termina en: <span className="text-primary">{timeLeft}</span>
                    </div>
                    <button className="bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-primary-dark transform hover:-translate-y-0.5 transition-all duration-200">
                      Reservar ahora →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
