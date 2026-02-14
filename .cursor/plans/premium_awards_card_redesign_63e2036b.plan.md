---
name: Premium Awards Card Redesign
overview: Overhaul the Awards carousel cards in [components/Awards.tsx](components/Awards.tsx) and [app/globals.css](app/globals.css) to remove cheap styling (thick borders, white backgrounds, boxy containers) and implement a premium “floating certificate” presentation with subtle gold accents, refined typography, and gallery-quality hierarchy aligned with the provided spec.
todos: []
isProject: false
---

# Premium Awards Card Redesign

## Current State (Summary)

- **Card**: `[AwardCard` in Awards.tsx](components/Awards.tsx) (lines 284–318) uses `rounded-2xl border` with inline `borderColor: "rgba(212,175,55,0.3)"`, `bg-[#0d0d0d]`, `p-6`/`p-8`, and a white certificate area (`aspect-[3/4] ... bg-white/95`). Title is a simple `<p>` below the image.
- **Hover**: [globals.css](app/globals.css) `.awards-card-hover` / `.awards-card-hover:hover` (lines 121–130) — translateY(-8px), scale(1.02), stronger border, gold box-shadow.
- **Carousel**: `embla-awards`, `embla-awards__container` with `gap-5 lg:gap-10`; slide flex `90%` / `calc(50%-10px)` / `calc((100%-5rem)/3)` (3 slides on desktop).
- **Arrows / Dots**: Inline Tailwind in Awards.tsx — solid gold border and fill on hover; dots are small circles, active slightly larger.

## Design Direction

- **Remove**: Thick borders, bright white card backgrounds, boxy look, disconnected title treatment.
- **Add**: Transparent/minimal card container; **floating certificate** treatment (Option A from spec) with radial spotlight, gold-accent shadows, subtle 3D tilt; refined title with gradient backdrop and decorative line; subtle wrapper backdrop (blur + thin gold border); refined arrows and pill-style active dots; optional loading skeleton; mobile-friendly tweaks (no 3D tilt, adjusted sizes).

---

## Phase 1 – Critical (Card and certificate)

**1. Card structure and wrapper**

- In `AwardCard`, introduce a clear hierarchy:
  - **Outer**: `award-card` — minimal container (transparent or very subtle), no heavy border, `position: relative` for glow pseudo-element. Keep role/aria/keyboard behavior.
  - **Middle**: `award-card-wrapper` — subtle backdrop: `rgba(13,13,13,0.4)`, `backdrop-filter: blur(10px)`, `border: 1px solid rgba(212,175,55,0.1)`, `border-radius: 12px`, `overflow: hidden`. Hover: slightly darker background and `border-color: rgba(212,175,55,0.25)`.
- Remove from the card: `rounded-2xl`, thick border, `bg-[#0d0d0d]`, and any bright white panel. Apply new classes in JSX and define them in `globals.css`.

**2. Certificate image – floating style**

- Replace the current `aspect-[3/4] ... bg-white/95` block with:
  - **Container**: `award-image-container` — padding (e.g. 40px 20px), `position: relative`, radial gradient behind certificate: `radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)`.
  - **Image wrapper**: Ensure the certificate image has class `award-certificate` and lives inside this container. Use Next.js `Image` with `fill` + a fixed-height wrapper (e.g. 400px desktop) and `object-fit: contain` so all certificates present consistently; optional subtle white-to-off-white gradient only on the image wrapper if desired (spec suggests subtle gradient), avoiding a big white card background.
- Certificate styling in CSS:
  - Base: `box-shadow` (deep dark + soft gold), `border-radius: 4px`, `inset 0 0 0 1px rgba(212,175,55,0.2)`.
  - Subtle 3D: `transform: perspective(1000px) rotateY(-2deg) rotateX(2deg)`.
  - Hover (desktop, `@media (hover: hover)`): `rotateY(0) rotateX(0) translateY(-12px)` and stronger shadows + gold inset border.
- Mobile: in a `@media (max-width: 768px)` block, set certificate height (e.g. 350px), `transform: none` to avoid 3D tilt on touch devices.

**3. Title treatment**

- Replace the current title `<p>` with a block that has class `award-title`:
  - Typography: smaller, refined (e.g. 16px), `font-weight: 600`, `letter-spacing: 2px`, `text-transform: uppercase`, `color: #D4AF37`, centered.
  - Layout: `padding: 24px 32px 32px`, `text-align: center`.
  - Background: `linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.8) 50%, transparent 100%)` so the title feels integrated with the dark theme.
  - Decorative line: `::before` — 60px wide, 2px height, centered above title, `linear-gradient(to right, transparent, #D4AF37, transparent)`.
- Mobile: reduce font size (e.g. 14px) and padding (e.g. 20px 24px 24px).

**4. Card hover and glow**

- Update/replace `.awards-card-hover` so that on hover (desktop only):
  - Card: subtle lift `translateY(-8px)`, `z-index: 10`, no harsh scale if you want to avoid “bouncy” feel (spec says “subtle lift, not jarring”).
  - Optional: `.award-card::before` for a soft gold gradient glow around the card (opacity 0 → 1 on hover), `border-radius: 8px`, `z-index: -1`, so it doesn’t cover content.
- Keep `prefers-reduced-motion` override so these transitions are disabled when requested.

---

## Phase 2 – Enhancement (Carousel, controls, spacing)

**5. Carousel spacing and slide sizing**

- In [Awards.tsx](components/Awards.tsx): increase gap between slides (e.g. `gap-8` or `32px` via class). Optionally adjust slide flex basis for “2.5 slides” on desktop, e.g. `lg:flex-[0_0_calc(100%/2.5)]` or equivalent so the center slide is prominent with a partial peek of neighbors; tune with the existing `align: "center"` in useEmblaCarousel.
- Add/use a class for the carousel padding (e.g. `py-[60px]` already present; ensure vertical rhythm matches spec “60px 0 80px” if needed).

