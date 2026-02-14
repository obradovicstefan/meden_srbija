---
name: Products Page Redesign
overview: 'Redesign the Proizvodi section with a refined page heading, a polished featured "JEDNA KESICA" card (badge, typography, CTA), and a responsive product grid where all information is visible by default (critical mobile fix). Optional: desktop hover/click detail panel, mobile detail sheet/modal, filters, and scroll animations.'
todos: []
isProject: false
---

# Products Page Redesign – Featured Product + Grid

## Current state

- **[components/Products.tsx](components/Products.tsx)**: Section `#proizvodi` with heading "Proizvodi", inline featured Kesica block, then a single grid of `ProductCard`. Uses `ProductHoverPanel` (hover-only) for full product details; no touch/mobile equivalent.
- **[components/ProductCard.tsx](components/ProductCard.tsx)**: Shows image, name, description, `weightVariants`. Text "Pređi mišem za više →" and hover triggers portal panel; on mobile, long description is unreachable.
- **[components/ProductHoverPanel.tsx](components/ProductHoverPanel.tsx)**: Portal-rendered floating panel with image, name, weightVariants, and longDescription paragraphs; positioned relative to hovered card. Mouse-only.

Theme: `--background: #0a0a0a`, `--gold: #d4af37`. Existing utilities: `reveal-on-scroll` / `revealFadeUp`, `panel-slide-in` / `fadeInRight`, `RevealOnScroll`. No product detail route (static export); CTAs will use `#kontakt` for ordering/inquiry.

---

## 1. Page heading (Section 1)

**File:** [components/Products.tsx](components/Products.tsx)

- Replace current `h2` with:
  - **Desktop:** `text-5xl`–`text-6xl` (48–56px), `font-bold` (700), centered, `mb-16`–`mb-20` (60–80px).
  - **Mobile:** `text-4xl` (36–40px) via responsive classes.
- Add centered gold accent line below: fixed width 60–80px, height 3px, `bg-[#D4AF37]`, `mx-auto`.
- Optional subtitle: "Naši prirodni proizvodi od meda" below the line, muted text, smaller font.

No new components; all in the same section wrapper.

---

## 2. Featured product card – "JEDNA KESICA" (Section 2)

**File:** [components/Products.tsx](components/Products.tsx) (featured block only)

**Layout and container**

- Wrapper: `max-w-[1200px] mx-auto mb-16`–`mb-20`; padding `p-8`–`p-12` (desktop), `p-6`–`p-8` (mobile); `rounded-2xl` (16–20px).
- Background: spec gradient (e.g. `linear-gradient(135deg, #3d2f1f 0%, #2d1f0f 50%, #1d1309 100%)`) via inline style or Tailwind arbitrary values.
- Border: `2px solid rgba(212, 175, 55, 0.3)`; `box-shadow: 0 20px 60px rgba(0,0,0,0.5)`.

**Grid**

- Desktop: two columns ~40% image / 60% content, gap 40–60px.
- Tablet: similar two columns, ~45% / 55%.
- Mobile: single column, image first (order), then content; reduce gap.

**"IZDVOJENO" badge**

- Position: `absolute top-4 right-4` (or top-6 right-6). `bg-[#D4AF37]` text `#1a1a1a`, `px-5 py-2`, `text-xs` `font-bold` `tracking-widest`, `rounded-md` or pill. Optional: subtle CSS animation (pulse/glow) with `prefers-reduced-motion` respected.

**Image (left)**

- `aspect-square` or `aspect-[4/5]`, `object-cover`, `rounded-xl`, shadow `0 10px 40px rgba(212,175,55,0.2)`, border `1px solid rgba(212,175,55,0.3)`. Hover: `scale(1.02)` and/or stronger glow (group-hover).

**Content (right)**

