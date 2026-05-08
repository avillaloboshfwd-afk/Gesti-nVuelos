const Newsletter = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-16">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            ✉️
          </div>
        </div>
        
        <h2 className="text-3xl font-title font-bold mb-4">
          Suscríbete y recibe ofertas exclusivas
        </h2>
        <p className="text-white/80 mb-10">
          Únete a nuestra comunidad y sé el primero en enterarte de promociones, nuevos destinos y beneficios premium.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Tu correo electrónico..." 
            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:bg-white focus:text-secondary transition-all"
          />
          <button className="bg-white text-primary font-bold px-10 py-4 rounded-full hover:bg-gray-100 transform active:scale-95 transition-all">
            Suscribirme
          </button>
        </form>

        <p className="text-xs text-white/60 flex items-center justify-center gap-2">
          <span>🔒 Sin spam. Puedes darte de baja cuando quieras.</span>
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
