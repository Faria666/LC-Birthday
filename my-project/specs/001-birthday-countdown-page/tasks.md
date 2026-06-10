# Tasks: Birthday Countdown Page

**Input**: Design documents from `specs/001-birthday-countdown-page/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: Unit tests included for pure countdown logic and state transitions (highest-value, lowest-overhead coverage for this project type).

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, CI pipeline, and folder structure. Everything downstream depends on this phase being complete.

- [ ] T001 Initialise npm project and install all dependencies: `vite`, `typescript`, `canvas-confetti`, `@types/canvas-confetti`, `@fontsource/cormorant-garamond`, `@fontsource/nunito`, `vitest`, `eslint`, `typescript-eslint`, `prettier`, `stylelint`, `@lighthouse-ci/cli` — write to `package.json` with all `scripts` entries from plan.md
- [ ] T002 [P] Configure `vite.config.ts`: set `base: '/lc-birthday/'`, configure `build.outDir: 'dist'`, asset hashing, and ESM output targeting Chrome 100+ / Firefox 100+ / Safari 15+
- [ ] T003 [P] Configure `tsconfig.json`: enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, target `ES2022`, module `ESNext`, moduleResolution `bundler`, lib `["ES2022","DOM","DOM.Iterable"]`
- [ ] T004 [P] Configure `.eslintrc.json` with `typescript-eslint` recommended rules, ban `any` (`@typescript-eslint/no-explicit-any: error`), require explicit function return types
- [ ] T005 [P] Configure `.stylelintrc.json` for plain CSS: enforce BEM naming pattern, disallow unknown custom properties, no `!important`
- [ ] T006 [P] Configure `.prettierrc`: single quotes, 2-space indent, trailing commas `es5`, print width 100
- [ ] T007 Create full directory tree: `src/assets/images/`, `src/assets/fonts/`, `src/styles/components/`, `src/scripts/modules/`, `src/types/`, `public/`, `tests/unit/`, `tests/e2e/`, `.github/workflows/`

**Checkpoint**: `npm install` succeeds, all config files present, folder structure matches plan.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared design tokens, base HTML shell, type contracts, and CI pipeline that every user story phase depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T008 Create `src/types/index.ts` with `CountdownValue` interface (`days`, `hours`, `minutes`, `seconds`, `isExpired`) and `PageState` type union (`'countdown' | 'celebration'`) — exact shapes from `contracts/modules.md`
- [ ] T009 [P] Create `src/styles/tokens.css` with the full design token set from `contracts/css-tokens.md`: colour tokens (`--color-cream`, `--color-sage`, `--color-rose`, `--color-gold`, `--color-taupe`, `--color-forest`, `--color-ink`, `--color-white`) + semantic aliases, typography (`--font-display`, `--font-body`, fluid type scale `--text-xs` through `--text-hero`), spacing (`--space-1` through `--space-24`), border/radius, shadow, transition, and animation tokens
- [ ] T010 [P] Create `src/styles/reset.css`: modern CSS reset — `box-sizing: border-box` on `*`, zero margin/padding, `inherit` font, `line-height: 1`, `img`/`svg` `display: block` max-width 100%, `button` cursor pointer
- [ ] T011 Create `src/styles/global.css`: declare `@layer reset, tokens, base, components, utilities`; import reset and tokens; set `body` background `var(--color-cream)`, font `var(--font-body)`, colour `var(--color-text-primary)`; style `.skip-link` (visually hidden by default, visible on focus); set `font-variant-numeric: tabular-nums` on `.countdown__digit`
- [ ] T012 Create `src/index.html` per `contracts/html-structure.md`: open with `<html lang="en">`; full `<head>` with charset, viewport, CSP meta tag (`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'`), title, meta description, canonical link, all OG + Twitter Card meta tags; add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for Cormorant Garamond 600 italic WOFF2 (resolve the exact path from the `@fontsource` package after T001 — reduces LCP by font discovery); `<body data-state="countdown">`; skip link; `<main>` with `.countdown-screen` (full BEM structure including `#countdown`, `#countdown-days/hours/minutes/seconds`) and `.celebration-screen` (heading, illustration placeholder, message blockquote, stamp placeholder); note: `og:image` references `/lc-birthday/og-image.png` which is created in T039 — use that path as a placeholder until T039 is complete
- [ ] T013 Create `src/scripts/main.ts` **stub**: import only font and CSS files — `@fontsource/cormorant-garamond/400.css`, `600.css`, `700.css`; `@fontsource/nunito/300.css`, `400.css`, `600.css`; `../styles/tokens.css`; `../styles/global.css`; export an empty `init(): void` placeholder — do NOT import any TypeScript modules yet (`countdown.ts` and `celebration.ts` do not exist until Phase 3/4 and their absence would break `tsc` at the Phase 2 checkpoint); full module wiring is completed in T019 (Phase 4)
- [ ] T014 Create `.github/workflows/deploy.yml` with three jobs: (1) `build` — checkout, Node 22, `npm ci`, `npm run lint`, `npm run lint:css`, `npm run typecheck`, `npm test`, `npm run build`, upload pages artifact; (2) `lighthouse` — depends on `build`, starts `npm run preview` in background, runs `npm run lhci`, gates deploy on scores ≥ 90 performance / ≥ 95 accessibility (constitution §X requires Lighthouse CI to block deploy); (3) `deploy` — only on `main`, depends on `lighthouse`, uses `actions/deploy-pages@v4`, environment `github-pages`

