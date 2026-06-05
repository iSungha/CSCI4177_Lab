import StarRating from "./StarRating";

function ApartmentHeader({ apartment }) {
  return (
    <section className="apartment-detail-header">
      <div>
        <h1>{apartment.name}</h1>
        <p className="detail-address">
          📍 {apartment.address} · {apartment.neighbourhood}
        </p>
        <p className="detail-description">
          High-rise tower in a quiet residential neighbourhood.
        </p>
      </div>

      <div className="detail-rating">
        <strong>{apartment.rating.toFixed(1)}</strong>
        <StarRating rating={apartment.rating} />
        <span>{apartment.reviews} reviews</span>
      </div>
    </section>
  );
}

export default ApartmentHeader;