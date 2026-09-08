const LABELS = {
  monthlyIncome: 'Monthly income',
  monthlyExpenses: 'Fixed monthly expenses',
  hoursPerDay: 'Working hours per day',
  daysPerMonth: 'Working days per month',
}

export function validateSettings(settings) {
  const errors = {}
  for (const key of Object.keys(LABELS)) {
    const value = settings[key]
    if (value === '' || value === null || Number.isNaN(value)) {
      errors[key] = `${LABELS[key]} must be a number`
    } else if (value < 0) {
      errors[key] = `${LABELS[key]} can't be negative`
    }
  }
  return errors
}
