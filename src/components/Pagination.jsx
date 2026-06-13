/**
 * Numbered pagination with Previous / Next.
 * Collapses long page lists with ellipses around the current page.
 */
export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  const pages = buildPageList(page, pageCount)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        ← Previous
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="pagination__gap">…</span>
        ) : (
          <button
            key={p}
            className={`pagination__btn pagination__num${p === page ? ' is-active' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
      >
        Next →
      </button>
    </nav>
  )
}

/** Produce a compact page list like [1, '…', 4, 5, 6, '…', 10]. */
function buildPageList(current, total) {
  if (total <= 7) return range(1, total)
  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const out = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