**Checkpoint**: `npm run typecheck` passes, `npm run lint` passes, `npm run lint:css` passes, `npm test` passes (zero test files → zero failures), `npm run build` produces `dist/`

---

## Phase 3: User Story 1 — Live Countdown (Priority: P1) 🎯 MVP

**Goal**: Visitor opens the page and sees a live Days : Hours : Minutes : Seconds countdown ticking every second toward Leonor's birthday.

**Independent Test**: Open `http://localhost:5173/lc-birthday/` before 12 June 2026; all four labelled units visible and the seconds digit decrements each second.

### Implementation

- [ ] T015 [US1] Implement pure functions in `src/scripts/modules/countdown.ts`: `COUNTDOWN_TARGET_UTC_MS = 1749714300000` constant; `pad(value: number, width: number): string`; `getTimeRemaining(targetUtcMs: number): CountdownValue` using floor arithmetic from `data-model.md` — no DOM access, no side effects
- [ ] T016 [US1] Implement `startCountdown(): void` in `src/scripts/modules/countdown.ts`: `setInterval` at 1000 ms, call `getTimeRemaining`, update `#countdown-days/hours/minutes/seconds` text content via `pad()`, add/remove `countdown__digit--animating` modifier on each change; when `isExpired`, clear interval and dispatch `document.dispatchEvent(new CustomEvent('countdown:expired'))` — do NOT import `celebration.ts` directly (avoids a Phase 3/4 circular dependency; the listener is wired in `main.ts` at T019); guard against multiple `startCountdown()` calls with a module-level boolean flag
- [ ] T017 [P] [US1] Write unit tests in `tests/unit/countdown.test.ts` for `getTimeRemaining()`: future target → all non-negative values with `isExpired: false`; past target → all zeros with `isExpired: true`; present target (±1 ms) → `isExpired: true`; `pad()` → single digits zero-padded, multi-digit numbers unchanged, zero formatted correctly
- [ ] T018 [US1] Create `src/styles/components/countdown.css`: `.countdown-screen` full-viewport centred flex column; `.countdown-screen__header` with `.countdown-screen__title` in `var(--font-display)` italic weight 600 `var(--text-2xl)`; `.countdown-screen__for` small label with `.countdown-screen__nickname` in italic rose; `.countdown` flex-row gap `var(--space-6)`; `.countdown__unit` flex-column items-center; `.countdown__digit` font-size `var(--text-hero)` `var(--font-display)` weight 700 colour `var(--color-ink)` min-width for two-digit alignment; `.countdown__label` `var(--text-xs)` `var(--tracking-widest)` uppercase `var(--color-text-secondary)`; `.countdown__separator` `var(--text-3xl)` `var(--color-gold)` align-self center; `@keyframes digit-flip` slide-up; `.countdown__digit--animating` applies `var(--anim-digit-flip)`

