import { Link } from "react-router-dom";
import { optimizedImage } from "../api/client";

function ApartmentCard({ apartment }) {
  const rating = Number(apartment.rating || 0);

  const tags =
    apartment.tags && apartment.tags.length > 0
      ? apartment.tags
      : [
          apartment.neighbourhood || "Halifax",
          apartment.landlord || "Rental property",
        ];

  return (
    <Link to={`/apartment/${apartment.id}`} className="apartment-card-link">
      <article className="apartment-card">
        <div className="apartment-image-wrap">
          <img
            src={optimizedImage(apartment.imageUrl || apartment.img, 900)}
            alt={`${apartment.name} building`}
            className="apartment-image"
            loading="lazy"
          />
          <div className="rating-badge">⭐ {rating.toFixed(1)}</div>
        </div>

        <div className="apartment-body">
          <h3>{apartment.name}</h3>

          <p className="apartment-address">
            <span>📍</span>
            {apartment.address} · {apartment.neighbourhood}
          </p>

          <div className="tag-row">
            {tags.slice(0, 3).map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="card-footer">
            <span>{apartment.reviews || 0} reviews</span>
            <span className="stars">★★★★★</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ApartmentCard;