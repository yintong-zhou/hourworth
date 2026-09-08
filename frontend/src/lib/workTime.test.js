import { describe, expect, it } from 'vitest'
import { getHourlyRate, getWorkTimeBreakdown } from './workTime'

describe('getHourlyRate', () => {
  it('computes disposable income divided by working hours per month', () => {
    const rate = getHourlyRate({
      monthlyIncome: 2000,
      monthlyExpenses: 1200,
      hoursPerDay: 8,
      daysPerMonth: 22,
    })
    // disposable = 800, working hours/month = 176 -> 4.5454...
    expect(rate).toBeCloseTo(800 / 176, 5)
  })

  it('returns 0 when working hours per month is 0', () => {
    const rate = getHourlyRate({
      monthlyIncome: 2000,
      monthlyExpenses: 1200,
      hoursPerDay: 0,
      daysPerMonth: 22,
    })
    expect(rate).toBe(0)
  })

  it('can be negative when expenses exceed income', () => {
    const rate = getHourlyRate({
      monthlyIncome: 1000,
      monthlyExpenses: 1500,
      hoursPerDay: 8,
      daysPerMonth: 22,
    })
    expect(rate).toBeLessThan(0)
  })
})

describe('getWorkTimeBreakdown', () => {
  const settings = { hoursPerDay: 8, daysPerMonth: 22 }

  it('converts price into hours, days, months, years at a given hourly rate', () => {
    const breakdown = getWorkTimeBreakdown(880, 10, settings)
    expect(breakdown.hours).toBeCloseTo(88, 5)
    expect(breakdown.days).toBeCloseTo(11, 5)
    expect(breakdown.months).toBeCloseTo(0.5, 5)
    expect(breakdown.years).toBeCloseTo(0.5 / 12, 5)
  })

  it('returns Infinity for every field when the hourly rate is 0', () => {
    const breakdown = getWorkTimeBreakdown(100, 0, settings)
    expect(breakdown.hours).toBe(Infinity)
    expect(breakdown.days).toBe(Infinity)
    expect(breakdown.months).toBe(Infinity)
    expect(breakdown.years).toBe(Infinity)
  })

  it('returns Infinity when the hourly rate is negative', () => {
    const breakdown = getWorkTimeBreakdown(100, -5, settings)
    expect(breakdown.hours).toBe(Infinity)
  })
})
