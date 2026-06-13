import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('renders the numeric value and an accessible label', () => {
    render(<StarRating value={4.5} />)
    expect(screen.getByText('(4.5)')).toBeInTheDocument()
    expect(screen.getByLabelText('Rated 4.5 out of 5')).toBeInTheDocument()
  })

  it('can hide the numeric value', () => {
    render(<StarRating value={3} showValue={false} />)
    expect(screen.queryByText('(3.0)')).not.toBeInTheDocument()
  })
})
