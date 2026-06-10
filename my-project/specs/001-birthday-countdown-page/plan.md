# Implementation Plan: Birthday Countdown Page

**Branch**: `001-birthday-countdown-page` | **Date**: 2026-06-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-birthday-countdown-page/spec.md`

---

## Summary

A zero-framework static web page — HTML5, vanilla CSS, TypeScript compiled via Vite — deployed to `joaofaria.github.io/lc-birthday` via GitHub Pages CI. The page counts down to 12 June 2026 at 09:45 AM Europe/Lisbon time, displayed as **Days : Hours : Minutes : Seconds**. When the timer expires, confetti bursts across the screen and a celebration reveal appears: a chibi/kawaii illustration, a "Happy Birthday, Leonor!" heading in Cormorant Garamond, a personal message, and a "Momô Minium" wax-seal stamp. The aesthetic combines K-drama soft pastels, old money elegance, and botanical nature motifs throughout.

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), HTML5, CSS (modern — no preprocessor)

**Primary Dependencies**:
- `vite` ^6 — bundler and dev server
- `typescript` ^5 — compile only; nothing ships at runtime
- `canvas-confetti` ^1 — celebration animation (~9 kB gzipped, bundled via Vite — no CDN)
- `@types/canvas-confetti` — TypeScript types for canvas-confetti
- `@fontsource/cormorant-garamond` — self-hosted serif display font (old money elegance)
- `@fontsource/nunito` — self-hosted rounded body font (kawaii-friendly readability)
- `vitest` ^2 — unit testing
- `eslint` + `typescript-eslint` — linting
- `prettier` — formatting
- `stylelint` — CSS linting
- `@lighthouse-ci/cli` — Lighthouse CI performance gate

**Storage**: N/A — purely static, no persistence of any kind

**Testing**: Vitest (unit tests for countdown logic and state transitions); manual validation scenarios in quickstart.md

**Target Platform**: Modern browser (Chrome 100+, Firefox 100+, Safari 15+), deployed on GitHub Pages at `joaofaria.github.io/lc-birthday`

**Project Type**: Static single-page web application

**Performance Goals**: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, Lighthouse Performance ≥ 90, total JS bundle < 50 kB gzipped

**Constraints**:
- No server-side code — GitHub Pages serves static files only
- Vite `base` must be set to `/lc-birthday/` for GitHub Pages subdirectory deployment
- Countdown target expressed as absolute UTC timestamp to be timezone-safe
- All fonts self-hosted via `@fontsource` (no Google Fonts CDN) to keep CSP clean
- canvas-confetti bundled via npm (not CDN) — no SRI required
- WCAG 2.1 AA hard gate on all text and interactive elements

**Scale/Scope**: Single page, single URL, one primary user (Leonor), shared via direct link

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked post-Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Zero-framework (no React/Vue/etc.) | ✅ PASS | Plain HTML + CSS + TypeScript only |
| Vite as bundler | ✅ PASS | Single source of truth for build pipeline |
| TypeScript strict mode + flags | ✅ PASS | See tsconfig in contracts/ |
| CSS design tokens (custom properties) | ✅ PASS | All values via tokens.css |
| BEM naming | ✅ PASS | Applied to all components |
| No `!important` | ✅ PASS | Architecture resolves specificity via @layer |
| WCAG 2.1 AA | ✅ PASS | Hard gate; alt text, contrast, keyboard nav |
| LCP < 2.5 s / Lighthouse ≥ 90 | ✅ PASS | Fonts self-hosted, no render-blocking scripts |
| No inline scripts or styles | ✅ PASS | CSP: `script-src 'self'` — no unsafe-inline |
| No CDN resources | ✅ PASS | canvas-confetti and fonts bundled via npm |
| GitHub Pages CI-only deploy | ✅ PASS | deploy.yml; no manual gh-pages pushes |
| Vite base path `/lc-birthday/` | ✅ PASS | Required for GitHub Pages subdirectory |
| JS bundle < 50 kB gzipped | ✅ PASS | canvas-confetti ~9 kB + our code ≈ < 20 kB total |
| Conventional Commits | ✅ PASS | enforced by team convention |

**Complexity justification required**: canvas-confetti is the only runtime JS dependency beyond TypeScript. Justified: confetti is a core feature requirement (FR-003), no CSS-only equivalent matches quality. Bundled via npm, not CDN.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-birthday-countdown-page/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   ├── modules.md       ← TypeScript module interface contracts
│   ├── css-tokens.md    ← CSS custom property contracts
│   └── html-structure.md ← HTML landmark and BEM structure contract
└── tasks.md             ← Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── index.html                        ← Single entry point; all meta, CSP, OG tags
├── assets/
│   ├── images/
│   │   ├── chibi-leonor.svg          ← Chibi girl + interest motifs illustration
│   │   └── stamp-momo.svg            ← "Momô Minium" wax seal / stamp
│   └── fonts/                        ← (empty — fonts served via @fontsource npm)
├── styles/
│   ├── tokens.css                    ← Design tokens: colours, spacing, type scale, radii
│   ├── reset.css                     ← Modern CSS reset (box-sizing, margin, padding)
│   ├── global.css                    ← Base typography, body, skip link, @layer declaration
│   └── components/
│       ├── countdown.css             ← Countdown block: digits, labels, separators
│       ├── celebration.css           ← Celebration state: heading, illustration, message, stamp
│       └── decorations.css           ← Ambient botanical motifs, background textures
├── scripts/
│   ├── main.ts                       ← Entry point: imports, initialises all modules
│   └── modules/
│       ├── countdown.ts              ← Pure countdown logic + DOM updates
│       ├── celebration.ts            ← Celebration state activation + DOM swap
│       └── confetti.ts              ← canvas-confetti wrapper; burst sequences
└── types/
    └── index.ts                      ← Shared TypeScript type declarations

public/
├── robots.txt
├── sitemap.xml
└── favicon.ico                       ← Simple floral/botanical favicon (SVG preferred)

tests/
├── unit/
│   ├── countdown.test.ts             ← getTimeRemaining() pure function tests
│   └── celebration.test.ts          ← isExpired() + state transition tests
└── e2e/                              ← Manual validation scenarios (see quickstart.md)

.github/
└── workflows/
    └── deploy.yml                    ← Build → lint → typecheck → test → deploy

vite.config.ts
tsconfig.json
.eslintrc.json
.stylelintrc.json
.prettierrc
package.json
```

**Structure Decision**: Single-project layout (Option 1 from template). This is a single-page static site with no backend — the src/ tree directly follows the constitution's prescribed layout.

---

## Complexity Tracking

No constitution violations. No complexity justification required beyond the canvas-confetti dependency noted in the Constitution Check above.
