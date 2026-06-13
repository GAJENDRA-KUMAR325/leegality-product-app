import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { COUNTRIES, DEFAULT_COUNTRY, findCountry } from '../i18n/locales'
import { TRANSLATIONS } from '../i18n/translations'
import { formatMoney } from '../utils/currency'

/**
 * Single source of truth for locale-driven concerns:
 *   - which country is selected
 *   - t(key, vars): translate a UI string (falls back to English, then the key)
 *   - formatPrice(usd): convert + format money for the active currency/locale
 *   - dir / locale exposed for layout
 *
 * Selection is persisted to localStorage and reflected on <html lang/dir> so
 * the whole document (including RTL for Arabic) follows the chosen country.
 */
const STORAGE_KEY = 'shopkart.country'
const LocaleContext = createContext(null)

function getInitialCountry() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return findCountry(saved)
  } catch {
    /* localStorage may be unavailable (private mode) — fall through */
  }
  return DEFAULT_COUNTRY
}

export function LocaleProvider({ children }) {
  const [country, setCountry] = useState(getInitialCountry)

  // Reflect language + direction on the document and persist the choice.
  useEffect(() => {
    document.documentElement.lang = country.lang
    document.documentElement.dir = country.dir
    try {
      localStorage.setItem(STORAGE_KEY, country.code)
    } catch {
      /* ignore persistence failures */
    }
  }, [country])

  const selectCountry = useCallback((code) => setCountry(findCountry(code)), [])

  const t = useCallback(
    (key, vars) => {
      const dict = TRANSLATIONS[country.lang] || TRANSLATIONS.en
      let str = dict[key] ?? TRANSLATIONS.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, v)
        }
      }
      return str
    },
    [country.lang]
  )

  const formatPrice = useCallback(
    (usd) => formatMoney(usd, { locale: country.locale, currency: country.currency }),
    [country.locale, country.currency]
  )

  const value = useMemo(
    () => ({
      country,
      countries: COUNTRIES,
      selectCountry,
      t,
      formatPrice,
      locale: country.locale,
      dir: country.dir,
    }),
    [country, selectCountry, t, formatPrice]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a <LocaleProvider>')
  return ctx
}
