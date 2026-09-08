export function CategoryFilter({ categories, value, onChange }) {
  const options = ['all', ...categories]

  return (
    <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={option === value}
          className={`rounded-pill border border-line px-3 py-1 text-xs font-medium transition-colors ${
            option === value ? 'bg-accent text-ink' : 'bg-surface text-muted'
          }`}
        >
          {option === 'all' ? 'All' : option}
        </button>
      ))}
    </div>
  )
}
