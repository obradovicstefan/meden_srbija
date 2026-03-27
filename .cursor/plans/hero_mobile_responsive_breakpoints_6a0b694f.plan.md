---
name: Hero mobile responsive breakpoints
overview: Add mobile/tablet and small-phone responsive styles to the landing hero without altering any existing desktop rules, and adjust the hero video framing/overlay for better mobile legibility.
todos:
  - id: recon-hero-css
    content: "Re-read `components/Hero.css` and confirm no existing breakpoints; append new `max-width: 768px` and `max-width: 480px` blocks exactly at file bottom."
    status: pending
  - id: hero-video-props
    content: 'Update `components/Hero.tsx` `<video>` element to include inline `style={{ objectPosition: "center center" }}` while preserving existing desktop behavior (keep `className="heroBg"`).'
    status: pending
  - id: mobile-video-overlay-rules
    content: "Inside the new `@media (max-width: 768px)` block add `.heroBg { object-position: 60% center; }` and heavier `.overlay { background: linear-gradient(...) }` as specified."
    status: pending
  - id: verify-mobile-layout
    content: Run dev server and verify layout at 375/390/414/768px; fix any issues strictly within the new media query blocks.
    status: pending
isProject: false
---

## Reconnaissance digest (what exists today)

- **Hero implementation**: `[components/Hero.tsx](components/Hero.tsx)` uses global class names and imports `[components/Hero.css](components/Hero.css)` (not CSS modules).
- **Breakpoint conventions** (project-wide): `app/globals.css` and other CSS use a mix of `@media (max-width: 1024px)`, `@media (max-width: 768px)`, `@media (max-width: 640px)` and some `@media (min-width: 768px)` (e.g. `.hero-bg-fixed`). So **px-based breakpoints** are already in use, and `**max-width: 768px` is established.
- **Tailwind**: `app/globals.css` includes `@import "tailwindcss";` (Tailwind v4 style), but the hero section here is styled via plain CSS.

## Implementation approach

- Only touch `[components/Hero.css](components/Hero.css)` by **appending** two new blocks at the very bottom:
  - `@media (max-width: 768px)`
  - `@media (max-width: 480px)`
- Do **not** edit or reorder any existing desktop rules.
- Update `[components/Hero.tsx](components/Hero.tsx)` `<video>` element to include the requested inline `style={{ objectPosition: "center center" }}` while keeping the existing `className="heroBg"` (since this hero does not use `styles.`).

## Verification approach

- Run the dev server and validate in Chrome DevTools device toolbar at widths: **375px, 390px, 414px, 768px**.
- Confirm:
  - Heading clamp scales smoothly with no overflow.
  - CTA buttons stack, full-width, and stay centered.
  - Gold line/eyebrow/heading/subtitle/CTAs remain centered and readable.
  - Bottom `scrollHint` + `meta` do not overlap/overflow.
  - No horizontal scrolling introduced.
- If any overlap/overflow/h-scroll appears, adjust **only within the two new media query blocks** until resolved.
