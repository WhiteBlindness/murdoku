import { Suspense, lazy, useState, useEffect } from 'react'
import { useGame } from './hooks/useGame'
import { useTheme } from './hooks/useTheme'
import HomeScreen from './components/HomeScreen'
import GameScreen from './components/GameScreen'

const importVictory = () => import('./components/VictoryScreen')
const importReleases = () => import('./components/ReleaseNotes')
const VictoryScreen = lazy(importVictory)
const ReleaseNotes = lazy(importReleases)

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep">
      <span className="text-paper-muted text-xs font-sans tracking-widest animate-pulse">Loading…</span>
    </div>
  )
}

export default function App() {
  const game = useGame()
  const theme = useTheme()
  const [aux, setAux] = useState<'none' | 'releases'>('none')

  useEffect(() => { window.scrollTo(0, 0) }, [game.screen, aux])

  // Warm the split chunks on idle so the win / releases transition never
  // stalls on a mid-animation fetch (which caused a visible repaint hiccup).
  useEffect(() => {
    const warm = () => { importVictory(); importReleases() }
    const ric = (window as any).requestIdleCallback
    if (ric) ric(warm); else setTimeout(warm, 400)
  }, [])

  function nextCase() {
    if (!game.puzzle) return
    const order = game.puzzles.map(p => p.id)
    const next = order[order.indexOf(game.puzzle.id) + 1]
    if (next) game.start(next, game.mode)
  }

  // The solving screen wants full width; everything else sits in a phone frame.
  if (aux === 'none' && game.screen === 'game' && game.puzzle) {
    return (
      <div className="min-h-screen bg-bg-deep text-paper font-sans">
        <GameScreen
          puzzle={game.puzzle}
          mode={game.mode}
          marks={game.marks}
          conflicts={game.conflicts}
          placedOf={game.placedOf}
          selectedPerson={game.selectedPerson}
          tool={game.tool}
          hintsLeft={game.hintsLeft}
          timer={game.timer}
          hideTimer={game.hideTimer}
          canUndo={game.history.length > 0}
          canRedo={game.future.length > 0}
          feedback={game.feedback}
          correctCount={game.correctCount}
          resolvedClues={game.resolvedClues}
          onSelectPerson={game.selectPerson}
          onSetTool={game.setTool}
          onCell={game.clickCell}
          onToggleClue={game.toggleClue}
          onUndo={game.undo}
          onRedo={game.redo}
          onClear={game.clearAll}
          onHint={game.hint}
          onToggleTimer={game.toggleTimer}
          onSubmit={game.submit}
          onDismissFeedback={game.dismissFeedback}
          onBack={() => game.navigate('home')}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-inset text-paper font-sans flex justify-center">
      <div className="relative w-full max-w-[560px] lg:max-w-4xl min-h-screen bg-bg-deep overflow-hidden shadow-[var(--shadow-elevated)]">
        <Suspense fallback={<Fallback />}>
          {aux === 'releases' && <ReleaseNotes onBack={() => setAux('none')} />}

          {aux === 'none' && game.screen === 'home' && (
            <HomeScreen
              puzzles={game.puzzles}
              completedIds={game.completedIds}
              records={game.records}
              mode={game.mode}
              onSetMode={game.setMode}
              onSelect={(id) => game.start(id, game.mode)}
              onOpenReleases={() => setAux('releases')}
              resolvedTheme={theme.resolved}
              onToggleTheme={theme.toggle}
            />
          )}

          {aux === 'none' && game.screen === 'victory' && game.puzzle && game.murderer && (
            <VictoryScreen
              puzzle={game.puzzle}
              murderer={game.murderer}
              timer={game.timer}
              hintsLeft={game.hintsLeft}
              completedIds={game.completedIds}
              onNext={nextCase}
              onPlayUnsolved={(id) => game.start(id, game.mode)}
              onHome={() => game.navigate('home')}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}
