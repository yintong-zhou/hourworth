import { Sparkle } from './Sparkle'
import { FIELD_KEYS, FIELD_LABELS } from '../lib/fields'

const CURRENCY_FIELDS = new Set(['monthlyIncome', 'monthlyExpenses'])
const CURRENCY_SYMBOLS = { USD: '$', EUR: '€' }

export function IncomeForm({ values, errors, onChange, currency }) {
  return (
    <form
      className="relative rounded-card bg-panel border border-line p-8"
      aria-label="Income and working time settings"
    >
      <Sparkle className="absolute -top-4 -right-4 h-10 w-10 rotate-12" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELD_KEYS.map((key) => (
          <label key={key} className="flex flex-col gap-1.5 text-sm">
            <span>{FIELD_LABELS[key]}</span>
            <div className="flex items-center rounded-md border border-line bg-surface focus-within:ring-2 focus-within:ring-accent">
              {CURRENCY_FIELDS.has(key) && (
                <span className="pl-3 text-muted">{CURRENCY_SYMBOLS[currency]}</span>
              )}
              <input
                type="number"
                min="0"
                value={values[key]}
                onChange={(e) => onChange(key, e.target.value)}
                aria-invalid={Boolean(errors?.[key])}
                className="w-full rounded-md bg-transparent px-3 py-2 text-ink focus:outline-none"
              />
            </div>
            {errors?.[key] && (
              <span className="text-xs text-red-600">{errors[key]}</span>
            )}
          </label>
        ))}
      </div>
    </form>
  )
}
