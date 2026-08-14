import { useState } from 'react'

interface Props {
  seed: string
  size?: number
  accent?: string
  className?: string
  dead?: boolean
  /** Shown in the fallback when the remote portrait cannot load. */
  name?: string
}

/**
 * Suspect portrait via DiceBear (notionists — clean line-portrait style).
 * Deterministic per seed; the service worker caches api.dicebear.com so repeat
 * and offline visits are instant (see vite.config.ts).
 *
 * The portrait is a REMOTE image, which makes a third party a single point of
 * failure for something the player needs: suspects were rendering with no photo
 * at all in some cases. The API being slow, rate-limiting, or having an error
 * response cached by the service worker must never leave a blank card, so a
 * failed load falls back to the suspect's monogram on their accent colour —
 * still unique per person, still readable, and it needs no network.
 *
 * `loading="lazy"` was also removed deliberately. There are only 4-8 of these on
 * screen so it bought nothing, and inside the dossier column (its own
 * `overflow-y-auto` scroll container) portraits below the fold could stay
 * unloaded.
 */
export default function Avatar({
  seed, size = 56, accent = '#888', className = '', dead = false, name,
}: Props) {
  const [failed, setFailed] = useState(false)

  const bg = accent.replace('#', '')
  const url =
    `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}` +
    `&backgroundColor=${bg}&backgroundType=gradientLinear&radius=12`

  // Monogram from the display name when we have it, else from the seed, which
  // is prefixed with the person's name (e.g. "Marco-1234-2").
  const initial = (name ?? seed).trim().charAt(0).toUpperCase() || '?'

  const shared = {
    display: 'block' as const,
    borderRadius: 12,
    filter: dead ? 'grayscale(1) brightness(0.7)' : undefined,
  }

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{
          ...shared,
          width: size,
          height: size,
          background: accent,
          color: 'var(--color-on-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Barlow Condensed is the naming voice (DESIGN.md `subject`). This
          // said Oswald, which is loaded nowhere in the project — no @import,
          // no <link>, no Tailwind family — so these initials have been
          // silently rendering in whatever ui-sans-serif resolves to rather
          // than a chosen face. Leftover from a superseded art direction.
          fontFamily: '"Barlow Condensed", ui-sans-serif, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: Math.round(size * 0.46),
          lineHeight: 1,
          // Matches the portrait's edge so a fallback never reads as a
          // different component from the ones that loaded beside it.
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)',
        }}
      >
        {initial}
      </span>
    )
  }

  return (
    <img
      src={url}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={className}
      style={shared}
    />
  )
}
