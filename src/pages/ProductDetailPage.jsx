import { useEffect, useState, useReducer, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import { useLocale } from '../context/LocaleContext'
import { useTranslated } from '../hooks/useTranslated'
import { translateText, isCached } from '../api/translate'
import StarRating from '../components/StarRating'
import TranslatedText from '../components/TranslatedText'
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
  const { t, formatPrice, country } = useLocale()

  const headingRef = useRef(null)
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

  // Translate the English API content into the active language (no-op for en).
  // Called unconditionally (before early returns) to keep hook order stable.
  const { text: title } = useTranslated(product?.title)
  const { text: description, translating: descTranslating } = useTranslated(product?.description)
  const { text: category } = useTranslated(product?.category)
  const { text: brand } = useTranslated(product?.brand)

  // Pre-translate all detail content and hold a loader until it's ready, so the
  // page reveals fully localized (no English-first flash on language switch).
  const [, rerender] = useReducer((x) => x + 1, 0)
  const detailStrings = product
    ? [
        product.title,
        product.description,
        product.category,
        product.brand,
        ...(product.reviews?.map((r) => r.comment) ?? []),
      ].filter(Boolean)
    : []
  const localized =
    !product ||
    country.lang === 'en' ||
    detailStrings.every((s) => isCached(s, country.lang))

  useEffect(() => {
    if (localized) return
    let cancelled = false
    Promise.all(detailStrings.map((s) => translateText(s, country.lang))).then(() => {
      if (!cancelled) rerender()
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localized, product, country.lang])

  // Move focus to the product heading once it's shown, so keyboard/screen-reader
  // users aren't left at the top of the document after navigating in.
  useEffect(() => {
    if (product && localized) headingRef.current?.focus()
  }, [product, localized, id])

  // Return to listing; falls back to home if there's no history to pop.
  const goBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  if (loading) return <Loader label={t('state.loadingProduct')} />
  if (error)
    return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
  if (!product) return null
  if (!localized) return <Loader label={t('state.loadingProduct')} />

  const images = product.images?.length ? product.images : [product.thumbnail]

  return (
    <div className="detail">
      <button className="btn detail__back" onClick={goBack}>
        ← {t('detail.back')}
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
          <h1 className="detail__title" ref={headingRef} tabIndex={-1}>
            {title}
          </h1>

          <div className="detail__price-row">
            <span className="detail__price">{formatPrice(product.price)}</span>
            <StarRating
              value={product.rating}
              count={t('detail.reviewCount', { n: product.reviews?.length ?? 0 })}
            />
          </div>

          <dl className="detail__attrs">
            <div>
              <dt>{t('detail.brand')}</dt>
              <dd>{brand || '—'}</dd>
            </div>
            <div>
              <dt>{t('detail.category')}</dt>
              <dd className="capitalize">{category}</dd>
            </div>
            <div>
              <dt>{t('detail.availability')}</dt>
              <dd>{product.stock > 0 ? t('detail.inStock') : t('detail.outOfStock')}</dd>
            </div>
          </dl>

          <section className="detail__section">
            <h2 className="detail__heading">{t('detail.description')}</h2>
            <p className="detail__desc" data-translating={descTranslating || undefined}>
              {description}
            </p>
          </section>

          {product.reviews?.length > 0 && (
            <section className="detail__section">
              <h2 className="detail__heading">{t('detail.reviews')}</h2>
              <ul className="reviews">
                {product.reviews.map((r, i) => (
                  <li key={i} className="review">
                    <div className="review__head">
                      {/* Reviewer names are people's names — left untranslated. */}
                      <span className="review__author">{r.reviewerName}</span>
                      <StarRating value={r.rating} showValue={false} />
                    </div>
                    <TranslatedText as="p" className="review__body" text={r.comment} />
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
