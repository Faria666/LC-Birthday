# Data Model: Birthday Countdown Page

**Phase**: 1 | **Date**: 2026-06-10 | **Plan**: [plan.md](./plan.md)

This page has no persistent data store. All state is ephemeral runtime state held in memory and reflected in the DOM.

---

## Runtime Entities

### CountdownTarget

A compile-time constant — never mutated.

```typescript
const COUNTDOWN_TARGET_UTC_MS = 1749714300000;
// = Date.UTC(2026, 5, 12, 7, 45, 0)
// = 12 June 2026 09:45:00 WEST (Europe/Lisbon)
```

| Field | Type | Value | Notes |
|---|---|---|---|
| `COUNTDOWN_TARGET_UTC_MS` | `number` | `1749714300000` | Milliseconds since Unix epoch, UTC |

---

### CountdownValue

Computed each second by `getTimeRemaining()`. Read-only output; never stored.

```typescript
interface CountdownValue {
  readonly days: number;       // 0 – 999
  readonly hours: number;      // 0 – 23
  readonly minutes: number;    // 0 – 59
  readonly seconds: number;    // 0 – 59
  readonly isExpired: boolean; // true when target has passed
}
```

**Derivation**: 
```
totalMs    = max(0, COUNTDOWN_TARGET_UTC_MS - Date.now())
days       = floor(totalMs / 86_400_000)
hours      = floor((totalMs % 86_400_000) / 3_600_000)
minutes    = floor((totalMs % 3_600_000) / 60_000)
seconds    = floor((totalMs % 60_000) / 1_000)
isExpired  = totalMs === 0
```

**Validation rules**:
- All unit values are non-negative integers
- When `isExpired` is `true`, all unit values are `0`
- `days` may exceed two digits when far from the target; display must not truncate

---

### PageState

A discriminated union controlling which DOM section is visible.

```typescript
type PageState = 'countdown' | 'celebration';
```

| Value | Triggered by | DOM effect |
|---|---|---|
| `'countdown'` | Page load when target is in the future | `.countdown-screen` visible; `.celebration-screen` hidden |
| `'celebration'` | Timer reaches zero OR page loads past target | `.celebration-screen` visible; `.countdown-screen` hidden; confetti launched |

**State transitions**:
```
(initial load)
    │
    ├── isExpired === true  ──→  celebration  (immediate, no timer started)
    │
    └── isExpired === false ──→  countdown
                                     │
                                     └── isExpired becomes true ──→  celebration
```

`celebration` is a terminal state — once entered, the page never returns to `countdown`.

---

### PersonalMessage

Static copy defined in `index.html` at build time. No runtime mutation.

| Field | Value |
|---|---|
| Primary name | `Leonor` |
| Nickname | `Momo` |
| Affectionate full name | `Momô Minium` |
| Birthday message | `"Wishing the happiest of birthdays to my favorite person. You deserve the world today and always!"` |
| Greeting heading | `"Happy Birthday, Leonor!"` |

---

## DOM State Contract

The two page states map to CSS visibility via a data attribute on the `<body>`:

```html
<body data-state="countdown">   <!-- or data-state="celebration" -->
```

CSS toggles visibility:

```css
/* countdown screen visible by default */
.celebration-screen { display: none; }

body[data-state="celebration"] .countdown-screen  { display: none; }
body[data-state="celebration"] .celebration-screen { display: block; }
```

This ensures the correct state is shown even before TypeScript initialises (the HTML sets the initial `data-state` attribute based on server-rendered logic — in this case, always `"countdown"` in the static HTML, then corrected by JS on load).
