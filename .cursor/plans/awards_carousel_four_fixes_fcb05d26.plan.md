---
name: Awards Carousel Four Fixes
overview: "Fix four carousel issues: remove the dark title background, prevent certificate hover from being clipped by the wrapper, soften or replace the card glow so it does not look like a second border, and prevent the white certificate from visibly flying during carousel scroll by containing overflow on slides."
todos: []
isProject: false
---

# Awards Carousel – Four Fixes

## 1. Remove black around the text in the card

**Cause:** The title block uses a dark gradient background so it reads as a distinct panel behind the text.

**Location:** [app/globals.css](app/globals.css) – `.award-title` (around lines 236–251).

**Change:** Remove the `background` property from `.award-title` entirely so the title sits on the existing `award-card-wrapper` background with no extra dark panel. Keep all other title styles (padding, font-size, font-weight, letter-spacing, text-transform, color, position, and the `::before` decorative line).

---

## 2. Certificate hover gets cut by the card container

**Cause:** `.award-card-wrapper` has `overflow: hidden` (line 175). On hover, `.award-certificate` gets `translateY(-12px)` and a larger box-shadow, so the top (and possibly sides) of the certificate are clipped by the wrapper.

**Location:** [app/globals.css](app/globals.css) – `.award-image-container` (padding) and optionally `.award-certificate` hover (lift amount).

**Changes:**

- **Increase top padding** on `.award-image-container`: change `padding: 40px 20px` to something like `padding: 56px 20px` (or 52px). That gives ~16px of space above the certificate so a 12px upward move stays inside the clipped area. Optionally add a bit more horizontal padding if the hover shadow is clipped on the sides (e.g. `padding: 56px 24px`).
- **Optional:** Slightly reduce the hover lift from `translateY(-12px)` to `translateY(-8px)` in the `.award-card:hover .award-certificate` rule so the effect is a bit more contained without changing the wrapper’s overflow.

Do not remove `overflow: hidden` from the wrapper; that would let the certificate and shadow break the card’s rounded shape.

---

## 3. Glow looks like a second bordered container

**Cause:** `.award-card::before` (lines 126–143) uses a sharp-edged gradient and `border-radius: 8px` with no blur, so it reads as a second rectangle/border instead of a soft halo.

**Location:** [app/globals.css](app/globals.css) – `.award-card::before` and its hover rule.

**Options (pick one approach):**

- **A – Soften the pseudo-element:** Add `filter: blur(12px)` (or 8px–16px) to `.award-card::before` and lower the opacity/gradient stops (e.g. 0.2 and 0.05 instead of 0.3 and 0.1) so the glow is diffuse and no longer looks like a second border.
- **B – Replace with box-shadow glow:** Remove or disable the `::before` glow and add a hover-only box-shadow on `.award-card` (or `.awards-card-hover:hover`), e.g. `box-shadow: 0 0 40px rgba(212,175,55,0.12), 0 0 80px rgba(212,175,55,0.06)`, so the glow is soft and has no visible edge. If the card already has a box-shadow on hover, merge the glow into that single rule.

Recommendation: **A** (blur + lower opacity) keeps the current structure; **B** simplifies and avoids a second “frame” entirely.

---

## 4. White block flying during carousel scroll

**Cause:** While Embla moves the slides, the white certificate (or its container) is visible outside the viewport, so a “white block” appears to fly in the scroll direction. The viewport (`.embla-awards`) already has `overflow: hidden`; the slide itself does not, so the slide’s contents can be painted outside the slide during the transform and become visible as they pass the viewport edge.

**Location:** [app/globals.css](app/globals.css) – Embla viewport and slide; [components/Awards.tsx](components/Awards.tsx) – slide root element if we add a class there.

**Changes:**

- **Clip each slide:** Add `overflow: hidden` to the slide so each card’s contents (including the white certificate) are clipped to the slide bounds. The slide is the element with classes `award-card embla-awards__slide ...` (the outer div in `AwardCard`). Add a rule in globals.css for `.embla-awards__slide { overflow: hidden; }` (and ensure the slide has a stacking context if needed, e.g. `position: relative` or `isolation: isolate` so the clip works as expected).
- **Optional:** Add `backface-visibility: hidden` to `.embla-awards__slide` to reduce rendering artifacts during the transform. The container already has `backface-visibility: hidden`; applying it to the slide as well can help.

No change to Embla options or JS is required unless testing shows otherwise.

---

## Summary

| Issue                          | File                           | Action                                                                                                                             |
| ------------------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1 – Black around text          | [globals.css](app/globals.css) | Remove `background` from `.award-title`.                                                                                           |
| 2 – Certificate hover cut off  | [globals.css](app/globals.css) | Increase `.award-image-container` top (and optionally side) padding; optionally reduce hover `translateY` on `.award-certificate`. |
| 3 – Glow like second border    | [globals.css](app/globals.css) | Soften `.award-card::before` with blur + lower opacity, or replace with a box-shadow glow on card hover.                           |
| 4 – White block when scrolling | [globals.css](app/globals.css) | Add `overflow: hidden` (and optionally `backface-visibility: hidden`) to `.embla-awards__slide`.                                   |

All edits are in [app/globals.css](app/globals.css) except for any optional class on the slide in [Awards.tsx](components/Awards.tsx); the slide can be targeted via `.embla-awards__slide` only. Preserve existing `prefers-reduced-motion` behavior for any modified selectors.
