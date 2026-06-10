# HTML Structure Contract

**Phase**: 1 | **Date**: 2026-06-10

Defines the semantic HTML landmark structure and BEM class names. TypeScript modules target elements by these IDs and classes — do not rename without updating the module contracts.

---

## Document Structure

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'">
  <title>Happy Birthday, Leonor! 🌿</title>
  <meta name="description" content="A birthday surprise for Leonor — counting down to a special moment.">
  <link rel="canonical" href="https://joaofaria.github.io/lc-birthday/">

  <!-- Open Graph -->
  <meta property="og:title"       content="Happy Birthday, Leonor!">
  <meta property="og:description" content="A birthday surprise just for you.">
  <meta property="og:image"       content="https://joaofaria.github.io/lc-birthday/og-image.png">
  <meta property="og:url"         content="https://joaofaria.github.io/lc-birthday/">
  <meta property="og:type"        content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="Happy Birthday, Leonor!">
  <meta name="twitter:description" content="A birthday surprise just for you.">
  <meta name="twitter:image"       content="https://joaofaria.github.io/lc-birthday/og-image.png">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <!-- Vite injects bundled CSS here at build time -->
</head>

<body data-state="countdown">

  <!-- Skip link — first focusable element (WCAG) -->
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <main id="main-content">

    <!-- ═══════════════════════════════════════════════════ -->
    <!--  COUNTDOWN SCREEN                                   -->
    <!--  Visible when body[data-state="countdown"]          -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section class="countdown-screen" aria-label="Birthday countdown">

      <header class="countdown-screen__header">
        <p class="countdown-screen__for">for <em class="countdown-screen__nickname">Momo</em> ♡</p>
        <h1 class="countdown-screen__title">Counting down to<br>Leonor's birthday</h1>
      </header>

      <!-- Live region so screen readers announce updates -->
      <div class="countdown"
           id="countdown"
           role="timer"
           aria-live="off"
           aria-label="Time remaining until Leonor's birthday">

        <div class="countdown__unit">
          <span class="countdown__digit" id="countdown-days" aria-label="days">00</span>
          <span class="countdown__label" aria-hidden="true">Days</span>
        </div>

        <span class="countdown__separator" aria-hidden="true">:</span>

        <div class="countdown__unit">
          <span class="countdown__digit" id="countdown-hours" aria-label="hours">00</span>
          <span class="countdown__label" aria-hidden="true">Hours</span>
        </div>

        <span class="countdown__separator" aria-hidden="true">:</span>

        <div class="countdown__unit">
          <span class="countdown__digit" id="countdown-minutes" aria-label="minutes">00</span>
          <span class="countdown__label" aria-hidden="true">Minutes</span>
        </div>

        <span class="countdown__separator" aria-hidden="true">:</span>

        <div class="countdown__unit">
          <span class="countdown__digit" id="countdown-seconds" aria-label="seconds">00</span>
          <span class="countdown__label" aria-hidden="true">Seconds</span>
        </div>

      </div>

      <!-- Ambient decorations (aria-hidden — purely decorative) -->
      <div class="countdown-screen__decorations" aria-hidden="true">
        <!-- SVG botanical motifs injected here or as CSS background -->
      </div>

    </section>

    <!-- ═══════════════════════════════════════════════════ -->
    <!--  CELEBRATION SCREEN                                 -->
    <!--  Visible when body[data-state="celebration"]        -->
    <!-- ═══════════════════════════════════════════════════ -->
    <section class="celebration-screen"
             aria-label="Birthday celebration"
             aria-hidden="true">   <!-- toggled to false when activated -->

      <div class="celebration__content">

        <h1 class="celebration__heading">Happy Birthday,<br>Leonor!</h1>

        <div class="celebration__illustration" role="img"
             aria-label="Illustration of a girl surrounded by books, flowers, a suitcase, and a teacup">
          <!-- chibi-leonor.svg inlined or <img src> -->
        </div>

        <blockquote class="celebration__message">
          <p>Wishing the happiest of birthdays to my favorite person.
             You deserve the world today and always!</p>
        </blockquote>

        <div class="celebration__stamp" aria-label="Momô Minium seal" role="img">
          <!-- stamp-momo.svg -->
        </div>

      </div>

    </section>

  </main>

  <!-- Vite injects bundled JS here at build time -->
</body>
</html>
```

---

## BEM Class Reference

| Block | Element | Modifier | Purpose |
|---|---|---|---|
| `countdown-screen` | — | — | Countdown page section |
| `countdown-screen` | `__header` | — | Title + nickname area |
| `countdown-screen` | `__for` | — | "for Momo ♡" subtitle |
| `countdown-screen` | `__nickname` | — | Italic "Momo" emphasis |
| `countdown-screen` | `__title` | — | `<h1>` heading |
| `countdown-screen` | `__decorations` | — | Botanical decor wrapper |
| `countdown` | — | — | Timer widget |
| `countdown` | `__unit` | — | Single unit column (days/hours/etc.) |
| `countdown` | `__digit` | — | The number display |
| `countdown` | `__digit` | `--animating` | Applied by JS on change to trigger CSS animation |
| `countdown` | `__label` | — | "Days" / "Hours" / etc. text |
| `countdown` | `__separator` | — | The `:` character |
| `celebration-screen` | — | — | Celebration page section |
| `celebration` | `__content` | — | Centered content wrapper |
| `celebration` | `__heading` | — | "Happy Birthday, Leonor!" |
| `celebration` | `__illustration` | — | Chibi SVG container |
| `celebration` | `__message` | — | Personal message blockquote |
| `celebration` | `__stamp` | — | "Momô Minium" wax seal |

---

## JS Anchor IDs

| ID | Element | Used by |
|---|---|---|
| `countdown` | Timer div | `startCountdown()` — polls for aria-label update |
| `countdown-days` | Days digit span | `startCountdown()` — updates text content |
| `countdown-hours` | Hours digit span | `startCountdown()` |
| `countdown-minutes` | Minutes digit span | `startCountdown()` |
| `countdown-seconds` | Seconds digit span | `startCountdown()` |
