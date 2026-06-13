import { useState, useRef, useEffect } from 'react'
import { useLocale } from '../context/LocaleContext'

/**
 * Country / language / currency picker shown in the navbar.
 * Selecting a country switches UI language, currency and text direction.
 */
export default function LocaleSwitcher() {
  const { country, countries, selectCountry } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="locale" ref={ref}>
      <button
        className="locale__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={country.name}
      >
        <span className="locale__flag" aria-hidden="true">{country.flag}</span>
        <span className="locale__code">{country.code}</span>
        <span className="locale__currency">{country.currency}</span>
        <span className="locale__caret" aria-hidden="true">▾</span>
      </button>

      {open && (
        <ul className="locale__menu" role="listbox">
          {countries.map((c) => (
            <li key={c.code}>
              <button
                className={`locale__item${c.code === country.code ? ' is-active' : ''}`}
                role="option"
                aria-selected={c.code === country.code}
                onClick={() => {
                  selectCountry(c.code)
                  setOpen(false)
                }}
              >
                <span className="locale__flag" aria-hidden="true">{c.flag}</span>
                <span className="locale__name">{c.name}</span>
                <span className="locale__currency">{c.currency}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
