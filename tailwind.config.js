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
        // Clean-modern type system with personality:
        //   display / headings -> Bricolage Grotesque (characterful, modern)
        //   body / UI / clues  -> Hanken Grotesk (legible, distinctive)
        cinzel:      ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        typewriter:  ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display:     ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans:        ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif:       ['"Bricolage Grotesque"', 'ui-sans-serif', 'sans-serif'],
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
      },
      animation: {
        stamp:     'stamp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'cell-pop':'cell-pop 0.25s ease-out',
        pulse:     'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
