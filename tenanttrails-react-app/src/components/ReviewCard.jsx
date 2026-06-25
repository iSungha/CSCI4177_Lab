import { optimizedImage } from "../api/client";
import StarRating from "./StarRating";

function ReviewCard({
  rating,
  body,
  date,
  author,
  imageUrl,
  canEdit = false,
  onEdit,
  onDelete,
}) {
  const displayRating = Number(rating || 0);

  return (
    <article className="review-card">
      <div className="review-header">
        <div>
          <strong>{author}</strong>
          <span>{date}</span>
        </div>

        <StarRating rating={displayRating} />
      </div>

      {imageUrl && (
        <img
          src={optimizedImage(imageUrl, 700)}
          alt="Review attachment"
          className="review-image"
          loading="lazy"
        />
      )}

      <p className="review-card-body">{body}</p>

      {canEdit && (
        <div className="review-actions">
          <button type="button" className="edit-review-btn" onClick={onEdit}>
            Edit
          </button>

          <button type="button" className="delete-review-btn" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

export default ReviewCard;