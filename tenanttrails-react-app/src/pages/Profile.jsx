import { Link, useNavigate } from "react-router-dom";
import { apartments } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";
import ReviewCard from "../components/ReviewCard";

function Profile() {
  const { user, logout } = useAuth();
  const { reviews, deleteReview } = useReviews();
  const navigate = useNavigate();

  const myReviews = reviews.filter((review) => review.userId === user.id);
  const myCommentsCount = 3;

  function getApartmentName(apartmentId) {
    return (
      apartments.find((apartment) => apartment.id === apartmentId)?.name ||
      "Unknown apartment"
    );
  }

  function handleLogout() {
    logout();
    navigate("/login");
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

      <section className="profile-content">
        <Link to="/dashboard" className="back-link">
          ← Back to apartments
        </Link>

        <section className="profile-header-card">
          <div className="profile-main">
            <div className="profile-avatar">
              {user?.name
                ?.split(" ")
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)}
            </div>

            <div>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div>
              <strong>{myReviews.length}</strong>
              <span>Reviews</span>
            </div>
            <div>
              <strong>{myCommentsCount}</strong>
              <span>Comments</span>
            </div>
          </div>
        </section>

        <h2>Your Reviews</h2>

        <div className="profile-review-list">
          {myReviews.map((review) => (
            <section className="profile-review-item" key={review.id}>
              <div className="profile-review-top">
                <h3>{getApartmentName(review.apartmentId)}</h3>

                <div className="profile-review-actions">
                  <Link to={`/apartment/${review.apartmentId}`}>View</Link>
                  <button type="button">
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteReview(review.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <ReviewCard {...review} />
            </section>
          ))}

          {myReviews.length === 0 && (
            <p className="empty-state">You have not written any reviews yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Profile;