**Checkpoint**: `npm test` passes; countdown module compiles cleanly with `tsc`; digit and CSS logic ready for wiring in Phase 4

---

## Phase 4: User Story 2 — Countdown Reaches Zero + Celebration (Priority: P1)

**Goal**: When the timer hits zero (or the page loads past the target), confetti bursts and a celebration reveal appears: heading, chibi illustration, personal message, "Momô Minium" stamp.

**Independent Test**: Override target to `Date.now() + 10_000`, wait 10 s — confetti fires, celebration screen appears with all four elements visible.

### Implementation

- [ ] T019 [US2] Complete `src/scripts/main.ts` (replaces Phase 2 stub): import `{ startCountdown, getTimeRemaining, COUNTDOWN_TARGET_UTC_MS }` from `./modules/countdown`; import `{ activate }` from `./modules/celebration`; on `DOMContentLoaded` — if `getTimeRemaining(COUNTDOWN_TARGET_UTC_MS).isExpired` is `true`, call `activate()` immediately without starting the timer (FR-005: page loaded after target shows celebration at once); otherwise call `startCountdown()` and add `document.addEventListener('countdown:expired', () => activate(), { once: true })` to handle the timed trigger; verify in browser that digits tick and the digit-flip animation is visible
- [ ] T020 [US2] Implement `launchBurst(): void` in `src/scripts/modules/confetti.ts`: dynamic `import('canvas-confetti')` inside try/catch for graceful degradation if blocked; dual-side burst (left `x: 0`, right `x: 1`) with palette colours `['#c8a96e','#d4a5a5','#8fad91','#f5efe6','#9e7a7a']`; `requestAnimationFrame` loop for 4 s
- [ ] T021 [US2] Implement `activate(): void` in `src/scripts/modules/celebration.ts`: return early if `document.body.dataset['state'] === 'celebration'` (idempotency); set `document.body.dataset['state'] = 'celebration'`; set `.celebration-screen` `aria-hidden="false"`, `.countdown-screen` `aria-hidden="true"`; call `launchBurst()`; `window.scrollTo({ top: 0, behavior: 'instant' })`
- [ ] T022 [P] [US2] Write unit tests in `tests/unit/celebration.test.ts` using jsdom: `activate()` sets `body.dataset.state` to `'celebration'`; calling `activate()` twice does not invoke `launchBurst()` a second time (mock the confetti module)
- [ ] T023 [US2] Create `src/styles/components/celebration.css`: `.celebration-screen` full-viewport centred flex column hidden by default (`display: none`); `body[data-state="celebration"] .countdown-screen { display: none }` + `body[data-state="celebration"] .celebration-screen { display: flex }`; `.celebration__heading` `var(--font-display)` italic weight 700 `var(--text-hero)` `var(--color-ink)` text-align centre; `.celebration__illustration` max-width 280px margin auto; `.celebration__message` `var(--font-body)` `var(--text-lg)` `var(--leading-loose)` `var(--color-text-secondary)` max-width 480px text-align centre; `.celebration__stamp` width 120px margin-inline auto opacity 0.85; entrance animation `var(--anim-celebration)` on `.celebration__content`
- [ ] T024 [P] [US2] Source chibi girl illustration: search Freepik free tier for "kawaii girl reading book flowers vintage" or "chibi girl botanical"; recolour SVG fills to palette (`--color-sage`, `--color-rose`, `--color-cream`); include motifs for book, flower cluster, small suitcase, teacup; save as `src/assets/images/chibi-leonor.svg` — if no suitable royalty-free asset found, compose from CSS art + emoji elements (📚🌸🧳☕) styled within `.celebration__illustration`
- [ ] T025 [P] [US2] Create `Momô Minium` wax seal SVG from scratch: circle path with `--color-gold` stroke and semi-transparent fill; "Momô Minium" text on circular path in Cormorant Garamond italic; small floral motif at centre; save as `src/assets/images/stamp-momo.svg`
- [ ] T026 [US2] Integrate SVG assets into `src/index.html`: replace `.celebration__illustration` placeholder with `<img src="..." alt="Illustration of a girl surrounded by books, flowers, a suitcase, and a teacup" width="280" height="280">`; replace `.celebration__stamp` placeholder with `<img src="..." role="img" aria-label="Momô Minium seal" width="120" height="120">`; add Leonor's personal message text to `.celebration__message > p`: *"Wishing the happiest of birthdays to my favorite person. You deserve the world today and always!"*
- [ ] T027 [US2] Verify full celebration flow end-to-end per `quickstart.md` Scenarios 3 and 4 (covers FR-005): past-target override confirms immediate celebration on page load; near-future override confirms timed trigger; revert both overrides; `npm test` passes

