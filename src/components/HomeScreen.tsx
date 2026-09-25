import { motion } from 'framer-motion'
import { Users, LayoutGrid, Sparkles, Search, Timer, ArrowLeft, Building2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Puzzle, Difficulty, GameMode } from '../core/types'
import { filterCases } from '../core/ux'
import type { InProgressSummary } from '../core/ux'
import type { CaseRecord } from '../hooks/useGame'
import ThemeToggle from './ThemeToggle'
import { dailyPuzzle, loadStreak, streakIsLive, computeBadges } from '../core/daily'
import '../styles/site-home.css'

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

const DIFF_TOKEN: Record<string, string> = {
  'Very Easy': 'very-easy', Easy: 'easy', Medium: 'medium', Hard: 'hard', Expert: 'expert',
  Master: 'master',
}
const diffFill = (d: string) => `var(--diff-${DIFF_TOKEN[d]})`
const diffText = (d: string) => `var(--diff-${DIFF_TOKEN[d]}-text)`

const DIFF_ORDER: Difficulty[] = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Expert', 'Master']

// Grid sizes associated with each difficulty level; derived at render time from
// the actual puzzle catalog so this stays accurate if tiers shift.
function tierGridSize(puzzles: Puzzle[], diff: Difficulty): string {
  const p = puzzles.find(x => x.difficulty === diff)
  return p ? `${p.size}×${p.size}` : '—'
}

// Floor count for a tier; derived from the catalog, never hardcoded per
// difficulty — the generator decides difficulty-to-floors, not this view.
function tierFloors(puzzles: Puzzle[], diff: Difficulty): number {
  const p = puzzles.find(x => x.difficulty === diff)
  return p ? (p.floors ?? 1) : 1
}

type StoreyFilter = 'all' | 'one' | 'two'

