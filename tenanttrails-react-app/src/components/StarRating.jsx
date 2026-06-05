function StarRating({ rating, max = 5, className = "" }) {
  const fullStars = Math.round(rating);

  return (
    <span className={`stars ${className}`.trim()} aria-label={`${rating} stars`}>
      {Array.from({ length: max }, (_, index) => (
        <span
          key={index}
          className={index < fullStars ? "star-filled" : "star-empty"}
        >
          {index < fullStars ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

export default StarRating;