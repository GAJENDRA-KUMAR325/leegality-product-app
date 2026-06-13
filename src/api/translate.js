/**
 * On-demand machine translation for dynamic API content (product titles,
 * descriptions, category names) that DummyJSON only serves in English.
 *
 * Uses MyMemory (free, no API key). To stay fast and within rate limits we:
 *   - never translate when the target is English (returns the source verbatim)
 *   - cache every result in memory AND localStorage (keyed by lang+text)
 *   - de-duplicate in-flight requests so identical text resolves once
 *   - fail soft: any error returns the original English text
 *
 * Production note: MyMemory is a sensible free demo backend. For scale you'd
 * swap `requestTranslation` for a keyed provider (DeepL/Google) and/or
 * pre-translate the catalogue server-side. The cache/dedupe layer stays.
 */

const ENDPOINT = 'https://api.mymemory.translated.net/get'
const STORE_KEY = 'shopkart.translations'

// Our internal lang codes -> MyMemory codes (mostly identical).
const LANG_MAP = { zh: 'zh-CN', pt: 'pt-BR' }

const memCache = new Map() // `${lang}::${text}` -> translated string
const inflight = new Map() // same key -> Promise (dedupe concurrent calls)

// Hydrate the in-memory cache from localStorage once at module load.
const persisted = loadPersisted()
for (const [k, v] of Object.entries(persisted)) memCache.set(k, v)

function keyFor(text, lang) {
  return `${lang}::${text}`
}

/**
 * Synchronous check: is this string already resolved for `lang`?
 * Lets the UI decide *before* paint whether it can show localized content
 * immediately or must show a loader. English is always "ready".
 */
export function isCached(text, lang) {
  if (!text || lang === 'en') return true
  return memCache.has(keyFor(text, lang))
}

function loadPersisted() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

function persist(key, value) {
  try {
    persisted[key] = value
    localStorage.setItem(STORE_KEY, JSON.stringify(persisted))
  } catch {
    /* quota/unavailable — memory cache still works for the session */
  }
}

async function requestTranslation(text, lang) {
  const target = LANG_MAP[lang] || lang
  const url = `${ENDPOINT}?q=${encodeURIComponent(text)}&langpair=en|${target}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`translate ${res.status}`)
  const data = await res.json()
  const out = data?.responseData?.translatedText
  // MyMemory echoes an error string in translatedText on some failures.
  if (!out || /MYMEMORY WARNING|INVALID/i.test(out)) throw new Error('bad translation')
  return out
}

/**
 * Translate a single string into `lang`. Resolves to the original text on any
 * failure or when lang is English. Safe to call frequently — heavily cached.
 */
export function translateText(text, lang) {
  if (!text || lang === 'en') return Promise.resolve(text)

  const key = keyFor(text, lang)
  if (memCache.has(key)) return Promise.resolve(memCache.get(key))
  if (inflight.has(key)) return inflight.get(key)

  const promise = requestTranslation(text, lang)
    .then((translated) => {
      memCache.set(key, translated)
      persist(key, translated)
      return translated
    })
    .catch(() => {
      // Fail soft: cache the English fallback in memory (not persisted) so we
      // treat it as "resolved" and don't retry it on every render this session.
      memCache.set(key, text)
      return text
    })
    .finally(() => inflight.delete(key))

  inflight.set(key, promise)
  return promise
}
