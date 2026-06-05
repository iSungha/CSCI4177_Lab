import { useState } from "react";

function ReviewDialog({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    if (!body.trim()) {
      setError("Please write your review.");
      return;
    }

    onSubmit({ rating, body: body.trim() });
    onClose();
  }

  return (
    <div className="modal-content" onClick={(event) => event.stopPropagation()}>
      <div className="modal-header">
        <h2>Write a Review</h2>
        <button type="button" onClick={onClose} aria-label="Close modal">
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="modal-label">Your rating</label>

        <div className="star-input">
          {[1, 2, 3, 4, 5].map((number) => (
            <button
              type="button"
              key={number}
              className={number <= rating ? "selected" : ""}
              onClick={() => setRating(number)}
              aria-label={`${number} star rating`}
            >
              {number <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>

        <label className="modal-label" htmlFor="review-body">
          Your review
        </label>
        <textarea
          id="review-body"
          value={body}
          placeholder="What was your experience living here? Cover maintenance, responsiveness, noise, pests, deposit handling, and anything future tenants should know."
          onChange={(event) => setBody(event.target.value)}
        />

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-review-btn">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewDialog;