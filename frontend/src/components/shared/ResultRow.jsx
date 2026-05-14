const ResultRow = ({ label, value, color, large }) => (
  <div className="result-row">
    <span className="result-label">{label}</span>
    <span className={`result-value${color ? ` ${color}` : ""}${large ? " lg" : ""}`}>
      {value}
    </span>
  </div>
);

export default ResultRow;
