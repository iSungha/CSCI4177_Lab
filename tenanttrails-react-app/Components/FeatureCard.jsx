function FeatureCard({ icon, title, children, iconClass = "" }) {
  return (
    <article className="feature-card">
      <div className={`feature-icon ${iconClass}`.trim()}>{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export default FeatureCard;