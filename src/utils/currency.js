/**
 * Currency conversion + locale-aware formatting.
 *
 * DummyJSON prices are quoted in USD. We convert with a static rate table and
 * format with Intl.NumberFormat so each locale gets correct symbols, grouping
 * and decimal rules (e.g. JPY shows no decimals, de-DE uses "1.234,56 €").
 *
 * NOTE: rates are illustrative/static. The production path is a live FX feed
 * (e.g. exchangerate.host / openexchangerates) cached server-side — swapping
 * this table for a fetch is the only change required.
 */
export const USD_RATES = {
  USD: 1,
  GBP: 0.79,
  INR: 83.2,
  EUR: 0.92,
  BRL: 5.42,
  JPY: 157,
  CNY: 7.25,
  SAR: 3.75,
}

/** Convert a USD amount into the target currency. */
export function convertFromUSD(usd, currency) {
  const rate = USD_RATES[currency] ?? 1
  return (usd ?? 0) * rate
}

/** Convert + format a USD amount for the given locale/currency. */
export function formatMoney(usd, { locale, currency }) {
  const amount = convertFromUSD(usd, currency)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: amount >= 1000 ? 0 : undefined,
  }).format(amount)
}
