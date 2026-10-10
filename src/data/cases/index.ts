import type { AuthoredCaseSpec } from '../../core/authored'
import { veryEasy1 } from './very-easy-1'
import { veryEasy2 } from './very-easy-2'
import { hard1 } from './hard-1'

// Every hand-authored case, keyed by the catalog slug it replaces
// (see catalog.ts's plan(): `${slug(difficulty)}-${index + 1}`).
// A slot with no entry here falls back to the procedural generator.
export const AUTHORED_CASES: Record<string, AuthoredCaseSpec> = {
  [veryEasy1.slug]: veryEasy1,
  [veryEasy2.slug]: veryEasy2,
  [hard1.slug]: hard1,
}
