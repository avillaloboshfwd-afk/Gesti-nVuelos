const AppDownload = () => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" 
              alt="App Mockup"
              className="w-full max-w-md mx-auto drop-shadow-2xl rounded-[3rem] border-[12px] border-secondary"
            />
          </div>
          
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-4xl font-title font-bold text-secondary mb-6 leading-tight">
              Lleva Horizon Air en tu bolsillo
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Gestiona tus vuelos, realiza check-in y mantente al tanto de tus reservas desde cualquier lugar del mundo.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-secondary text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:bg-black transition-all group">
                <div className="text-2xl"></div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold opacity-60">Descarga en</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </button>
              
              <button className="bg-secondary text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:bg-black transition-all group">
                <div className="text-2xl">▶</div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold opacity-60">Disponible en</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
