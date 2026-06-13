import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LocaleProvider } from '../context/LocaleContext'
import { FilterProvider } from '../context/FilterContext'
import ProductListPage from './ProductListPage'

// Mock the network layer so the test is deterministic and offline.
const SAMPLE = [
  { id: 1, title: 'iPhone 15', price: 999, rating: 4.8, brand: 'Apple', thumbnail: '', images: [] },
  { id: 2, title: 'Galaxy S24', price: 799, rating: 4.5, brand: 'Samsung', thumbnail: '', images: [] },
  { id: 3, title: 'Pixel 9', price: 699, rating: 4.6, brand: 'Google', thumbnail: '', images: [] },
  { id: 4, title: 'iPad Air', price: 599, rating: 4.7, brand: 'Apple', thumbnail: '', images: [] },
]

vi.mock('../api/products', () => ({
  fetchProducts: vi.fn(() => Promise.resolve(SAMPLE)),
  fetchCategories: vi.fn(() =>
    Promise.resolve([{ slug: 'smartphones', name: 'Smartphones' }])
  ),
  fetchProductById: vi.fn(),
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LocaleProvider>
        <FilterProvider>
          <ProductListPage />
        </FilterProvider>
      </LocaleProvider>
    </MemoryRouter>
  )
}

describe('ProductListPage (integration)', () => {
  beforeEach(() => localStorage.clear())

  it('renders the fetched products', async () => {
    renderPage()
    expect(await screen.findByText('iPhone 15')).toBeInTheDocument()
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
    expect(screen.getByText('Pixel 9')).toBeInTheDocument()
  })

  it('filters the grid when a brand is selected (combined filtering)', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText('iPhone 15')

    // Brand checkboxes are derived from the fetched products.
    await user.click(screen.getByRole('checkbox', { name: 'Apple' }))

    await waitFor(() => {
      expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument()
    })
    // Apple products remain.
    expect(screen.getByText('iPhone 15')).toBeInTheDocument()
    expect(screen.getByText('iPad Air')).toBeInTheDocument()
  })

  it('sorts by price: low to high', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText('iPhone 15')

    await user.selectOptions(
      screen.getByRole('combobox', { name: /sort by/i }),
      'price-asc'
    )

    // Each product card is a link whose accessible name is the product title;
    // their DOM order reflects the sorted grid order.
    const titles = screen.getAllByRole('link').map((a) => a.getAttribute('aria-label'))
    expect(titles).toEqual(['iPad Air', 'Pixel 9', 'Galaxy S24', 'iPhone 15'])
  })
})
