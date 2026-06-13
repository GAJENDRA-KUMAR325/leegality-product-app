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
      <Navbar />
      <div className="app__main">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <footer className="footer">
        {t('footer.text')}{' '}
        <a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">
          DummyJSON
        </a>
      </footer>
    </div>
  )
}
