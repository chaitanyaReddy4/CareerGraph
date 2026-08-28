function StatCard({ label, value, description, tone = "default" }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon">{label.slice(0, 2).toUpperCase()}</div>
      <div>
        <p className="stat-card__label">{label}</p>
        <strong className="stat-card__value">{value}</strong>
        <p className="stat-card__description">{description}</p>
      </div>
    </div>
  );
}

export default StatCard;
