/**
 * Supported countries.
 *
 * Each entry maps a country to its display language, BCP-47 locale (used by
 * Intl for number/currency formatting), ISO-4217 currency and text direction.
 *
 * Adding a country = add one row here + (if it's a new language) one block in
 * translations.js. Nothing else needs to change.
 */
export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', lang: 'en', locale: 'en-US', currency: 'USD', dir: 'ltr' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lang: 'en', locale: 'en-GB', currency: 'GBP', dir: 'ltr' },
  { code: 'IN', name: 'India', flag: '🇮🇳', lang: 'hi', locale: 'hi-IN', currency: 'INR', dir: 'ltr' },
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪', lang: 'de', locale: 'de-DE', currency: 'EUR', dir: 'ltr' },
  { code: 'FR', name: 'France', flag: '🇫🇷', lang: 'fr', locale: 'fr-FR', currency: 'EUR', dir: 'ltr' },
  { code: 'ES', name: 'España', flag: '🇪🇸', lang: 'es', locale: 'es-ES', currency: 'EUR', dir: 'ltr' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', lang: 'pt', locale: 'pt-BR', currency: 'BRL', dir: 'ltr' },
  { code: 'JP', name: '日本', flag: '🇯🇵', lang: 'ja', locale: 'ja-JP', currency: 'JPY', dir: 'ltr' },
  { code: 'CN', name: '中国', flag: '🇨🇳', lang: 'zh', locale: 'zh-CN', currency: 'CNY', dir: 'ltr' },
  { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦', lang: 'ar', locale: 'ar-SA', currency: 'SAR', dir: 'rtl' },
]

export const DEFAULT_COUNTRY = COUNTRIES[0]

export function findCountry(code) {
  return COUNTRIES.find((c) => c.code === code) || DEFAULT_COUNTRY
}
