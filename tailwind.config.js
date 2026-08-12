/** @type {import('tailwindcss').Config} */
export default {
  // Class strategy so `.theme-light` / `.theme-dark` on <html> control everything.
  darkMode: ['class', '.theme-dark'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Semantic tokens -> CSS custom properties (see src/styles/theme.css).
      // Legacy aliases (bg-deep, paper, gold...) are repointed to the same
      // vars so existing markup themes automatically with no refactor.
      colors: {
        // --- semantic (preferred going forward) ---
        'bg-base':      'var(--color-bg-base)',
        'bg-surface':   'var(--color-bg-surface)',
        'bg-elevated':  'var(--color-bg-elevated)',
        'bg-inset':     'var(--color-bg-inset)',
        'border-subtle':'var(--color-border-subtle)',
        'border-strong':'var(--color-border-strong)',
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        'accent':         'var(--color-accent)',
        'accent-strong':  'var(--color-accent-strong)',
        'accent-text':    'var(--color-accent-text)',
        'on-accent':      'var(--color-on-accent)',
        'danger':         'var(--color-danger)',
        'danger-text':    'var(--color-danger-text)',

        // --- board (police blueprint) ---
        'board-ground':      'var(--board-ground)',
        'board-ink':         'var(--board-ink)',
        'board-wall':        'var(--board-wall)',
        'board-room':        'var(--board-room-tint)',
        'board-room-alt':    'var(--board-room-tint-2)',
        'board-chalk':       'var(--board-chalk)',

        // --- legacy aliases (kept so old class names stay valid & themed) ---
        'bg-deep':   'var(--color-bg-base)',
        'bg-panel':  'var(--color-bg-surface)',
        'bg-cell':   'var(--color-bg-elevated)',
        'bg-given':  'var(--color-bg-inset)',
        'br-thin':   'var(--color-border-subtle)',
        'br-box':    'var(--color-border-strong)',
        gold:        'var(--color-accent)',
        amber:       'var(--color-accent-strong)',
        crimson:     'var(--color-danger)',
        blood:       'var(--color-danger)',
        paper:       'var(--color-text-primary)',
        'paper-dim': 'var(--color-text-secondary)',
        'paper-muted':'var(--color-text-muted)',
      },
      fontFamily: {
        // L.A. Noire type system — three voices, each with one job:
        //   display -> Oswald. Stark condensed newspaper headline. Titles only.
        //   mono    -> Courier Prime. The case file: clues, evidence, timer,
        //              case numbers. A screenplay typewriter, so it stays
        //              legible at body size where a distressed novelty face
        //              (Special Elite et al) would not.
        //   sans    -> Hanken Grotesk. Dense UI chrome. Condensed display type
        //              is unreadable at 10-11px, so small labels get a neutral
        //              grotesk rather than being forced into the theme.
        display:     ['"Barlow Condensed"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:        ['"Courier Prime"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        typewriter:  ['"Courier Prime"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans:        ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Legacy alias kept so any straggler `font-cinzel` still resolves to a
        // real family instead of falling back to Times.
        cinzel:      ['"Barlow Condensed"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        stamp: {
          '0%':   { transform: 'scale(2) rotate(-8deg)', opacity: '0' },
          '60%':  { transform: 'scale(0.95) rotate(1deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-2deg)', opacity: '1' },
        },
        'cell-pop': {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(0.82)' },
          '70%':  { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        // Rejection gesture for an illegal move. Small amplitude and short —
        // a physical "no", not a tantrum. Uses translate3d so it composites on
        // the GPU and never triggers layout. Kept as a CSS animation (not a
        // Framer spring) so the global prefers-reduced-motion block in
        // index.css actually neutralises it.
        shake: {
          '0%, 100%':      { transform: 'translate3d(0, 0, 0)' },
          '15%, 45%, 75%': { transform: 'translate3d(-5px, 0, 0)' },
          '30%, 60%, 90%': { transform: 'translate3d(5px, 0, 0)' },
        },
      },
      animation: {
        stamp:     'stamp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'cell-pop':'cell-pop 0.25s ease-out',
        pulse:     'pulse 2s ease-in-out infinite',
        shake:     'shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97) both',
      },
    },
  },
  plugins: [],
}
