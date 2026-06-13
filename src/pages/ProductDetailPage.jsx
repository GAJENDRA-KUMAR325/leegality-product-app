import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import { formatPrice } from '../utils/format'
import StarRating from '../components/StarRating'
import { Loader, ErrorState } from '../components/States'

/**
 * Product Detail Page (/product/:id).
 *
 * Shows image gallery, name, price, rating, brand, category, description and
 * reviews. The Back button returns to the listing; because filter state lives
 * in <FilterProvider> above the router, the previous filters/page are intact.
 */
export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    window.scrollTo({ top: 0 })

    fetchProductById(id)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        setActiveImage(0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  // Return to listing; falls back to home if there's no history to pop.
  const goBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  if (loading) return <Loader label="Loading product…" />
  if (error)
    return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
  if (!product) return null

  const images = product.images?.length ? product.images : [product.thumbnail]

  return (
    <div className="detail">
      <button className="btn detail__back" onClick={goBack}>
        ← Back to results
      </button>

      <div className="detail__grid">
        {/* Gallery */}
        <div className="detail__gallery">
          <div className="detail__image-wrap">
            <img
              src={images[activeImage]}
              alt={product.title}
              className="detail__image"
            />
          </div>
          {images.length > 1 && (
            <div className="detail__thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`detail__thumb${i === activeImage ? ' is-active' : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail__info">
          <h1 className="detail__title">{product.title}</h1>

          <div className="detail__price-row">
            <span className="detail__price">{formatPrice(product.price)}</span>
            <StarRating value={product.rating} count={`${product.reviews?.length ?? 0} reviews`} />
          </div>

          <dl className="detail__attrs">
            <div>
              <dt>Brand</dt>
              <dd>{product.brand || '—'}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd className="capitalize">{product.category}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}</dd>
            </div>
          </dl>

          <section className="detail__section">
            <h2 className="detail__heading">Description</h2>
            <p className="detail__desc">{product.description}</p>
          </section>

          {product.reviews?.length > 0 && (
            <section className="detail__section">
              <h2 className="detail__heading">Reviews</h2>
              <ul className="reviews">
                {product.reviews.map((r, i) => (
                  <li key={i} className="review">
                    <div className="review__head">
                      <span className="review__author">{r.reviewerName}</span>
                      <StarRating value={r.rating} showValue={false} />
                    </div>
                    <p className="review__body">{r.comment}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
