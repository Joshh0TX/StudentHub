// Interactive star rating (for forms) or display-only
export function StarRatingInput({ value, onChange }) {
  return (
    <div className="starRatingInput" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`starBtn${value >= star ? " starFilled" : ""}`}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
      <span className="starLabel">{value}/5</span>
    </div>
  );
}

export function StarRatingDisplay({ value, size = "sm" }) {
  const rounded = Math.round(value || 0);
  return (
    <span className={`starDisplay starDisplay--${size}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rounded ? "starFilled" : "starEmpty"}>★</span>
      ))}
    </span>
  );
}
