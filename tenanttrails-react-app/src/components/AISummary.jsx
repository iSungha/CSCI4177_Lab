function AISummary({ summary, issues = [] }) {
  return (
    <section className="ai-summary-card">
      <p className="section-eyebrow">THE AI-GENERATED SUMMARY</p>
      <p>{summary}</p>

      <div className="detail-tags">
        {issues.map((issue) => (
          <span key={issue}>{issue}</span>
        ))}
      </div>
    </section>
  );
}

export default AISummary;