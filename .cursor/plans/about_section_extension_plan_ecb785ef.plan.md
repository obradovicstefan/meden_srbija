---
name: About Section Extension Plan
overview: Plan for extending the About (O nama) section of the Meden Srbija Next.js site. The actual content/feature to add will be specified in your next prompt; this plan documents the current state, extension points, and implementation rules so changes can be applied consistently.
todos: []
isProject: false
---

# About Section Extension Plan

## Current state

**Component:** [components/About.tsx](components/About.tsx)

- **Structure:** Single `<section id="o-nama">` with one `RevealOnScroll` wrapper containing a two-column grid:
  - **Left column (desktop):** Title "O nama" (h2) + two paragraphs (tradition/quality copy).
  - **Right column (desktop):** One image only — `/images/aboutus/onama.webp` via `next/image` in an aspect-ratio box.
- **Responsive:** Grid becomes stacked on smaller breakpoints; column order is swapped (image first on mobile, text second).
- **Styling:** Tailwind + dark theme CSS variables (`--background`, `--foreground`); section uses `border-t border-white/10`, consistent typography scale. Scroll-reveal animations are defined in [app/globals.css](app/globals.css) (`.reveal-about`, `.reveal-about-text`, `.reveal-about-image`).
- **Usage:** About is composed once in [app/page.tsx](app/page.tsx) between Hero and Products.

**Available assets (currently unused in About):**

- `/images/aboutus/menadzer.webp`
- `/images/aboutus/osnivac.webp`

**Rules (from spec and project_plan):**

- No new dependencies unless you approve.
- All images from `/public/images`; reference as `/images/...`; use `next/image` except for CSS backgrounds.
- Styling: Tailwind only; stay consistent with dark theme and existing typography/spacing.
- Static-first; no backend/CMS for this change.

---

## Extension points (where to add content)

You can extend the About section in one or more of these ways without breaking the existing layout:

1. **Inside the current grid**
   Add more blocks (e.g. another paragraph, a subheading, or a small “stats” row) inside the left column (`.reveal-about-text`), or add a second image/card in the right column. Keeping the same grid and RevealOnScroll keeps current animations.
2. **New row below the grid**
   Add a second row (e.g. team photos, quotes, or a “Why us” strip) below the existing two-column grid, still inside the same `<section>` and optionally inside the same or a new `RevealOnScroll` wrapper for scroll-reveal.
3. **Subsections**
   Split “O nama” into subsections (e.g. “Naša priča” + “Tim” or “Vrednosti”) with clear headings; each subsection can have its own two-column or single-column layout.
4. **Reuse existing assets**
   Use `menadzer.webp` and `osnivac.webp` for team/leadership blocks, secondary image column, or a small gallery within About.

---

## Implementation approach (for your next prompt)

When you specify what to add in the next prompt, implementation will:

1. **Edit only [components/About.tsx**](components/About.tsx) unless the addition is a standalone component (e.g. a reusable `AboutTeam` or `AboutValues`); in that case we add a new component and import it into About.
2. **Preserve:** section `id="o-nama"`, `aria-labelledby="about-title"`, existing heading and paragraphs, and the current RevealOnScroll + grid for the existing block.
3. **Match styling:** same Tailwind patterns (spacing `py-16 sm:py-20 lg:py-24`, container `max-w-7xl`, `text-[var(--foreground)]` and opacity variants), and existing `reveal-about-*` classes if the new content sits inside the same reveal wrapper.
4. **Images:** use `next/image` with `fill` or explicit dimensions, `sizes` for responsiveness, and descriptive `alt`; paths `/images/aboutus/...`.
5. **Accessibility:** new headings in logical order (h2 → h3), and new images with meaningful alt text.
6. **No changes** to [app/page.tsx](app/page.tsx) unless we split About into multiple sections on the page.

---

## What to provide in your next prompt

Please specify:

- **What** you want added (e.g. “team block with menadzer and osnivac photos”, “second paragraph”, “awards strip”, “quote”, “stats row”).
- **Where** it should sit (e.g. “below the current text”, “next to the main image”, “new row under the grid”).
- **Copy** (if any) for new headings or text, or say “use placeholder” and we can use sensible placeholders.

With that, the change can be implemented following this plan and the existing Phase 3 structure and global rules.
