import { useEffect, useState } from "react";
import { optimizedImage } from "../api/client";

function ReviewDialog({
  onClose,
  onSubmit,
  initialReview = null,
  title = "Write a Review",
}) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [body, setBody] = useState(initialReview?.body || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialReview?.imageUrl || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(initialReview?.imageUrl || "");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile, initialReview]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    if (!body.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await onSubmit({
        rating,
        body: body.trim(),
        imageFile,
        imageUrl: initialReview?.imageUrl || null,
      });

      onClose();
    } catch (submitError) {
      setError(submitError.message || "Could not save review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-content" onClick={(event) => event.stopPropagation()}>
      <div className="modal-header">
        <h2>{title}</h2>
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

        <label className="modal-label" htmlFor="review-image">
          Optional photo
        </label>
        <input
          id="review-image"
          className="file-input"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] || null)}
        />

        {imagePreview && (
          <img
            src={
              imageFile
                ? imagePreview
                : optimizedImage(imagePreview, 500)
            }
            alt="Selected review attachment"
            className="current-image-preview"
          />
        )}

        {imageFile && <p className="selected-file">{imageFile.name}</p>}

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="submit-review-btn"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewDialog;