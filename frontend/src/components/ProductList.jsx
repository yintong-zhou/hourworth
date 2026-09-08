import { getWorkTimeBreakdown } from '../lib/workTime'
import { formatWorkTime } from '../lib/formatWorkTime'

const CARD_STYLES = [
  { card: 'bg-panel border border-line text-ink', value: 'text-ink' },
  { card: 'bg-accent text-ink', value: 'text-ink' },
  { card: 'bg-ink text-white', value: 'text-white' },
]

export function ProductList({ products, hourlyRate, settings }) {
  if (!products.length) return null

  return (
    <ul className="flex flex-col gap-3">
      {products.map((product, index) => {
        const breakdown = getWorkTimeBreakdown(product.price, hourlyRate, settings)
        const style = CARD_STYLES[index % CARD_STYLES.length]
        return (
          <li
            key={product.id}
            className={`flex items-center justify-between rounded-card px-6 py-4 ${style.card}`}
          >
            <span className="font-medium">{product.name}</span>
            <span className={`font-mono text-sm font-medium ${style.value}`}>
              {formatWorkTime(breakdown)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
