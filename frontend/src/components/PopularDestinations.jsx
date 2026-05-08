const destinations = [
  { name: "Madrid", price: "850", image: "/assets/dest_madrid.png" },
  { name: "Cancún", price: "450", image: "/assets/dest_cancun.png" },
  { name: "Tokio", price: "1200", image: "/assets/dest_tokyo.png" },
  { name: "Nueva York", price: "600", image: "/assets/hero_new_york.png" }
];

const PopularDestinations = () => {
  return (
    <section className="section-container">
      <div className="section-header">
        <h2 className="section-title">Destinos Populares</h2>
        <p style={{color: 'var(--color-gray-text)'}}>Encuentra las mejores ofertas para tus lugares favoritos.</p>
      </div>
      <div className="destinations-grid">
        {destinations.map((dest, i) => (
          <div key={i} className="dest-card fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
            <img src={dest.image} alt={dest.name} className="dest-img" />
            <div className="dest-overlay">
              <h3 className="dest-name">{dest.name}</h3>
              <p className="dest-price">Desde <span>${dest.price}</span></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;
