import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useFilters } from '../context/FilterContext'
import { useLocale } from '../context/LocaleContext'
import LocaleSwitcher from './LocaleSwitcher'

/**
 * Top app bar — branding + a real, working product search.
 *
 * The search input is bound to the shared filter state (FilterContext), so it
 * stays in sync with the search box in the filter rail. Typing from a detail
 * page jumps back to the listing so results are visible.
 */
export default function Navbar() {
  const { filters, updateFilters } = useFilters()
  const { t } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (value) => {
    updateFilters({ search: value })
    // If we're not on the listing page, surface the results.
    if (location.pathname !== '/') navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="ShopKart home">
          <span className="navbar__logo" aria-hidden="true">🛒</span>
          <span className="navbar__name">
            Shop<strong>Kart</strong>
          </span>
        </Link>

        <form
          className="navbar__search"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <span className="navbar__search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="navbar__search-input"
            placeholder={t('nav.search')}
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label={t('nav.search')}
          />
        </form>

        <nav className="navbar__actions" aria-label={t('nav.account')}>
          <LocaleSwitcher />
          <span className="navbar__icon" title={t('nav.cart')} aria-hidden="true">🛒</span>
          <span className="navbar__icon" title={t('nav.account')} aria-hidden="true">👤</span>
        </nav>
      </div>
    </header>
  )
}
