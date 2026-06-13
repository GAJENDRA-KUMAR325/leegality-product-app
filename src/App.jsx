import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import { useLocale } from './context/LocaleContext'

/**
 * App shell + route table.
 * <FilterProvider> wraps this (in main.jsx) so filter state outlives route
 * changes — that's what keeps filters applied when returning from a detail page.
 */
export default function App() {
  const { t } = useLocale()
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        {t('a11y.skip')}
      </a>
      <Navbar />
      <main id="main-content" className="app__main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        {t('footer.text')}{' '}
        <a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">
          DummyJSON
        </a>
      </footer>
    </div>
  )
}