- **Title:** "JEDNA KESICA." — `text-4xl`–`text-5xl` (desktop), `text-3xl` (mobile), `font-bold`, color `#D4AF37`; margin below 16px. Option: drop period or style it as gold.
- **Flavor line:** "Sa ukusom PRIRODE i LUKSUZA" — `text-lg`–`text-xl`, italic on flavor words, `#e5e5e5`, `mb-5`.
- **Body paragraphs:** `text-base`–`text-[17px]`, `leading-relaxed` (1.7–1.8), `#c0c0c0`, max-width ~540px, spacing 16–20px. Highlight phrases in gold: "PRESTIŽ JE TU", "MOĆ PRIRODE", "MEDEN" (existing content, adjust classes to match spec).
- **Decorative line:** 60–80px × 2–3px, `#D4AF37`, after last paragraph.
- **CTA button:** "Saznaj više" or "Naruči odmah" — `<a href="#kontakt">` with classes: `bg-[#D4AF37] text-[#1a1a1a]`, padding 14px 32px, `font-semibold`, `rounded-lg`, shadow and hover `translateY(-2px) scale(1.02)`, transition 0.3s. Ensure 44px min touch target and visible focus ring.

---

## 3. Product grid and cards (Section 3) – critical mobile fix

**Grid container** in [components/Products.tsx](components/Products.tsx)

- `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`, `gap: 2rem` (desktop), `max-w-[1400px] mx-auto`, `px-5` / `py-10`.
- **Breakpoints:**
  - &lt;640px: `grid-cols-2`, gap 16–20px, padding 16px.
  - &lt;400px (optional): `grid-cols-1`.

**ProductCard – show all info by default (no hover dependency)**

**File:** [components/ProductCard.tsx](components/ProductCard.tsx)

- **Default visible on all viewports:** product image, product name, short description (2–3 lines, `line-clamp` + ellipsis), pricing (`weightVariants`), and a CTA link. No information hidden behind hover.
- **Card container:** background `#0d0d0d` or `#111`, border `1px solid rgba(212,175,55,0.2)`, `rounded-xl`–`rounded-2xl`, padding 0 (image full-width top). Shadow and hover: `translateY(-4px)`, stronger gold border and shadow on desktop only.
- **Image:** aspect ratio 1/1 or 4/5, `object-cover`, `rounded-t-xl`.
- **Content block:** padding 20–24px. Name: 20–22px, `font-bold`, white. Description: 14–15px, `line-height` 1.6, `#b0b0b0`, clamped. Pricing: 15–16px, `#D4AF37`, `font-semibold`, multi-line allowed.
- **CTA link:** "Predi za više →" (desktop) / "Vidi detalje →" (mobile) — use `sr-only` or responsive text so one label per breakpoint if desired; or single "Vidi detalje →". Style: `text-[#D4AF37]`, hover underline; ensure 44px min height for touch.

**Remove hover dependency for content**

- Do not require hover to see name, description, or price. Keep hover only for optional desktop enhancement (e.g. stronger shadow, or open detail panel).
- **ProductHoverPanel** usage: keep for desktop as an enhancement (hover or click-to-open). On mobile, do not rely on it for primary info; use either always-visible card content and/or a tap-to-open detail view (see below).

**Optional: mobile detail (expand or modal)**

- **Option A – In-card expand:** Tap product name or "Vidi detalje" toggles expanded state; show `longDescription` and optionally full pricing in an accordion with chevron; smooth height/opacity transition; `aria-expanded` and focus management.
- **Option B – Bottom sheet / modal:** Tap card or "Vidi detalje" opens a bottom sheet (mobile) or modal (tablet/desktop) with large image, full description, all pricing, optional "Naruči" button linking to `#kontakt`. Close by swipe-down or X; trap focus and restore on close.

Implement one of these so mobile users can access full text without hover. Recommendation: Option B (modal/sheet) reuses content similar to ProductHoverPanel and keeps cards compact.

---

## 4. Desktop hover/click detail (enhancement)

**Files:** [components/ProductHoverPanel.tsx](components/ProductHoverPanel.tsx), [components/Products.tsx](components/Products.tsx), [components/ProductCard.tsx](components/ProductCard.tsx)

