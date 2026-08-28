function StatusCard({
  type = "loading",
  title,
  description,
  action,
  compact = false,
}) {
  return (
    <div
      className={`status-card status-card--${type} ${compact ? "is-compact" : ""}`}
    >
      <div className="status-card__badge">
        {type === "loading" ? "..." : type === "error" ? "!" : "0"}
      </div>
      <div>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
        {action}
      </div>
    </div>
  );
}

export default StatusCard;
