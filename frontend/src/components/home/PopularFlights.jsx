import { FiClock } from 'react-icons/fi';

const flights = [
  {
    route: 'SJO → MIA',
    duration: '3h 20min',
    price: 189,
    image: '/assets/hero_new_york.png',
    iata: 'SJO - MIA'
  },
  {
    route: 'SJO → BOG',
    duration: '2h 55min',
    price: 210,
    image: '/assets/hero_airplane.png',
    iata: 'SJO - BOG'
  },
  {
    route: 'SJO → MAD',
    duration: '10h 30min',
    price: 580,
    image: '/assets/dest_madrid.png',
    iata: 'SJO - MAD'
  }
];

const PopularFlights = () => {
  return (
    <section className="py-20 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-title font-bold text-secondary mb-4">Vuelos Populares</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {flights.map((f, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={f.image} 
                  alt={f.route} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-secondary">{f.route}</h3>
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{f.iata}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                  <FiClock className="text-primary" />
                  <span>{f.duration}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-400 text-xs block">Desde</span>
                    <span className="text-2xl font-extrabold text-secondary">${f.price}</span>
                  </div>
                  <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-lg font-bold transition-all">
                    Ver vuelo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularFlights;
