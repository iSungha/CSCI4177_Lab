import StarRating from "./StarRating";

function ApartmentHeader({ apartment }) {
  const rating = Number(apartment.rating || 0);
  const reviewCount = apartment.reviews || apartment.reviewCount || 0;

  return (
    <section className="apartment-detail-header">
      <div>
        <h1>{apartment.name}</h1>
        <p className="detail-address">
          📍 {apartment.address} · {apartment.neighbourhood}
        </p>
        <p className="detail-description">
          Reviews and property details are loaded from the TenantTrails API.
        </p>
      </div>

      <div className="detail-rating">
        <strong>{rating.toFixed(1)}</strong>
        <StarRating rating={rating} />
        <span>{reviewCount} reviews</span>
      </div>
    </section>
  );
}

export default ApartmentHeader;