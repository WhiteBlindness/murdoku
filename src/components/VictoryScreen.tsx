import { motion } from 'framer-motion'
import type { Puzzle } from '../core/types'
import { roomIdAt } from '../core/engine'
import { getAllPuzzles } from '../core/catalog'
import Avatar from './Avatar'

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

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-screen bg-bg-deep items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 1.35, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: -2, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
        style={{ willChange: 'transform, opacity', transformOrigin: 'center' }}
      >
        <div className="border-4 border-danger rounded-lg px-7 py-2.5" style={{ boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-danger) 27%, transparent)' }}>
          <p className="font-display font-bold tracking-[0.25em] text-danger-text" style={{ fontSize: '1.5rem' }}>CASE SOLVED</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-paper-muted text-xs font-sans tracking-widest uppercase mb-4"
      >
        The killer was
      </motion.p>

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl"
        style={{ boxShadow: `0 0 0 3px ${killer.accent}, 0 0 40px ${killer.accent}55` }}
      >
        <Avatar seed={killer.avatarSeed} accent={killer.accent} size={96} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        className="font-display text-2xl font-bold text-paper mt-3"
      >
        {killer.name}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="w-full max-w-xs rounded-xl border border-br-thin bg-bg-panel px-5 py-4 my-6 grid grid-cols-2 gap-3 text-center"
      >
        <Stat label="Victim" value={victim.name} />
        <Stat label="Scene" value={room?.name ?? '—'} />
        <Stat label="Time" value={timer} />
        <Stat label="Hints used" value={`${3 - hintsLeft} / 3`} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
        className="w-full max-w-xs flex flex-col gap-3"
      >
        {hasNext && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={onNext}
            className="focus-ring w-full py-3.5 rounded-xl font-display font-semibold tracking-wide uppercase text-sm"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))', color: 'var(--color-on-accent)' }}>
            Next Case →
          </motion.button>
        )}
        {hasUnsolved && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onPlayUnsolved(unsolved!.id)}
            className="focus-ring w-full py-3.5 rounded-xl font-display font-semibold tracking-wide uppercase text-sm"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))', color: 'var(--color-on-accent)' }}>
            Play Another →
          </motion.button>
        )}
        <motion.button whileTap={{ scale: 0.97 }} onClick={onHome}
          className="focus-ring w-full py-3 rounded-xl border border-br-thin text-paper-dim font-display text-sm tracking-wide uppercase">
          All Cases
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-paper-muted text-[10px] font-sans uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-paper text-xs font-sans">{value}</p>
    </div>
  )
}
