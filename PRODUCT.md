# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are solo puzzle players looking for a focused deduction game they can understand quickly and play in short sessions on either a phone or desktop. They need to read evidence, cross-reference a spatial board, test placements, and return to an unfinished case without losing progress.

## Product Purpose

Alibi is an installable, offline-capable murder-mystery deduction puzzle. Each case asks the player to place every person on a house map so that each occupies exactly one row and one column, then identify the suspect left alone with the victim. Success means the player can form and revise a mental model of the case, finish a uniquely solvable grid, and understand why the accusation follows from the evidence.

## Positioning

Alibi combines literal witness clues, a spatial house map, and permutation-grid logic: the room, furniture, and relationship language in each clue maps directly to visible board features and produces one valid arrangement.

## Operating Context

Players choose a case and either Classic or Detective mode, read suspect clues, place or pencil people onto the map, eliminate impossible cells, use undo, redo, clear, or limited hints, submit an accusation, and review the reveal. Sessions may be interrupted; theme, mode, records, solved cases, and in-progress placements persist locally. The app is designed for touch, keyboard, mobile, desktop, light, and dark environments.

## Capabilities and Constraints

- Twenty-seven procedurally generated cases span five difficulties and grid sizes from 4x4 through 7x7.
- Every case must retain a unique solution and a logically correct murderer.
- Room names and furniture must remain immediately identifiable because clue interpretation depends on them.
- Every person must occupy one unique row and column; board controls must preserve semantic button behavior and keyboard navigation.
- Classic mode supports free placement and submission; Detective mode adds drafting and automatic elimination.
- The PWA must remain installable and usable offline.
- Existing `murdoku_*` local-storage keys are compatibility contracts and must not be renamed.
- Generated puzzle data is cached; generation changes require a catalog cache-key bump.

## Brand Commitments

The product name shown to players is **Alibi**. The repository, deployment URL, and persistence keys retain the Murdoku name for compatibility. Language is concise, observant, and investigative; game terms include case, evidence, suspect, victim, clue, alibi, and accusation.

## Evidence on Hand

- Puzzle rules, capabilities, and architecture: `README.md`
- Current production behavior and interaction constraints: `src/`
- Existing generated cases and solution model: `src/core/`
- Existing visual and accessibility rationale: `DESIGN.md`
- No testimonials, commercial claims, customer logos, pricing, or external performance claims are available and none should be invented.

## Product Principles

1. Evidence must map to the board without interpretation friction.
2. Every action should preserve the player's chain of reasoning.
3. The interface should make dense logic feel tactile and legible, not administrative.
4. Interruption must be harmless: progress and preferences survive locally.
5. Cinematic atmosphere may heighten the mystery but never hide state, controls, or clues.

## Accessibility & Inclusion

All core flows must work with keyboard and touch, maintain visible focus, meet WCAG AA contrast, respect reduced-motion preferences, expose non-text board information to assistive technology, and keep interactive targets at least 44px.
