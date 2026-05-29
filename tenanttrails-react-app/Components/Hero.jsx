import Button from "./Button";
import FeatureCard from "./FeatureCard";

function Hero() {
  return (
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
        <Button>Create Free Account</Button>
        <Button variant="secondary">Sign In</Button>
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
  );
}

export default Hero;