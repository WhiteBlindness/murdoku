// Solver-checker over the whole catalog.
// Asserts every case has EXACTLY ONE clue-derivable solution using the clues
// the player actually sees. Run with: npm run verify
import { getAllPuzzles } from '../src/core/catalog.ts'
import { countSolutions, findMurderer } from '../src/core/engine.ts'

const all = getAllPuzzles()
let failures = 0
let multiClueSuspects = 0

for (const p of all) {
  const sols = countSolutions(p, 5)
  const murderer = findMurderer(p)
  const perPerson = {}
  for (const ct of p.clues) { const k = ct.clue.person; perPerson[k] = (perPerson[k] || 0) + 1 }
  const suspectsWithMany = Object.entries(perPerson)
    .filter(([id, n]) => n > 1 && id !== p.victimId).length
  multiClueSuspects += suspectsWithMany
  // every room must keep ≥1 furniture-free cell so its label never covers a tile
  const fset = new Set(p.furniture.map(f => `${f.row},${f.col}`))
  const fullRooms = p.rooms.filter(rm => rm.cells.every(c => fset.has(`${c.row},${c.col}`)))
  const labelSafe = fullRooms.length === 0
  const ok = sols === 1 && !!murderer && labelSafe
  if (!ok) failures++
  const flag = ok ? 'OK ' : 'FAIL'
  const extra = labelSafe ? '' : `  <-- FULLY-FURNISHED ROOM(S): ${fullRooms.map(r => r.name).join(', ')}`
  console.log(`[${flag}] ${p.caseNumber} ${p.difficulty} ${p.size}x${p.size} "${p.title}" — solutions=${sols} clues=${p.clues.length} suspects>1clue=${suspectsWithMany}${extra}`)
}

console.log(`\n${all.length - failures}/${all.length} cases uniquely solvable. Total suspects needing >1 clue: ${multiClueSuspects}.`)
if (failures > 0) { console.error(`\n❌ ${failures} case(s) are NOT uniquely solvable.`); process.exit(1) }
console.log('✅ All cases have exactly one clue-derivable solution.')
