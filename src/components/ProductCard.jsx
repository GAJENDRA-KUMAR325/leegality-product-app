import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { useLocale } from '../context/LocaleContext'
import { useTranslated } from '../hooks/useTranslated'
import TranslatedText from './TranslatedText'

/**
 * A single product tile. The whole card is a link to /product/:id.
 * Displays image, title, price and rating (spec requirement).
 */
export default function ProductCard({ product }) {
  const { formatPrice } = useLocale()
  const { text: title } = useTranslated(product.title)
  return (
    <Link to={`/product/${product.id}`} className="card" aria-label={title}>
      <div className="card__media">
        <img
          src={product.thumbnail}
          alt={title}
          loading="lazy"
          className="card__img"
        />
        {product.discountPercentage > 0 && (
          <span className="card__badge">-{Math.round(product.discountPercentage)}%</span>
        )}
      </div>

      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <div className="card__meta">
          <span className="card__price">{formatPrice(product.price)}</span>
          <StarRating value={product.rating} />
        </div>
        {product.brand && <TranslatedText as="span" className="card__brand" text={product.brand} />}
      </div>
    </Link>
  )
}
