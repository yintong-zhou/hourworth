// Static, hardcoded exchange rate (units of that currency per 1 USD).
// No live rate lookup: the app makes no API calls, per README.md.
const UNITS_PER_USD = {
  USD: 1,
  EUR: 0.92,
}

export const SUPPORTED_CURRENCIES = Object.keys(UNITS_PER_USD)

export function convertAmount(amount, from, to) {
  if (from === to || !Number.isFinite(amount)) return amount
  const amountInUsd = amount / UNITS_PER_USD[from]
  return Math.round(amountInUsd * UNITS_PER_USD[to] * 100) / 100
}

export function formatCurrency(amount, currency) {
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}
