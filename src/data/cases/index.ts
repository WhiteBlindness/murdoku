import type { AuthoredCaseSpec } from '../../core/authored'
import { veryEasy2 } from './very-easy-2'

// Every hand-authored case, keyed by the catalog slug it replaces
// (see catalog.ts's plan(): `${slug(difficulty)}-${index + 1}`).
// A slot with no entry here falls back to the procedural generator.
export const AUTHORED_CASES: Record<string, AuthoredCaseSpec> = {
  [veryEasy2.slug]: veryEasy2,
}
