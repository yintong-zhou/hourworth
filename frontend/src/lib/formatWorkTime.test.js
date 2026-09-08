import { describe, expect, it } from 'vitest'
import { formatWorkTime } from './formatWorkTime'

describe('formatWorkTime', () => {
  it('returns n/a when the breakdown is not finite', () => {
    expect(formatWorkTime({ hours: Infinity, days: Infinity, months: Infinity, years: Infinity })).toBe('n/a')
  })

  it('formats sub-day durations in hours', () => {
    expect(formatWorkTime({ hours: 4.5, days: 0.5, months: 0.02, years: 0.001 })).toBe('4.5 hours')
  })

  it('formats multi-day, sub-month durations in days', () => {
    expect(formatWorkTime({ hours: 40, days: 5, months: 0.2, years: 0.02 })).toBe('5.0 days')
  })

  it('formats multi-month, sub-year durations in months', () => {
    expect(formatWorkTime({ hours: 500, days: 60, months: 2.7, years: 0.2 })).toBe('2.7 months')
  })

  it('formats multi-year durations in years', () => {
    expect(formatWorkTime({ hours: 5000, days: 600, months: 20, years: 1.6 })).toBe('1.6 years')
  })
})
