---
name: aboutsection-team-block
overview: Append a diamond divider + animated Team Block below the existing AboutSection v4 hero split, reusing RevealOnScroll and ExpandableBio, styled via AboutSection.css with Inter typography and existing gold/background variables.
todos:
  - id: append-team-markup
    content: Append diamond divider + Team Block markup inside existing `components/sections/AboutSection.tsx` section, after the hero split block, reusing `RevealOnScroll` and `ExpandableBio`.
    status: pending
  - id: team-css
    content: Extend `components/sections/AboutSection.css` with divider + team layout + avatar rings + hover wash + typography (Inter) + responsive rules.
    status: pending
  - id: team-stagger
    content: Add `.reveal-about-team` staggered entrance animation rules + reduced-motion overrides.
    status: pending
  - id: verify
    content: Run lint/build and visually sanity-check desktop/tablet/mobile behavior.
    status: pending
isProject: false
---

## Scope

- Append **two new blocks** inside the existing `<section>` in `components/sections/AboutSection.tsx`:
  1. diamond divider
  2. team block
- **Do not modify** the existing hero split (photo/stats/button) markup; only add new siblings after it.
- Use **Inter** everywhere for this Team Block (per your decision).
- Team Block inherits current section background `**#111110` (per your decision).

## Reconnaissance (confirmed)

- **AboutSection**: `components/sections/AboutSection.tsx`
- **Reveal**: `components/RevealOnScroll.tsx` exists and adds `reveal-on-scroll` + `is-visible`.
- **ExpandableBio**: `components/ExpandableBio.tsx` exists; we will reuse it.
- **CSS variables**: `app/globals.css` defines `--gold`, `--foreground`, `--background` (no `--gold-rgb`).
- **AboutSection CSS**: `components/sections/AboutSection.css` already hosts About v4 layout + its own stagger.

## Phase 1 — Append markup (no hero block edits)

- Update `components/sections/AboutSection.tsx`:
  - After the existing hero split wrapper closes (after the first `<RevealOnScroll className="reveal-about-v4" ...>` block), append:
    - **Diamond divider** block:
      - wrapper `div` with a new class e.g. `aboutV4DiamondDivider`
      - 2 line divs + diamond div per spec
      - Use `rgba(201,146,10,0.15)` directly (since `--gold-rgb` doesn’t exist)
    - **Team block** wrapped in `RevealOnScroll`:
      - `RevealOnScroll className="reveal-about-team" once`
      - Team outer wrapper `div` class e.g. `aboutV4Team`
      - Header: eyebrow + h3 + gold bar
      - Team grid: `div` class e.g. `aboutV4TeamGrid` containing 2 `article`s
      - Avatar structure exactly as spec (wrapper with rings, inner circle, `Image` 200×200, gold dot)
      - Bio: use `ExpandableBio previewCount={1}` with the provided paragraph arrays

## Phase 2 — Styling (layout + hover + typography)

- Update `components/sections/AboutSection.css`:
  - **Diamond divider** styles:
    - flex row, `gap: 20px`, and `padding: 0 80px` (and responsive padding adjustments at 1024/640 to mirror Team Block)
  - **Team block outer**:
    - `padding: 100px 80px 110px`
    - Inter font family for all Team Block text (inherit body, but set explicitly on key nodes)
  - **Header**:
    - eyebrow uses the same styling as `.aboutV4Eyebrow`
    - h3: Inter `44px`, `700`, `#fff`, `margin-bottom: 16px`
    - gold bar: 48×3, centered, `background: var(--gold)`
    - header bottom margin: 72px
  - **Grid**:
    - 2 columns, max-width 1040px, centered
    - vertical center line via `::after` on grid with gradient using `rgba(201,146,10,0.2)`
  - **Cards**:
    - open layout (no border, no background)
    - padding `56px 56px 52px`
    - hover wash via `::before` pseudo-element with `background: rgba(201,146,10,0.025)`
  - **Avatar**:
    - wrapper 200×200 relative + margin-bottom 32
    - concentric rings via `::before` and `::after`
    - inner circle 200×200 with overflow hidden
    - gold dot bottom-right 16×16 with 2px border matching section bg (`#111110`)
  - **Role/Name/Bio**:
    - role: Inter 11px, 600, uppercase, `letter-spacing: 0.22em`, `color: var(--gold)`
    - name: Inter 32px, 700, `#fff`, `line-height: 1.1`
    - bio text: Inter 14.5px, 300, `line-height: 1.85`, max-width 320px

## Phase 3 — Scroll animation (staggered entrance)

- Add new animation rules in `components/sections/AboutSection.css` scoped under `.reveal-about-team`:
  - Divider: fade in only, delay 0
  - Header eyebrow: delay 0.1s, `translateY(20px)`
  - Header h3: delay 0.2s, same
  - Gold bar: delay 0.3s, `scaleX(0) → 1` from left + opacity
  - Left card: delay 0.35s, `translateY(30px)`
  - Right card: delay 0.5s, `translateY(30px)`
  - Duration 0.7s, easing `cubic-bezier(0.22, 1, 0.36, 1)`
  - Include `prefers-reduced-motion: reduce` override (show all immediately)

## Phase 4 — Responsive rules

- In `components/sections/AboutSection.css`:
  - ≤1024px:
    - team padding `72px 40px 80px`
    - grid becomes 1 column
    - hide vertical line
    - add horizontal separator between cards (a dedicated divider element between the two `article`s or a `::after` on first card) using the gradient spec and `max-width: 200px`
    - diamond divider padding becomes `0 40px`
  - ≤640px:
    - team padding `56px 24px 72px`
    - avatar wrapper/inner become 160×160
    - member name font-size 26px
    - card padding `40px 24px`
    - diamond divider padding becomes `0 24px`

## Phase 5 — Verification

- Run `npm run lint`.
- Run `npm run build` (static export constraints).
- Manual check:
  - divider renders between blocks, consistent padding
  - team header centered
  - vertical center line on desktop only
  - ExpandableBio works for both members
  - staggered reveal triggers once per view and respects reduced-motion.