**Checkpoint**: Both P1 stories fully functional — countdown ticks, celebration triggers at zero and on late load, all four reveal elements visible, confetti fires

---

## Phase 5: User Story 3 — Immersive Aesthetic Experience (Priority: P2)

**Goal**: The page reads as a cohesive handcrafted gift — palette, typography, and botanical motifs coherently express K-drama / old money / nature / country aesthetics and the kawaii illustration style.

**Independent Test**: Show the page to a neutral viewer — they describe the mood as "cute," "elegant," or "nature-inspired" without prompting.

### Implementation

- [ ] T028 [P] [US3] Create `src/styles/components/decorations.css`: botanical ambient decorations for the countdown screen — CSS-drawn leaf clusters, subtle petal shapes, or inline SVG motifs as `::before`/`::after` pseudo-elements on `.countdown-screen__decorations`; interest nods: small book icon, leaf sprig, travel-stamp shape — all `aria-hidden="true"`, decorative only
- [ ] T029 [P] [US3] Typography pass: ensure `.countdown-screen__title` uses Cormorant Garamond italic 600, `.countdown-screen__for` uses Nunito 300 with `--color-taupe`, `.countdown__digit` uses Cormorant Garamond 700, `.countdown__label` uses Nunito 400 `--tracking-widest`, all celebration headings use Cormorant Garamond italic; verify font-display swap working (WOFF2 served from self in Network tab)
- [ ] T030 [US3] WCAG 2.1 AA contrast audit: run axe DevTools on both screens; verify `--color-ink` on `--color-cream` (≥ 13:1 ✅), `--color-forest` on `--color-cream` (≥ 5.8:1 ✅), `--color-gold` only on decorative/large text (not body copy); fix any contrast failures axe reports
- [ ] T031 [US3] Aesthetic review pass: cross-check that all four interest references are visible (reading → chibi book / botanical decoration; K-drama → palette / soft warm tones; nature → botanical motifs; country/old money → Cormorant Garamond / gold accents / stamp); adjust decorations or illustration if any interest feels absent

**Checkpoint**: Axe reports zero critical/serious issues; a neutral viewer identifies the correct aesthetic

---

## Phase 6: User Story 4 — Seamless Mobile & Desktop (Priority: P2)

**Goal**: The page renders beautifully and functions correctly on all viewport widths from 320 px to 2560 px, with smooth confetti on mobile.

**Independent Test**: Open on iPhone SE emulation (375 × 667) and a 1440 px desktop; no overflow, no truncation, no lag.

### Implementation

