import ProductCard from './ProductCard'

/** Responsive grid of product cards. */
export default function ProductGrid({ products }) {
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
