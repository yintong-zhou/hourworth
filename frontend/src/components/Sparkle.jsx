export function Sparkle({ className = '' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 2 L18.5 13.5 L30 16 L18.5 18.5 L16 30 L13.5 18.5 L2 16 L13.5 13.5 Z"
        fill="#cbf042"
        stroke="#191a23"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}
