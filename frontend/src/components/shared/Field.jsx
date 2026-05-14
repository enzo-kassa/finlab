const Field = ({ label, value, onChange, placeholder, min, max, step = "any" }) => (
  <div className="field">
    <label>{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
    />
  </div>
);

export default Field;
