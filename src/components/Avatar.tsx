interface Props {
  seed: string
  size?: number
  accent?: string
  className?: string
  dead?: boolean
}

/**
 * Suspect portrait via DiceBear (notionists — clean line-portrait style).
 * SVG is served from the API; the service worker caches api.dicebear.com so
 * repeat/offline visits are instant (see vite.config.ts). Deterministic per seed.
 */
export default function Avatar({ seed, size = 56, accent = '#888', className = '', dead = false }: Props) {
  const bg = accent.replace('#', '')
  const url =
    `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}` +
    `&backgroundColor=${bg}&backgroundType=gradientLinear&radius=12`
  return (
    <img
      src={url}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={className}
      style={{
        display: 'block',
        borderRadius: 12,
        filter: dead ? 'grayscale(1) brightness(0.7)' : undefined,
      }}
    />
  )
}
