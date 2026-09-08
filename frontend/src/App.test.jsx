import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const CATALOG = {
  currency_reference: { us: 'USD', eu: 'EUR' },
  products: [
    { category: 'Drinks', model: 'Coffee', configuration: '1 cup', price_us_usd: 3, price_eu_eur: 2.76 },
    { category: 'Drinks', model: 'Tea', configuration: '1 cup', price_us_usd: 2, price_eu_eur: 1.84 },
    { category: 'Electronics', model: 'Laptop', configuration: '13-inch', price_us_usd: 1000, price_eu_eur: 950 },
  ],
}

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => CATALOG,
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the default hourly rate (EUR) and the full catalog grouped by category', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())
    // (1500 - 1200) / (8 * 22) = 1.7045... -> "€1.70"
    expect(screen.getByText('€1.70')).toBeInTheDocument()
    expect(screen.getByText('Tea')).toBeInTheDocument()
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Drinks' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Electronics' })).toBeInTheDocument()
  })

  it('recalculates the hourly rate when income changes', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText(/Monthly income/), { target: { value: '3000' } })

    // (3000 - 1200) / 176 = 10.2272... -> "€10.23"
    await waitFor(() => expect(screen.getByText('€10.23')).toBeInTheDocument())
  })

  it('shows a validation error and dashes out the rate for an empty field', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText(/Monthly income/), { target: { value: '' } })

    expect(await screen.findByText(/must be a number/)).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('switches to USD and converts the stored income amount, using real regional product prices', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'USD' }))

    // 1500 EUR -> 1630.43 USD at the static 0.92 rate (user income, not catalog prices)
    await waitFor(() => expect(screen.getByLabelText(/Monthly income/)).toHaveValue(1630.43))
    // Laptop's real USD price (1000) is shown directly, not 950 / 0.92
    expect(await screen.findByText('$1,000.00')).toBeInTheDocument()
  })

  it('filters the catalog by search text', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.change(screen.getByPlaceholderText('Search products…'), { target: { value: 'lap' } })

    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
    expect(screen.queryByText('Tea')).not.toBeInTheDocument()
  })

  it('filters the catalog by category', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Electronics' }))

    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Drinks' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Coffee')).toBeInTheDocument()
  })

  it('shows an empty-state message when no product matches the filters', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByText('Coffee')).toBeInTheDocument())

    fireEvent.change(screen.getByPlaceholderText('Search products…'), {
      target: { value: 'nonexistent-product' },
    })

    expect(await screen.findByText('No products match your search.')).toBeInTheDocument()
  })
})
