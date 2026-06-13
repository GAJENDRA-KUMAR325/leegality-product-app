import { createContext, useContext, useState, useCallback, useMemo } from 'react'

/**
 * Holds all listing-page filter state above the route tree.
 *
 * Why context (not local page state): the spec requires that previously
 * selected filters remain applied after navigating to a product and back.
 * Because this provider sits above <Routes>, it survives route changes, so the
 * listing page restores exactly where the user left it — including page number.
 */

const DEFAULT_FILTERS = {
  category: '', // category slug ('' = all)
  min: '', // price min (string from input)
  max: '', // price max
  brands: [], // selected brand names (multi-select)
  search: '', // free-text title search
}

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  /**
   * Update one or more filter fields. Any filter change resets pagination to
   * page 1 (spec: "Pagination should reset when filters change").
   */
  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }, [])

  const toggleBrand = useCallback((brand) => {
    setFilters((prev) => {
      const next = prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand]
      return { ...prev, brands: next }
    })
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }, [])

  const value = useMemo(
    () => ({ filters, page, setPage, updateFilters, toggleBrand, resetFilters }),
    [filters, page, updateFilters, toggleBrand, resetFilters]
  )

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within a <FilterProvider>')
  return ctx
}
