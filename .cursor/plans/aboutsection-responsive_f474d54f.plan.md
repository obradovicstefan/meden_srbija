---
name: aboutsection-responsive
overview: Refactor AboutSection’s responsive CSS for tablet (640–1023) and mobile (<640) without changing any desktop (≥1024) styles, markup structure, logic, content, or animation durations.
todos:
  - id: refactor-breakpoints
    content: Refactor AboutSection.css breakpoints to tablet (640–1023) and mobile (≤639) without affecting desktop.
    status: pending
  - id: hero-split-responsive
    content: "Implement tablet/mobile rules for hero split: stacking, photo sizing, photo-wrap relative, padding/typography tweaks, stats responsiveness, hide corner brackets."
    status: pending
  - id: divider-responsive
    content: Ensure diamond divider padding uses tablet/mobile values under corrected breakpoint ranges.
    status: pending
  - id: team-responsive
    content: "Implement tablet/mobile rules for team block: stacked grid, hide vertical line, separator, header sizing, avatar/name/bio sizing, card padding."
    status: pending
  - id: overlay-caption-mobile
    content: Strengthen photo overlay gradient on tablet/mobile and adjust caption layout on mobile.
    status: pending
  - id: mobile-animation-simplify
    content: On mobile, switch translateX→translateY for photo reveal and halve stagger delays (keep duration unchanged).
    status: pending
  - id: verify
    content: Run lint/build and sanity-check 375px/768px/≥1024px layouts.
    status: pending
isProject: false
---

## What we’re changing (and not changing)

- **Change**: responsive overrides in `components/sections/AboutSection.css` for **tablet (640–1023px)** and **mobile (≤639px)**.
- **Do NOT change**: desktop styles (≥1024px), `components/sections/AboutSection.tsx` markup/structure, any logic/state/content, or animation **durations**.
- **Breakpoints**: confirmed desktop is **≥1024px** (tablet ends at **1023px**).

## Repo reality (recon)

- About section is implemented at `components/sections/AboutSection.tsx` with plain CSS in `components/sections/AboutSection.css` (not Tailwind responsive prefixes).
- No `tailwind.config.` is present; we’ll use **CSS media queries**.
- Hero uses mobile-friendly padding patterns in `components/Hero.css` and uses Montserrat/Cormorant variables.

## Plan

### Phase 1 — Replace existing breakpoint rules with correct ranges

Update `components/sections/AboutSection.css`:

- Replace any current `@media (max-width: 1024px)` rules with **tablet-only** `@media (min-width: 640px) and (max-width: 1023px)`.
- Replace any current `@media (max-width: 640px)` rules with **mobile** `@media (max-width: 639px)`.
- Keep all base (desktop) rules untouched.

### Phase 2 — Part 1: Hero split responsive (photo + text)

In `components/sections/AboutSection.css`, add tablet + mobile overrides:

**Tablet (640–1023px)**

- `.aboutV4Grid`:
  - `grid-template-columns: 1fr; grid-template-rows: auto auto; height: auto; min-height: auto;`
- `.aboutV4Right` (photo column):
  - `order: -1; height: 56vw; min-height: 320px; max-height: 480px;`
- `.aboutV4PhotoWrap`:
  - `position: relative; inset: auto; top: 0; left: 0; right: 0; bottom: 0; height: 100%; border-radius: 0;`
- Corner brackets:
  - `.aboutV4CornerTL, .aboutV4CornerBR { display: none; }`
- `.aboutV4Left`:
  - `padding: 56px 40px 64px;`
- `.aboutV4Title`:
  - `font-size: 44px;`
- `.aboutV4Underline`:
  - `width: 40px;`
- Stats row:
  - keep `display: flex`, allow wrap if needed (`flex-wrap: wrap`), and set `.aboutV4Stat { padding: 16px 18px; }`

**Mobile (≤639px)**

