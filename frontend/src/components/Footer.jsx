import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-ink text-white px-4 py-8 mt-auto">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo inverted />
        <p className="text-sm text-neutral-300">
          No data ever leaves your device. Everything is calculated and stored locally.
        </p>
      </div>
    </footer>
  )
}
