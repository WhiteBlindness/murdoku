import { motion } from 'framer-motion'

interface Props {
  resolved: string
  onToggle: () => void
  className?: string
}

/**
 * Compact sun/moon toggle. Labelled for screen readers; the icon swap is the
 * visual affordance. Uses accent tokens so it themes automatically.
 */
export default function ThemeToggle({ resolved, onToggle, className = '' }: Props) {
  const isDark = resolved === 'dark'
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
      className={`focus-ring flex items-center justify-center w-11 h-11 rounded-full border border-br-thin bg-bg-panel text-gold ${className}`}
    >
      {isDark ? (
        /* moon */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* sun */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.15" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </motion.button>
  )
}