- Use the same stack as tablet, but:
  - `.aboutV4Right`: `height: 72vw; min-height: 260px;` (no max-height required)
  - `.aboutV4Left`: `padding: 40px 24px 52px;`
  - `.aboutV4Eyebrow`: `font-size: 10px;`
  - `.aboutV4Title`: `font-size: 34px;`
  - `.aboutV4Paragraph`: `font-size: 14.5px;`
  - Stats row becomes grid:
    - `.aboutV4Stats { display: grid; grid-template-columns: 1fr 1fr; }`
    - third stat spans full width:
      - target `.aboutV4StatLast { grid-column: 1 / -1; border-right: none; border-top: 1px solid rgba(201,146,10,0.12); }`
  - `.aboutV4StatNumber`: `font-size: 26px;`
  - Button:
    - `.aboutV4Button { width: 100%; justify-content: center; }`

### Phase 3 — Part 2: Diamond divider responsive padding

Ensure `components/sections/AboutSection.css` sets:

- Tablet: `.aboutV4DiamondDivider { padding: 0 40px; }`
- Mobile: `.aboutV4DiamondDivider { padding: 0 24px; }`
(These will move under the corrected breakpoint ranges so desktop is unaffected.)

### Phase 4 — Part 3: Team section responsive

In `components/sections/AboutSection.css`:

**Tablet (640–1023px)**

- `.aboutV4Team`: `padding: 72px 40px 80px;`
- `.aboutV4TeamGrid`: `grid-template-columns: 1fr; gap: 0;`
- Hide vertical center line: `.aboutV4TeamGrid::after { display: none; }`
- Horizontal separator between cards without changing structure:
  - keep using `.aboutV4TeamCard:first-child::after` (already present) but ensure it matches the gradient spec and is only active on tablet/mobile.
- `.aboutV4TeamTitle`: `font-size: 36px;`
- `.aboutV4TeamCard`: `padding: 52px 40px;` (and remove the special “padding-top/bottom 72px” spacing if it conflicts)

**Mobile (≤639px)**

- `.aboutV4Team`: `padding: 56px 24px 72px;`
- `.aboutV4TeamTitle`: `font-size: 28px;`
- `.aboutV4TeamEyebrow`: `font-size: 10px;`
- Avatar sizing:
  - `.aboutV4AvatarWrap` and `.aboutV4AvatarInner`: `160px × 160px`
  - `.aboutV4AvatarWrap::before { inset: -4px; }`
  - `.aboutV4AvatarWrap::after { inset: -10px; }`
- `.aboutV4TeamName`: `font-size: 26px;`
- Bio typography:
  - `.aboutV4TeamBio { max-width: 280px; }`
  - `.aboutV4TeamBio p { font-size: 13.5px; }`
- Card padding:
  - `.aboutV4TeamCard { padding: 40px 16px; }`

### Phase 5 — Photo overlay + caption adjustments (tablet + mobile)

In `components/sections/AboutSection.css`:

- Tablet + mobile: strengthen overlay gradient on `.aboutV4PhotoOverlay`:
  - `transparent 35% → rgba(10,8,5,0.9) 100%`
- Mobile caption bar layout:
  - `.aboutV4Caption { bottom: 16px; left: 16px; right: 16px; flex-direction: column; align-items: flex-start; gap: 8px; }`

### Phase 6 — Mobile animation simplification (no duration changes)

In `components/sections/AboutSection.css` under `@media (max-width: 639px)`:

- Override `.reveal-about-v4` so the right/photo column uses **translateY** instead of translateX.
- Reduce existing stagger **delays by ~50%** (keep `0.7s` duration and the same easing).
- Keep `prefers-reduced-motion` overrides intact.

### Phase 7 — Verification

- Run `npm run lint`.
- Run `npm run build`.
- Manual spot-check at widths:
  - 375px: no horizontal overflow, caption readable, stats third item spans, button full-width.
  - 768px: photo on top, correct paddings, corner brackets hidden.
  - ≥1024px: unchanged desktop layout/styling.

