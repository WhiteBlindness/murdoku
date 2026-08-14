// ============================================================================
// The shareable result card.
//
// SPOILER DISCIPLINE IS THE WHOLE POINT. A share card may contain nothing that
// shortens the puzzle for whoever reads it: no murderer, no victim, no room, no
// cell, no clue text, not even the case title. It carries the case NUMBER, the
// shape of the board, and how the sharer did. Anything richer turns a share
// into a leak.
// ============================================================================

export interface ShareResult {
  caseNumber: string
  difficulty: string
  size: number
  seconds: number
  /** Hints still unspent out of `hintsTotal` when the case closed. */
  hintsLeft: number
  hintsTotal: number
  /** Current daily streak; omitted from the card unless it is worth stating. */
  streak?: number
}

function clock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safe / 60)
  return `${String(minutes).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}

/**
 * A filled pip per hint left unspent, a hollow one per hint used — the shape of
 * the run at a glance, in the spirit of a Wordle grid but carrying no
 * positional information to give away.
 */
function hintPips(left: number, total: number): string {
  const clamped = Math.max(0, Math.min(total, left))
  return '◆'.repeat(clamped) + '◇'.repeat(Math.max(0, total - clamped))
}

export function buildShareText(result: ShareResult): string {
  const lines = [
    `ALIBI — ${result.caseNumber}`,
    `${result.difficulty} · ${result.size}×${result.size}`,
    `Closed in ${clock(result.seconds)}`,
    `Hints ${hintPips(result.hintsLeft, result.hintsTotal)}`,
  ]
  if (result.streak && result.streak > 1) lines.push(`Streak ${result.streak} days`)
  return lines.join('\n')
}

/**
 * Copy the card. Prefers the async clipboard and falls back to a hidden
 * textarea + execCommand, which is still the only path that works in some
 * in-app browsers. Returns whether the text actually left the building, so the
 * UI can avoid claiming success it did not get.
 */
export async function copyShareText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through to the legacy path */ }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch { return false }
}
