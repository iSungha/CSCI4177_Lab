function ApartmentCard({ apartment }) {
  return (
    <article className="apartment-card">
      <div className="apartment-image-wrap">
        <img
          src={apartment.imageUrl}
          alt={`${apartment.name} building`}
          className="apartment-image"
        />
        <div className="rating-badge">⭐ {apartment.rating.toFixed(1)}</div>
      </div>

      <div className="apartment-body">
        <h3>{apartment.name}</h3>

        <p className="apartment-address">
          <span>📍</span>
          {apartment.address} · {apartment.neighbourhood}
        </p>

        <div className="tag-row">
          {apartment.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="card-footer">
          <span>{apartment.reviews} reviews</span>
          <span className="stars">★★★★★</span>
        </div>
      </div>
    </article>
  );
}

export default ApartmentCard;