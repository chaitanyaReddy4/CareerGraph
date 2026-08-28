function ProgressBar({ value }) {
  const width = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="progress-bar" aria-hidden="true">
      <div className="progress-bar__fill" style={{ width: `${width}%` }} />
    </div>
  );
}

export default ProgressBar;
