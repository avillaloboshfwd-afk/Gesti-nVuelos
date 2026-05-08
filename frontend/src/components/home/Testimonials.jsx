import { useState, useEffect } from 'react';

const testimonials = [
  {
    text: "Horizon Air cambió mi forma de viajar. El proceso de reserva fue increíblemente sencillo y el vuelo impecable.",
    author: "María G.",
    location: "San José, Costa Rica",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=maria"
  },
  {
    text: "Excelente servicio al cliente y puntualidad. Los asientos premium realmente marcan la diferencia en viajes largos.",
    author: "Carlos R.",
    location: "Bogotá, Colombia",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=carlos"
  },
  {
    text: "La mejor experiencia de vuelo que he tenido. Precios competitivos y una app muy fácil de usar.",
    author: "Elena M.",
    location: "Madrid, España",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Comillas decorativas gigantes */}
      <div className="absolute top-10 left-10 text-[200px] font-serif text-primary/5 leading-none select-none">“</div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <div className="flex justify-center gap-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[#F5A623] text-2xl">★</span>
          ))}
        </div>

        <div className="min-h-[150px] flex items-center justify-center">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className={`transition-all duration-700 absolute inset-x-0 mx-auto px-4 ${
                i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <p className="text-2xl italic text-gray-700 leading-relaxed font-medium">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center">
          <div className="relative mb-4">
            <img 
              src={testimonials[current].avatar} 
              alt={testimonials[current].author}
              className="w-20 h-20 rounded-full border-4 border-primary/10 shadow-lg"
            />
          </div>
          <h4 className="font-bold text-lg text-secondary">{testimonials[current].author}</h4>
          <p className="text-sm text-gray-500">{testimonials[current].location}</p>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === current ? 'bg-primary w-8' : 'bg-gray-200'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
