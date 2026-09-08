export function formatWorkTime({ hours, days, months, years }) {
  if (!Number.isFinite(hours)) return 'n/a'
  if (years >= 1) return `${years.toFixed(1)} years`
  if (months >= 1) return `${months.toFixed(1)} months`
  if (days >= 1) return `${days.toFixed(1)} days`
  return `${hours.toFixed(1)} hours`
}
