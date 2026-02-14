---
name: Awards Spotlight Carousel Redesign
overview: 'Replace the current Embla-based horizontal scroll with a state-driven three-card "spotlight" layout: one centered active card (full opacity, sharp) and two blurred/smaller side cards. This involves removing Embla, introducing slide state (active/prev/next/hidden), fixed card dimensions, new CSS for positioning and containment, and keeping modal/zoom behavior.'
todos: []
isProject: false
---

# Awards Carousel – Focused Spotlight Design

## Current state

- [components/Awards.tsx](components/Awards.tsx): Uses **Embla Carousel** (`useEmblaCarousel`) with horizontal scroll, `align: "center"`, loop. All awards are rendered as slides in a flex row; `selectedIndex` is synced from Embla. `AwardCard` is a single div with `award-card`, `award-card-wrapper`, `award-image-container` > `award-certificate` (Next.js `Image` with `fill`), and `p.award-title`. Click opens `AwardDetailsModal`; arrows/dots call `scrollPrev`/`scrollNext`/`scrollTo(i)`.
- [app/globals.css](app/globals.css): Embla viewport/container/slide rules, award-card wrapper/certificate/title styles, carousel arrows/dots, glow on `.award-card::before`, reduced-motion overrides.

## Target behavior

- **Layout:** Always show three logical slots: **prev** (left), **active** (center), **next** (right). Prev/next are smaller, blurred, ~30% opacity; active is full size, sharp, 100% opacity. Any other indices are **hidden** (opacity 0, no pointer events).
- **Navigation:** Arrows and dots set `selectedIndex` (with loop). Clicking the **prev** card goes to previous; clicking the **next** card goes to next; clicking the **active** card opens the award details modal (current behavior).
- **Containment:** Fixed-width/height cards, `overflow: hidden` only on the inner card container and image area so nothing clips outside the card or causes “flying” content.
- **Glow:** Only on the active card (e.g. pseudo-element on `.award-card-inner`), not on prev/next.
- **Mobile:** Only the active card visible (prev/next hidden); single card, optionally swipe to change slide.

---

## 1. Carousel logic: remove Embla, add state-based three-card layout

**File:** [components/Awards.tsx](components/Awards.tsx)

- Remove `useEmblaCarousel`, `emblaRef`, `emblaApi`, and all Embla-related state/effects (e.g. `onSelect`, autoplay, `scrollPrev`/`scrollNext` as Embla calls). Keep `selectedIndex` (number) as the single source of truth; loop with modulo so `prevIndex = (selectedIndex - 1 + N) % N`, `nextIndex = (selectedIndex + 1) % N`.
- Replace the Embla viewport/container with a single **track** div, e.g. `className="carousel-track"`, with `role="region"`, `aria-roledescription="carousel"`, `aria-label="Nagrade i priznanja"`.
- **Render all awards** in a single list. For each award at index `i`, compute slide role:
  - `i === selectedIndex` → `active`
  - `i === prevIndex` → `prev`
  - `i === nextIndex` → `next`
  - else → `hidden`
- Each item is a wrapper div with classes `carousel-slide` and `carousel-slide-${role}` (e.g. `carousel-slide-active`), and optional `data-award-index={i}` for debugging/aria. **No Embla refs or container classes.**
- **Click handler on the slide wrapper:** if role is `active`, open modal (set `selectedAward`, store `triggerRef`); if `prev`, call `setSelectedIndex(prevIndex)`; if `next`, call `setSelectedIndex(nextIndex)`. `hidden` slides can have `pointer-events: none` and no click. Preserve keyboard (Enter/Space) and `aria-label` per slide.
- **Arrows:** `onClick` calls `setSelectedIndex((selectedIndex - 1 + N) % N)` and `setSelectedIndex((selectedIndex + 1) % N)`. Disable prev when `selectedIndex === 0` only if you do not want loop (spec implies loop; if loop, arrows never disabled).
- **Dots:** `onClick={() => setSelectedIndex(i)}`; `aria-selected={i === selectedIndex}`.
- **Live region:** Keep “Nagrada X od Y” and update from `selectedIndex`.
- Optional: **Touch swipe** on `carousel-track`: `onTouchStart` / `onTouchEnd` (or `onTouchMove`) with deltaX threshold to call prev/next (e.g. swipe left → next). Can be a small helper to avoid re-adding Embla just for swipe.

