import { motion } from 'framer-motion'
import { CHANGELOG, groupByMonth, formatDay, type ChangeTag } from '../core/changelog'

interface Props {
  onBack: () => void
}

const TAG_COLOR: Record<ChangeTag, string> = {
  Feature: '#48C890',
  Improvement: '#C8922A',
  Fix: '#5888C8',
  Content: '#A870C8',
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
          className="focus-ring text-paper-muted text-sm font-typewriter tracking-wider flex items-center gap-1 px-1 py-1"
        >
          ← Back
        </button>
        <span className="text-paper-muted text-[10px] tracking-[0.2em] uppercase font-typewriter">
          Case Files
        </span>
      </div>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-br-box to-transparent" />

      <main className="flex-1 overflow-y-auto px-6 py-6 w-full max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="font-display text-2xl font-bold text-paper tracking-wide">
            Release Notes
          </h1>
          <p className="text-paper-dim text-sm mt-1 font-sans">
            Every update to Murdoku, newest first.
          </p>
        </header>

        {groups.map((group, gi) => (
          <section key={group.key} className="mb-8" aria-labelledby={`m-${group.key}`}>
            {/* Sticky month header for easy scanning */}
            <h2
              id={`m-${group.key}`}
              className="sticky top-0 z-10 bg-bg-deep/95 backdrop-blur-sm py-2 mb-2 font-typewriter text-[11px] tracking-[0.25em] uppercase text-gold border-b border-br-thin"
            >
              {group.label}
            </h2>

            <ol className="flex flex-col gap-4 list-none pl-0">
              {group.entries.map((entry, i) => (
                <motion.li
                  key={`${entry.date}-${entry.headline}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(gi * 3 + i, 8) * 0.04, duration: 0.3 }}
                  className="rounded-xl border border-br-thin bg-bg-panel px-4 py-3.5"
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {entry.tag && (
                        <span
                          className="text-[9px] font-typewriter uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{
                            color: TAG_COLOR[entry.tag],
                            backgroundColor: TAG_COLOR[entry.tag] + '1E',
                          }}
                        >
                          {entry.tag}
                        </span>
                      )}
                      <h3 className="font-display text-paper text-sm font-semibold leading-tight truncate">
                        {entry.headline}
                      </h3>
                    </div>
                    <time
                      dateTime={entry.date}
                      className="text-paper-muted text-[10px] font-typewriter tracking-wider flex-shrink-0"
                    >
                      {formatDay(entry.date)}
                    </time>
                  </div>
                  <p className="text-paper-dim text-[13px] leading-relaxed font-sans">
                    {entry.detail}
                  </p>
                </motion.li>
              ))}
            </ol>
          </section>
        ))}

        <p className="text-center text-paper-muted text-[10px] font-typewriter tracking-wider opacity-60 mt-4">
          — The case is never truly closed —
        </p>
      </main>
    </motion.div>
  )
}
