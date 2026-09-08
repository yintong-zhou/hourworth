import { useMemo } from 'react'
import { IncomeForm } from './components/IncomeForm'
import { ProductList } from './components/ProductList'
import { Logo } from './components/Logo'
import { Footer } from './components/Footer'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useProducts } from './hooks/useProducts'
import { getHourlyRate } from './lib/workTime'
import { validateSettings } from './lib/validateSettings'

const DEFAULT_SETTINGS = {
  monthlyIncome: 2000,
  monthlyExpenses: 1200,
  hoursPerDay: 8,
  daysPerMonth: 22,
}

function App() {
  const [settings, setSettings] = useLocalStorage('hourworth-settings', DEFAULT_SETTINGS)
  const { products, loading, error } = useProducts()

  const errors = useMemo(() => validateSettings(settings), [settings])
  const isValid = Object.keys(errors).length === 0
  const hourlyRate = useMemo(
    () => (isValid ? getHourlyRate(settings) : 0),
    [settings, isValid],
  )

  const updateSetting = (key, rawValue) => {
    setSettings((prev) => ({ ...prev, [key]: rawValue === '' ? '' : Number(rawValue) }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <Logo />
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

        <IncomeForm values={settings} errors={errors} onChange={updateSetting} />

        <p className="text-sm text-muted">
          Your disposable hourly rate:{' '}
          <strong className="bg-accent rounded-sm px-1.5 py-0.5 text-ink">
            {isValid ? hourlyRate.toFixed(2) : '—'}
          </strong>
        </p>

        {loading && <p className="text-muted">Loading catalog…</p>}
        {error && <p className="text-red-600">Could not load products.json</p>}
        <ProductList products={products} hourlyRate={hourlyRate} settings={settings} />
      </main>

      <Footer />
    </div>
  )
}

export default App
