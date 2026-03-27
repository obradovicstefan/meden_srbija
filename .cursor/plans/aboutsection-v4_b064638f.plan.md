---
name: aboutsection-v4
overview: Implement the AboutSection v4 two-column, full-viewport section with exact typography/colors, scroll-triggered staggered entrance animation, and integrate it directly under the hero while replacing the existing About block.
todos:
  - id: add-aboutsection-component
    content: Create `components/sections/AboutSection.tsx` matching the exact DOM tree, IDs, and `next/image` usage.
    status: pending
  - id: add-aboutsection-css
    content: Add `components/sections/AboutSection.css` implementing exact spec CSS + responsive rules + staggered reveal timing.
    status: pending
  - id: wire-up-scroll-reveal
    content: Wrap AboutSection v4 with `components/RevealOnScroll.tsx` using a dedicated class name (e.g. `reveal-about-v4`) and implement visible/hidden states in CSS.
    status: pending
  - id: integrate-page
    content: Update `app/page.tsx` to replace old `<About />` with `<AboutSection />` directly under the hero.
    status: pending
  - id: verify-build-lint
    content: Run lint + build and spot-check layout/responsiveness/animation + reduced-motion behavior.
    status: pending
isProject: false
---

## Decisions (based on repo reality)

- **No `src/` migration right now**: repo currently uses root `app/` + `components/` (no `src/`). Introducing `src/` would create a mixed layout with no functional benefit for this single section.
- **Use existing About image asset**: you already have `/public/images/aboutus/onama.webp` referenced in `components/About.tsx`. We’ll use that as the right-column photo source (instead of `src/assets/images/beekeeper.jpg`).
- **Animation approach**: reuse your existing `components/RevealOnScroll.tsx` IntersectionObserver pattern and implement AboutSection-v4-specific stagger via CSS selectors + delays, mirroring how `globals.css` already does `reveal-about` and `reveal-products`.

## Phases and steps

### Phase 1 — Section component (structure + content)

- **Step 1.1**: Create `components/sections/AboutSection.tsx`.
- **Step 1.2**: Implement the exact DOM tree from the spec:
  - `<section>` (full width, `min-h-screen`, background `#0a0805`)
  - left column container (eyebrow, `h2`, gold underline, paragraph 1, thin divider, paragraph 2, stats row, button)
  - right column container (relative/overflow-hidden, TL + BR corner accents, photo-wrap with `next/image`, overlay gradient, caption bar)
- **Step 1.3**: Ensure anchors remain compatible:
  - `id="o-nama"` on the section
  - CTA button behavior per spec (if it should scroll, use `href="#proizvodi"` or the existing smooth-scroll behavior already enabled globally)
- **Step 1.4**: Implement image usage:
  - use `next/image` with `fill`, `priority`, and `objectPosition: 'center top'`
  - source the photo from `/public/images/aboutus/onama.webp` (no new asset folder introduced)

### Phase 2 — Styling (exact CSS values + responsive rules)

- **Step 2.1**: Create `components/sections/AboutSection.css`.
- **Step 2.2**: Apply exact spec CSS values:
  - section grid: `grid-template-columns: 1fr 1fr`, `min-height: 100vh`, background `#0a0805`
  - left padding: `80px 64px 80px 80px`
  - typography: Montserrat / Cormorant via existing CSS variables (`--font-montserrat`, `--font-cormorant`)
  - stats row borders, cell separators, button styles, photo-wrap insets, overlay gradient, caption bar, corner brackets
- **Step 2.3**: Responsive behavior:
  - `@media (max-width: 1024px)`: stack to 1 column; image on top; right col `height: 60vw`; photo-wrap becomes `position: relative` with no inset
  - `@media (max-width: 640px)`: heading `38px`; left padding `40px 24px`; stats wrap to 2-column grid and adjust borders accordingly

### Phase 3 — Scroll-triggered staggered entrance animation

- **Step 3.1**: Wrap AboutSection in `components/RevealOnScroll.tsx` (IntersectionObserver).
- **Step 3.2**: Use a dedicated reveal class name (e.g. `reveal-about-v4`) so existing `reveal-about` styles remain untouched.
- **Step 3.3**: Implement stagger order/delays exactly in CSS:
  - eyebrow: `0.1s`
  - h2: `0.25s`
  - underline: `0.35s`
  - paragraph1: `0.45s`
  - divider: `0.5s`
  - paragraph2: `0.55s`
  - stats: `0.7s`
  - button: `0.85s`
  - photo column: `0.2s` with `translateX(+40px) → 0`
  - all elements: `opacity: 0 → 1`, `translateY(20px) → 0`, duration `0.7s`, easing `cubic-bezier(0.22, 1, 0.36, 1)`
