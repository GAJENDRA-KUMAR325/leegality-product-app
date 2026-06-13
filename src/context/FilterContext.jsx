import { createContext, useContext, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Filter state, stored in the URL query string (the single source of truth).
 *
 * Why the URL: it makes any filtered view shareable, bookmarkable and
 * refresh-proof, and it satisfies "previously selected filters remain applied
 * when navigating back" for free — the browser restores the query on Back.
 *
 * Query shape:  ?category=&min=&max=&brands=a,b&q=&sort=&page=
 * Updates use { replace: true } so typing/toggling filters doesn't spam the
 * history stack (Back still steps between pages/products, not keystrokes).
 */
const FilterContext = createContext(null)

function parseFilters(params) {
  return {
    category: params.get('category') || '',
    min: params.get('min') || '',
    max: params.get('max') || '',
    brands: params.get('brands') ? params.get('brands').split(',').filter(Boolean) : [],
    search: params.get('q') || '',
    sort: params.get('sort') || 'featured',
  }
}

/** Build a clean query object, omitting empty/default values for tidy URLs. */
function buildParams(filters, page) {
  const p = {}
  if (filters.category) p.category = filters.category
  if (filters.min) p.min = filters.min
  if (filters.max) p.max = filters.max
  if (filters.brands.length) p.brands = filters.brands.join(',')
  if (filters.search) p.q = filters.search
  if (filters.sort && filters.sort !== 'featured') p.sort = filters.sort
  if (page > 1) p.page = String(page)
  return p
}

export function FilterProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const page = Number(searchParams.get('page')) || 1

  const write = useCallback(
    (nextFilters, nextPage) => {
      setSearchParams(buildParams(nextFilters, nextPage), { replace: true })
    },
    [setSearchParams]
  )

  // Any filter change resets pagination to page 1 (spec requirement).
  const updateFilters = useCallback(
    (patch) => write({ ...filters, ...patch }, 1),
    [filters, write]
  )

  const toggleBrand = useCallback(
    (brand) => {
      const brands = filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand]
      write({ ...filters, brands }, 1)
    },
    [filters, write]
  )

  // Page changes keep the filters but don't reset the page.
  const setPage = useCallback((next) => write(filters, next), [filters, write])

  const resetFilters = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams])

  const value = useMemo(
    () => ({ filters, page, setPage, updateFilters, toggleBrand, resetFilters }),
    [filters, page, setPage, updateFilters, toggleBrand, resetFilters]
  )

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within a <FilterProvider>')
  return ctx
}
