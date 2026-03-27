---
name: hero-about-separator
overview: Add a diamond divider between Hero and About, plus add responsive top padding to About’s hero grid wrapper, with exactly two code changes (one in `app/page.tsx`, one in `components/sections/AboutSection.tsx`).
todos: []
isProject: false
---

## Change 1 — Add responsive top padding to About hero grid wrapper

- **File**: `components/sections/AboutSection.tsx`
- **Where**: the outermost wrapper of the ab4 hero split block, currently:
  - `div` with `className="aboutV4Grid"` inside `RevealOnScroll className="reveal-about-v4"`
- **Edit**: append Tailwind padding-top utilities to that same `className` (do not alter any other padding values on that element):
  - desktop: `pt-[100px]`
  - tablet (640–1023): `sm:pt-[72px]`
  - mobile (≤639): `max-sm:pt-[52px]`

## Change 2 — Insert diamond divider between Hero and About in page

- **File**: `app/page.tsx`
- **Where**: between `<Hero />` and `<AboutSection />`
- **Edit**: insert the divider `div` inline.
  - Keep the inner 3 children as in the prompt (left line, diamond, right line)
  - Ensure wrapper background is `#0a0805`.
  - Make wrapper padding responsive without adding a new component/file:
    - desktop: `px-[80px]`
    - tablet: `sm:px-[40px]`
    - mobile: `max-sm:px-6`
  - Use either:
    - **Option A (recommended)**: `className` for responsive padding + `style` for the fixed properties (background, flex, gap)
    - **Option B**: keep everything inline (but CSS can’t do responsive padding purely inline without extra code)

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Manual: confirm the divider is visible between hero and about, and the About hero grid starts lower (padding-top) on all breakpoints.
