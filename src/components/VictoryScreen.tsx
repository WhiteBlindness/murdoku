import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BadgeCheck, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import type { Puzzle } from '../core/types'
import { roomIdAt } from '../core/engine'
import { getAllPuzzles } from '../core/catalog'
import { buildShareText, copyShareText } from '../core/share'
import { loadStreak } from '../core/daily'
import { resolveClueHighlights } from '../core/ux'
import type { ClueHighlight } from '../core/ux'
import ThemeToggle from './ThemeToggle'
import '../styles/site-victory.css'

interface Props {
  puzzle: Puzzle
  murderer: string
  timer: string
  /** Raw elapsed time. The share card should not be derived from the display
   *  string: a future change to the timer's format would silently corrupt it. */
  elapsedSeconds?: number
  hintsLeft: number
  completedIds: string[]
  onNext: () => void
  onPlayUnsolved: (id: string) => void
  onHome: () => void
  resolvedTheme?: string
  onToggleTheme?: () => void
}

export default function VictoryScreen({
  puzzle, murderer, timer, elapsedSeconds, hintsLeft, completedIds,
  onNext, onPlayUnsolved, onHome,
  resolvedTheme = 'dark', onToggleTheme = () => {},
}: Props) {
  const [showReplay, setShowReplay] = useState(false)
  const killer = puzzle.people.find(p => p.id === murderer)!
  const victim = puzzle.people.find(p => p.id === puzzle.victimId)!
  const room = puzzle.rooms.find(r => r.id === roomIdAt(puzzle, puzzle.solution[puzzle.victimId]))
  const allPuzzles = getAllPuzzles()
  const order = allPuzzles.map(p => p.id)
  const currentIndex = order.indexOf(puzzle.id)
  const nextPuzzle = allPuzzles[currentIndex + 1]
  const hasNext = currentIndex >= 0 && currentIndex < order.length - 1
  const unsolved = allPuzzles.find(p => !completedIds.includes(p.id) && p.id !== puzzle.id)
  const hasUnsolved = !hasNext && !!unsolved
  const reduceMotion = useReducedMotion()

  // The real elapsed seconds when the caller supplies them; parsing the MM:SS
  // display is only a fallback so the component still works standalone.
  const [timerM, timerS] = timer.split(':').map(Number)
  const seconds = elapsedSeconds ?? (timerM || 0) * 60 + (timerS || 0)
  const streak = loadStreak()
  const shareText = buildShareText({
    caseNumber: puzzle.caseNumber,
    difficulty: puzzle.difficulty,
    size: puzzle.size,
    seconds,
    hintsLeft,
    hintsTotal: 3,
    streak: streak.current > 1 ? streak.current : undefined,
  })

  return (
    <motion.main
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.28 }}
      data-testid="victory-screen"
      aria-labelledby="victory-title"
      className="site-victory"
    >
      <article className="site-victory__document">
        <header className="site-victory__masthead">
          <div className="site-victory__brand" aria-label="Alibi case file">
            <span className="site-victory__brand-mark" aria-hidden="true">A</span>
            <span>Alibi <span className="site-victory__brand-divider">/</span> Case file</span>
          </div>
          <div className="site-victory__masthead-tools">
            <p className="site-victory__case-ref">{puzzle.caseNumber}</p>
            <ThemeToggle resolved={resolvedTheme} onToggle={onToggleTheme} className="site-victory__theme-toggle" />
          </div>
        </header>

        <section className="site-victory__lead" aria-labelledby="victory-title">
          <div className="site-victory__lead-copy">
            <h1 id="victory-title" className="site-victory__title"><span>Case</span><span>closed.</span></h1>
            <p className="site-victory__summary">Every clue found its place. The final reconstruction reveals who was left alone with the victim.</p>
          </div>
          <div className="site-victory__verdict">
            <div className="site-victory__verdict-heading">
              <span className="site-victory__field-label">Perpetrator</span>
              <BadgeCheck size={24} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <h2>{killer.name}</h2>
            <p>Identified from the evidence</p>
          </div>
        </section>

        <section className="site-victory__record" aria-label="Case record">
          <div className="site-victory__record-heading">
            <BadgeCheck size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>Reconstruction verified</span>
          </div>
          <div className="site-victory__facts">
            <Stat label="Victim" value={victim.name} />
            <Stat label="Scene" value={room?.name ?? 'Not recorded'} />
            <Stat label="Time" value={timer} />
            <Stat label="Hints used" value={`${3 - hintsLeft} of 3`} />
          </div>
        </section>

        <footer className="site-victory__actions">
          <div className="site-victory__next-wrap">
            {hasNext && (
              <button type="button" onClick={onNext} className="site-victory__next-button">
                <span className="site-victory__next-copy">Open the next case</span>
                <span className="site-victory__next-label">{nextPuzzle?.caseNumber ?? ''}{nextPuzzle?.title ? ` · ${nextPuzzle.title}` : ''}</span>
                <ChevronRight size={19} strokeWidth={1.8} aria-hidden />
              </button>
            )}
            {hasUnsolved && unsolved && (
              <button type="button" onClick={() => onPlayUnsolved(unsolved.id)} className="site-victory__next-button">
                <span className="site-victory__next-copy">Choose another case</span>
                <span className="site-victory__next-label">Continue your investigations</span>
                <ChevronRight size={19} strokeWidth={1.8} aria-hidden />
              </button>
            )}
          </div>

          <div className="site-victory__secondary-actions">
            <ShareButton shareText={shareText} />
            <button
              type="button"
              onClick={() => setShowReplay(value => !value)}
              aria-expanded={showReplay}
              aria-controls="clue-replay"
              className="site-victory__text-button"
            >
              <BookOpen size={17} strokeWidth={1.8} aria-hidden />
              <span>{showReplay ? 'Hide clue review' : 'Review clues'}</span>
            </button>
            <button type="button" onClick={onHome} className="site-victory__text-button site-victory__all-cases">
              <span>All cases</span>
              <ChevronRight size={16} strokeWidth={1.8} aria-hidden />
            </button>
          </div>

          <div className="site-victory__replay" hidden={!showReplay}>
            <ClueReplay puzzle={puzzle} />
          </div>
        </footer>
      </article>
    </motion.main>
  )
}

