---
name: Product popup position and scroll
overview: "Fix the product hover popup so it appears right next to the hovered card and does not follow scrolling (either scrolls with the page or stays fixed, depending on interpretation). Root cause: container rect is taken from the wrong element."
todos: []
isProject: false
---

# Product hover popup: position and scroll behavior

## Problem

- The popup appears **far from** the hovered card (e.g. above the heading) instead of **right next to it**.
- When scrolling, the popup should **not follow** the scroll in a sticky/following way; it should either stay in place on the page (scroll with content) or stay fixed in the viewport.

## Root cause

In [components/Products.tsx](components/Products.tsx):

- `revealWrapperRef` is attached to **RevealOnScroll**, which wraps the whole products content.
- `containerRect` is set from `revealWrapperRef.current?.getBoundingClientRect()` — i.e. the **outer** wrapper div.
- The panel is rendered inside the **inner** `<div className="relative mx-auto max-w-7xl ...">` (line 206), which is the actual **containing block** for `position: absolute`.

So [ProductHoverPanel](components/ProductHoverPanel.tsx) computes `left`/`top` relative to the wrong element: coordinates are in the outer wrapper’s coordinate system, but the panel is positioned relative to the inner `relative` div. That mismatch shifts the popup (often up and to the right), which matches “positioned significantly above and to the right” and overlapping the heading.

## Approach

1. **Correct positioning (primary fix)**
  Use the **same** element for both:

- the ref used to get `containerRect`, and
- the containing block for the panel (the element with `position: relative`).
So: add a second ref (e.g. `containerRef`) on the inner `<div className="relative mx-auto max-w-7xl ...">` and set `containerRect` from `containerRef.current?.getBoundingClientRect()`. Keep `revealWrapperRef` on RevealOnScroll only if it’s still needed for RevealOnScroll behavior; the panel’s position must be driven by the inner div’s rect.

1. **Scroll behavior (“stay there when i scroll … not follow scrolling”)**
  Two valid interpretations; choose one:

- **A – Scroll with page (current model, fixed position only):**  
Keep `position: absolute` and the panel inside the relative container. After the fix above, the popup will sit beside the card and **scroll with the page**; it will not “follow” in a sticky sense. No further change.
- **B – Stay on screen when scrolling:**  
Use `position: fixed` and compute coordinates from the card’s viewport rect (`anchorRect`). Render the panel in a **React portal** (e.g. `document.body`) so it’s not clipped by overflow. Then when the user scrolls, the popup **stays in the viewport** and does not “follow” the card (it stays where it was). Optionally close the popup on scroll to avoid confusion.
Recommendation: implement **A** first (correct `containerRect`). If you prefer the popup to stay on screen while scrolling, we can then switch to **B** (fixed + portal).

## Implementation steps

1. **Products.tsx**

- Add `containerRef = useRef<HTMLDivElement>(null)`.
- Attach `containerRef` to the inner wrapper: `<div ref={containerRef} className="relative mx-auto max-w-7xl ...">`.
- In the `useLayoutEffect` that sets `containerRect`, use `containerRef.current?.getBoundingClientRect()` instead of `revealWrapperRef.current?.getBoundingClientRect()`.
- Keep `revealWrapperRef` on `RevealOnScroll` unchanged (no structural change to RevealOnScroll).

1. **ProductHoverPanel.tsx**

- No logic change required if we keep absolute positioning; the existing `getPanelPositionAbsolute(anchorRect, containerRect)` will work once `containerRect` is the inner div’s rect.
- Optional: if the panel sometimes renders before `containerRect` is set and falls back to `getPanelPositionFixed`, ensure that fallback still places the panel beside the card (it already uses `anchorRect`; verify on first paint).

1. **Edge cases**

- **Narrow viewport:** Panel already flips to the left of the card when there’s no room on the right (`getPanelPositionAbsolute` / `getPanelPositionFixed`). No change needed.
- **Scroll during hover:** With approach A, the panel scrolls with the content. With approach B, either keep the panel fixed and optionally close it on scroll.

## Files to change


| File                                               | Change                                                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [components/Products.tsx](components/Products.tsx) | Add `containerRef`, attach it to the inner `relative` div, set `containerRect` from `containerRef.current` in `useLayoutEffect`. |


No changes to [components/ProductHoverPanel.tsx](components/ProductHoverPanel.tsx) are required for the primary fix (correct position next to the card and no “following” with current absolute behavior).

## Verification

- Hover “Bagrem” (and other cards with long description): popup appears immediately to the right (or left on narrow screens) of the card, aligned vertically with the card.
- Scroll the page while the popup is open: popup moves with the content (approach A); it does not stick to the cursor or have a separate “following” behavior.

