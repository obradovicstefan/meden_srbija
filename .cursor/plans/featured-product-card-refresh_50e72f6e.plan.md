---
name: featured-product-card-refresh
overview: Refresh the existing featured product block on the products section to match your provided visual spec and keep the grid subheader aligned with the current project style language.
todos:
  - id: inspect-featured-markup
    content: Validate and minimally adjust Featured markup in Products.tsx for glow layer and content order
    status: pending
  - id: retune-featured-css
    content: Update Featured card, pane, typography, corner accents, and CTA styles in Products.css to match provided spec
    status: pending
  - id: subheader-harmonization
    content: Keep current grid subheader style pattern and tune spacing/typography only if needed for cohesion
    status: pending
  - id: verify-lint-and-ui
    content: Run lints and verify visual behavior for featured card, subheader, and products grid responsiveness
    status: pending
isProject: false
---

# Featured Product Card Refresh Plan

## Scope

Update the existing featured block inside the products section (current location in [C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.tsx](C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.tsx)) and tune its styles in [C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.css](C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.css). Keep the grid subheader between featured and product cards using the project’s existing style approach.

## Implementation Steps

- In [C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.tsx](C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.tsx), preserve current featured content structure and adjust markup only where needed for spec fidelity:
  - Ensure image pane has a dedicated glow layer element (or pseudo-ready wrapper) behind the Next `Image`.
  - Keep `Image` with `fill` and `object-cover` behavior.
  - Keep badge, prelabel row, heading, tagline, divider, body paragraphs, paragraph separator, and CTA order exactly as requested.
- In [C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.css](C:/Users/stefa/Desktop/Folderi/sajtovi/meden_srbija/meden_srbija/components/Products.css), align featured styles to your provided values:
  - Card container: full-width, dark surface, border opacity, `overflow: visible`, corner accents sizing/opacities.
  - Two-column layout: enforce `1fr 1fr` for featured card grid.
  - Badge position/typography spacing to requested metrics.
  - Left image pane min-height/background/alignment and subtle radial gradient glow (no solid amber fill).
  - Right content spacing and typography tuning for prelabel, heading, tagline, divider, paragraphs, emphasis, and brand span.
  - CTA `.btn-primary` to match provided primary style and sheen hover transition.
- For subheader between featured and grid cards, keep existing pattern (`.grid-header`, `.grid-title`, `.grid-line`) and lightly normalize sizing/spacing only if needed to visually integrate with updated featured card, without introducing a new stylistic system.
- Ensure responsive behavior remains stable (featured still collapses appropriately on smaller breakpoints) while preserving existing dark-theme language.

## Verification

- Run lint checks for touched files and fix any introduced issues.
- Verify in browser/dev build that:
  - Featured card matches requested visual hierarchy.
  - Glow appears subtle and non-blocking behind image.
  - CTA sheen animation and border hover are working.
  - Existing grid subheader still sits correctly between featured and product cards.
  - No regressions in product card grid or toggle interactions.
