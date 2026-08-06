import { motion } from 'framer-motion'
import { CHANGELOG, groupByMonth, formatDay, type ChangeTag } from '../core/changelog'

interface Props {
  onBack: () => void
}

// Token-mapped tag styles. No hardcoded hex — background is a translucent tint
// of the foreground token via color-mix so it scales across both themes.
const TAG_STYLE: Record<ChangeTag, { color: string; label: string }> = {
  Feature:     { color: 'var(--color-accent-text)',      label: 'FEATURE' },
  Improvement: { color: 'var(--color-text-secondary)',   label: 'UPDATE' },
  Fix:         { color: 'var(--color-danger-text)',      label: 'FIX' },
  Content:     { color: 'var(--color-text-muted)',       label: 'CONTENT' },
}

export default function ReleaseNotes({ onBack }: Props) {
  const groups = groupByMonth(CHANGELOG)

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col min-h-screen bg-bg-deep"
    >
      {/* Top bar */}
      <div className="pt-safe flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="focus-ring text-paper-muted text-sm font-mono tracking-wider flex items-center gap-1 px-1 py-2"
          style={{ minHeight: 44 }}
        >
          ← BACK
        </button>
        <span className="font-mono text-paper-muted text-[9px] tracking-[0.3em] uppercase">
          FIELD REPORTS
        </span>
      </div>

      {/* Divider — drawn line, not a soft gradient */}
      <div className="mx-6 h-px bg-border-strong" />

      <main className="flex-1 overflow-y-auto px-6 py-6 w-full max-w-2xl mx-auto">
        <header className="mb-8">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-paper-muted mb-1">
            CASE FILE — REVISION HISTORY
          </p>
          <h1 className="font-display text-3xl font-bold text-text-primary tracking-wide uppercase">
            Release Notes
          </h1>
          <p className="font-mono text-text-secondary text-[12px] mt-1">
            Every update to Alibi, newest first.
          </p>
        </header>

        {groups.map((group, gi) => (
          <section key={group.key} className="mb-8" aria-labelledby={`m-${group.key}`}>
            {/* Sticky month header — stamped section divider */}
            <h2
              id={`m-${group.key}`}
              className="sticky top-0 z-10 py-2 mb-3 font-mono text-[10px] tracking-[0.3em] uppercase text-accent-text border-b border-border-strong"
              style={{ background: 'var(--color-bg-base)', backdropFilter: 'blur(4px)' }}
            >
              {group.label}
            </h2>

            <ol className="flex flex-col gap-3 list-none pl-0">
              {group.entries.map((entry, i) => (
                <motion.li
                  key={`${entry.date}-${entry.headline}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(gi * 3 + i, 8) * 0.04, duration: 0.3 }}
                  className="border border-border-strong bg-bg-panel px-4 py-3.5"
                  style={{ boxShadow: 'var(--shadow-cut)' }}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {entry.tag && (() => {
                        const ts = TAG_STYLE[entry.tag]
                        return (
                          <span
                            className="font-mono text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 flex-shrink-0 border"
                            style={{
                              color: ts.color,
                              borderColor: ts.color,
                              background: `color-mix(in srgb, ${ts.color} 10%, transparent)`,
                            }}
                          >
                            {ts.label}
                          </span>
                        )
                      })()}
                      <h3 className="font-display text-text-primary text-sm font-semibold leading-tight tracking-wide truncate">
                        {entry.headline}
                      </h3>
                    </div>
                    <time
                      dateTime={entry.date}
                      className="font-mono text-paper-muted text-[10px] tracking-wider flex-shrink-0"
                    >
                      {formatDay(entry.date)}
                    </time>
                  </div>
                  <p className="font-mono text-text-secondary text-[12px] leading-relaxed">
                    {entry.detail}
                  </p>
                </motion.li>
              ))}
            </ol>
          </section>
        ))}

        <p className="text-center font-mono text-paper-muted text-[10px] tracking-wider opacity-60 mt-4">
          — THE CASE IS NEVER TRULY CLOSED —
        </p>
      </main>
    </motion.div>
  )
}