- Keep ProductHoverPanel for desktop. Optionally add **click** to open (e.g. on card or "Vidi detalje") so keyboard and touch users can open the same panel; use state `selectedProduct` + `anchorRect` from click target.
- On mobile (<640px or touch-only): do not show floating hover panel; rely on always-visible card content + optional sheet/modal.
- Ensure panel is dismissible (e.g. Escape, click outside) and has `aria-label` and focus trap when used as modal.

---

## 5. Optional: filters and sort

- Add a row above the grid: filter pills (Svi, Bagrem, Livada, Šuma, …) and/or sort dropdown (Cena, Naziv). Filter by product `id` or a new `category` field on `Product`; sort by name or by parsing price. Animate grid items (e.g. fade/move) when filtering. Low priority; implement only if time permits.

---

## 6. Animations and performance

- **Scroll:** Use existing `RevealOnScroll` for the section; optionally add a `reveal-products` variant so the heading, featured card, and grid (or each card) get staggered `revealFadeUp` with delays. Respect `prefers-reduced-motion` (already in globals).
- **Images:** Keep Next.js `Image` with existing `sizes`; ensure product grid images use lazy loading (default for non-priority) and appropriate `sizes` (e.g. `(max-width: 640px) 50vw, ...`). No changes needed if already correct.
- **Loading:** Optional skeleton or placeholder for images; optional fade-in when loaded. Not blocking.

---

## 7. Accessibility and semantics

- Section: `aria-labelledby="products-title"`; heading `id="products-title"`.
- Cards: keep `<article>`, `aria-labelledby` pointing to product heading.
- Buttons/links: visible focus ring (`focus-visible:ring-2` etc.), CTA touch targets ≥44px.
- Images: meaningful `alt` (product name).
- If modal/sheet: focus trap, Escape to close, `aria-modal="true"`, and return focus to trigger on close.

---

## 8. Files to touch (summary)

| File                                                                 | Changes                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [components/Products.tsx](components/Products.tsx)                   | New heading + gold line + subtitle; featured block restyle (gradient, badge, grid, typography, CTA); grid container (max-width, columns, gap, breakpoints); optional `selectedProduct` for click-to-open panel; optional filter/sort state. |
| [components/ProductCard.tsx](components/ProductCard.tsx)             | Always show name, description, price, CTA; new card styling (bg, border, shadow, hover); optional onClick for modal/sheet or expand; responsive CTA label; remove "Pređi mišem" as only cue.                                                |
| [components/ProductHoverPanel.tsx](components/ProductHoverPanel.tsx) | Optional: support both hover and click; optional mobile-friendly variant (e.g. full-screen or bottom sheet when opened by click on small viewport).                                                                                         |
| [app/globals.css](app/globals.css)                                   | Optional: featured badge pulse/glow keyframes; product grid stagger classes; any new utility for modal/sheet.                                                                                                                               |

Optional new component: `ProductDetailSheet.tsx` or `ProductDetailModal.tsx` for mobile (and optionally desktop) full-detail view opened on tap, reusing product data and similar layout to ProductHoverPanel.

---

## Implementation order

1. **Page heading** – quick win, no dependency.
2. **Featured card** – self-contained restyle in Products.tsx (layout, badge, gradient, typography, CTA).
3. **ProductCard always-visible content** – ensure name, description, price, and CTA are always visible; adjust layout and styles per spec.
4. **Grid container** – max-width, auto-fill columns, responsive gaps and breakpoints (1–2 cols mobile).
5. **Mobile detail path** – implement either in-card expand or ProductDetailSheet/Modal so full description is reachable on touch.
6. **Desktop hover/click** – keep ProductHoverPanel, add click-to-open and viewport check so mobile uses sheet/modal instead.
7. **Animations** – stagger reveal for heading, featured, and cards; respect reduced motion.
8. **Optional** – filters, sort, quick view; polish and a11y pass.

This order ensures the critical fix (no hover dependency, mobile-first info) is done right after the featured block and grid layout.
