import { getWorkTimeBreakdown } from '../lib/workTime'
import { formatWorkTime } from '../lib/formatWorkTime'
import { formatCurrency } from '../lib/currency'
import { getPriceForCurrency } from '../lib/products'

const CARD_STYLES = [
  { card: 'bg-panel border border-line text-ink', value: 'text-ink' },
  { card: 'bg-accent text-ink', value: 'text-ink' },
  { card: 'bg-ink text-white', value: 'text-white' },
]

export function ProductList({ products, hourlyRate, settings, currency }) {
  if (!products.length) return null

  return (
    <ul className="flex flex-col gap-3">
      {products.map((product, index) => {
        const price = getPriceForCurrency(product, currency)
        const breakdown = getWorkTimeBreakdown(price, hourlyRate, settings)
        const style = CARD_STYLES[index % CARD_STYLES.length]

        return (
          <li
            key={product.id}
            className={`flex items-center justify-between gap-4 rounded-card px-6 py-4 ${style.card}`}
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{product.model}</span>
              <span className={`truncate text-xs opacity-70 ${style.value}`}>
                {product.configuration}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-0.5">
              <span className={`font-mono text-sm font-medium ${style.value}`}>
                {formatWorkTime(breakdown)}
              </span>
              <span className={`text-xs opacity-70 ${style.value}`}>
                {formatCurrency(price, currency)}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
