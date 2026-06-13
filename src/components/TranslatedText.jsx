import { useTranslated } from '../hooks/useTranslated'

/**
 * Inline translated text. Lets us translate dynamic API strings inside `.map()`
 * loops (where each item needs its own hook) without bloating parent components.
 *
 * Renders the original English instantly, then swaps to the translation.
 */
export default function TranslatedText({ text, as: Tag = 'span', className }) {
  const { text: translated, translating } = useTranslated(text)
  return (
    <Tag className={className} data-translating={translating || undefined}>
      {translated}
    </Tag>
  )
}
