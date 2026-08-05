import { motion } from 'framer-motion'
import { Users, LayoutGrid, Sparkles, Search, Timer } from 'lucide-react'
import type { Puzzle, GameMode } from '../core/types'
import type { CaseRecord } from '../hooks/useGame'
import ThemeToggle from './ThemeToggle'

interface Props {
  puzzles: Puzzle[]
  completedIds: string[]
  records: Record<string, CaseRecord>
  mode: GameMode
  onSetMode: (m: GameMode) => void
  onSelect: (id: string) => void
  onOpenReleases: () => void
  resolvedTheme: string
  onToggleTheme: () => void
}

function fmt(s: number) { return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }

// Map each difficulty label to its CSS token slug.
// Two variants are available in theme.css for each slug:
//   --diff-<slug>       decorative fill (rails, card spine, CSS custom property fed to color-mix hover rules)
//   --diff-<slug>-text  AA-safe foreground text (>= 4.5:1 contrast in both light and dark themes)
const DIFF_TOKEN: Record<string, string> = {
  'Very Easy': 'very-easy', Easy: 'easy', Medium: 'medium', Hard: 'hard', Expert: 'expert',
}
const diffFill = (d: string) => `var(--diff-${DIFF_TOKEN[d]})`
const diffText = (d: string) => `var(--diff-${DIFF_TOKEN[d]}-text)`

const DIFF_ORDER = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Expert'] as const