- [ ] T032 [US4] Responsive CSS for countdown screen in `src/styles/components/countdown.css`: at `max-width: 480px` reduce `.countdown__digit` to `var(--text-3xl)`, reduce gap, allow `.countdown` to wrap to 2×2 grid; heading text wraps cleanly; add `padding-inline: var(--space-4)` on `.countdown-screen`
- [ ] T033 [US4] Responsive CSS for celebration screen in `src/styles/components/celebration.css`: at `max-width: 480px` reduce `.celebration__heading` to `var(--text-2xl)`, constrain `.celebration__illustration` to `max-width: 200px`, reduce `.celebration__stamp` to 80 px, add `padding-inline: var(--space-4)` to `.celebration__content`
- [ ] T034 [US4] Implement and verify keyboard navigation in `src/styles/global.css` and `src/index.html`: confirm `.skip-link` is the first focusable element (Tab from page load hits it first); add `tabindex="-1"` to all `aria-hidden="true"` decoration elements to exclude them from Tab order; verify Tab sequence through both screens is logical; confirm no focus trap exists on either screen; fix any issues found in place
- [ ] T035 [US4] Test and optimise confetti performance in `src/scripts/modules/confetti.ts`: in Chrome DevTools CPU throttle 4× → trigger celebration → if frame rate drops below 30 fps, reduce `particleCount` to 1 per side per frame; add `window.matchMedia('(prefers-reduced-motion: reduce)').matches` guard that skips the entire confetti animation for users who prefer reduced motion (accessibility + performance)

**Checkpoint**: No horizontal overflow at 320 px; no breakage at 2560 px; Tab navigation logical; confetti smooth at 4× throttle

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Production-readiness gates, SEO assets, caching policy, performance validation, and final accessibility sign-off.

- [ ] T036 [P] Create `public/robots.txt`: `User-agent: *`, `Allow: /`, `Sitemap: https://joaofaria.github.io/lc-birthday/sitemap.xml`
- [ ] T037 [P] Create `public/sitemap.xml`: single `<url>` entry for `https://joaofaria.github.io/lc-birthday/` with `<lastmod>2026-06-10</lastmod>`
- [ ] T038 [P] Create `public/favicon.svg`: simple botanical/floral icon (leaf or small flower) in `--color-sage` on transparent background; add `<link rel="icon" type="image/svg+xml" href="/lc-birthday/favicon.svg">` to `src/index.html`
- [ ] T039 [P] Create `public/og-image.png` (1200 × 630): cream background, "Happy Birthday, Leonor! 🌿" in Cormorant Garamond (hand-crafted in Figma / Canva or generated via script); verify the OG and Twitter Card `<meta content>` paths in `src/index.html` (set as placeholder in T012) point to this file correctly
- [ ] T040 Create `lighthouserc.json`: `url: 'http://localhost:4173/lc-birthday/'`, thresholds performance ≥ 90 / accessibility ≥ 95 / best-practices ≥ 90 / SEO ≥ 90; run `npm run lhci` against `npm run preview` and fix any threshold failures
- [ ] T041 Final bundle size check: `npm run build`, inspect `dist/` transferred sizes; confirm total JS ≤ 50 kB gzipped; if over budget, audit `@fontsource` weight variants and drop unused ones
- [ ] T042 Full `quickstart.md` validation run: execute all 10 scenarios in order; fix any failures; re-run until all pass
- [ ] T043 Final code quality pass: `npm run lint`, `npm run lint:css`, `npm run format:check`, `npm run typecheck`, `npm test` — all must exit 0
- [ ] T044 Create `public/_headers` with cache directives per constitution §IX: `Cache-Control: max-age=31536000, immutable` for `/assets/*` (Vite-hashed JS, CSS, font, image files); `Cache-Control: no-cache` for `/index.html` (entry point must always revalidate so the browser picks up new deploys)