---

## 2. DOM structure: track, slide, card-inner, title container

**File:** [components/Awards.tsx](components/Awards.tsx)

- **Outer carousel wrapper:** Keep a ref if needed for focus return; use class e.g. `awards-carousel` and ensure parent section or wrapper uses `overflow: visible` and padding per spec (e.g. 100px vertical, 40px horizontal).
- **Track:** One div with `carousel-track` wrapping all slides.
- **Slide:** For each award, one div: `className={carousel-slide carousel-slide-${role}}`, click/keyboard handler, and `role="button"` (or group with `role="group"` and an inner button for a11y if preferred). Child: **AwardCard**.
- **AwardCard props:** Extend to accept `award`, `onClick` (already), and optionally `slideRole` (or derive from parent) so the card can add data attributes or classes for “active” styling if needed. Prefer applying all positioning/blur/opacity on the **parent** `.carousel-slide`, so the card itself can stay presentational.
- **Card structure inside AwardCard:**
  - **Outer:** `div.award-card` (fixed dimensions in CSS; see below).
  - **Inner:** `div.award-card-inner` (replaces current `award-card-wrapper` for this design): contains image area + title area; `overflow: hidden`; backdrop, border, border-radius, box-shadow.
  - **Image block:** `div.award-image-container` (fixed height, e.g. 520px; `overflow: hidden`; padding; radial gradient background). Inside: one wrapper for the certificate image (keep Next.js `Image` with `fill` and `object-contain`, or a single `img` with `object-fit: contain` and `max-width/max-height: 100%` so the image never overflows).
  - **Title block:** `div.award-title-container` (fixed height, e.g. 130px; `position: absolute; bottom: 0; left: 0; right: 0`; gradient background; decorative `::before` line). Inside: `p.award-title` (or span) with the award name; clamp lines (e.g. 3) and ellipsis via CSS.

So the hierarchy is: `carousel-slide` → `award-card` → `award-card-inner` → `award-image-container` + `award-title-container` (title at bottom of card). This keeps overflow contained and matches the spec’s “fixed position” title area.

---

## 3. CSS: container, track, slide states, card dimensions, containment, glow, arrows, dots

**File:** [app/globals.css](app/globals.css)

- **Section / carousel container:** Ensure `overflow: visible` on the awards section and on `.awards-carousel` (or equivalent). Padding as specified (e.g. 100px 40px); max-width 1600px, centered.
- **Track:** `.carousel-track`: `display: flex`, `align-items: center`, `justify-content: center`, `gap: 0`, `position: relative`, `perspective: 1200px`. No overflow hidden so the three cards can overlap and sit in the spotlight layout.
- **Slides:** `.carousel-slide`: base transition for `transform`, `opacity`, `filter` (e.g. 0.6–0.7s cubic-bezier). Position absolute or flex so they can overlap and center:
  - **.carousel-slide-active:** `z-index: 10`, `transform: scale(1) translateX(0)`, `opacity: 1`, `filter: blur(0)`, `pointer-events: all`.
  - **.carousel-slide-prev:** `z-index: 5`, `transform: scale(0.75) translateX(-60%) translateZ(-200px) rotateY(15deg)`, `opacity: 0.3`, `filter: blur(4px)`, `pointer-events: all` (so click to go prev works).
  - **.carousel-slide-next:** same as prev but `translateX(60%)`, `rotateY(-15deg)`.
  - **.carousel-slide-hidden:** `opacity: 0`, `pointer-events: none`, `transform: scale(0.5)` (or similar) so they don’t show or capture clicks.
