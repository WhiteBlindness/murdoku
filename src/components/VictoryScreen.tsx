import { motion, useReducedMotion } from 'framer-motion'
import type { Puzzle } from '../core/types'
import { roomIdAt } from '../core/engine'
import { getAllPuzzles } from '../core/catalog'

interface Props {
  puzzle: Puzzle
  murderer: string
  timer: string
  hintsLeft: number
  completedIds: string[]
  onNext: () => void
  onPlayUnsolved: (id: string) => void
  onHome: () => void
}

export default function VictoryScreen({ puzzle, murderer, timer, hintsLeft, completedIds, onNext, onPlayUnsolved, onHome }: Props) {
  const killer = puzzle.people.find(p => p.id === murderer)!
  const victim = puzzle.people.find(p => p.id === puzzle.victimId)!
  const room = puzzle.rooms.find(r => r.id === roomIdAt(puzzle, puzzle.solution[puzzle.victimId]))
  const allPuzzles = getAllPuzzles()
  const order = allPuzzles.map(p => p.id)
  const hasNext = order.indexOf(puzzle.id) < order.length - 1
  const unsolved = allPuzzles.find(p => !completedIds.includes(p.id) && p.id !== puzzle.id)
  const hasUnsolved = !hasNext && !!unsolved
  const reduceMotion = useReducedMotion()

  // The stamp is the emotional payoff — a rubber verdict being pressed onto the
  // dossier. Spring with overshoot so it physically thuds. Reduced motion: plain
  // fade, no vestibular movement.
  const stamp = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : {
        initial: { scale: 1.45, rotate: -8, opacity: 0 },
        animate: { scale: 1, rotate: -2, opacity: 1 },
        transition: { delay: 0.05, type: 'spring' as const, bounce: 0.4, duration: 0.55 },
      }

  // The killer name materialises out of blur — evidence arriving, not switching on.
  const reveal = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4, duration: 0.2 } }
    : {
        initial: { scale: 0.85, opacity: 0, filter: 'blur(8px)' },
        animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
        transition: { delay: 0.55, type: 'spring' as const, bounce: 0.2, duration: 0.55 },
      }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      data-testid="victory-screen"
      aria-labelledby="victory-title"
      className="desk-surface flex min-h-screen flex-col items-center justify-center px-6 py-8"
    >
      {/* CASE CLOSED stamp — the payoff */}
      <motion.div
        {...stamp}
        className="mb-8"
        style={{ willChange: 'transform, opacity', transformOrigin: 'center' }}
      >
        <div
          className="border-4 border-danger px-8 py-3"
          style={{
            boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-danger) 30%, transparent), var(--shadow-cut)',
          }}
        >
          <p
            id="victory-title"
            className="font-display font-bold tracking-[0.35em] text-danger-text uppercase"
            style={{ fontSize: '1.6rem' }}
          >
            Case Closed
          </p>
        </div>
      </motion.div>

      {/* Evidence header label */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-paper-muted"
      >
        PERPETRATOR IDENTIFIED
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}
        className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-accent-text"
      >
        CASE RECONSTRUCTED
      </motion.p>

      {/* Killer name — presented like a name plate on a case file */}
      <motion.div
        {...reveal}
        className="w-full max-w-xs border-2 border-danger px-6 py-5 text-center"
        style={{
          boxShadow: '0 12px 32px -18px color-mix(in srgb, var(--color-danger) 55%, transparent), var(--shadow-elevated)',
          background: 'color-mix(in srgb, var(--color-danger) 6%, var(--color-bg-surface))',
        }}
      >
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-paper-muted mb-2">SUBJECT</p>
        <h2 className="font-display text-3xl font-bold text-text-primary tracking-wide">
          {killer.name}
        </h2>
      </motion.div>

      {/* Case file stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="w-full max-w-xs border border-border-strong bg-bg-panel px-5 py-4 my-6 grid grid-cols-2 gap-3 text-center"
        style={{ boxShadow: 'var(--shadow-cut)' }}
      >
        <Stat label="Victim" value={victim.name} />
        <Stat label="Scene" value={room?.name ?? '—'} />
        <Stat label="Time" value={timer} />
        <Stat label="Hints used" value={`${3 - hintsLeft} / 3`} />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
        className="w-full max-w-xs flex flex-col gap-3"
      >
        {hasNext && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="focus-ring w-full py-3.5 font-display font-semibold tracking-widest uppercase text-sm border-2 border-accent"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))',
              color: 'var(--color-on-accent)',
              boxShadow: 'var(--shadow-cut)',
            }}
          >
            NEXT CASE →
          </motion.button>
        )}
        {hasUnsolved && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onPlayUnsolved(unsolved!.id)}
            className="focus-ring w-full py-3.5 font-display font-semibold tracking-widest uppercase text-sm border-2 border-accent"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))',
              color: 'var(--color-on-accent)',
              boxShadow: 'var(--shadow-cut)',
            }}
          >
            ANOTHER CASE →
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onHome}
          className="focus-ring w-full py-3 border border-border-strong text-paper-dim font-display text-sm tracking-widest uppercase"
          style={{ background: 'var(--color-bg-surface)', boxShadow: 'var(--shadow-cut)' }}
        >
          ALL CASES
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-paper-muted text-[9px] uppercase tracking-[0.25em] mb-1">{label}</p>
      <p className="font-display text-paper text-sm font-semibold tracking-wide">{value}</p>
    </div>
  )
}