**6. Navigation arrows**

- Replace current arrow button classes with a single class (e.g. `carousel-arrow`, `carousel-arrow-left`, `carousel-arrow-right`) and move styling to [globals.css](app/globals.css):
  - Default: transparent background, `border: 2px solid rgba(212,175,55,0.3)`, `border-radius: 50%`, color `rgba(212,175,55,0.7)`, `backdrop-filter: blur(8px)`, size ~52px.
  - Hover: `background: rgba(212,175,55,0.15)`, `border-color: rgba(212,175,55,0.6)`, `color: #D4AF37`, `transform: scale(1.08)`.
  - Desktop: position arrows outside the carousel (e.g. `left: -80px` / `right: -80px` or via negative margins) so they don’t overlap content; keep existing `lg:left-0` / `lg:right-0` or replace with the new offsets. Preserve focus-visible and disabled styles.

**7. Pagination dots**

- In [Awards.tsx](components/Awards.tsx), give the dot `<span>` a class (e.g. `carousel-dot`) and add `carousel-dot active` for the selected index. In CSS:
  - Inactive: ~8px circle, `background: rgba(212,175,55,0.25)`, hover slightly brighter and scale.
  - Active: pill shape (e.g. width 32px, `border-radius: 4px`), `linear-gradient(90deg, rgba(212,175,55,0.5), #D4AF37, rgba(212,175,55,0.5))`.
  - Keep 32px min touch target on the wrapper button.

---

## Phase 3 – Polish (Optional accents, loading, a11y)

**8. Decorative accents (optional)**

- If desired: add a small gold corner ornament (`::after` on card) or a badge-style label (e.g. “Nagrada”) with class `award-badge` — subtle, low opacity so they don’t compete with the certificate. Can be skipped in a first pass to keep “less is more.”

**9. Loading / skeleton state**

- Add a skeleton component or class `award-card-skeleton` (e.g. same structure as card but with placeholder blocks). Shimmer animation: `linear-gradient(90deg, rgba(212,175,55,0.05), rgba(212,175,55,0.1), rgba(212,175,55,0.05))`, `background-size: 200% 100%`, `@keyframes shimmer` translating position. Use when award images are loading if you add image loading state; otherwise defer.

**10. Accessibility and reduced motion**

- Ensure all new transitions and transforms are wrapped in `@media (hover: hover)` where appropriate, and that `@media (prefers-reduced-motion: reduce)` in [globals.css](app/globals.css) disables card hover, certificate hover, and any new animations (already partially in place for `.awards-card-hover` and `.embla-awards__container` — extend to new class names).
- Keep existing focus-visible rings and aria labels on arrows, dots, and cards.

---

## File and Class Map

| Area                      | File                                                                 | Changes                                                                                                                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card DOM structure        | [Awards.tsx](components/Awards.tsx)                                  | Wrap card in `award-card` + `award-card-wrapper`; add `award-image-container`, `award-certificate` wrapper, `award-title`; update class names for arrows/dots.                                                                                       |
| Card & certificate styles | [globals.css](app/globals.css)                                       | New: `.award-card`, `.award-card-wrapper`, `.award-image-container`, `.award-certificate`, `.award-title` (and `::before`), optional `::before` glow and `::after` accent; update/replace `.awards-card-hover`; certificate hover; mobile overrides. |
| Carousel layout           | [Awards.tsx](components/Awards.tsx) + [globals.css](app/globals.css) | Gap and slide flex in JSX; optional `.embla-awards__container` padding in CSS.                                                                                                                                                                       |
| Arrows                    | [Awards.tsx](components/Awards.tsx) + [globals.css](app/globals.css) | New classes `carousel-arrow`, positioning; CSS for default/hover/disabled.                                                                                                                                                                           |
| Dots                      | [Awards.tsx](components/Awards.tsx) + [globals.css](app/globals.css) | New classes `carousel-dot` / active; CSS for circle vs pill and hover.                                                                                                                                                                               |
| Reduced motion            | [globals.css](app/globals.css)                                       | Extend existing block to new award card and certificate classes.                                                                                                                                                                                     |

---

## Implementation Notes

- **Colors**: Use the spec palette — card/backdrop `rgba(13,13,13,0.4)`, spotlight `rgba(212,175,55,0.08–0.12)`, borders `rgba(212,175,55,0.1–0.25)`, title `#D4AF37`, shadows dark `rgba(0,0,0,0.6–0.8)` and gold tint `rgba(212,175,55,0.15–0.25)`.
- **Certificate aspect**: Fixed height (400px desktop, 350px mobile) + `object-fit: contain` keeps different certificate orientations/sizes consistent; the “floating” effect comes from the container gradient and the image’s own shadow/border, not from varying card heights.
- **AwardDetailsModal**: No change required for this task; the redesign is scoped to the carousel cards. If modal styling is updated later, it can follow the same gold/dark palette.
- **AwardHoverPanel**: Not used in the current Awards flow (click opens AwardDetailsModal); no change needed unless you later wire it in.

---

## Verification

- Visual: Cards have no thick borders or white card background; certificate appears to float with spotlight and gold-accent shadow; title has gradient and line; wrapper has subtle blur and border.
- Interaction: Hover on desktop lifts card and certificate, smooth transitions; arrows and dots match spec; reduced motion disables animations.
- Responsive: Mobile certificate has no 3D tilt, readable title and touch targets.
- A11y: Focus order, aria labels, and keyboard (Enter/Space on card, arrows) unchanged.
