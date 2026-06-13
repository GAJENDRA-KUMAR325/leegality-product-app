import { describe, it, expect } from 'vitest'
import { convertFromUSD, formatMoney, USD_RATES } from './currency'

describe('convertFromUSD', () => {
  it('returns the same amount for USD (rate 1)', () => {
    expect(convertFromUSD(100, 'USD')).toBe(100)
  })

  it('applies the rate for a foreign currency', () => {
    expect(convertFromUSD(100, 'INR')).toBeCloseTo(100 * USD_RATES.INR)
  })

  it('treats null/undefined amount as 0', () => {
    expect(convertFromUSD(null, 'EUR')).toBe(0)
    expect(convertFromUSD(undefined, 'EUR')).toBe(0)
  })

  it('falls back to rate 1 for an unknown currency', () => {
    expect(convertFromUSD(50, 'XYZ')).toBe(50)
  })
})

describe('formatMoney', () => {
  it('formats USD with the dollar symbol', () => {
    const out = formatMoney(699, { locale: 'en-US', currency: 'USD' })
    expect(out).toContain('699')
    expect(out).toContain('$')
  })

  it('omits decimals for large amounts', () => {
    // 699 USD → INR is in the thousands, so no fractional part
    const out = formatMoney(699, { locale: 'en-US', currency: 'INR' })
    expect(out).not.toMatch(/\.\d/)
  })

  it('renders JPY without decimals (currency-driven)', () => {
    const out = formatMoney(5, { locale: 'ja-JP', currency: 'JPY' })
    expect(out).not.toMatch(/\.\d/)
  })
})
