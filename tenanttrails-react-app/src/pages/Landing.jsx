import { Link } from "react-router-dom";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";

function Landing() {
  return (
    <main className="landing-page">
      <header className="navbar">
        <Link to="/" className="logo">
          TenantTrails
        </Link>

        <nav className="nav-actions" aria-label="Main navigation">
          <Link to="/login" className="nav-link">
            Sign In
          </Link>
          <Link to="/signup">
            <Button variant="nav">Get Started</Button>
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="launch-badge">Launching in Halifax, Nova Scotia</div>

        <h1>
          Know what you're
          <br />
          signing before
          <br />
          you sign it.
        </h1>

        <p className="hero-subtitle">
          Read honest reviews from past tenants. See AI-
          <br />
          generated summaries. Make informed decisions about
          <br />
          where you live.
        </p>

        <div className="hero-buttons">
          <Link to="/signup">
            <Button>Create Free Account</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Sign In</Button>
          </Link>
        </div>

        <div className="features">
          <FeatureCard icon="⭐" title="Verified Reviews" iconClass="star-icon">
            Real ratings with photos and
            <br />
            videos from past tenants.
          </FeatureCard>

          <FeatureCard icon="🤖" title="AI Summaries">
            Key issues and sentiment
            <br />
            extracted from every
            <br />
            review.
          </FeatureCard>

          <FeatureCard icon="💬" title="Ask Questions" iconClass="chat-icon">
            Comment on reviews and
            <br />
            get answers from past
            <br />
            tenants.
          </FeatureCard>
        </div>
      </section>
    </main>
  );
}

export default Landing;