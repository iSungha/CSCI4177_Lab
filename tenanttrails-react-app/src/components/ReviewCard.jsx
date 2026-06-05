import StarRating from "./StarRating";

function ReviewCard({ rating, body, date, author, onDelete, showDelete = false }) {
  return (
    <article className="review-card">
      <div className="review-header">
        <div>
          <strong>{author}</strong>
          <span>{date}</span>
        </div>

        <StarRating rating={rating} />
      </div>

      <p>{body}</p>

      {showDelete && (
        <button type="button" className="delete-review-btn" onClick={onDelete}>
          Delete
        </button>
      )}
    </article>
  );
}

export default ReviewCard;