import { useMemo, useState } from 'react'
import { IncomeForm } from './components/IncomeForm'
import { ProductList } from './components/ProductList'
import { CategoryFilter } from './components/CategoryFilter'
import { SearchInput } from './components/SearchInput'
import { Logo } from './components/Logo'
import { Footer } from './components/Footer'
import { PillToggle } from './components/PillToggle'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useProducts } from './hooks/useProducts'
import { getHourlyRate } from './lib/workTime'
import { validateSettings } from './lib/validateSettings'
import { convertAmount, formatCurrency } from './lib/currency'
import { filterProducts, getCategories, groupByCategory } from './lib/products'

const DEFAULT_SETTINGS = {
  monthlyIncome: 1500,
  monthlyExpenses: 1200,
  hoursPerDay: 8,
  daysPerMonth: 22,
}

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
]

function App() {
  const [settings, setSettings] = useLocalStorage('hourworth-settings', DEFAULT_SETTINGS)
  const [currency, setCurrency] = useLocalStorage('hourworth-currency', 'EUR')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { products, loading, error } = useProducts()

  const errors = useMemo(() => validateSettings(settings), [settings])
  const isValid = Object.keys(errors).length === 0
  const hourlyRate = useMemo(
    () => (isValid ? getHourlyRate(settings) : 0),
    [settings, isValid],
  )

  const categories = useMemo(() => getCategories(products), [products])
  const filteredProducts = useMemo(
    () => filterProducts(products, { search, category }),
    [products, search, category],
  )
  const groupedProducts = useMemo(() => groupByCategory(filteredProducts), [filteredProducts])

  const updateSetting = (key, rawValue) => {
    setSettings((prev) => ({ ...prev, [key]: rawValue === '' ? '' : Number(rawValue) }))
  }

  const handleCurrencyChange = (nextCurrency) => {
    if (nextCurrency === currency) return
    setSettings((prev) => ({
      ...prev,
      monthlyIncome: convertAmount(prev.monthlyIncome, currency, nextCurrency),
      monthlyExpenses: convertAmount(prev.monthlyExpenses, currency, nextCurrency),
    }))
    setCurrency(nextCurrency)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3">
          <Logo />
          <PillToggle
            options={CURRENCY_OPTIONS}
            value={currency}
            onChange={handleCurrencyChange}
            ariaLabel="Currency"
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 pb-16">
        <div>
          <span className="inline-block rounded-pill bg-panel border border-line px-3 py-1 text-xs">
            time, not money
          </span>
          <p className="mt-3 text-muted">
            See how many hours, days, months or years of work a purchase really costs you.
          </p>
        </div>

        <IncomeForm values={settings} errors={errors} onChange={updateSetting} currency={currency} />

        <p className="text-sm text-muted">
          Your disposable hourly rate:{' '}
          <strong className="bg-accent rounded-sm px-1.5 py-0.5 text-ink">
            {isValid ? formatCurrency(hourlyRate, currency) : '—'}
          </strong>
        </p>

        {loading && <p className="text-muted">Loading catalog…</p>}
        {error && <p className="text-red-600">Could not load products.json</p>}

        {!loading && !error && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <SearchInput value={search} onChange={setSearch} />
              <CategoryFilter categories={categories} value={category} onChange={setCategory} />
            </div>

            {groupedProducts.length === 0 && (
              <p className="text-muted">No products match your search.</p>
            )}

            {groupedProducts.map(({ category: groupCategory, items }) => (
              <div key={groupCategory} className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {groupCategory}
                </h2>
                <ProductList
                  products={items}
                  hourlyRate={hourlyRate}
                  settings={settings}
                  currency={currency}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
