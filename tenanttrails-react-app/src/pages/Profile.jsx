import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import ReviewCard from "../components/ReviewCard";
import ReviewDialog from "../components/ReviewDialog";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(user);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/api/profile");

      setProfileUser(data.user);
      setReviews(data.reviews || []);
    } catch (loadError) {
      setError(loadError.message || "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
    await loadProfile();
  }

  async function handleDeleteReview(reviewId) {
    const confirmed = window.confirm("Delete this review?");

    if (!confirmed) return;

    await apiFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    await loadProfile();
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <p className="loading-state">Loading profile...</p>
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
            <div className="avatar">
              {profileUser?.initials || profileUser?.name?.charAt(0) || "U"}
            </div>
            <span>{profileUser?.name}</span>
          </Link>
          <button type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="profile-content">
        <Link to="/dashboard" className="back-link">
          ← Back to apartments
        </Link>

        {error && <p className="api-error">{error}</p>}

        <section className="profile-header-card">
          <div className="profile-main">
            <div className="profile-avatar">
              {profileUser?.initials ||
                profileUser?.name
                  ?.split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .slice(0, 2)}
            </div>

            <div>
              <h1>{profileUser?.name}</h1>
              <p>{profileUser?.email}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div>
              <strong>{reviews.length}</strong>
              <span>Reviews</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Comments</span>
            </div>
          </div>
        </section>

        <h2>Your Reviews</h2>

        <div className="profile-review-list">
          {reviews.map((review) => (
            <section className="profile-review-item" key={review.id}>
              <div className="profile-review-top">
                <h3>{review.apartmentName || "Unknown apartment"}</h3>

                <div className="profile-review-actions">
                  <Link to={`/apartment/${review.aptId}`}>View</Link>
                  <button type="button" onClick={() => setEditingReview(review)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <ReviewCard
                {...review}
                author={profileUser?.name}
                canEdit={false}
              />
            </section>
          ))}

          {reviews.length === 0 && (
            <p className="empty-state">You have not written any reviews yet.</p>
          )}
        </div>
      </section>

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

export default Profile;