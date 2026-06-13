/**
 * Pure helpers for client-side filtering, brand extraction and pagination.
 * Kept free of React so they're trivial to reason about and unit-test.
 */

export const PAGE_SIZE = 8

/** Unique, sorted list of brands present in a set of products. */
export function extractBrands(products) {
  const set = new Set()
  for (const p of products) {
    if (p.brand) set.add(p.brand)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

/**
 * Apply price range, brand selection and a search term to a product list.
 * All filters combine (logical AND).
 *
 * @param {Array} products
 * @param {{ min:string|number, max:string|number, brands:string[], search:string }} filters
 */
export function applyFilters(products, { min, max, brands, search }) {
  const minN = toNumber(min, -Infinity)
  const maxN = toNumber(max, Infinity)
  const query = search.trim().toLowerCase()
  const brandSet = new Set(brands)

  return products.filter((p) => {
    if (p.price < minN || p.price > maxN) return false
    if (brandSet.size > 0 && !brandSet.has(p.brand)) return false
    if (query && !p.title.toLowerCase().includes(query)) return false
    return true
  })
}

/** Supported sort modes (value used in the URL + <select>). */
export const SORT_OPTIONS = ['featured', 'price-asc', 'price-desc', 'rating-desc', 'title-asc']

/**
 * Return a new, sorted copy of the list. 'featured' (or unknown) preserves the
 * API order. Never mutates the input.
 */
export function sortProducts(products, sort) {
  const list = [...products]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return list.sort((a, b) => b.rating - a.rating)
    case 'title-asc':
      return list.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return list // 'featured' — original order
  }
}

/** Slice a list into the requested 1-based page. */
export function paginate(items, page, pageSize = PAGE_SIZE) {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function totalPages(count, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(count / pageSize))
}

function toNumber(value, fallback) {
  if (value === '' || value === null || value === undefined) return fallback
  const n = Number(value)
  return Number.isNaN(n) ? fallback : n
}
