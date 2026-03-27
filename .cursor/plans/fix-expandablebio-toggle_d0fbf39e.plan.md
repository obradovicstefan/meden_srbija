---
name: fix-expandablebio-toggle
overview: Fix the ExpandableBio expand/collapse toggle so label and arrow reflect open/closed state (“Pročitaj više”→“Zatvori”) with a rotating arrow, and ensure AboutSection team cards style it correctly without conflicting CSS.
todos: []
isProject: false
---

## Current state (evidence)

- Team cards in `components/sections/AboutSection.tsx` use `ExpandableBio` twice (no inline state).
- `components/ExpandableBio.tsx` currently toggles internal `expanded` state but renders labels **"Pročitaj više" / "Pročitaj manje"** and **no arrow element**.
- Your Team Block CSS currently adds an always-on arrow via `button::after { content: "→" }`, which cannot rotate with state and can conflict with desired behavior.

## Goal

- Toggle must render:
  - **Closed**: `Pročitaj više` + arrow icon
  - **Open**: `Zatvori` + same arrow rotated 180° (rotation via CSS transition, not swapping characters)
- Apply globally (affects both `components/sections/AboutSection.tsx` and `components/About.tsx`).
- No new dependencies.

## Implementation plan

### Phase 1 — Update `components/ExpandableBio.tsx` markup and state wiring

- Keep existing internal `expanded` state.
- Change button label logic:
  - `expanded ? "Zatvori" : "Pročitaj više"`
- Add an explicit arrow element inside the button, e.g.:
  - `<span className={expanded ? "bioToggleArrow isOpen" : "bioToggleArrow"}>↓</span>`
  - Use **one arrow character** (↓) and rotate it on open via CSS.
- Add a stable class on the button itself (e.g. `bioToggleButton`) so CSS can target it reliably across pages.

### Phase 2 — Add/adjust CSS for arrow rotation + smooth transition

- Add CSS rules (preferred location: `app/globals.css` since ExpandableBio is shared):
  - `.bioToggleButton` keeps existing accessibility/focus styles.
  - `.bioToggleArrow`:
    - `display: inline-block; margin-left: 6px; transition: transform 0.3s ease; transform: rotate(0deg);`
  - `.bioToggleArrow.isOpen`:
    - `transform: rotate(180deg);`
- Ensure reduced-motion is respected by disabling the arrow transform transition inside `@media (prefers-reduced-motion: reduce)`.

### Phase 3 — Remove CSS conflict in About team styling

- In `components/sections/AboutSection.css`, update `.aboutV4TeamBio button` styling to **not** inject an arrow via `::after`.
  - Keep your desired typography (Montserrat 11px, 600, tracking 0.12em, uppercase, gold color, inline-flex, etc.), but let `ExpandableBio` own the arrow element.

### Phase 4 — Verification

- Run `npm run lint` and `npm run build`.
- Manual check:
  - In AboutSection team cards, clicking toggles:
    - label switches `Pročitaj više` ↔ `Zatvori`
    - arrow rotates smoothly
  - In `components/About.tsx` usage, same behavior works and styling remains acceptable.

## Files changed

- `components/ExpandableBio.tsx`
- `app/globals.css` (add shared toggle arrow CSS)
- `components/sections/AboutSection.css` (remove `button::after` arrow injection, keep button styling)

## Todos

- Update ExpandableBio to render new label + arrow span.
- Add global CSS for arrow rotation.
- Remove conflicting AboutSection team `button::after` rule.
- Lint/build verification.
