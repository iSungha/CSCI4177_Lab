import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApartmentCard from "../components/ApartmentCard";
import { apartments } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("All Neighbourhoods");
  const [sortBy, setSortBy] = useState("Highest Rated");

  const neighbourhoods = useMemo(() => {
    return [
      "All Neighbourhoods",
      ...new Set(apartments.map((apartment) => apartment.neighbourhood)),
    ];
  }, []);

  const filteredApartments = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    let result = apartments.filter((apartment) => {
      const matchesSearch = apartment.name.toLowerCase().includes(normalizedSearch) || apartment.address.toLowerCase().includes(normalizedSearch) ||apartment.neighbourhood.toLowerCase().includes(normalizedSearch);
      const matchesNeighbourhood =neighbourhood === "All Neighbourhoods" || apartment.neighbourhood === neighbourhood;
      return matchesSearch && matchesNeighbourhood;
    });
    result = [...result].sort((a, b) => {
      if (sortBy === "Highest Rated") {
        return b.rating - a.rating;
      }
      if (sortBy === "Most Reviews") {
        return b.reviews - a.reviews;
      }
      if (sortBy === "Name A-Z") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    return result;
  }, [searchText, neighbourhood, sortBy]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-nav">
        <div className="dashboard-logo">TenantTrails</div>

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
          <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
          <span>{user?.name}</span>
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
          <span>
            {apartments.reduce((total, apartment) => total + apartment.reviews, 0)}{" "}
            reviews
          </span>
          <span>{neighbourhoods.length - 1} neighbourhoods</span>
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

        <div className="apartment-grid">
          {filteredApartments.map((apartment) => (
            <ApartmentCard apartment={apartment} key={apartment.id} />
          ))}
        </div>

        {filteredApartments.length === 0 && (
          <p className="empty-state">No apartments matched your search.</p>
        )}
      </section>
    </main>
  );
}

export default Dashboard;