import { describe, expect, it } from 'vitest'
import { convertAmount, formatCurrency, SUPPORTED_CURRENCIES } from './currency'

describe('SUPPORTED_CURRENCIES', () => {
  it('includes USD and EUR', () => {
    expect(SUPPORTED_CURRENCIES).toEqual(expect.arrayContaining(['USD', 'EUR']))
  })
})

describe('convertAmount', () => {
  it('returns the same amount when converting to the same currency', () => {
    expect(convertAmount(100, 'USD', 'USD')).toBe(100)
  })

  it('converts USD to EUR using the static rate', () => {
    expect(convertAmount(100, 'USD', 'EUR')).toBe(92)
  })

  it('converts EUR back to USD (round-trip is approximately stable)', () => {
    const eur = convertAmount(100, 'USD', 'EUR')
    const backToUsd = convertAmount(eur, 'EUR', 'USD')
    expect(backToUsd).toBeCloseTo(100, 1)
  })

  it('passes through non-finite amounts unchanged', () => {
    expect(convertAmount('', 'USD', 'EUR')).toBe('')
    expect(convertAmount(Number.NaN, 'USD', 'EUR')).toBeNaN()
  })
})

describe('formatCurrency', () => {
  it('formats USD amounts', () => {
    expect(formatCurrency(4.5, 'USD')).toBe('$4.50')
  })

  it('formats EUR amounts', () => {
    expect(formatCurrency(4.5, 'EUR')).toBe('€4.50')
  })

  it('returns an em dash for non-finite amounts', () => {
    expect(formatCurrency(Number.NaN, 'USD')).toBe('—')
  })
})
