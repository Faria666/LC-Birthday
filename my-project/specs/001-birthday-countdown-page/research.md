# Research: Birthday Countdown Page

**Phase**: 0 | **Date**: 2026-06-10 | **Plan**: [plan.md](./plan.md)

---

## 1. Timezone-safe Countdown Target

**Decision**: Express the countdown target as a fixed UTC millisecond timestamp computed once at build time.

```
12 June 2026 at 09:45:00 AM WEST (Europe/Lisbon in summer = UTC+2)
= 12 June 2026 at 07:45:00 UTC
= Date.UTC(2026, 5, 12, 7, 45, 0)   // months are 0-indexed in JS
= 1749714300000 ms since epoch
```

The countdown module subtracts `Date.now()` from this constant. No `Intl` or timezone library is needed. The result is correct regardless of the visitor's device timezone because both sides of the subtraction are in UTC.

**Rationale**: Hardcoding the UTC equivalent is the simplest, most reliable approach for a one-off static page. It avoids timezone library bloat and `Intl.DateTimeFormat` parsing complexities, which differ subtly across browsers.

**Alternatives considered**:
- `Temporal.ZonedDateTime` API — not yet available in all target browsers; polyfill exceeds bundle budget
- `date-fns-tz` library — would work but adds ~15 kB for a single conversion we can pre-compute
- Using visitor's local timezone — rejected: the birthday moment is a specific real-world event at a fixed point in time, not "09:45 in whatever timezone the visitor is in"

---

## 2. canvas-confetti

**Decision**: Use `canvas-confetti` npm package, bundled by Vite. Version ^1.9.

**Rationale**: ~9 kB gzipped; excellent browser support; TypeScript types via `@types/canvas-confetti`; pure ESM compatible with Vite tree-shaking. Gives realistic physics-based confetti with custom colours.

**Implementation pattern** (for the confetti module):

```typescript
// Launch a multi-burst firework effect
const COLORS = ['#c8a96e', '#d4a5a5', '#8fad91', '#f5efe6', '#9e7a7a'];

function launchBurst(): void {
  const duration = 4000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
```

**Alternatives considered**:
- `party.js` — heavier, more opinionated
- CSS-only confetti — no library with sufficient quality exists within the 50 kB budget constraint
- `tsparticles` — feature-rich but ~40 kB gzipped; too heavy for a confetti-only use case

---

## 3. Self-hosted Fonts via @fontsource

**Decision**: Use `@fontsource/cormorant-garamond` and `@fontsource/nunito` npm packages. Import specific weight/style CSS files in `main.ts`.

**Cormorant Garamond** (Display / Headings):
- Ultra-elegant old-world serif — fits "old money" and K-drama period drama aesthetics
- Import: `@fontsource/cormorant-garamond/400.css`, `500.css`, `600.css`, `700.css` (italic variants for headings)
- Used for: "Happy Birthday, Leonor!" heading, countdown label, section titles

**Nunito** (Body / Labels):
- Rounded terminal strokes — clean, friendly, slightly kawaii without being childish
- Pairs harmoniously with Cormorant as a humanist sans-serif counterpoint
- Import: `@fontsource/nunito/300.css`, `400.css`, `600.css`
- Used for: countdown digit labels (Days, Hours, Minutes, Seconds), body copy, message text

**Rationale**: @fontsource packages are served by Vite, bundled as static WOFF2 assets. Zero CDN dependency. `font-display: swap` is configured by @fontsource by default. Keeps the Content-Security-Policy at `font-src 'self'` — no exceptions needed.

**Alternatives considered**:
- Google Fonts CDN — rejected: adds third-party request, requires `style-src fonts.googleapis.com` and `font-src fonts.gstatic.com` CSP exceptions; render-blocking on slow connections
- Adobe Fonts — requires paid subscription; unavailable in open build
- System fonts only — rejected: insufficient aesthetic quality for the old money / K-drama look

