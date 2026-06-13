import { useEffect, useState } from 'react'
import { useLocale } from '../context/LocaleContext'
import { translateText } from '../api/translate'

/**
 * Translates a piece of English API content into the active language.
 *
 * Returns { text, translating }. The original English is shown immediately and
 * swapped in place once the machine translation resolves, so the UI never
 * blocks. English locale is a no-op.
 */
export function useTranslated(source) {
  const { country } = useLocale()
  const lang = country.lang
  const [text, setText] = useState(source)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!source || lang === 'en') {
      setText(source)
      setTranslating(false)
      return
    }

    setText(source) // show English while we fetch
    setTranslating(true)
    translateText(source, lang)
      .then((t) => {
        if (!cancelled) setText(t)
      })
      .finally(() => {
        if (!cancelled) setTranslating(false)
      })

    return () => {
      cancelled = true
    }
  }, [source, lang])

  return { text, translating }
}