export default function HomeScreen({
  puzzles, completedIds, records, mode, onSetMode, onSelect,
  onOpenReleases, resolvedTheme, onToggleTheme, inProgress = null, onResume,
}: Props) {
  // 'landing' = Screen 1; any Difficulty string = Screen 2 (case list for that tier)
  const [view, setView] = useState<'landing' | Difficulty>('landing')
  const [storeyFilter, setStoreyFilter] = useState<StoreyFilter>('all')

  const resumablePuzzle = inProgress ? puzzles.find(puzzle => puzzle.id === inProgress.id) : undefined

  function resumeCase() {
    if (!inProgress) return
    if (onResume) onResume(inProgress.id, inProgress.mode)
    else onSelect(inProgress.id)
  }

  if (view !== 'landing') {
    return (
      <TierScreen
        difficulty={view}
        puzzles={puzzles}
        completedIds={completedIds}
        records={records}
        mode={mode}
        onSetMode={onSetMode}
        onSelect={onSelect}
        onBack={() => setView('landing')}
        resolvedTheme={resolvedTheme}
        onToggleTheme={onToggleTheme}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="desk-surface site-home relative flex flex-col min-h-screen"
    >
      <div
        data-testid="home-content-cap"
        className="site-home__content relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen"
      >

        <nav aria-label="Main navigation" className="site-home__masthead pt-safe flex items-center justify-between">
          <a href="#main" className="site-home__wordmark focus-ring" aria-label="Alibi, home">ALIBI<span> / MURDOKU CASE FILES</span></a>
          <button
            onClick={onOpenReleases}
            className="site-home__updates focus-ring"
          >
            What&rsquo;s new <span aria-hidden>↗</span>
          </button>
          <ThemeToggle resolved={resolvedTheme} onToggle={onToggleTheme} />
        </nav>

        <main id="main" className="site-home__main">
          <section aria-labelledby="home-title" className="site-home__hero">
            <div className="site-home__intro">
              <p className="site-home__eyebrow"><span aria-hidden>01</span> The reconstruction desk</p>
              <h1 id="home-title" className="site-home__title">ALIBI<span>.</span></h1>
              <p className="site-home__dek">Every room holds a reason.</p>
              <p className="site-home__rule">Read the witness accounts. Rebuild the night, then find who was alone with the victim.</p>
              <div className="site-home__hero-actions">
                <a className="site-home__browse-action focus-ring" href="#tiers-heading">Browse cases <span aria-hidden>↗</span></a>
                <a className="site-home__how-link" href="#how-it-works">How to play <span aria-hidden>↓</span></a>
              </div>
            </div>

            <div className="site-home__dispatch">
              <figure className="site-home__scene">
                <img src="/assets/site-home-dollhouse-cutout.png" alt="Isometric view of the rooms in a Murdoku house." />
                <figcaption><span aria-hidden>◆</span> The house is part of the evidence</figcaption>
              </figure>
              {resumablePuzzle && inProgress ? (
                <section data-testid="continue-strip" aria-labelledby="continue-reconstruction-heading" className="site-home__dispatch-sheet">
                  <div>
                    <p className="site-home__eyebrow"><span aria-hidden>↳</span> Resume investigation</p>
                    <h2 id="continue-reconstruction-heading">{resumablePuzzle.title}</h2>
                    <p className="site-home__dispatch-meta">
                      {inProgress.placedCount} / {resumablePuzzle.people.length} placed <i aria-hidden>·</i> {fmt(inProgress.elapsedSeconds)} <i aria-hidden>·</i> {inProgress.mode === 'detective' ? 'Detective' : 'Classic'}
                    </p>
                  </div>
                  <button type="button" data-testid="continue-reconstruction" onClick={resumeCase} className="site-home__primary-action focus-ring">
                    Continue reconstruction <span aria-hidden>→</span>
                  </button>
                </section>
              ) : (
                <DailyPanel puzzles={puzzles} completedIds={completedIds} records={records} onSelect={onSelect} />
              )}
              <div className="site-home__progress" aria-label={`${completedIds.filter(id => puzzles.some(p => p.id === id)).length} of ${puzzles.length} cases solved`}>
                <div className="site-home__progress-label"><span>Casebook progress</span><span>{completedIds.filter(id => puzzles.some(p => p.id === id)).length} / {puzzles.length}</span></div>
                <div className="site-home__progress-track" role="progressbar" aria-label="Cases solved" aria-valuemin={0} aria-valuemax={puzzles.length} aria-valuenow={completedIds.filter(id => puzzles.some(p => p.id === id)).length}>
                  <span style={{ width: `${puzzles.length ? Math.min(100, (completedIds.filter(id => puzzles.some(p => p.id === id)).length / puzzles.length) * 100) : 0}%` }} />
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" aria-labelledby="how-heading" className="site-home__steps">
            <div className="site-home__section-heading"><p className="site-home__eyebrow"><span aria-hidden>02</span> The method</p><h2 id="how-heading">How it works</h2></div>
            <ol>
              <li><span>01</span><p>Read witness clues about rooms, objects and relationships.</p></li>
              <li><span>02</span><p>Place each person once across every row and column.</p></li>
              <li><span>03</span><p>Find the suspect left alone with the victim.</p></li>
            </ol>
          </section>
        </main>

        {/* ── Difficulty tiers — main navigation ── */}
        <section aria-labelledby="tiers-heading" className="site-home__tiers">
          <div className="site-home__tiers-heading">
            <div className="site-home__section-heading"><p className="site-home__eyebrow"><span aria-hidden>03</span> The case archive</p><h2 id="tiers-heading">Case tiers</h2></div>
            {/* Storey filter — three-state button group. Matches the ModeBtn
                interaction pattern: no native radio, each button carries
                aria-pressed so assistive technology reads the active state.
                Touch targets are 44px minimum. */}
            <div
              role="group"
              aria-label="Filter tiers by storey count"
              className="site-home__filter"
            >
              {([
                { value: 'all', label: 'All' },
                { value: 'one', label: '1 floor' },
                { value: 'two', label: '2 floors' },
              ] as { value: StoreyFilter; label: string }[]).map(({ value, label }) => {
                const active = storeyFilter === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStoreyFilter(value)}
                    className={`site-home__filter-button focus-ring${active ? ' is-active' : ''}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="site-home__tier-grid">
            {(() => {
              const visibleDiffs = DIFF_ORDER.filter(diff => {
                const tierPuzzles = puzzles.filter(p => p.difficulty === diff)
                if (!tierPuzzles.length) return false
                const floors = tierFloors(puzzles, diff)
                if (storeyFilter === 'one') return floors < 2
                if (storeyFilter === 'two') return floors >= 2
                return true
              })
              if (!visibleDiffs.length) {
                return (
                    <p
                    className="site-home__empty"
                    role="status"
                  >
                    No tiers match that filter.
                  </p>
                )
              }
              return visibleDiffs.map(diff => {
                const tierPuzzles = puzzles.filter(p => p.difficulty === diff)
                const solvedInTier = tierPuzzles.filter(p => completedIds.includes(p.id)).length
                const gridSize = tierGridSize(puzzles, diff)
                const floors = tierFloors(puzzles, diff)
                const storeyLabel = floors >= 2 ? '2 floors' : '1 floor'
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setView(diff)}
                    className="site-home__tier focus-ring"
                    aria-label={`${diff} cases, ${gridSize} grid, ${storeyLabel}, ${solvedInTier} of ${tierPuzzles.length} solved`}
                  >
                    <div className="site-home__tier-main">
                      {/* Difficulty colour swatch — same visual language as card spine */}
                      <div
                        className="site-home__tier-mark shrink-0"
                        style={{ background: diffFill(diff) }}
                        aria-hidden
                      />
                      <span
                        className="site-home__tier-name"
                        style={{ color: diffText(diff) }}
                      >
                        {diff}
                      </span>
                      <span
                        className="site-home__tier-size"
                      >
                        {gridSize}
                      </span>
                      {/* Storey chip — text carries meaning, icon is decorative.
                          Only shown when there are two storeys to avoid noise on
                          every single-storey row. */}
                      {floors >= 2 && (
                        <span
                          className="site-home__tier-floors"
                        >
                          <Building2 size={11} aria-hidden />
                          {storeyLabel}
                        </span>
                      )}
                    </div>
                    <span className="site-home__tier-count">
                      <span>{solvedInTier}</span><span aria-hidden> / </span>{tierPuzzles.length}<small>closed</small>
                    </span>
                    <span className="site-home__tier-arrow" aria-hidden>→</span>
                  </button>
                )
              })
            })()}
          </div>
        </section>

        {/* ── Achievements shelf ── */}
        <BadgeShelf puzzles={puzzles} completedIds={completedIds} records={records} />

        {/* Footer */}
        <footer className="site-home__footer pb-safe">
          {(() => {
            const solvedCount = completedIds.filter(id => puzzles.some(p => p.id === id)).length
            const bestTimes = puzzles.map(p => records[p.id]?.bestSeconds).filter((v): v is number => v != null)
            const fastest = bestTimes.length ? Math.min(...bestTimes) : null
            return (
              <>
                <span>
                  {solvedCount}/{puzzles.length} cases solved
                </span>
                {fastest != null && (
                  <span>
                    <Timer size={11} /> best {fmt(fastest)}
                  </span>
                )}
              </>
            )
          })()}
        </footer>

      </div>
    </motion.div>
  )
}

// ── Screen 2: Case list for one difficulty tier ─────────────────────────────

interface TierScreenProps {
  difficulty: Difficulty
  puzzles: Puzzle[]
  completedIds: string[]
  records: Record<string, CaseRecord>
  mode: GameMode
  onSetMode: (m: GameMode) => void
  onSelect: (id: string) => void
  onBack: () => void
  resolvedTheme: string
  onToggleTheme: () => void
}

function TierScreen({
  difficulty, puzzles, completedIds, records, mode, onSetMode, onSelect, onBack, resolvedTheme, onToggleTheme,
}: TierScreenProps) {
  const [query, setQuery] = useState('')

  const tierPuzzles = useMemo(() => puzzles.filter(p => p.difficulty === difficulty), [puzzles, difficulty])
  const matchingPuzzles = useMemo(() => filterCases(tierPuzzles, query), [tierPuzzles, query])

  const solvedInTier = tierPuzzles.filter(p => completedIds.includes(p.id)).length
  const gridSize = tierPuzzles[0] ? `${tierPuzzles[0].size}×${tierPuzzles[0].size}` : '—'
  const nextCaseId = tierPuzzles.find(puzzle => !completedIds.includes(puzzle.id))?.id

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="desk-surface site-tier relative flex flex-col min-h-screen"
    >
      <div className="site-tier__content relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col min-h-screen">
        <nav aria-label="Case library navigation" className="site-tier__masthead pt-safe">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to landing"
            className="site-tier__back focus-ring"
          >
            <ArrowLeft size={16} aria-hidden />
            <span>All cases</span>
          </button>

          <div className="site-tier__heading">
            <p className="site-home__eyebrow"><span aria-hidden>Case tier</span> <span aria-hidden>/</span> {gridSize} grid</p>
            <h1 style={{ color: diffText(difficulty) }}>{difficulty}</h1>
            <p className="site-tier__summary">{solvedInTier} of {tierPuzzles.length} cases closed</p>
          </div>
          <div className="site-tier__completion" aria-hidden>
            <span>{tierPuzzles.length ? Math.round((solvedInTier / tierPuzzles.length) * 100) : 0}%</span>
            <small>complete</small>
          </div>
          <ThemeToggle resolved={resolvedTheme} onToggle={onToggleTheme} />
        </nav>

        <section aria-label="Choose a play mode" className="site-tier__mode-section">
          <p className="site-home__eyebrow">Choose how to investigate</p>
          <div className="site-tier__mode-options">
            <ModeBtn active={mode === 'classic'} onClick={() => onSetMode('classic')}
              icon={<Sparkles size={14} aria-hidden />} title="Classic"
              desc="Place freely · 3 hints" />
            <ModeBtn active={mode === 'detective'} onClick={() => onSetMode('detective')}
              icon={<Search size={14} aria-hidden />} title="Detective"
              desc="Draft & eliminate · no hints" />
          </div>
        </section>

        <section aria-labelledby="case-search-heading" className="site-tier__search">
          <div className="site-tier__search-head">
            <div>
              <p className="site-home__eyebrow">Case archive</p>
              <h2 id="case-search-heading">Find a case</h2>
            </div>
            <p data-testid="case-result-count" aria-live="polite" className="site-tier__result-count">
              {matchingPuzzles.length} matching {matchingPuzzles.length === 1 ? 'case' : 'cases'}
            </p>
          </div>
          <label htmlFor="case-search" className="sr-only">Search cases</label>
          <div className="site-tier__search-field">
            <Search size={17} aria-hidden />
            <input
              id="case-search"
              data-testid="home-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.currentTarget.value)}
              placeholder="Search cases, rooms, or suspects"
              className="focus-ring"
              style={{ minHeight: 44 }}
            />
          </div>
        </section>

        <main className="site-tier__cases">
          {matchingPuzzles.length === 0 && (
            <p className="site-home__empty" role="status">
              No cases match that search.
            </p>
          )}

          <div className="site-tier__case-list">
            {matchingPuzzles.map((p) => {
              const solved = completedIds.includes(p.id)
              const isNext = !solved && p.id === nextCaseId
              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`site-tier__case focus-ring${isNext ? ' is-next' : ''}${solved ? ' is-solved' : ''}`}
                  style={{ ['--case-diff' as string]: diffFill(p.difficulty), minHeight: 44 }}
                  aria-label={`${p.caseNumber}: ${p.title}, ${p.size} by ${p.size}, ${(p.floors ?? 1)} floor${(p.floors ?? 1) === 1 ? '' : 's'}, ${p.people.length} people, ${solved ? 'completed' : isNext ? 'next case' : 'open case'}${records[p.id] ? `, best time ${fmt(records[p.id].bestSeconds)}` : ''}`}
                >
                  <span className="site-tier__case-kicker">{p.caseNumber}</span>
                  <span className="site-tier__case-state"><span className="site-tier__case-state-mark" aria-hidden />{solved ? 'Case closed' : isNext ? 'Next in sequence' : 'Ready to open'}</span>
                  <h2>{p.title}</h2>
                  <span className="site-tier__case-meta">
                    <span><LayoutGrid size={13} aria-hidden />{p.size}×{p.size}</span>
                    {(p.floors ?? 1) >= 2 && <span><Building2 size={13} aria-hidden />{p.floors} floors</span>}
                    <span title={`${p.people.length} people`}><Users size={13} aria-hidden />{p.people.length} people</span>
                    {records[p.id] && <span className="site-tier__best-time"><Timer size={12} aria-hidden />{fmt(records[p.id].bestSeconds)}</span>}
                  </span>
                  <span className="site-tier__case-arrow" aria-hidden>→</span>
                </button>
              )
            })}
          </div>
        </main>
        <footer className="site-tier__footer"><span>{difficulty} case files</span><span>{solvedInTier} closed</span></footer>
      </div>
    </motion.div>
  )
}

// ── ModeBtn ──────────────────────────────────────────────────────────────────

function ModeBtn({ active, onClick, icon, title, desc }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`site-tier__mode-button focus-ring${active ? ' is-active' : ''}`}
    >
      {icon}
      <span className="text-left">
        <span className="block font-display font-bold text-xs leading-tight tracking-wide uppercase">{title}</span>
        <span className="block text-[10px] font-mono opacity-70 leading-tight">{desc}</span>
      </span>
    </button>
  )
}

// ── DailyPanel ───────────────────────────────────────────────────────────────

function DailyPanel({
  puzzles,
  completedIds,
  records,
  onSelect,
}: {
  puzzles: Puzzle[]
  completedIds: string[]
  records: Record<string, CaseRecord>
  onSelect: (id: string) => void
}) {
  const daily = useMemo(() => dailyPuzzle(puzzles), [puzzles])
  const streak = useMemo(() => loadStreak(), [])
  const live = useMemo(() => streakIsLive(streak), [streak])

  if (!daily) return null

  const solved = completedIds.includes(daily.id)

  return (
    <section
      aria-labelledby="daily-case-heading"
      className="site-home__daily"
    >
      <div className="site-home__daily-body">
        <div className="min-w-0">
          <p className="site-home__daily-label">
            {live && streak.current > 1
              ? `Today's case · ${streak.current}-day streak`
              : "Today's case"}
          </p>
          <h2
            id="daily-case-heading"
            className="site-home__daily-title"
          >
            {daily.title}
          </h2>
          <p className="site-home__daily-meta">
            {daily.caseNumber} · {daily.difficulty} · {daily.size}×{daily.size}
            {/* The daily is always drawn from the two-storey pool, so say so
                here as well as on the tier rows and case cards — otherwise the
                one case most players open is the single place the second floor
                goes unannounced. Derived from the puzzle, never hardcoded. */}
            {(daily.floors ?? 1) >= 2 && <> · {daily.floors} floors</>}
            {solved && (
              <span
                className="site-home__closed-tag ml-2"
              >
                CLOSED
              </span>
            )}
          </p>
          {records[daily.id] && (
            <p className="site-home__daily-best">
              <Timer size={11} aria-hidden /> best {fmt(records[daily.id].bestSeconds)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onSelect(daily.id)}
          className="site-home__primary-action focus-ring"
          aria-label={solved ? "Play today's case again" : "Play today's case"}
        >
          {solved ? 'Play again' : 'Play'}
        </button>
      </div>
    </section>
  )
}

// ── BadgeShelf ───────────────────────────────────────────────────────────────

function BadgeShelf({
  puzzles,
  completedIds,
  records,
}: {
  puzzles: Puzzle[]
  completedIds: string[]
  records: Record<string, CaseRecord>
}) {
  const [open, setOpen] = useState(false)
  const streak = useMemo(() => loadStreak(), [])
  const badges = useMemo(
    () => computeBadges({ puzzles, completedIds, records, streak }),
    [puzzles, completedIds, records, streak],
  )
  const earnedCount = badges.filter(b => b.earned).length

  return (
    <div data-testid="badge-shelf" className="site-home__badges">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="badge-shelf-items"
        className="site-home__badges-toggle focus-ring"
      >
        <span className="site-home__badges-title">
          Achievements
        </span>
        <span className="site-home__badges-count">
          {earnedCount}/{badges.length}
          <span
            aria-hidden
            className="font-mono text-[10px]"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.2s' }}
          >
            ▾
          </span>
        </span>
      </button>

      {open && (
        <div id="badge-shelf-items" className="site-home__badge-list">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`site-home__badge${badge.earned ? ' is-earned' : ' is-unearned'}`}
            >
              <span
                aria-hidden
                className="site-home__badge-mark"
                style={{ color: badge.earned ? 'var(--home-brass)' : 'var(--home-muted)' }}
              >
                {badge.earned ? '◆' : '◇'}
              </span>
              <div className="min-w-0">
                <p
                  className="site-home__badge-name"
                >
                  {badge.name}
                </p>
                <p
                  className="site-home__badge-description"
                >
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
