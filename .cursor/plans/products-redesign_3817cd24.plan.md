---
name: products-redesign
overview: Rebuild the Products section UI to match the provided design exactly, while preserving existing featured placement, desktop hover/pin tooltip behavior for all 15 cards, and all routing/data/business logic.
todos:
  - id: fonts-weights
    content: Update `[app/layout.tsx]` font weights to include Cormorant `700` and Montserrat `600` per spec.
    status: pending
  - id: products-css
    content: Create `[components/Products.css]` implementing the full Products/Shop design spec (header, featured card, grid, card + tooltip styles, animations, scroll hint).
    status: pending
  - id: products-tsx-refactor
    content: Refactor `[components/Products.tsx]` markup to match the spec header/featured/grid structure; keep the existing hover/pin timing logic; remove floating `ProductHoverPanel` rendering and wire in-card tooltip state + close/backdrop + scroll hint count.
    status: pending
  - id: productcard-tooltip
    content: Refactor `[components/ProductCard.tsx]` to render the in-card tooltip overlay (`.product-tooltip`) while preserving the current mobile accordion and click-to-pin behavior on desktop.
    status: pending
  - id: stagger-animations
    content: Add per-card stagger entrance animations (featured delay `0.2s`, cards stagger `0.1s` up to `0.8s`) using the spec `fadeUp` keyframes.
    status: pending
  - id: verify
    content: Run build/lint/typecheck and do a manual UI verification pass (desktop hover, click pin, Escape/backdrop close, mobile accordion, responsive breakpoints, scroll hint count).
    status: pending
isProject: false
---

## Scope

Replace the current Products section layout/styling (header, featured card, grid, cards, hover tooltip styling) while keeping:

- The featured product slot and its data.
- The existing product dataset (static array) and longDescription-driven behavior.
- The interaction semantics: desktop hover shows tooltip with the same 180ms leave delay, and click pins/unpins (with Escape/backdrop close behavior preserved as closely as possible).
- Mobile behavior stays the accordion expand/collapse.

## Key files

- [components/Products.tsx](components/Products.tsx): Products section structure, featured card markup, product list render, hover/pin state.
- [components/ProductCard.tsx](components/ProductCard.tsx): individual card markup + mobile accordion; will gain the in-card hover tooltip overlay.
- [components/ProductHoverPanel.tsx](components/ProductHoverPanel.tsx): will no longer be used by `Products.tsx` (kept intact to avoid unrelated risk).
- [components/Products.css](components/Products.css) (new): all spec-specific CSS (colors, layout, tooltip overlay, animations, scroll hint).
- [app/layout.tsx](app/layout.tsx): ensure font weights for Cormorant Garamond (incl. 700) and Montserrat (incl. 600) are loaded.

## Implementation plan

### 1. Fonts/design tokens alignment

- Update `[app/layout.tsx]` `next/font/google` configs so the weights used by the design spec are actually available:
  - Cormorant: include `700` (display/featured headings).
  - Montserrat: include `600` (badge/buttons/strong emphasis).
- Keep usage via `var(--font-cormorant)` / `var(--font-montserrat)` as Hero/About already do.

### 2. Add Products-specific CSS (spec-accurate)

Create `[components/Products.css]` and scope selectors to avoid collisions.

- Implement:
  - Section/header layout styles (vertical gold lines, `PROIZVODI` title, divider, subtitle typography).
  - Featured card grid + `border-radius: 0` + `featured-card::before/::after` L-corners.
  - Featured image pane radial glow behind the image.
  - Grid header (`Sve vrste meda ...`).
  - Product grid (`repeat(3,1fr)`, `gap:2px`) and the responsive breakpoints (860px -> 2 columns, 560px -> 1 column).
  - Card styling (`product-card`, `card-img-wrap`, image hover wash pseudo-element).
  - In-card hover tooltip overlay (`product-tooltip`, `tooltip-name`, `tooltip-price`, `tooltip-text`) with pinned state.
  - Entrance animation keyframes (`fadeUp`) and per-card stagger delays.
  - Bottom scroll hint (`Još X vrsta meda ...`) and divider lines.

