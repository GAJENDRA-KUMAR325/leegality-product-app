/**
 * Renders a 0–5 star rating with half-star support, plus the numeric value.
 * Pure presentational component.
 */
export default function StarRating({ value = 0, count, showValue = true }) {
  const rounded = Math.round(value * 2) / 2 // nearest 0.5
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) stars.push('full')
    else if (rounded >= i - 0.5) stars.push('half')
    else stars.push('empty')
  }

  return (
    <span className="rating" aria-label={`Rated ${value} out of 5`}>
      <span className="rating__stars" aria-hidden="true">
        {stars.map((type, i) => (
          <Star key={i} type={type} />
        ))}
      </span>
      {showValue && <span className="rating__value">({value?.toFixed(1)})</span>}
      {count != null && <span className="rating__count">· {count}</span>}
    </span>
  )
}

function Star({ type }) {
  if (type === 'half') {
    return (
      <svg viewBox="0 0 24 24" className="star" width="15" height="15">
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor="#f5a623" />
            <stop offset="50%" stopColor="#d9d9d9" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-grad)"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="star" width="15" height="15">
      <path
        fill={type === 'full' ? '#f5a623' : '#d9d9d9'}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  )
}
