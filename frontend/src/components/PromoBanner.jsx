const PromoBanner = () => {
  return (
    <div className="section-container">
      <div className="promo-banner">
        <div className="promo-text">
          <span style={{fontSize: '32px'}}>✈</span>
          ¡Reserva hoy y obtén 10% de descuento en tu primer vuelo!
        </div>
        <button className="btn btn-white">Aprovechar oferta</button>
      </div>
    </div>
  );
};

export default PromoBanner;
