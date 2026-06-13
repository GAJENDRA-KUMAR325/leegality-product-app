import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '../context/LocaleContext'
import Pagination from './Pagination'

// Pagination reads translated Prev/Next labels, so it needs the locale context.
const renderWithLocale = (ui) => render(<LocaleProvider>{ui}</LocaleProvider>)

describe('Pagination', () => {
  it('renders nothing when there is a single page', () => {
    const { container } = renderWithLocale(
      <Pagination page={1} pageCount={1} onChange={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('disables Previous on the first page', () => {
    renderWithLocale(<Pagination page={1} pageCount={5} onChange={() => {}} />)
    expect(screen.getByText(/Previous/i)).toBeDisabled()
    expect(screen.getByText(/Next/i)).toBeEnabled()
  })

  it('disables Next on the last page', () => {
    renderWithLocale(<Pagination page={5} pageCount={5} onChange={() => {}} />)
    expect(screen.getByText(/Next/i)).toBeDisabled()
  })

  it('calls onChange with the chosen page number', async () => {
    const onChange = vi.fn()
    renderWithLocale(<Pagination page={1} pageCount={5} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('marks the active page with aria-current', () => {
    renderWithLocale(<Pagination page={2} pageCount={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('collapses long page lists with an ellipsis', () => {
    renderWithLocale(<Pagination page={6} pageCount={12} onChange={() => {}} />)
    expect(screen.getAllByText('…').length).toBeGreaterThan(0)
  })
})
