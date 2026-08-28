function MatchBadge({ value, label = "Match" }) {
  const percentage = Math.max(0, Math.min(100, Number(value) || 0));
  const tone =
    percentage >= 70 ? "strong" : percentage >= 50 ? "medium" : "soft";

  return (
    <div className={`match-badge match-badge--${tone}`}>
      <strong>{percentage}%</strong>
      <span>{label}</span>
    </div>
  );
}

export default MatchBadge;
