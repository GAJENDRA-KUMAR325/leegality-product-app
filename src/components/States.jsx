import { useLocale } from '../context/LocaleContext'

/**
 * Shared loading / error / empty UI states.
 * Centralised so every screen handles these consistently — and localised.
 */

export function Loader({ label }) {
  const { t } = useLocale()
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state__text">{label || t('state.loading')}</p>
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
  const { t } = useLocale()
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon">⚠️</div>
      <p className="state__text">{message || t('state.error')}</p>
      {onRetry && (
        <button className="btn btn--primary" onClick={onRetry}>
          {t('state.retry')}
        </button>
      )}
    </div>
  )
}

export function EmptyState({ onReset }) {
  const { t } = useLocale()
  return (
    <div className="state">
      <div className="state__icon">🔍</div>
      <p className="state__text">{t('state.empty')}</p>
      {onReset && (
        <button className="btn" onClick={onReset}>
          {t('state.clear')}
        </button>
      )}
    </div>
  )
}
