import { useInView } from 'react-intersection-observer';
import { FiSearch, FiLayout, FiCreditCard, FiSmile } from 'react-icons/fi';

const steps = [
  { icon: <FiSearch />, title: "Busca tu vuelo", number: "1" },
  { icon: <FiLayout />, title: "Elige tu asiento", number: "2" },
  { icon: <FiCreditCard />, title: "Paga de forma segura", number: "3" },
  { icon: <FiSmile />, title: "¡Disfruta tu viaje!", number: "4" }
];

const TravelSteps = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="py-20 bg-[#9B0C23] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-title font-bold mb-4 uppercase tracking-wider">Tu viaje comienza aquí</h2>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4">
          {/* Línea conectora Desktop */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-white/20 z-0"></div>

          {steps.map((step, index) => (
            <div 
              key={index}
              className={`relative z-10 flex flex-col items-center text-center max-w-[200px] transition-all duration-700 delay-[${index * 200}ms] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl mb-6 hover:bg-white/20 transition-all cursor-default">
                {step.icon}
              </div>
              
              <h3 className="text-lg font-bold mb-2 h-12 flex items-center">{step.title}</h3>
              
              <div className="w-8 h-8 rounded-full bg-white text-[#9B0C23] font-black flex items-center justify-center text-sm shadow-lg">
                {step.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelSteps;
