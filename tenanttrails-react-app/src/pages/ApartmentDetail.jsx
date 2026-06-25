import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import ApartmentHeader from "../components/ApartmentHeader";
import AISummary from "../components/AISummary";
import ReviewCard from "../components/ReviewCard";
import ReviewDialog from "../components/ReviewDialog";

function ApartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApartment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [apartmentData, reviewData] = await Promise.all([
        apiFetch(`/api/apartments/${id}`),
        apiFetch(`/api/apartments/${id}/reviews`),
      ]);

      setApartment(apartmentData);
      setReviews(reviewData);
    } catch (loadError) {
      setError(loadError.message || "Could not load apartment.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApartment();
  }, [loadApartment]);

  const summary = useMemo(() => {
    if (!apartment) return "";

    if (reviews.length === 0) {
      return "No tenant reviews have been submitted for this apartment yet. Be the first to add one.";
    }

    return `TenantTrails has ${reviews.length} review${
      reviews.length === 1 ? "" : "s"
    } for this apartment. Reviews are stored in the database and loaded through the API.`;
  }, [apartment, reviews]);

  const issues = useMemo(() => {
    if (!apartment) return [];

    return [
      apartment.neighbourhood || "Halifax",
      apartment.landlord || "Landlord listed",
      `${reviews.length} review${reviews.length === 1 ? "" : "s"}`,
    ];
  }, [apartment, reviews]);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  async function uploadReviewImage(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const data = await apiFetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    return data.url;
  }

  async function handleSubmitReview(reviewData) {
    let imageUrl = reviewData.imageUrl || null;

    if (reviewData.imageFile) {
      imageUrl = await uploadReviewImage(reviewData.imageFile);
    }

    await apiFetch(`/api/apartments/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify({
        rating: reviewData.rating,
        body: reviewData.body,
        imageUrl,
      }),
    });

    await loadApartment();
  }

  async function handleEditReview(reviewData) {
    let imageUrl = reviewData.imageUrl || null;

    if (reviewData.imageFile) {
      imageUrl = await uploadReviewImage(reviewData.imageFile);
    }

    await apiFetch(`/api/reviews/${editingReview.id}`, {
      method: "PUT",
      body: JSON.stringify({
        rating: reviewData.rating,
        body: reviewData.body,
        imageUrl,
      }),
    });

    setEditingReview(null);
    await loadApartment();
  }

  async function handleDeleteReview(reviewId) {
    const confirmed = window.confirm("Delete this review?");

    if (!confirmed) return;

    await apiFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    await loadApartment();
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <p className="loading-state">Loading apartment...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <section className="detail-content">
          <p className="api-error">{error}</p>
          <Link to="/dashboard">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  if (!apartment) {
    return (
      <main className="dashboard-page">
        <section className="detail-content">
          <p>Apartment not found.</p>
          <Link to="/dashboard">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-nav">
        <Link to="/dashboard" className="dashboard-logo">
          TenantTrails
        </Link>

        <label className="search-bar">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search apartments by address or neighbourhood..."
            readOnly
          />
        </label>

        <div className="dashboard-user">
          <Link to="/profile" className="avatar-link">
            <div className="avatar">{user?.initials || user?.name?.charAt(0) || "U"}</div>
            <span>{user?.name}</span>
          </Link>
          <button type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="detail-content">
        <Link to="/dashboard" className="back-link">
          ← Back to all apartments
        </Link>

        <ApartmentHeader
          apartment={{
            ...apartment,
            reviews: reviews.length,
          }}
        />

        <div className="detail-grid">
          <div>
            <AISummary summary={summary} issues={issues} />

            <section className="reviews-section">
              <div className="reviews-title-row">
                <h2>Reviews ({reviews.length})</h2>
                <button
                  type="button"
                  className="small-outline-btn"
                  onClick={() => setShowReviewDialog(true)}
                >
                  + Write a Review
                </button>
              </div>

              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  canEdit={Number(review.userId) === Number(user.id)}
                  onEdit={() => setEditingReview(review)}
                  onDelete={() => handleDeleteReview(review.id)}
                />
              ))}

              {reviews.length === 0 && (
                <p className="empty-state">No reviews yet. Be the first.</p>
              )}
            </section>
          </div>

          <aside className="property-sidebar">
            <section className="property-card">
              <h3>Property Info</h3>
              <dl>
                <div>
                  <dt>Landlord</dt>
                  <dd>{apartment.landlord}</dd>
                </div>
                <div>
                  <dt>Units</dt>
                  <dd>{apartment.units}</dd>
                </div>
                <div>
                  <dt>Year built</dt>
                  <dd>{apartment.yearBuilt || apartment.built}</dd>
                </div>
                <div>
                  <dt>Neighbourhood</dt>
                  <dd>{apartment.neighbourhood}</dd>
                </div>
              </dl>
            </section>

            <section className="property-card">
              <h3>Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(
                  (review) => Math.round(Number(review.rating)) === star
                ).length;

                const width =
                  reviews.length === 0 ? 0 : Math.round((count / reviews.length) * 100);

                return (
                  <div className="rating-row" key={star}>
                    <span>{star}★</span>
                    <div className="rating-line">
                      <div style={{ width: `${width}%` }} />
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </section>

            <button
              type="button"
              className="wide-review-btn"
              onClick={() => setShowReviewDialog(true)}
            >
              Write a Review
            </button>
          </aside>
        </div>
      </section>

      {showReviewDialog && (
        <div
          className="modal-overlay"
          onClick={() => setShowReviewDialog(false)}
        >
          <ReviewDialog
            onClose={() => setShowReviewDialog(false)}
            onSubmit={handleSubmitReview}
          />
        </div>
      )}

      {editingReview && (
        <div className="modal-overlay" onClick={() => setEditingReview(null)}>
          <ReviewDialog
            title="Edit Review"
            initialReview={editingReview}
            onClose={() => setEditingReview(null)}
            onSubmit={handleEditReview}
          />
        </div>
      )}
    </main>
  );
}

export default ApartmentDetail;