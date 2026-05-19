const Field = ({ label, value, onChange, placeholder, min, max, step = "any", tooltip, hint }) => (
  <div className="field">
    <label>
      {label}
      {tooltip && (
        <span className="field-tooltip" data-tip={tooltip} role="tooltip" aria-label={tooltip}>
          i
        </span>
      )}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      aria-label={label}
    />
    {hint && <div className="field-hint">{hint}</div>}
  </div>
);

export default Field;