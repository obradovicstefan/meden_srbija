---
name: awards-honours-carousel
overview: Rebuild the existing Awards section as a modern, highly interactive, dark-theme Tailwind carousel component in TypeScript for Next.js App Router, using lucide-react icons and the exact interaction/visual behavior requested.
todos:
  - id: add-lucide-react
    content: Install lucide-react dependency for carousel icons
    status: pending
  - id: rewrite-awards-component
    content: Replace components/Awards.tsx with typed Tailwind-only Awards & Honours carousel
    status: pending
  - id: match-interactions-and-styling
    content: Implement progress bar, centered track transform, active card behaviors, pagination lines, and entrance animation
    status: pending
  - id: verify-quality
    content: Run lint checks and validate visual/interaction requirements
    status: pending
isProject: false
---

# Awards & Honours Carousel Plan

## Scope

Re-implement the current awards UI in a single client component and preserve existing page integration.

- Keep usage in [app/page.tsx](app/page.tsx) unchanged (`<Awards />`).
- Fully rewrite [components/Awards.tsx](components/Awards.tsx) to match requested structure, styles, and interactions.
- Use Tailwind utilities only for the component UI (no new custom CSS files).

## Implementation Steps

1. Add missing icon dependency

- Install `lucide-react` (required for `ChevronLeft`, `ChevronRight`, `Star`).

1. Rebuild component data + typing in `Awards.tsx`

- Keep `'use client'` at top.
- Define a strict `AwardItem` TypeScript type with fields: `id`, `name`, `year`, `category`, `location`, `tag`, `description`.
- Create a constant array of 6 Serbian-honey-themed awards with JSX-enabled `name` content for emphasis.
- Use `useState<number>(0)` for `currentIndex` (starts at `0`).

1. Implement header + controls

- Left block: vertical gold line, uppercase pre-title (`RECOGNITION & QUALITY`), serif title (`Awards & Honours` with italicized `Honours`).
- Right block: formatted fraction counter (`01 / 06`) and two square nav buttons with lucide chevrons.
- Add requested dark palette classes and hover/transition states.

1. Implement progress bar

- Track: `h-[1px] bg-[#c9920a]/10`.
- Fill: `bg-[#c9920a]` with width driven by:
  - `style={{ width:` ${((currentIndex + 1) / awards.length) 100}% `}}`
- Smooth width transition via Tailwind classes.

1. Implement 3-card carousel viewport + centered track translation

- Viewport with `overflow-hidden`.
- Track as flex row with `gap-6` (`24px`) and inline `transform: translateX(...)`.
- Card width set to `w-[calc(33.333%-16px)] shrink-0` to realize a 3-card layout with gap compensation.
- Compute translate offset from `currentIndex` so active card centers in desktop 3-card view.
- Add responsive fallbacks (2/1 card views on smaller breakpoints) while preserving active navigation behavior.

1. Implement interactive card states

- Card shell with dark background and subtle gold border.
- Bracket corners as absolutely positioned elements (top-left + bottom-right) that expand/brighten when active.
- Image area (`h-56`) with centered `Star`; inactive cards receive dark overlay.
- Body content: tag, serif title, divider expanding on active, metadata row (Year/Location/Category), and animated description reveal (`max-h-0 opacity-0` -> `max-h-40 opacity-100 mt-4`).
- Apply transitions (`transition-all duration-300 ease-in-out`) consistently for activation and hover.

1. Implement pagination lines

- Centered row of thin line indicators.
- Active indicator expands and becomes solid gold.
- Click updates `currentIndex`.

1. Add section entrance animation

- Add initial fade-in-up effect using Tailwind transitions + mount state trigger (no CSS file).

## Verification

- Run lint/type checks and fix any issues in edited files.
- Manually verify:
  - Prev/Next and dot navigation
  - Fraction counter and progress bar updates
  - Active/inactive visual states and description expansion
  - Dark theme color adherence and typography (`font-serif`/`font-sans`)
  - Responsive behavior and smooth transitions