Note: the design spec includes a linear-gradient sheen in `.btn-primary::before` even though it says “no gradients except product image glow”. During the rebuild we will follow the provided `.btn-primary` CSS to match the exact visual spec; if you want strict “no gradients” globally for the Products section, we can swap the sheen to a non-gradient opacity overlay.

### 3. Refactor `components/Products.tsx` structure

- Replace the current centered `Proizvodi` heading with the specified 3-line header structure:
  - vertical gold lines + “Meden Srbija · Od 1987” row
  - `PROIZVODI` display title
  - subtitle “Naši prirodni proizvodi od meda”
- Rebuild the featured card markup to match the specified grid and content order:
  - card container: background `#0f0d0b`, border `rgba(201,146,10,0.18)`, margin-bottom `80px`, overflow visible
  - badge: absolute top/right, uppercase, border `rgba(201,146,10,0.45)`, transparent background
  - left pane: `min-height: 520px`, background `#080604`, centered image + radial glow layer
  - right pane: padding `60px 52px` and the exact text blocks/order/dividers
  - CTA button: apply `.btn-primary`
- Insert the grid header (“Sve vrste meda — ...”) between featured and the cards grid.
- Update product cards grid container to:
  - `grid-template-columns: repeat(3, 1fr)` and `gap: 2px`
  - apply the new responsive classes for 860px and 560px.
- Preserve existing hover/pin state logic (including 180ms leave delay) but remove floating-panel rendering:
  - stop rendering `ProductHoverPanel`
  - instead pass `isHovered` / `isPinned` and close handler to each `ProductCard` so it can show the in-card `.product-tooltip` overlay.
- Maintain gating:
  - desktop tooltip overlay only when `!isMobile && product.longDescription`.
  - mobile keeps the current accordion expand/collapse.
- Add the bottom scroll hint below the grid.
  - Use IntersectionObserver to compute `X` as “cards not visible in the first viewport” when the section first becomes visible; recompute on resize so the number matches the active viewport.

### 4. Refactor `components/ProductCard.tsx` to support in-card tooltip

- Update markup to match the design spec:
  - `article` becomes `.product-card` (with `position:relative`, `border-radius:0`, correct backgrounds/borders).
  - image area becomes `.card-img-wrap` with `aspect-ratio: 4 / 3` and the hover wash `::after`.
  - info block includes Name/Short description/Price (`weightVariants`).
- Add in-card tooltip overlay markup:
  - `.product-tooltip` positioned absolutely at the top of the card
  - `.tooltip-name`, `.tooltip-price` (from `product.weightVariants`), `.tooltip-text` from `product.longDescription` paragraphs
- Preserve interactions:
  - keep the existing mobile accordion UI unchanged.
  - desktop: show overlay on hover (controlled by `isHovered` state) and pinned on click (controlled by `isPinned` state).
  - pinned overlay must support close (Escape and click outside/backdrop behavior preserved via a backdrop in `Products.tsx`, plus a close button in the tooltip).

### 5. Entrance animations and stagger

- Keep `RevealOnScroll` for section-level reveal.
- Add a per-card stagger:
  - in `Products.tsx` map the product cards with `style={{ animationDelay: ... }}` using the index,
  - keep the animation respecting `prefers-reduced-motion` via CSS.
- Featured card delay: match the spec (`0.2s`).

### 6. Verification (post-implementation)

- Confirm:
  - featured card remains in the same slot and uses the same `featuredProduct` image/id
  - all 15 cards show the in-card tooltip overlay on desktop hover with the same delay behavior
  - click pins/unpins and close works (Escape + backdrop + focus restoration)
  - mobile accordion still functions
  - responsive breakpoints match (860px/560px)
  - no border-radius > 0 anywhere in this Products section
  - colors match spec values

## Deliverables

- Visual/UI parity with the provided design spec for Products section.
- No changes to routing/data fetching/business logic beyond removing the floating panel rendering in favor of the in-card tooltip overlay.
