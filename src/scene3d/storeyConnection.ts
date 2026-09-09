import type { ResolvedScene, Rect } from './resolve'
import type { Violation } from './validate'
import { CELL } from './units'
import { planRectToWorld, validPlanRect, worldRectCoveredByFloor } from './floorGeometry'

const EPS = 1e-6
const contains = (outer: Rect, inner: Rect) => outer.minX <= inner.minX + EPS
  && outer.maxX >= inner.maxX - EPS && outer.minZ <= inner.minZ + EPS && outer.maxZ >= inner.maxZ - EPS
const overlaps = (a: Rect, b: Rect) => a.minX < b.maxX - EPS && a.maxX > b.minX + EPS
  && a.minZ < b.maxZ - EPS && a.maxZ > b.minZ + EPS

/** Checks the measured flight, its opening and the clear space at either end. */
export function validatePhysicalConnection(lower: ResolvedScene, upper: ResolvedScene): Violation[] {
  const issues: Violation[] = []
  const error = (code: Violation['code'], subject: string, message: string) => {
    issues.push({ code, subject, message, severity: 'error' })
  }
  const stair = lower.objects.find(object => object.kind === 'stairs')!
  if (!upper.stairwellBounds || !validPlanRect(upper.stairwellBounds, upper.n)) {
    error('stairwell-size-mismatch', 'stairwell', 'The physical stair opening is invalid')
    return issues
  }
  const well = planRectToWorld(upper.stairwellBounds)
  if (!contains(well, stair.footprint)) {
    error('stairwell-size-mismatch', 'stairwell', 'The opening does not contain the measured stair flight')
  }
  const alongX = stair.facing === 'E' || stair.facing === 'W'
  const forward = stair.facing === 'E' || stair.facing === 'S'
  const flight = stair.footprint
  const head = alongX ? (forward ? flight.maxX : flight.minX) : (forward ? flight.maxZ : flight.minZ)
  const edge = alongX ? (forward ? well.maxX : well.minX) : (forward ? well.maxZ : well.minZ)
  if (Math.abs(head - edge) > EPS) {
    error('stair-slab-blocked', 'stairwell', 'The opening edge must meet the final stair tread')
  }
  const approach = (top: boolean): Rect => {
    const direction = (forward ? 1 : -1) * (top ? 1 : -1)
    const end = top ? head : alongX ? (forward ? flight.minX : flight.maxX) : (forward ? flight.minZ : flight.maxZ)
    const start = Math.min(end, end + direction * 0.6)
    const finish = Math.max(end, end + direction * 0.6)
    return alongX ? { ...flight, minX: start, maxX: finish } : { ...flight, minZ: start, maxZ: finish }
  }
  for (const [scene, top] of [[lower, false], [upper, true]] as const) {
    const area = approach(top)
    const subject = top ? 'upper-landing' : 'lower-landing'
    if (!worldRectCoveredByFloor(scene, area)) error('stair-floor-mismatch', subject, 'The stair approach must have continuous floor')
    const object = scene.objects.find(o => o.kind === 'furniture' && !o.parentId && overlaps(o.footprint, area))
    const wall = scene.walls.find(w => w.kind !== 'foundation' && w.pieces.some(piece => overlaps(area, {
      minX: piece.min[0], maxX: piece.max[0], minZ: piece.min[2], maxZ: piece.max[2],
    })))
    if (object || wall) error('stair-landing-blocked', subject, `${object?.id ?? wall?.id} blocks the stair approach`)
  }
  if (!upper.circulation) {
    error('circulation-missing', 'upper-landing', 'Declare an architectural landing and circulation')
  } else if (!contains(planRectToWorld(upper.circulation.landing), approach(true))) {
    error('stair-landing-blocked', 'upper-landing', 'The declared landing must contain the full-width stair arrival')
  }
  if (issues.length) error('upper-floor-inaccessible', 'upper-storey', 'The stair connection is not physically usable')
  return issues
}

/** Exterior ground and absent lower slabs never support ordinary upper floor. */
export function validateUpperSupport(lower: ResolvedScene, upper: ResolvedScene): Violation[] {
  const issues: Violation[] = []
  for (let row = 0; row < upper.n; row++) for (let col = 0; col < upper.n; col++) {
    if (!upper.floorPresent[row][col] || upper.zoneKind[row][col] !== 'interior') continue
    const supported = lower.floorPresent[row][col] && lower.zoneKind[row][col] === 'interior'
      && worldRectCoveredByFloor(lower, { minX: col * CELL, maxX: (col + 1) * CELL, minZ: row * CELL, maxZ: (row + 1) * CELL })
    if (!supported) issues.push({ code: 'upper-floor-unsupported', severity: 'error', subject: `${row},${col}`,
      message: `Upper interior (${row},${col}) has no built support below` })
  }
  return issues
}