// Clue replay
// One step per suspect (non-victim). Shows each suspect's clue text(s) and
// what board region their clues pointed at, described in words.
// Read-only: state is local step index only. Nothing is written or stored.

/** Describe a ClueHighlight as a short phrase for the replay list. */
function describeHighlight(highlight: ClueHighlight, puzzle: Puzzle): string {
  if (highlight.roomId) {
    const room = puzzle.rooms.find(r => r.id === highlight.roomId)
    return room ? `the ${room.name}` : highlight.roomId
  }
  if (highlight.furniture) {
    return `the ${highlight.furniture}`
  }
  if (highlight.cells) {
    const n = puzzle.size
    const cells = highlight.cells
    // Detect edge (all cells touch the boundary)
    const isEdge = cells.length === (n * 4 - 4) && cells.every(
      c => c.row === 0 || c.col === 0 || c.row === n - 1 || c.col === n - 1,
    )
    if (isEdge) return 'the outer edge'
    // Detect corner
    const cornerSet = new Set(['0,0', `0,${n - 1}`, `${n - 1},0`, `${n - 1},${n - 1}`])
    const isCorner = cells.length === 4 && cells.every(c => cornerSet.has(`${c.row},${c.col}`))
    if (isCorner) return 'a corner cell'
    // Row or column
    const rows = [...new Set(cells.map(c => c.row))]
    const cols = [...new Set(cells.map(c => c.col))]
    if (rows.length === 1) return `row ${rows[0]! + 1}`
    if (cols.length === 1) return `column ${cols[0]! + 1}`
    return `${cells.length} cells`
  }
  return 'the board'
}

/** One suspect step in the replay. */
interface ReplayStep {
  personId: string
  personName: string
  clueTexts: string[]
  targets: string[]   // human-readable highlight descriptions
}

