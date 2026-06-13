import { useMemo, useEffect } from 'react'
import { useFilters } from '../context/FilterContext'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useDebounce } from '../hooks/useDebounce'
import {
  extractBrands,
  applyFilters,
  paginate,
  totalPages,
  PAGE_SIZE,
} from '../utils/filtering'

import Filters from '../components/Filters'
import ProductGrid from '../components/ProductGrid'
import Pagination from '../components/Pagination'
import { GridSkeleton, ErrorState, EmptyState } from '../components/States'

/**
 * Product Listing Page.
 *
 * Data flow:
 *   category (context) ──> useProducts() ──> raw scope from API
 *   raw scope + price/brand/search (context) ──> client-side filtering
 *   filtered list + page (context) ──> client-side pagination
 *
 * Network only fires on category change; everything else is in-memory, so
 * filters feel instant and the brand list always reflects the fetched scope.
 */
export default function ProductListPage() {
  const { filters, page, setPage, resetFilters } = useFilters()
  const { products, loading, error, reload } = useProducts(filters.category)
  const { categories } = useCategories()

  // Debounce only the search term so typing doesn't thrash the filter pipeline.
  const debouncedSearch = useDebounce(filters.search, 250)

  const brands = useMemo(() => extractBrands(products), [products])

  const filtered = useMemo(
    () =>
      applyFilters(products, {
        min: filters.min,
        max: filters.max,
        brands: filters.brands,
        search: debouncedSearch,
      }),
    [products, filters.min, filters.max, filters.brands, debouncedSearch]
  )

  const pageCount = totalPages(filtered.length)

  // Defensive clamp: if the result set shrinks below the current page, snap back.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount, setPage])

  const pageItems = useMemo(
    () => paginate(filtered, Math.min(page, pageCount), PAGE_SIZE),
    [filtered, page, pageCount]
  )

  const handlePageChange = (next) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="layout">
      <Filters categories={categories} brands={brands} resultCount={filtered.length} />

      <main className="content" aria-busy={loading}>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <GridSkeleton count={PAGE_SIZE} />
        ) : filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <ProductGrid products={pageItems} />
            <Pagination
              page={Math.min(page, pageCount)}
              pageCount={pageCount}
              onChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  )
}