- **Step 3.4**: Add reduced-motion support mirroring existing patterns:
  - at `prefers-reduced-motion: reduce`, disable transitions and show everything immediately

### Phase 4 — Page integration (replace old About)

- **Step 4.1**: Update `app/page.tsx`:
  - remove `import About from "@/components/About"`
  - add `import AboutSection from "@/components/sections/AboutSection"`
  - replace `<About />` with `<AboutSection />` directly below `<Hero />`
- **Step 4.2**: Keep `components/About.tsx` unchanged for now (optional later cleanup once v4 is accepted).

### Phase 5 — Verification (quality gates + manual checks)

- **Step 5.1**: Run `npm run lint`.
- **Step 5.2**: Run `npm run build` (important for `output: "export"`).
- **Step 5.3**: Manual visual checks:
  - desktop: full viewport height, 2 columns, exact spacing and colors
  - ≤1024px: stacked layout, image on top, `height: 60vw`
  - ≤640px: heading/padding changes + stats grid wrap/borders correct
  - reveal stagger triggers on scroll with correct directions/delays
  - reduced motion behaves correctly

## Files to add

- `components/sections/AboutSection.tsx`
  - Exact DOM tree from your spec (left content column + right photo column with corner brackets, overlay gradient, caption bar).
  - `id="o-nama"` so existing hero nav anchors continue to work.
  - Wrap content in `RevealOnScroll` with a **new** class (e.g. `reveal-about-v4`) so we don’t break the existing `About` animations.
  - Use `next/image` with `fill` and `objectFit/objectPosition` per spec.
- `components/sections/AboutSection.css`
  - Implement the **exact CSS values** you listed (section grid, paddings, fonts via `var(--font-montserrat)` / `var(--font-cormorant)` already set in `app/layout.tsx`, colors, stats row, photo wrapper geometry, gradient overlay, caption bar, corner brackets, and responsive breakpoints at 1024px and 640px).
  - Implement the **scroll-triggered stagger**:
    - Default state: each reveal target starts at `opacity: 0; transform: translateY(20px)` (photo column uses `translateX(40px)`), with `transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1)`.
    - Visible state (when `.reveal-on-scroll.is-visible` is present): transform to 0 and opacity 1.
    - Apply per-element delays exactly: 0.1s, 0.25s, 0.35s, 0.45s, 0.5s, 0.55s, 0.7s, 0.85s; photo 0.2s.
    - Reduced motion: follow the existing `@media (prefers-reduced-motion: reduce)` pattern (immediately visible, no transitions).

## Files to update

- `app/page.tsx`
  - Replace the old `About` import/render with the new section:
    - Remove: `import About from "@/components/About"`
    - Add: `import AboutSection from "@/components/sections/AboutSection"`
    - Render `<AboutSection />` directly below `<Hero />`.
- `components/About.tsx`
  - No edits required for functionality, but once `AboutSection` is in use we can optionally delete/retire this old component in a later cleanup step.

## Integration notes (to keep the system consistent)

- **Hero CTA / anchors**: your hero uses `#o-nama` / `#proizvodi` etc, and `app/page.tsx` already renders those sections. AboutSection v4 will keep `id="o-nama"` so navigation continues to work.
- **Fonts**: use `font-family: var(--font-montserrat), "Montserrat", sans-serif;` and `var(--font-cormorant), "Cormorant Garamond", serif;` so it matches your existing font setup in `app/layout.tsx`.
- **Image optimization**: your `next.config.ts` sets `images.unoptimized = true` (static export). Using `next/image` with a public asset path is compatible.

## Verification

- Run `npm run lint`.
- Run `npm run build` (important because `output: "export"` can surface image/path issues).
- Manually verify:
  - About section is full viewport height on desktop, 2 columns.
  - At ≤1024px it stacks with image on top and `height: 60vw` behavior.
  - At ≤640px heading size + padding changes and stats wrap to 2-column grid.
  - Scroll reveal triggers once the section enters view, with correct stagger/directions.
  - `prefers-reduced-motion` disables the animations gracefully.
