---
name: featured-image-treatment-only
overview: Apply only image-column visual treatment to the featured product block (right-edge fade, edge vignette, bottom gold shimmer, and subtle image scaling), without changing layout, text, button, routing, or data logic.
todos:
  - id: fade-layer
    content: "Add right-edge dissolve overlay on featured image column using exact #0f0d0b target color."
    status: pending
  - id: vignette-layer
    content: Implement 4-edge vignette layer while preserving existing glow and non-interactive overlays.
    status: pending
  - id: shimmer-layer
    content: Add subtle bottom-only gold shimmer overlay on featured image column.
    status: pending
  - id: image-scale
    content: Apply base + hover scale transforms to featured image with long easing.
    status: pending
  - id: verify-stack
    content: Verify all 4 visual layers render and seam to text column has no visible hard line.
    status: pending
isProject: false
---

# Featured Image Treatment Plan

## Reconnaissance Findings

- Featured block markup lives in [components/Products.tsx](components/Products.tsx).
- Current featured image column class is `featured-img-pane` (not `featured-image-col`), with image rendered via Next `<Image>` wrapped in `.ms-featured-image-wrap`.
- Featured styles are in [components/Products.css](components/Products.css), scoped under `#proizvodi`.
- Existing pseudo-layer already exists on image pane: `#proizvodi .featured-img-pane::before` (currently radial glow).
- Layout/text/button are currently controlled by `featured-card-grid`, `featured-content`, `featured-heading`, `btn-primary`; these can remain untouched.

## Scope Guardrails

- Only adjust styles related to the featured image column and image rendering.
- Do not modify JSX structure unless needed for a dedicated shimmer layer element (optional fallback).
- Do not touch header, product grid, tooltips, copy, CTA behavior, routing, or data objects.

## Steps

1. **Right-edge dissolve layer**

- Add a new overlay on `#proizvodi .featured-img-pane::after`.
- Use exact fade target color `#0f0d0b` via `rgba(15,13,11,...)` to avoid hard seam with content side.
- Set overlay to right 45% width, absolute, non-interactive.

1. **Vignette edge darkening**

- Preserve existing glow behavior by moving one effect to an additional absolute child layer class (or combine safely in pseudo backgrounds).
- Ensure all 4 edges darken subtly without flattening center details.

1. **Bottom gold shimmer**

- Add a dedicated absolute shimmer layer in image column (`.featured-img-shimmer`) or equivalent pseudo stack.
- Position at bottom 35%, low opacity, z-index above image and below text UI.

1. **Subtle image scale motion**

- Apply base `transform: scale(1.03)` to featured image selector.
- On featured-card hover, animate to `scale(1.08)` with long easing (`8s`).
- Keep transitions image-only to avoid layout shifts.

1. **Layer stacking verification**

- Validate z-index order:
  - image base
  - vignette + right-edge fade
  - shimmer
  - existing non-image UI remains unaffected.
- Confirm no hard line between image column and content column; fade must visually blend into `#0f0d0b`.

## Files To Modify

- [components/Products.css](components/Products.css) (primary)
- [components/Products.tsx](components/Products.tsx) (only if a dedicated shimmer element is required)

## Verification Checklist

- Right-edge fade visible and smooth.
- Fade target color matches `#0f0d0b` exactly.
- Vignette darkens all edges subtly.
- Gold shimmer appears only at lower image edge.
- Image scales subtly at rest and on hover.
- No change in layout/text/button behavior.
