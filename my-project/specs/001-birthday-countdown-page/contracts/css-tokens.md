# CSS Custom Property Contracts (tokens.css)

**Phase**: 1 | **Date**: 2026-06-10

All raw values (hex codes, px, rem, etc.) live ONLY in `tokens.css`. All other CSS files reference these tokens exclusively.

---

## Colour Tokens

```css
:root {
  /* Surfaces */
  --color-cream:   #f5efe6;   /* page background */
  --color-white:   #fafaf8;   /* cards, digit containers */

  /* Palette */
  --color-sage:    #8fad91;   /* botanical accent, labels */
  --color-rose:    #d4a5a5;   /* warm accent, celebration highlights */
  --color-gold:    #c8a96e;   /* old money accent, stamp, borders */
  --color-taupe:   #9e7a7a;   /* secondary text */
  --color-forest:  #4a6741;   /* deep botanical, strong accent */
  --color-ink:     #2c2c2c;   /* primary text — 13:1 on cream ✅ */

  /* Semantic aliases */
  --color-text-primary:    var(--color-ink);
  --color-text-secondary:  var(--color-taupe);
  --color-accent-primary:  var(--color-gold);
  --color-accent-nature:   var(--color-sage);
  --color-accent-warm:     var(--color-rose);
  --color-surface:         var(--color-cream);
  --color-surface-raised:  var(--color-white);
}
```

---

## Typography Tokens

```css
:root {
  /* Font families */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Nunito', system-ui, sans-serif;

  /* Type scale (fluid) */
  --text-xs:   clamp(0.75rem,  1.5vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 2vw,   1rem);
  --text-base: clamp(1rem,     2.5vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 3vw,   1.375rem);
  --text-xl:   clamp(1.375rem, 4vw,   1.75rem);
  --text-2xl:  clamp(1.75rem,  5vw,   2.5rem);
  --text-3xl:  clamp(2.5rem,   7vw,   4rem);
  --text-hero: clamp(3rem,     10vw,  6rem);

  /* Weights */
  --weight-light:   300;
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-semibold: 600;
  --weight-bold:    700;

  /* Line heights */
  --leading-tight:  1.2;
  --leading-snug:   1.4;
  --leading-normal: 1.6;
  --leading-loose:  1.8;

  /* Letter spacing */
  --tracking-tight:  -0.02em;
  --tracking-normal:  0;
  --tracking-wide:    0.08em;
  --tracking-widest:  0.2em;
}
```

---

## Spacing Tokens

```css
:root {
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

---

## Border & Radius Tokens

```css
:root {
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  --border-thin:   1px solid var(--color-gold);
  --border-medium: 2px solid var(--color-gold);
}
```

---

## Shadow & Effect Tokens

```css
:root {
  --shadow-soft: 0 2px 16px rgba(44, 44, 44, 0.06);
  --shadow-card: 0 4px 24px rgba(44, 44, 44, 0.10);

  --transition-fast:   150ms ease;
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:   500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Animation Tokens

```css
:root {
  --anim-digit-flip:    digit-flip 0.3s var(--transition-normal);
  --anim-fade-in:       fade-in    0.5s var(--transition-normal);
  --anim-slide-up:      slide-up   0.6s var(--transition-normal);
  --anim-celebration:   celebration-enter 0.8s var(--transition-slow);
}
```
