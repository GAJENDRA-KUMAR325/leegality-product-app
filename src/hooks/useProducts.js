import { useEffect, useState, useCallback } from 'react'
import { fetchProducts } from '../api/products'

/**
 * Loads the product scope for the current category.
 *
 * Only `category` triggers a network request — price/brand/search filtering and
 * pagination run client-side over the returned set (see useFilteredProducts),
 * so changing those does not re-hit the API.
 *
 * Returns { products, loading, error, reload } with a stable reload() for retry.
 */
export function useProducts(category) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // bump this to force a refetch (used by the "Try again" button)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProducts(category || null)
      .then((data) => {
        if (cancelled) return
        setProducts(data)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Something went wrong while loading products.')
        setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // Ignore the result of a stale request if category changes mid-flight.
    return () => {
      cancelled = true
    }
  }, [category, reloadKey])

  return { products, loading, error, reload }
}
