import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import ApartmentCard from "../components/ApartmentCard";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [apartments, setApartments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("All Neighbourhoods");
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadApartments() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/apartments");

        if (!ignore) {
          setApartments(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Could not load apartments.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadApartments();

    return () => {
      ignore = true;
    };
  }, []);

  const neighbourhoods = useMemo(() => {
    return [
      "All Neighbourhoods",
      ...new Set(apartments.map((apartment) => apartment.neighbourhood)),
    ];
  }, [apartments]);

  const filteredApartments = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    let result = apartments.filter((apartment) => {
      const matchesSearch =
        apartment.name.toLowerCase().includes(normalizedSearch) ||
        apartment.address.toLowerCase().includes(normalizedSearch) ||
        apartment.neighbourhood.toLowerCase().includes(normalizedSearch);

      const matchesNeighbourhood =
        neighbourhood === "All Neighbourhoods" ||
        apartment.neighbourhood === neighbourhood;

      return matchesSearch && matchesNeighbourhood;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "Highest Rated") {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }

      if (sortBy === "Most Reviews") {
        return Number(b.reviews || 0) - Number(a.reviews || 0);
      }

      if (sortBy === "Name A-Z") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

    return result;
  }, [apartments, searchText, neighbourhood, sortBy]);

  const totalReviews = apartments.reduce(
    (total, apartment) => total + Number(apartment.reviews || 0),
    0
  );

  async function handleLogout() {
    await logout();
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
            value={searchText}
            placeholder="Search apartments by address or neighbourhood..."
            onChange={(event) => setSearchText(event.target.value)}
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

      <section className="dashboard-content">
        {location.state?.message && (
          <p className="welcome-message">{location.state.message}</p>
        )}

        <h1>Apartments in Halifax</h1>
        <p className="dashboard-subtitle">
          Honest reviews from real tenants. Read before you rent.
        </p>

        <div className="stats-row">
          <span>{apartments.length} apartments</span>
          <span>{totalReviews} reviews</span>
          <span>{Math.max(neighbourhoods.length - 1, 0)} neighbourhoods</span>
        </div>

        <div className="filters-row">
          <select
            value={neighbourhood}
            onChange={(event) => setNeighbourhood(event.target.value)}
          >
            {neighbourhoods.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option>Highest Rated</option>
            <option>Most Reviews</option>
            <option>Name A-Z</option>
          </select>
        </div>

        {loading && <p className="loading-state">Loading apartments...</p>}

        {error && <p className="api-error">{error}</p>}

        {!loading && !error && (
          <div className="apartment-grid">
            {filteredApartments.map((apartment) => (
              <ApartmentCard apartment={apartment} key={apartment.id} />
            ))}
          </div>
        )}

        {!loading && !error && filteredApartments.length === 0 && (
          <p className="empty-state">No apartments matched your search.</p>
        )}
      </section>
    </main>
  );
}

export default Dashboard;