**Checkpoint**: All CI gates green, Lighthouse ≥ 90, bundle ≤ 50 kB, axe zero critical issues, all quickstart scenarios pass, `_headers` in place

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T002–T007 parallel after T001
- **Phase 2 (Foundational)**: Depends on Phase 1 — T008–T011 parallel; T012 after T011; T013 after T008 (stub only — no countdown/celebration imports); T014 independent
- **Phase 3 (US1)**: Depends on Phase 2 — T015 before T016; T017 parallel with T015; T018 parallel with T015; phase ends at T018
- **Phase 4 (US2)**: Depends on Phase 3 — T019 first (completes main.ts, wires event listener); T020 parallel with T022 and T023; T021 after T020; T024 and T025 parallel; T026 after T021+T023+T024+T025; T027 after T026
- **Phase 5 (US3)**: Depends on Phase 2 — T028/T029 parallel; T030 after T029; T031 after T028–T030
- **Phase 6 (US4)**: Depends on Phase 3 and Phase 4 — T032/T033 parallel; T034 after T032/T033; T035 after T020
- **Phase 7 (Polish)**: Depends on Phase 3–6 — T036–T039 parallel; T040–T044 sequential

### User Story Dependencies

- **US1 (P1 — Countdown)**: Starts after Phase 2. Independent — no dependency on US2/US3/US4.
- **US2 (P1 — Celebration)**: Starts after Phase 3. T019 wires the event bridge; T020–T027 implement the celebration layer.
- **US3 (P2 — Aesthetic)**: Can start after Phase 2. CSS/decoration tasks run in parallel with US1/US2; typography pass runs after Phase 3/4 components are in place.
- **US4 (P2 — Responsive)**: Starts after Phase 3 and Phase 4 CSS exists.

---

## Parallel Example: Phase 2

```
T008 src/types/index.ts          ─┐
T009 src/styles/tokens.css        ├─ parallel
T010 src/styles/reset.css         ┘
T011 src/styles/global.css       ← after T009, T010
T012 src/index.html              ← after T011
T013 src/scripts/main.ts (stub)  ← after T008
T014 .github/workflows/deploy.yml ─ independent
```

## Parallel Example: Phase 4 (US2)

```
T019 main.ts (wiring + FR-005)    ← first in phase

T020 confetti.ts                  ─┐
T022 celebration.test.ts          ├─ parallel
T023 celebration.css              ┘
T021 celebration.ts              ← after T020

T024 chibi-leonor.svg             ─┐ parallel
T025 stamp-momo.svg               ┘
T026 integrate into index.html   ← after T021+T023+T024+T025
T027 e2e verification (FR-005)   ← after T026
```

---

## Implementation Strategy

### MVP First (US1 + US2 — Both P1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (live countdown)
4. **STOP**: Validate — digits tick, no layout shift, `npm test` green
5. Complete Phase 4: US2 (celebration + confetti)
6. **STOP**: Validate — confetti fires, all reveal elements appear, FR-005 works
7. Deploy to `joaofaria.github.io/lc-birthday` for a preview link

### Incremental Delivery

1. Setup + Foundational → working build pipeline
2. US1 → working countdown (shareable as a teaser)
3. US2 → full surprise experience ready
4. US3 → polished aesthetic, feels like a gift
5. US4 → flawless on her phone
6. Polish → production-ready, Lighthouse ≥ 90

---

## Notes

- [P] tasks operate on different files — safe to run in parallel
- [Story] label maps each task to its spec user story for traceability
- `startCountdown()` dispatches `countdown:expired` event; `main.ts` (T019) listens and calls `activate()` — no circular import between countdown and celebration modules
- The personal message is hardcoded in `src/index.html` (T026): *"Wishing the happiest of birthdays to my favorite person. You deserve the world today and always!"*
- Countdown target UTC ms: `1749714300000` = 12 June 2026 07:45:00 UTC = 09:45 WEST
- Deploy URL: `https://joaofaria.github.io/lc-birthday/`
- Revert any temporary timestamp overrides (quickstart.md Scenarios 3/4) before every commit
- **Total tasks: 44** (T001–T044)
