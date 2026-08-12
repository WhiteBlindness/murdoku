import { motion } from 'framer-motion'
import { Users, LayoutGrid, Sparkles, Search, Timer } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Puzzle, Difficulty, GameMode } from '../core/types'
import { filterCases } from '../core/ux'
import type { InProgressSummary } from '../core/ux'
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
  inProgress?: InProgressSummary | null
  onResume?: (id: string, mode: GameMode) => void
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

const DIFF_ORDER: Difficulty[] = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Expert']

export default function HomeScreen({ puzzles, completedIds, records, mode, onSetMode, onSelect, onOpenReleases, resolvedTheme, onToggleTheme, inProgress = null, onResume }: Props) {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All')
  const matchingPuzzles = useMemo(() => filterCases(puzzles, query, difficulty), [puzzles, query, difficulty])
  const solvedCount = completedIds.filter(id => puzzles.some(p => p.id === id)).length
  const bestTimes = puzzles.map(p => records[p.id]?.bestSeconds).filter((v): v is number => v != null)
  const fastest = bestTimes.length ? Math.min(...bestTimes) : null
  const resumablePuzzle = inProgress ? puzzles.find(puzzle => puzzle.id === inProgress.id) : undefined

  function resumeCase() {
    if (!inProgress) return
    if (onResume) onResume(inProgress.id, inProgress.mode)
    else onSelect(inProgress.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="desk-surface relative flex flex-col min-h-screen"
    >
      {/* Atmosphere: a warm pool of light behind the crest falling off into the
          corners, plus fine grain. Flat near-black read as "unfinished dark
          theme" rather than "noir". Both layers are inert and theme-aware.
          These stay full-bleed — they ARE the desk surface behind the files. */}
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

      {/* ── Content column: bounded measure so wide screens stay purposeful ── */}
      {/* max-w-[1600px] is generous enough for a 5-col card grid at 1920px     */}
      {/* while keeping the hero text from floating in space. The atmosphere    */}
      {/* layers above live outside this container so they stay full-bleed.     */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col min-h-screen">
        <div className="pt-safe flex items-center justify-between pt-3">
          <button onClick={onOpenReleases} className="focus-ring min-h-11 text-paper-muted text-xs font-sans tracking-wide hover:text-accent-text transition-colors px-1 py-1" style={{ minHeight: 44 }}>
            What&rsquo;s new
          </button>
          <ThemeToggle resolved={resolvedTheme} onToggle={onToggleTheme} />
        </div>

      <header className="flex flex-col items-center pt-2 pb-4 px-6 relative">
        {/* Detective badge / seal */}
        <div className="relative mb-3">
          <svg width="58" height="58" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        <h1
          className="font-display font-bold tracking-tight mt-0.5 leading-none"
          style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            color: 'var(--color-text-primary)',
            textShadow: '0 2px 24px color-mix(in srgb, var(--color-accent) 40%, transparent)',
          }}
        >
          ALIBI
        </h1>

        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">Continuity case index</p>
      </header>

      {/* Mode selector — bounded to readable width, centred within the column */}
      <div className="mb-4 w-full max-w-md mx-auto">
        <div className="flex rounded-none border border-border-strong bg-bg-surface p-1 gap-1">
          <ModeBtn active={mode === 'classic'} onClick={() => onSetMode('classic')}
            icon={<Sparkles size={14} />} title="Classic"
            desc="Place & submit" />
          <ModeBtn active={mode === 'detective'} onClick={() => onSetMode('detective')}
            icon={<Search size={14} />} title="Detective"
            desc="Draft · lock · deduce" />
        </div>
      </div>

      {/* Case index — uses the full column width purposefully: 3 cols on md,
          4 on xl, 5 on 2xl. On a 1920 monitor that's ~5 files spread across
          the desk rather than a thin strip in the centre. */}
      {resumablePuzzle && inProgress && (
        <section
          data-testid="continue-strip"
          aria-labelledby="continue-reconstruction-heading"
          className="mb-4 border border-accent-strong bg-bg-surface p-3 sm:p-4"
          style={{ boxShadow: 'var(--shadow-cut)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-text">In progress</p>
              <h2 id="continue-reconstruction-heading" className="mt-1 truncate font-display text-lg font-bold uppercase tracking-[0.04em] text-text-primary">
                {resumablePuzzle.title}
              </h2>
              <p className="mt-1 font-mono text-[11px] text-text-secondary">
                {inProgress.placedCount} / {resumablePuzzle.people.length} placed · {fmt(inProgress.elapsedSeconds)} · {inProgress.mode === 'detective' ? 'Detective' : 'Classic'}
              </p>
            </div>
            <button
              type="button"
              data-testid="continue-reconstruction"
              onClick={resumeCase}
              className="focus-ring min-h-11 border border-accent-strong bg-accent px-4 font-sans text-xs font-bold uppercase tracking-[0.12em] text-on-accent"
              style={{ minHeight: 44 }}
            >
              Continue reconstruction
            </button>
          </div>
        </section>
      )}

      <section aria-labelledby="case-search-heading" className="mb-5 border border-border-strong bg-bg-surface p-3 sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 id="case-search-heading" className="font-display text-sm font-bold uppercase tracking-[0.14em] text-text-primary">Find a case</h2>
            <label htmlFor="case-search" className="sr-only">Search cases</label>
            <div className="relative mt-2">
              <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="case-search"
                data-testid="home-search"
                type="search"
                value={query}
                onChange={event => setQuery(event.currentTarget.value)}
                placeholder="Search cases, rooms, or suspects"
                className="h-11 w-full border border-border-strong bg-bg-inset pl-10 pr-3 font-mono text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent-strong"
                style={{ minHeight: 44 }}
              />
            </div>
          </div>
          <p data-testid="case-result-count" aria-live="polite" className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
            {matchingPuzzles.length} matching {matchingPuzzles.length === 1 ? 'case' : 'cases'}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter cases by difficulty">
          <DifficultyButton active={difficulty === 'All'} onClick={() => setDifficulty('All')} label="All" />
          {DIFF_ORDER.map(item => (
            <DifficultyButton key={item} active={difficulty === item} onClick={() => setDifficulty(item)} label={item} />
          ))}
        </div>
      </section>

      <main className="flex-1 overflow-y-auto pb-8">
        {matchingPuzzles.length === 0 && (
          <p className="border border-border-strong bg-bg-surface p-6 text-center font-mono text-sm text-text-secondary" role="status">
            No cases match that search or difficulty.
          </p>
        )}
        {DIFF_ORDER.map(diff => {
          const group = matchingPuzzles.filter(p => p.difficulty === diff)
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

              {/* Column counts chosen against the DATA, not by eyeballing the
                  gap: difficulty groups hold 6 cases (Very Easy / Easy /
                  Medium), then 5 and 4. A 4- or 5-column grid strands a single
                  orphan card on its own row in every 6-case section. 3 divides
                  6 cleanly (3+3), and 6 lays a whole section out in one row. */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {group.map((p) => {
                  const solved = completedIds.includes(p.id)
                  return (
                    // Plain buttons (no per-card entry animation) so toggling Classic ↔
                    // Detective never re-triggers a staggered fade/flicker.
                    // border-border-strong: the card edge IS the interactive affordance
                    // (bg-surface vs bg-base is near-zero contrast), so it must meet
                    // WCAG 1.4.11 at 3.5:1 — that's border-strong, not border-subtle.
                    <button
                      key={p.id}
                      onClick={() => onSelect(p.id)}
                      className="case-card evidence-strip focus-ring group relative text-left rounded-none border border-border-strong overflow-hidden"
                      style={{ ['--diff' as string]: diffFill(p.difficulty), minHeight: 44 }}
                    >
                      {/* Difficulty spine: file-folder tab colour running the
                          full height of the left edge, like a coloured folder tab
                          in a physical evidence cabinet. */}
                      <div className="px-3.5 py-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          {/* Case number: typed evidence reference, font-mono */}
                          <span
                            className="text-[10px] tracking-[0.18em] uppercase font-mono"
                            style={{ color: diffText(p.difficulty) }}
                          >
                            {p.caseNumber}
                          </span>
                          {solved && (
                            /* Stamped-ink "CLOSED" — rectangular, no rounding,
                               slightly rotated to evoke a rubber-stamp over a
                               case file. Uses accent tokens, not a bright pill. */
                            <span
                              className="text-[9px] font-display font-bold uppercase tracking-[0.22em] px-1.5 py-[3px] leading-none"
                              style={{
                                color: 'var(--color-accent-text)',
                                border: '1px solid color-mix(in srgb, var(--color-accent) 60%, transparent)',
                                background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                                transform: 'rotate(-1.5deg)',
                                display: 'inline-block',
                              }}
                            >
                              CLOSED
                            </span>
                          )}
                        </div>

                        <h2 className="font-display text-[17px] font-bold leading-[1.15] tracking-[0.01em] mb-2.5 uppercase" style={{ color: '#19150F' }}>
                          {p.title}
                        </h2>

                        <div className="flex items-center gap-3 text-[11px] font-sans" style={{ color: '#4B4232' }}>
                          <span className="flex items-center gap-1"><LayoutGrid size={12} />{p.size}×{p.size}</span>

                          {/* The cast, as accent dots. Real portraits would be
                              ~150 DiceBear API requests across the catalog —
                              these carry the same "who's in this case" signal
                              for free. Victim dots are desaturated to mark
                              their role without a separate label. */}
                          <span className="flex items-center gap-[3px]" title={`${p.people.length} people`}>
                            <Users size={12} className="mr-0.5" />
                            {p.people.map(person => (
                              <span
                                key={person.id}
                                className="rounded-none"
                                style={{
                                  width: 6, height: 6,
                                  backgroundColor: person.accent,
                                  opacity: person.isVictim ? 0.30 : 1,
                                  boxShadow: person.isVictim ? 'none' : `0 0 3px ${person.accent}55`,
                                }}
                              />
                            ))}
                          </span>

                          {records[p.id] && (
                            /* Best time: typewriter readout — case-file data lives in mono */
                            <span className="flex items-center gap-1 text-accent-text ml-auto tabular-nums font-mono text-[10px]">
                              <Timer size={11} />{fmt(records[p.id].bestSeconds)}
                            </span>
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

      </div>{/* /content column */}
    </motion.div>
  )
}

function ModeBtn({ active, onClick, icon, title, desc }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string
}) {
  return (
    <button onClick={onClick}
      className="focus-ring flex-1 min-h-11 rounded-none px-3 py-2 flex items-center gap-2 transition-colors"
      style={{
        background: active ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)' : 'transparent',
        color: active ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
        /* border-strong: this is an unfilled button outline = the border IS the affordance */
        boxShadow: active ? 'inset 0 0 0 1px var(--color-border-strong)' : undefined,
        borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
        minHeight: 44,
      }}>
      {icon}
      <span className="text-left">
        <span className="block font-display font-bold text-xs leading-tight tracking-wide uppercase">{title}</span>
        <span className="block text-[10px] font-mono opacity-70 leading-tight">{desc}</span>
      </span>
    </button>
  )
}

function DifficultyButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="focus-ring h-11 w-11 border p-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors"
      style={{
        minHeight: 44,
        minWidth: 44,
        height: 44,
        width: 44,
        aspectRatio: '1 / 1',
        borderColor: active ? 'var(--color-accent-strong)' : 'var(--color-border-strong)',
        backgroundColor: active ? 'var(--color-accent)' : 'var(--color-bg-inset)',
        color: active ? 'var(--color-on-accent)' : 'var(--color-text-secondary)',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
      }}
    >
      {label}
    </button>
  )
}
