# Module Interface Contracts

**Phase**: 1 | **Date**: 2026-06-10

These are the public TypeScript interfaces for each source module. Implementation details (loops, DOM selectors, event listeners) belong in tasks.md — only the public surface is defined here.

---

## `src/types/index.ts`

```typescript
export interface CountdownValue {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly isExpired: boolean;
}

export type PageState = 'countdown' | 'celebration';
```

---

## `src/scripts/modules/countdown.ts`

```typescript
/**
 * Pure function — no DOM access, no side effects.
 * Returns the time remaining from now until targetUtcMs.
 */
export function getTimeRemaining(targetUtcMs: number): CountdownValue;

/**
 * Starts a 1-second interval that:
 *   1. Calls getTimeRemaining(COUNTDOWN_TARGET_UTC_MS)
 *   2. Updates the DOM countdown digits
 *   3. Triggers celebration() and clears the interval when isExpired === true
 *
 * Must be idempotent — calling more than once does nothing if already running.
 */
export function startCountdown(): void;

/**
 * Formats a number as a zero-padded string of the given width.
 * e.g. pad(7, 2) → "07"
 * Pure function; exported for testing.
 */
export function pad(value: number, width: number): string;
```

---

## `src/scripts/modules/celebration.ts`

```typescript
/**
 * Transitions the page from countdown state to celebration state.
 * - Sets body[data-state="celebration"]
 * - Launches confetti burst
 * - Scrolls to top (if page had scrolled)
 *
 * Idempotent — calling multiple times has no additional effect.
 */
export function activate(): void;
```

---

## `src/scripts/modules/confetti.ts`

```typescript
/**
 * Launches the full confetti burst sequence using canvas-confetti.
 * Uses the palette colours defined in research.md.
 * Runs for ~4 seconds using requestAnimationFrame.
 * Does not throw if canvas-confetti fails to load (graceful degradation).
 */
export function launchBurst(): void;
```

---

## `src/scripts/main.ts`

```typescript
/**
 * Entry point. Imports all modules and @fontsource CSS.
 * On DOMContentLoaded:
 *   1. Checks if countdown is already expired → calls activate() immediately
 *   2. Otherwise → calls startCountdown()
 * No other logic lives here.
 */
```
