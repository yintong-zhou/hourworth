export function Logo({ inverted = false }) {
  const inkColor = inverted ? '#ffffff' : '#191a23'
  return (
    <span className="inline-flex items-center gap-2 font-bold text-xl">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0 L24 12 L12 24 L0 12 Z" fill={inkColor} />
      </svg>
      <span style={{ color: inkColor }}>
        Hour
        <span className="bg-accent px-1 rounded-sm text-ink">Worth</span>
      </span>
    </span>
  )
}
