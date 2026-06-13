import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { formatPrice } from '../utils/format'

/**
 * A single product tile. The whole card is a link to /product/:id.
 * Displays image, title, price and rating (spec requirement).
 */
export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="card" aria-label={product.title}>
      <div className="card__media">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="card__img"
        />
        {product.discountPercentage > 0 && (
          <span className="card__badge">-{Math.round(product.discountPercentage)}%</span>
        )}
      </div>

      <div className="card__body">
        <h3 className="card__title">{product.title}</h3>
        <div className="card__meta">
          <span className="card__price">{formatPrice(product.price)}</span>
          <StarRating value={product.rating} />
        </div>
        {product.brand && <span className="card__brand">{product.brand}</span>}
      </div>
    </Link>
  )
}