function buildReplaySteps(puzzle: Puzzle): ReplayStep[] {
  return puzzle.people
    .filter(p => !p.isVictim)
    .map(p => {
      const clueTexts = puzzle.clues
        .filter(ct => ct.clue.person === p.id)
        .map(ct => ct.text)
      const highlights: ClueHighlight[] = resolveClueHighlights(puzzle, p.id)
      const targets = highlights.map(h => describeHighlight(h, puzzle))
      return { personId: p.id, personName: p.name, clueTexts, targets }
    })
    .filter(step => step.clueTexts.length > 0)
}

function ClueReplay({ puzzle }: { puzzle: Puzzle }) {
  const steps = buildReplaySteps(puzzle)
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  if (steps.length === 0) return null

  const step = steps[index]!
  const isFirst = index === 0
  const isLast = index === steps.length - 1

  const slideVariants = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } }

  return (
    <section
      id="clue-replay"
      aria-label="Clue replay"
      className="site-victory__replay-card"
    >
      {/* Header */}
      <div className="site-victory__replay-heading">
        <p>
          CLUE BREAKDOWN
        </p>
        <p>
          {index + 1} / {steps.length}
        </p>
      </div>

      {/* Step content */}
      <motion.div
        key={step.personId}
        {...slideVariants}
        transition={{ duration: 0.18 }}
        className="site-victory__replay-body"
      >
        {/* Suspect name */}
        <p
          className="site-victory__replay-person"
        >
          {step.personName}
        </p>

        {/* Clue texts */}
        <ul className="space-y-1 mb-2" aria-label={`Clues for ${step.personName}`}>
          {step.clueTexts.map((text, i) => (
            <li
              key={i}
              className="site-victory__replay-clue"
            >
              {text}
            </li>
          ))}
        </ul>

        {/* Board targets in words */}
        {step.targets.length > 0 && (
          <div className="site-victory__replay-target">
            <p>
              POINTS AT
            </p>
            <p>
              {step.targets.join(' · ')}
            </p>
          </div>
        )}
      </motion.div>

      {/* Prev / Next */}
      <div className="site-victory__replay-controls">
        <button
          type="button"
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={isFirst}
          aria-label="Previous suspect"
          className="site-victory__replay-control"
        >
          <ChevronLeft size={14} strokeWidth={2} aria-hidden />
          PREV
        </button>
        <button
          type="button"
          onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))}
          disabled={isLast}
          aria-label="Next suspect"
          className="site-victory__replay-control"
        >
          NEXT
          <ChevronRight size={14} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="site-victory__fact">
      <p className="site-victory__field-label">{label}</p>
      <p className="site-victory__fact-value">{value}</p>
    </div>
  )
}

// Share button
// Never reveals murderer, victim, room, or clue text. buildShareText enforces
// this; we only pass case number, shape, time, and hint pips.

type ShareStatus = 'idle' | 'copied' | 'failed'

function ShareButton({ shareText }: { shareText: string }) {
  const [status, setStatus] = useState<ShareStatus>('idle')

  // Reset "Copied" feedback after 2 s
  useEffect(() => {
    if (status !== 'copied') return
    const t = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(t)
  }, [status])

  async function handleShare() {
    const ok = await copyShareText(shareText)
    setStatus(ok ? 'copied' : 'failed')
  }

  return (
    <div className="site-victory__share">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share result"
        className="site-victory__text-button"
      >
        <span aria-live="polite">{status === 'copied' ? 'Copied' : 'Share result'}</span>
        <span aria-hidden="true">{status === 'copied' ? '✓' : '↗'}</span>
      </button>

      {status === 'failed' && (
        <div className="flex flex-col gap-1">
          <p className="site-victory__share-error">
            Copy failed. Select and copy the result below:
          </p>
          <textarea
            readOnly
            value={shareText}
            aria-label="Share text, select and copy"
            rows={5}
            className="focus-ring w-full border border-border-strong bg-bg-inset px-3 py-2 font-mono resize-none"
            style={{ fontSize: 14, lineHeight: 1.5 }}
            onFocus={e => e.currentTarget.select()}
          />
        </div>
      )}
    </div>
  )
}
