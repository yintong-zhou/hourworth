// Core HourWorth calculation, per README.md.

export function getHourlyRate({ monthlyIncome, monthlyExpenses, hoursPerDay, daysPerMonth }) {
  const disposableIncome = monthlyIncome - monthlyExpenses
  const workingHoursPerMonth = hoursPerDay * daysPerMonth
  if (workingHoursPerMonth <= 0) return 0
  return disposableIncome / workingHoursPerMonth
}

export function getWorkTimeBreakdown(price, hourlyRate, { hoursPerDay, daysPerMonth }) {
  if (!hourlyRate || hourlyRate <= 0) {
    return { hours: Infinity, days: Infinity, months: Infinity, years: Infinity }
  }
  const hours = price / hourlyRate
  const days = hours / hoursPerDay
  const months = days / daysPerMonth
  const years = months / 12
  return { hours, days, months, years }
}
