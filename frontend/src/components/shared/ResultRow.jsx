const ResultRow = ({ label, value, color, large }) => (
  <div className="result-row" role="row">
    <span className="result-label" role="cell">{label}</span>
    <span
      className={["result-value", color, large ? "lg" : ""].filter(Boolean).join(" ")}
      role="cell"
      aria-label={`${label}: ${value}`}
    >
      {value}
    </span>
  </div>
);

export default ResultRow;