import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const PRODUCTS = [{ id: 'coffee', name: 'Coffee', price: 3 }]

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => PRODUCTS,
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the default hourly rate and product catalog', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())
    // (2000 - 1200) / (8 * 22) = 4.5454... -> "4.55"
    expect(screen.getByText('4.55')).toBeInTheDocument()
  })

  it('recalculates the hourly rate when income changes', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText('Monthly income'), { target: { value: '3000' } })

    // (3000 - 1200) / 176 = 10.2272...
    await waitFor(() => expect(screen.getByText('10.23')).toBeInTheDocument())
  })

  it('shows a validation error and dashes out the rate for an empty field', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText('Monthly income'), { target: { value: '' } })

    expect(await screen.findByText(/must be a number/)).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
