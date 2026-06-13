import { useEffect, useState } from 'react'
import { fetchCategories } from '../api/products'

/** Loads the category list once on mount. Categories rarely change. */
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchCategories()
      .then((data) => !cancelled && setCategories(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  return { categories, error }
}
