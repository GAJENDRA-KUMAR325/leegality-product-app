import { Link } from 'react-router-dom'

/** Top app bar — branding + a decorative search/account row (Amazon-style). */
export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="ShopKart home">
          <span className="navbar__logo" aria-hidden="true">🛒</span>
          <span className="navbar__name">
            Shop<strong>Kart</strong>
          </span>
        </Link>

        <div className="navbar__search" role="search">
          <span className="navbar__search-icon" aria-hidden="true">🔍</span>
          <span className="navbar__search-placeholder">
            Search powered by the filters on the left
          </span>
        </div>

        <nav className="navbar__actions" aria-label="Account">
          <span className="navbar__icon" title="Cart" aria-hidden="true">🛒</span>
          <span className="navbar__icon" title="Account" aria-hidden="true">👤</span>
        </nav>
      </div>
    </header>
  )
}
