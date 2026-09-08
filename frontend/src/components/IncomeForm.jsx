import { Sparkle } from './Sparkle'

const FIELDS = [
  { key: 'monthlyIncome', label: 'Monthly income' },
  { key: 'monthlyExpenses', label: 'Fixed monthly expenses' },
  { key: 'hoursPerDay', label: 'Working hours per day' },
  { key: 'daysPerMonth', label: 'Working days per month' },
]

export function IncomeForm({ values, errors, onChange }) {
  return (
    <form
      className="relative rounded-card bg-panel border border-line p-8"
      aria-label="Income and working time settings"
    >
      <Sparkle className="absolute -top-4 -right-4 h-10 w-10 rotate-12" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-1.5 text-sm">
            <span>{label}</span>
            <input
              type="number"
              min="0"
              value={values[key]}
              onChange={(e) => onChange(key, e.target.value)}
              aria-invalid={Boolean(errors?.[key])}
              className="rounded-md border border-line bg-surface px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {errors?.[key] && (
              <span className="text-xs text-red-600">{errors[key]}</span>
            )}
          </label>
        ))}
      </div>
    </form>
  )
}
