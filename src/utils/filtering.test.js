import { describe, it, expect } from 'vitest'
import {
  extractBrands,
  applyFilters,
  sortProducts,
  paginate,
  totalPages,
  PAGE_SIZE,
} from './filtering'

const products = [
  { id: 1, title: 'iPhone 15', price: 999, rating: 4.8, brand: 'Apple' },
  { id: 2, title: 'Galaxy S24', price: 799, rating: 4.5, brand: 'Samsung' },
  { id: 3, title: 'Pixel 9', price: 699, rating: 4.6, brand: 'Google' },
  { id: 4, title: 'Redmi Note', price: 199, rating: 4.1, brand: 'Apple' },
  { id: 5, title: 'Generic Phone', price: 99, rating: 3.9 }, // no brand
]

describe('extractBrands', () => {
  it('returns unique, sorted brands and ignores products without a brand', () => {
    expect(extractBrands(products)).toEqual(['Apple', 'Google', 'Samsung'])
  })

  it('returns an empty array when nothing has a brand', () => {
    expect(extractBrands([{ id: 1, title: 'x', price: 1, rating: 1 }])).toEqual([])
  })
})

describe('applyFilters', () => {
  const base = { min: '', max: '', brands: [], search: '' }

  it('returns everything when no filters are set', () => {
    expect(applyFilters(products, base)).toHaveLength(products.length)
  })

  it('filters by price range (inclusive)', () => {
    const out = applyFilters(products, { ...base, min: '199', max: '799' })
    expect(out.map((p) => p.id)).toEqual([2, 3, 4])
  })

  it('filters by selected brands (and excludes brand-less products)', () => {
    const out = applyFilters(products, { ...base, brands: ['Apple'] })
    expect(out.map((p) => p.id)).toEqual([1, 4])
  })

  it('search is case-insensitive and matches the title', () => {
    const out = applyFilters(products, { ...base, search: 'pixel' })
    expect(out).toHaveLength(1)
    expect(out[0].id).toBe(3)
  })

  it('combines filters with logical AND', () => {
    const out = applyFilters(products, { ...base, brands: ['Apple'], max: '500' })
    expect(out.map((p) => p.id)).toEqual([4])
  })
})

describe('sortProducts', () => {
  it('sorts by price ascending and descending without mutating input', () => {
    const original = [...products]
    expect(sortProducts(products, 'price-asc').map((p) => p.price)).toEqual([
      99, 199, 699, 799, 999,
    ])
    expect(sortProducts(products, 'price-desc').map((p) => p.price)).toEqual([
      999, 799, 699, 199, 99,
    ])
    expect(products).toEqual(original) // input untouched
  })

  it('sorts by rating descending', () => {
    expect(sortProducts(products, 'rating-desc')[0].id).toBe(1)
  })

  it('keeps original order for "featured"/unknown', () => {
    expect(sortProducts(products, 'featured').map((p) => p.id)).toEqual([1, 2, 3, 4, 5])
  })
})

describe('paginate & totalPages', () => {
  it('slices the correct page', () => {
    const list = Array.from({ length: 20 }, (_, i) => i + 1)
    expect(paginate(list, 1, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(paginate(list, 3, 8)).toEqual([17, 18, 19, 20])
  })

  it('computes total pages (min 1)', () => {
    expect(totalPages(0)).toBe(1)
    expect(totalPages(8, 8)).toBe(1)
    expect(totalPages(9, 8)).toBe(2)
  })

  it('exposes a sensible default page size', () => {
    expect(PAGE_SIZE).toBeGreaterThan(0)
  })
})
