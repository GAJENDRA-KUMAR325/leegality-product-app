/**
 * Shared loading / error / empty UI states.
 * Centralised so every screen handles these consistently.
 */

export function Loader({ label = 'Loading products…' }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state__text">{label}</p>
    </div>
  )
}

/** Card-grid skeleton shown while the first page of products loads. */
export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card card--skeleton" aria-hidden="true">
          <div className="skeleton skeleton--media" />
          <div className="card__body">
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line short" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon">⚠️</div>
      <p className="state__text">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className="btn btn--primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ onReset }) {
  return (
    <div className="state">
      <div className="state__icon">🔍</div>
      <p className="state__text">No products match your filters.</p>
      {onReset && (
        <button className="btn" onClick={onReset}>
          Clear all filters
        </button>
      )}
    </div>
  )
}
