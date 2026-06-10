# Quickstart & Validation Guide

**Phase**: 1 | **Date**: 2026-06-10 | **Plan**: [plan.md](./plan.md)

A runnable guide for validating the feature end-to-end during and after implementation. Not an implementation guide — for implementation steps see `tasks.md`.

---

## Prerequisites

- Node.js 22 LTS
- npm 10+
- A modern browser (Chrome 100+ recommended for DevTools)
- Repository cloned: `git clone https://github.com/joaofaria/lc-birthday.git`

---

## Setup

```bash
cd lc-birthday
npm install
```

Expected: no errors, `node_modules/` created, `@fontsource`, `canvas-confetti`, `vite`, and `vitest` installed.

---

## Scenario 1 — Dev Server Launches

```bash
npm run dev
```

**Expected outcome**:
- Vite starts on `http://localhost:5173/lc-birthday/` (base path applied)
- Opening the URL in a browser shows the countdown screen
- The page background is `#f5efe6` (cream), not a blank white
- Cormorant Garamond loads for the heading; Nunito loads for the countdown labels
- No console errors

---

## Scenario 2 — Countdown Ticks

With dev server running, open `http://localhost:5173/lc-birthday/` in a browser.

**Expected outcome**:
- All four units visible: `Days : Hours : Minutes : Seconds`
- Values are non-zero (target is June 12 2026 — well in the future)
- Seconds digit decrements every 1 second
- No layout shift (CLS) as digits change — widths remain fixed
- Digits animate with a subtle slide-up transition on each change

---

## Scenario 3 — Celebration State Triggers (Manual Test)

In `src/scripts/modules/countdown.ts`, temporarily change:

```typescript
// Change this:
const COUNTDOWN_TARGET_UTC_MS = 1749714300000;
// To a timestamp 10 seconds in the future:
const COUNTDOWN_TARGET_UTC_MS = Date.now() + 10_000;
```

Save and wait 10 seconds in the browser.

**Expected outcome**:
1. Confetti bursts from both sides of the screen in palette colours (sage, rose, gold, cream, taupe)
2. Countdown screen fades out / hides
3. Celebration screen appears with:
   - `"Happy Birthday, Leonor!"` heading in Cormorant Garamond
   - Chibi illustration visible, with `alt` text
   - Personal message text visible
   - "Momô Minium" stamp visible in corner
4. No console errors
5. `body[data-state]` changes from `"countdown"` to `"celebration"` (verify in DevTools)

**Revert the timestamp change before committing.**

---

## Scenario 4 — Post-Expiry Load (Manual Test)

Change the target to a timestamp in the past:

```typescript
const COUNTDOWN_TARGET_UTC_MS = Date.now() - 1_000;
```

Reload the page from scratch (hard refresh).

**Expected outcome**:
- Celebration screen appears immediately on load — no countdown flash
- Confetti launches on load
- No countdown timer is visible at any point

**Revert before committing.**

---

## Scenario 5 — Unit Tests Pass

```bash
npm test
```

**Expected outcome**:
- `countdown.test.ts`: `getTimeRemaining()` returns correct values for future, present, and past targets; `pad()` formats correctly; `isExpired` is `false` for future, `true` for past
- `celebration.test.ts`: `activate()` sets `body[data-state="celebration"]`; calling `activate()` twice has no secondary effect
- All tests green, zero failures

---

## Scenario 6 — Build Succeeds

```bash
npm run build
```

**Expected outcome**:
- No TypeScript errors (`tsc --noEmit` passes)
- No ESLint errors
- No Stylelint errors
- `dist/` directory created with `index.html`, hashed JS/CSS assets, font files, SVG images
- No files in `dist/` reference `localhost`

---

## Scenario 7 — Performance Budget

```bash
npm run build
npm run preview
```

Open `http://localhost:4173/lc-birthday/` and run Lighthouse (Chrome DevTools → Lighthouse tab → Mobile preset).

**Expected outcome**:
- Performance score ≥ 90
- LCP < 2.5 s
- CLS < 0.1
- INP < 200 ms
- Total JS transferred: < 50 kB (verify in Network tab, filter by JS, check "transferred" column)

---

## Scenario 8 — Mobile Rendering

Open Chrome DevTools → toggle device toolbar → select "iPhone SE" (375 × 667).

**Expected outcome**:
- All four countdown units visible simultaneously on one line or gracefully stacked
- No horizontal overflow (verify: DevTools → Elements → `<html>` scroll width = viewport width)
- Heading and message text readable at mobile scale
- Countdown digit font size legible without zooming

---

## Scenario 9 — Accessibility Spot-Check

Install the [axe DevTools](https://www.deque.com/axe/devtools/) Chrome extension.

Run axe on the countdown screen and the celebration screen (trigger Scenario 3 first).

**Expected outcome**:
- Zero critical or serious violations on both screens
- All images have non-empty `alt` attributes
- Colour contrast: no failures
- Heading hierarchy: single `<h1>` on each screen
- Focus order: Tab key reaches the skip link first, then navigates logically

---

## Scenario 10 — GitHub Pages Deploy Preview

After merging to `main`, GitHub Actions runs the deploy workflow.

**Expected outcome**:
- `build`, `lint`, `typecheck`, `test` jobs all pass
- `deploy` job succeeds; GitHub Pages URL `https://joaofaria.github.io/lc-birthday/` shows the live page
- No 404 on assets (fonts, SVGs, JS, CSS)
- Countdown is live and ticking

---

## Reference

| Item | Value |
|---|---|
| Countdown target (UTC ms) | `1749714300000` |
| Countdown target (human) | 12 June 2026, 09:45 WEST |
| Deploy URL | `https://joaofaria.github.io/lc-birthday/` |
| Vite base path | `/lc-birthday/` |
| Primary name | Leonor |
| Nickname | Momo |
| Stamp name | Momô Minium |
| Message | "Wishing the happiest of birthdays to my favorite person. You deserve the world today and always!" |
