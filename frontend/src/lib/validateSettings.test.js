import { describe, expect, it } from 'vitest'
import { validateSettings } from './validateSettings'

const VALID = {
  monthlyIncome: 2000,
  monthlyExpenses: 1200,
  hoursPerDay: 8,
  daysPerMonth: 22,
}

describe('validateSettings', () => {
  it('returns no errors for fully valid settings', () => {
    expect(validateSettings(VALID)).toEqual({})
  })

  it('flags an empty field', () => {
    const errors = validateSettings({ ...VALID, monthlyIncome: '' })
    expect(errors.monthlyIncome).toMatch(/number/)
  })

  it('flags a negative field', () => {
    const errors = validateSettings({ ...VALID, hoursPerDay: -1 })
    expect(errors.hoursPerDay).toMatch(/negative/)
  })

  it('flags NaN', () => {
    const errors = validateSettings({ ...VALID, daysPerMonth: Number.NaN })
    expect(errors.daysPerMonth).toMatch(/number/)
  })

  it('allows 0 as a valid value', () => {
    const errors = validateSettings({ ...VALID, monthlyExpenses: 0 })
    expect(errors.monthlyExpenses).toBeUndefined()
  })
})