- **Card:** `.award-card` (inside any slide): fixed `width`/`height` (e.g. 500px / 650px; active 550px / 700px via `.carousel-slide-active .award-card`). `flex-shrink: 0`, `position: relative`. Responsive: reduce for tablet (e.g. 420/550, active 460/600) and mobile (e.g. 340/480; active only).
- **Card inner:** `.award-card-inner`: `width: 100%`, `height: 100%`, `overflow: hidden`, `border-radius: 16px`, `background`, `backdrop-filter`, `border`, `box-shadow`. Active variant: stronger border and shadow. **Glow:** only `.carousel-slide-active .award-card-inner::before` (gradient, blur, opacity on hover); no glow on prev/next (override or omit pseudo-element for `.carousel-slide-prev`, `.carousel-slide-next`).
- **Image container:** `.award-image-container`: fixed `height` (e.g. 520px), `overflow: hidden`, padding, radial gradient. Certificate wrapper / img: `max-width: 100%`, `max-height: 100%`, `object-fit: contain` so the image never overflows.
- **Title container:** `.award-title-container`: `position: absolute`, `bottom: 0`, `left/right: 0`, fixed `height` (e.g. 130px), padding, gradient background, `overflow: hidden`. `.award-title-container::before` for the gold line; `.award-title` typography and line-clamp (e.g. 3 lines, ellipsis).
- **Arrows:** Reposition with `.carousel-arrow-left` / `.carousel-arrow-right` (e.g. `left: 60px`, `right: 60px`; mobile 10px). Keep `z-index` above cards (e.g. 20). Style per spec (size, border, backdrop, hover). Disabled state only if not looping.
- **Pagination:** `.carousel-pagination` absolute, `bottom: 30px`, centered; dots and active pill style as specified. Keep 32px min touch target on dot buttons.
- **Mobile:** `@media (max-width: 768px)` hide `.carousel-slide-prev` and `.carousel-slide-next` (e.g. `display: none`); `.carousel-slide-active` full width or max-width with horizontal padding; optional `touch-action` on track for swipe.
- **Reduced motion:** In existing `prefers-reduced-motion` block, disable or shorten transitions for `.carousel-slide`, `.award-card-inner`, and any new classes (glow, certificate, title).

Remove or refactor Embla-specific rules (`.embla-awards`, `.embla-awards__container`, `.embla-awards__slide`) and any award-card styles that conflict (e.g. old wrapper padding, certificate min-height/padding that assumed the previous layout). Keep or adapt `.award-card-skeleton` if still used.

---

## 4. Data flow and accessibility

- **State:** `selectedIndex` (0 to N-1) drives which award is active; `prevIndex`/`nextIndex` computed with modulo for loop. Modal state (`selectedAward`, `zoomOpen`) unchanged.
- **Focus:** When opening the modal, keep `triggerRef` on the active card or the slide so focus can return. Arrows and dots keep focus-visible styles and aria-labels.
- **Screen readers:** Live region updates “Nagrada X od Y” when `selectedIndex` changes. Each slide can have `aria-hidden={role === 'hidden'}` and `aria-current={role === 'active'}` (or equivalent) so the active card is announced.

---

## 5. Implementation order (suggested)

1. **Awards.tsx – state and layout:** Remove Embla, add `selectedIndex` + prev/next indices, render track with slides and role classes; wire arrows and dots to `setSelectedIndex`; keep modal open on active-card click and add prev/next click to change index.
2. **Awards.tsx – AwardCard:** Restructure to `award-card` > `award-card-inner` > `award-image-container` (with certificate image) + `award-title-container` (with title and line). Ensure Image still has correct `sizes` and container has dimensions so layout is correct.
3. **globals.css – spotlight layout:** Add/rewrite container, track, slide state rules (active/prev/next/hidden), card and card-inner dimensions and overflow, image container and certificate containment, title container and line-clamp; move glow to active card inner only; adjust arrows and dots; add mobile hide and reduced-motion.
4. **Optional:** Touch swipe on track for mobile.
5. **Cleanup:** Remove Embla dependency from package.json if no other component uses it; remove unused Embla CSS and any obsolete award-card padding/certificate rules that cause clipping or overlap.

---

## 6. Dependencies and files

- **Components:** [components/Awards.tsx](components/Awards.tsx) – only file that needs structural and logic changes. [AwardDetailsModal](components/AwardDetailsModal.tsx) and [ImageLightbox](components/ImageLightbox.tsx) stay as-is; they are still opened from the active card and zoom button.
- **Styles:** [app/globals.css](app/globals.css) – all carousel/card/certificate/title/arrow/dot and reduced-motion rules.
- **Package:** If Embla is only used here, remove `embla-carousel-react` (and optionally `embla-carousel`) after the new carousel is in place and tested.

No new components or routes are required. The `Award` type and the `awards` array stay unchanged.
