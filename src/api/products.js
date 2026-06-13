/**
 * Thin API layer over the DummyJSON Products API.
 *
 * All network access lives here so the rest of the app depends on a small,
 * stable surface (and we can swap the data source or add caching in one place).
 *
 * Docs: https://dummyjson.com/docs/products
 */

const BASE_URL = 'https://dummyjson.com'

/** Wraps fetch with JSON parsing + consistent error messages. */
async function request(path) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`)
  } catch (networkError) {
    // fetch only rejects on network failure (offline, DNS, CORS, abort)
    throw new Error('Network error — please check your connection and try again.')
  }

  if (!res.ok) {
    throw new Error(`Request failed (${res.status} ${res.statusText}).`)
  }
  return res.json()
}

/**
 * Fetch every product within a scope.
 *
 * `limit=0` tells DummyJSON to return the full set, which lets us run combined
 * client-side filtering (price + brand + search) and pagination correctly.
 * The catalog is small (~194 items), so this is cheap and keeps filters honest.
 *
 * @param {string|null} category - category slug, or null for the whole catalog
 */
export async function fetchProducts(category = null) {
  const path = category
    ? `/products/category/${encodeURIComponent(category)}?limit=0`
    : `/products?limit=0`
  const data = await request(path)
  return data.products ?? []
}

/** Fetch the list of category descriptors: { slug, name, url }. */
export async function fetchCategories() {
  const data = await request('/products/categories')
  // Newer DummyJSON returns objects; older returned plain strings. Normalize.
  return data.map((c) =>
    typeof c === 'string'
      ? { slug: c, name: humanizeSlug(c) }
      : { slug: c.slug, name: c.name }
  )
}

/** Fetch a single product by id (for the detail page). */
export async function fetchProductById(id) {
  return request(`/products/${id}`)
}

/** "home-decoration" -> "Home Decoration" (fallback for legacy string categories). */
function humanizeSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
