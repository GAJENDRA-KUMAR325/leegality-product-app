import { useEffect, useState } from 'react'
import { useFilters } from '../context/FilterContext'

/**
 * Left-hand filter rail: search, category (single-select), price range and
 * brand (multi-select).
 *
 * - Category, brand and search apply immediately (spec requirement).
 * - Price uses an explicit "Apply" so we don't filter on half-typed numbers;
 *   it also applies on Enter. Local input state is synced from context so a
 *   "Clear all" reset reflects here too.
 */
export default function Filters({ categories, brands, resultCount }) {
  const { filters, updateFilters, toggleBrand, resetFilters } = useFilters()

  // Local, uncommitted price inputs (committed via Apply / Enter).
  const [minInput, setMinInput] = useState(filters.min)
  const [maxInput, setMaxInput] = useState(filters.max)

  // Keep local price inputs in sync when filters are reset externally.
  useEffect(() => {
    setMinInput(filters.min)
    setMaxInput(filters.max)
  }, [filters.min, filters.max])

  const applyPrice = () => updateFilters({ min: minInput, max: maxInput })

  const hasActiveFilters =
    filters.category || filters.min || filters.max || filters.brands.length || filters.search

  return (
    <aside className="filters" aria-label="Product filters">
      <div className="filters__header">
        <h2 className="filters__title">🔍 Filters</h2>
        {hasActiveFilters ? (
          <button className="filters__clear" onClick={resetFilters}>
            Clear all
          </button>
        ) : null}
      </div>

      <p className="filters__count">{resultCount} result{resultCount === 1 ? '' : 's'}</p>

      {/* Search */}
      <div className="filters__group">
        <input
          type="search"
          className="input"
          placeholder="Search products…"
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          aria-label="Search products by name"
        />
      </div>

      {/* Category */}
      <div className="filters__group">
        <h3 className="filters__label">Categories</h3>
        <div className="filters__options filters__options--scroll">
          <label className="option">
            <input
              type="radio"
              name="category"
              checked={filters.category === ''}
              onChange={() => updateFilters({ category: '' })}
            />
            <span>All categories</span>
          </label>
          {categories.map((c) => (
            <label className="option" key={c.slug}>
              <input
                type="radio"
                name="category"
                checked={filters.category === c.slug}
                onChange={() => updateFilters({ category: c.slug })}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="filters__group">
        <h3 className="filters__label">Price Range</h3>
        <div className="filters__price">
          <input
            type="number"
            min="0"
            className="input input--sm"
            placeholder="Min"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
            aria-label="Minimum price"
          />
          <span className="filters__dash">–</span>
          <input
            type="number"
            min="0"
            className="input input--sm"
            placeholder="Max"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
            aria-label="Maximum price"
          />
        </div>
        <button className="btn btn--primary btn--block" onClick={applyPrice}>
          Apply
        </button>
      </div>

      {/* Brand */}
      <div className="filters__group">
        <h3 className="filters__label">Brands</h3>
        {brands.length === 0 ? (
          <p className="filters__hint">No brand data for this selection.</p>
        ) : (
          <div className="filters__options filters__options--scroll">
            {brands.map((b) => (
              <label className="option" key={b}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