export default function HomeScreen({ puzzles, completedIds, records, mode, onSetMode, onSelect, onOpenReleases, resolvedTheme, onToggleTheme }: Props) {
  const solvedCount = completedIds.filter(id => puzzles.some(p => p.id === id)).length
  const bestTimes = puzzles.map(p => records[p.id]?.bestSeconds).filter((v): v is number => v != null)
  const fastest = bestTimes.length ? Math.min(...bestTimes) : null
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col min-h-screen bg-bg-deep"
    >
      {/* Atmosphere: a warm pool of light behind the crest falling off into the
          corners, plus fine grain. Flat near-black read as "unfinished dark
          theme" rather than "noir". Both layers are inert and theme-aware. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% 0%, color-mix(in srgb, var(--color-accent) 13%, transparent), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter><rect width="140" height="140" filter="url(#n)"/></svg>'
          )}")`,
        }}
      />
      <div className="relative z-10 pt-safe flex items-center justify-between px-4 pt-3">
        <button onClick={onOpenReleases} className="focus-ring text-paper-muted text-xs font-sans tracking-wide hover:text-accent-text transition-colors px-1 py-1">
          What&rsquo;s new
        </button>
        <ThemeToggle resolved={resolvedTheme} onToggle={onToggleTheme} />
      </div>

      <header className="z-10 flex flex-col items-center pt-5 pb-7 px-6 relative">
        {/* Detective badge / seal */}
        <div className="relative mb-3">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* outer dashed ring */}
            <circle cx="40" cy="40" r="37" stroke="var(--color-accent)" strokeOpacity="0.38" strokeWidth="1.5" strokeDasharray="4 3.5"/>
            {/* inner solid ring */}
            <circle cx="40" cy="40" r="30" stroke="var(--color-accent)" strokeOpacity="0.55" strokeWidth="1.8"/>
            {/* magnifying glass */}
            <circle cx="34" cy="34" r="12" stroke="var(--color-accent)" strokeOpacity="0.85" strokeWidth="3" fill="none"/>
            <circle cx="34" cy="34" r="7" fill="var(--color-accent)" fillOpacity="0.12"/>
            <line x1="43" y1="43" x2="54" y2="54" stroke="var(--color-accent)" strokeOpacity="0.85" strokeWidth="4" strokeLinecap="round"/>
            {/* crosshair inside lens */}
            <line x1="34" y1="28" x2="34" y2="40" stroke="var(--color-accent)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="28" y1="34" x2="40" y2="34" stroke="var(--color-accent)" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {/* ambient glow */}
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: '0 0 40px 8px var(--color-accent)', opacity: 0.08 }}/>
        </div>

        <span className="text-[10px] tracking-[0.32em] uppercase font-sans" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.32em' }}>
          A Game of Murder &amp; Deduction
        </span>

        <h1
          className="font-display font-bold tracking-tight mt-1 leading-none"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 3.4rem)',
            color: 'var(--color-text-primary)',
            textShadow: '0 2px 24px color-mix(in srgb, var(--color-accent) 40%, transparent)',
          }}
        >
          ALIBI
        </h1>

        {/* ornamental divider */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent))' }}/>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1 L8.8 5.2 L13 7 L8.8 8.8 L7 13 L5.2 8.8 L1 7 L5.2 5.2 Z" fill="var(--color-accent)" fillOpacity="0.75"/>
          </svg>
          <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, var(--color-accent))' }}/>
        </div>
      </header>

      {/* Mode selector */}
      <div className="relative z-10 px-4 mb-4 w-full max-w-md mx-auto">
        <div className="flex rounded-xl border border-br-thin bg-bg-panel p-1 gap-1">
          <ModeBtn active={mode === 'classic'} onClick={() => onSetMode('classic')}
            icon={<Sparkles size={14} />} title="Classic"
            desc="Place & submit" />
          <ModeBtn active={mode === 'detective'} onClick={() => onSetMode('detective')}
            icon={<Search size={14} />} title="Detective"
            desc="Draft · lock · deduce" />
        </div>
      </div>

      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-8 w-full max-w-3xl mx-auto">
        {DIFF_ORDER.map(diff => {
          const group = puzzles.filter(p => p.difficulty === diff)
          if (!group.length) return null
          const solvedInGroup = group.filter(p => completedIds.includes(p.id)).length
          return (
            <section key={diff} className="mb-6">
              {/* Difficulty divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${diffFill(diff)})` }} />
                <h2
                  className="font-display font-bold text-sm uppercase tracking-[0.18em]"
                  style={{ color: diffText(diff) }}
                >
                  {diff}
                </h2>
                <span className="text-paper-muted text-[10px] font-sans">{solvedInGroup}/{group.length}</span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${diffFill(diff)})` }} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((p) => {
                  const solved = completedIds.includes(p.id)
                  return (
                    // Plain buttons (no per-card entry animation) so toggling Classic ↔
                    // Detective never re-triggers a staggered fade/flicker.
                    <button
                      key={p.id}
                      onClick={() => onSelect(p.id)}
                      className="case-card focus-ring group relative text-left rounded-xl border border-br-thin bg-bg-panel overflow-hidden"
                      style={{ ['--diff' as string]: diffFill(p.difficulty) }}
                    >
                      {/* Difficulty reads as a spine down the edge of a file,
                          not a stripe pinned to the top of a web card. */}
                      <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: diffFill(p.difficulty) }} />

                      <div className="pl-4 pr-3.5 py-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-[9px] tracking-[0.22em] uppercase font-sans font-semibold"
                            style={{ color: diffText(p.difficulty) }}
                          >
                            {p.caseNumber}
                          </span>
                          {solved && (
                            <span
                              className="text-[9px] font-display font-bold uppercase tracking-[0.14em] rounded-sm px-1.5 py-[3px] leading-none"
                              style={{
                                color: 'var(--color-accent-text)',
                                border: '1px solid color-mix(in srgb, var(--color-accent) 55%, transparent)',
                                background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)',
                              }}
                            >
                              Closed
                            </span>
                          )}
                        </div>

                        <h2 className="font-display text-paper text-[17px] font-bold leading-[1.15] tracking-[-0.01em] mb-2.5">
                          {p.title}
                        </h2>

                        <div className="flex items-center gap-3 text-paper-muted text-[11px] font-sans">
                          <span className="flex items-center gap-1"><LayoutGrid size={12} />{p.size}×{p.size}</span>

                          {/* The cast, as accent chips. Real portraits would be
                              ~150 DiceBear API requests across the catalog —
                              these carry the same "who's in this case" signal
                              for free. */}
                          <span className="flex items-center gap-[3px]" title={`${p.people.length} people`}>
                            <Users size={12} className="mr-0.5" />
                            {p.people.map(person => (
                              <span
                                key={person.id}
                                className="rounded-full"
                                style={{
                                  width: 6, height: 6,
                                  backgroundColor: person.accent,
                                  opacity: person.isVictim ? 0.35 : 1,
                                  boxShadow: person.isVictim ? 'none' : `0 0 4px ${person.accent}66`,
                                }}
                              />
                            ))}
                          </span>

                          {records[p.id] && (
                            <span className="flex items-center gap-1 text-accent-text ml-auto tabular-nums"><Timer size={12} />{fmt(records[p.id].bestSeconds)}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </main>

      <footer className="pb-safe pb-6 flex justify-center gap-4">
        <span className="text-paper-muted text-[10px] tracking-wider font-sans opacity-70">
          {solvedCount}/{puzzles.length} cases solved
        </span>
        {fastest != null && (
          <span className="text-paper-muted text-[10px] tracking-wider font-sans opacity-70 flex items-center gap-1">
            <Timer size={11} /> best {fmt(fastest)}
          </span>
        )}
      </footer>
    </motion.div>
  )
}

function ModeBtn({ active, onClick, icon, title, desc }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string
}) {
  return (
    <button onClick={onClick}
      className="focus-ring flex-1 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors"
      style={{
        background: active ? 'color-mix(in srgb, var(--color-accent) 16%, transparent)' : 'transparent',
        color: active ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
        boxShadow: active ? 'inset 0 0 0 1px var(--color-accent)' : undefined,
      }}>
      {icon}
      <span className="text-left">
        <span className="block font-display font-semibold text-xs leading-tight">{title}</span>
        <span className="block text-[10px] font-sans opacity-80 leading-tight">{desc}</span>
      </span>
    </button>
  )
}
