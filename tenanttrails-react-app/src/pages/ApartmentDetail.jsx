import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { apartments } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";
import ApartmentHeader from "../components/ApartmentHeader";
import AISummary from "../components/AISummary";
import ReviewCard from "../components/ReviewCard";
import ReviewDialog from "../components/ReviewDialog";

function ApartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { reviews, addReview } = useReviews();
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const apartment = apartments.find((item) => item.id === Number(id));

  if (!apartment) {
    return (
      <main className="dashboard-page">
        <p>Apartment not found.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </main>
    );
  }

  const apartmentReviews = reviews.filter(
    (review) => review.apartmentId === apartment.id
  );

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleSubmitReview(reviewData) {
    addReview({
      ...reviewData,
      apartmentId: apartment.id,
      userId: user.id,
      author: user.name,
    });
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
            <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
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

        <ApartmentHeader apartment={apartment} />

        <div className="detail-grid">
          <div>
            <AISummary
              summary={apartment.aiSummary}
              issues={apartment.aiIssues}
            />

            <section className="reviews-section">
              <div className="reviews-title-row">
                <h2>Reviews ({apartmentReviews.length})</h2>
                <button
                  type="button"
                  className="small-outline-btn"
                  onClick={() => setShowReviewDialog(true)}
                >
                  + Write a Review
                </button>
              </div>

              {apartmentReviews.map((review) => (
                <ReviewCard key={review.id} {...review} />
              ))}

              {apartmentReviews.length === 0 && (
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
                  <dd>{apartment.yearBuilt}</dd>
                </div>
                <div>
                  <dt>Neighbourhood</dt>
                  <dd>{apartment.neighbourhood}</dd>
                </div>
              </dl>
            </section>

            <section className="property-card">
              <h3>Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((star) => (
                <div className="rating-row" key={star}>
                  <span>{star}★</span>
                  <div className="rating-line">
                    <div
                      style={{
                        width:
                          star === Math.round(apartment.rating) ? "72%" : "8%",
                      }}
                    />
                  </div>
                  <span>{star === Math.round(apartment.rating) ? 1 : 0}</span>
                </div>
              ))}
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
    </main>
  );
}

export default ApartmentDetail;