---

## 4. Colour Palette

**Decision**: Custom palette derived from the K-drama, old money, nature, and country aesthetic intersection.

| Token name | Hex | Role |
|---|---|---|
| `--color-cream` | `#f5efe6` | Page background, primary surface |
| `--color-sage` | `#8fad91` | Accent, botanical motifs, labels |
| `--color-rose` | `#d4a5a5` | Warm accent, celebration highlights |
| `--color-gold` | `#c8a96e` | Old money accent, borders, stamp |
| `--color-taupe` | `#9e7a7a` | Secondary text, subdued elements |
| `--color-forest` | `#4a6741` | Dark botanical, deep accent |
| `--color-ink` | `#2c2c2c` | Primary text (WCAG AA on cream) |
| `--color-white` | `#fafaf8` | Cards, countdown digit backgrounds |

Contrast check (WCAG AA — 4.5:1 minimum for normal text):
- `--color-ink` (#2c2c2c) on `--color-cream` (#f5efe6): ~13:1 ✅
- `--color-ink` on `--color-white` (#fafaf8): ~14:1 ✅
- `--color-forest` (#4a6741) on `--color-cream`: ~5.8:1 ✅
- `--color-gold` (#c8a96e) on `--color-cream`: ~2.2:1 ⚠️ — use only for decorative/large text (≥ 18px bold), never for body copy

**Rationale**: Palette avoids saturated brightness (too "birthday party" / too garish) in favour of muted, dusty tones. The cream-sage-rose combination is characteristic of K-drama romantic aesthetic; gold and taupe ground it in old money restraint.

---

## 5. Illustration Approach

**Decision**: Two-layer illustration strategy — SVG primary, CSS/emoji accent backup.

**Celebration reveal illustration** (chibi-leonor.svg):
- Source: Freepik free tier (attribution required) or unDraw alternative
- Search terms: "kawaii girl reading", "chibi girl flowers", "cute anime girl botanical"
- Target style: clean black outlines, rosy cheeks, rounded proportions matching reference image
- Recolour to palette (sage, rose, cream, gold) using SVG `fill` overrides or CSS custom properties on SVG paths
- Interest motifs included: open book, botanical flower cluster, small vintage suitcase, teacup
- Fallback: If no suitable royalty-free asset found, compose from CSS shapes + emoji (📚🌸🧳☕) with styled containers

**Wax seal stamp** (stamp-momo.svg):
- Simple circular stamp design with "Momô Minium" text in Cormorant Garamond italic
- Inner motif: a small floral or botanical element
- Colour: `--color-gold` with `--color-taupe` text
- Can be hand-crafted as SVG — simple geometry, no external source needed

**Rationale**: SVG illustrations scale to any resolution without quality loss, are WCAG-compatible with proper `alt` text, and add no HTTP request overhead when inlined or imported via Vite. CSS/emoji art is the constitution-compliant fallback (no binary assets, pure code).

---

## 6. Countdown Digit Animation

**Decision**: CSS `@keyframes` slide-up transition on digit change, gated by a `data-digit` attribute change detected by a MutationObserver or direct class toggle in TypeScript.

```css
@keyframes digit-flip {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}

.countdown__digit[data-animating] {
  animation: digit-flip 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

Digit containers use `font-variant-numeric: tabular-nums` to prevent layout shift (CLS) as digits change width. Width is fixed via CSS to the widest expected value (99 for days).

**Rationale**: Pure CSS animation avoids JS animation libraries. INP stays < 200 ms because no heavy computation happens on the main thread per tick — only a `setInterval` updating text content and toggling a CSS attribute.

**Alternatives considered**:
- CSS 3D flip card (classic "flip clock") — visually striking but complex to implement accessibly and adds CLS risk; deferred to stretch goal
- `requestAnimationFrame` animation loop — unnecessary for a 1-second tick; setInterval is sufficient
