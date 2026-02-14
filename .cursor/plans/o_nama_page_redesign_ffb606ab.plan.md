---
name: O NAMA Page Redesign
overview: "Redesign the full About Us page (O nama) in [components/About.tsx](components/About.tsx): improve the main About content block (layout, typography, image, optional CTA), then fully enhance the Team section (heading, grid, profile images with gold styling, connecting line, typography, cards option, section transition, scroll animations, responsive and a11y). All changes stay within the existing section `#o-nama`, use current CSS variables and RevealOnScroll, and follow the provided color palette and technical specs."
todos: []
isProject: false
---

# Complete "O NAMA" Page Redesign – About Us + Team Section

## Current state

- **Single section** in [components/About.tsx](components/About.tsx): `<section id="o-nama">` with `aria-labelledby="about-title"`.
- **Block 1:** Two-column grid (text left, image right on desktop) wrapped in `RevealOnScroll` with `reveal-about`; animations in [app/globals.css](app/globals.css) (aboutSlideRight, aboutFadeUp). Typography: h2 `text-3xl..lg:text-5xl`, paragraphs `text-lg`/`text-base`, image `aspect-[4/3]`/`lg:aspect-[3/4]`, `rounded-lg`.
- **Block 2:** Team subsection "Tim koji stoji iza projekta" in `RevealOnScroll` with `reveal-timeline`. Two circular avatars (128px / 148px), `ring-2 ring-amber-400/60`, horizontal gradient line between them; below, two columns with role (uppercase amber), name (h4), short description. Staggered timeline animations already in globals.
- **Globals:** `--background: #0a0a0a`, `--foreground: #ededed`, `--gold: #d4af37`. No About-specific CTA or gold accent line yet.
- **Assets:** [public/images/aboutus/](public/images/aboutus/) — `onama.webp`, `osnivac.webp`, `menadzer.webp` (use with `next/image`, keep WebP).

**Note:** There is no separate "previous About Us improvements" document in the repo. Section 1 below is specified from your design language (padding, gold, typography scale, image treatment) so it matches the Team section and the rest of the site.

---

## Section 1: About Us content improvements

**Goal:** Align the main About block with the same layout, typography, image treatment, and optional CTA as in your brief.

### 1.1 Container and spacing

- **Section padding:** Increase to match brief: top 100–120px, bottom 80–100px (e.g. `pt-[100px] pb-20 lg:pt-[120px] lg:pb-24` or equivalent Tailwind). Keep `border-t border-white/10` and `bg-[var(--background)]`.
- **Content container:** Constrain content to max-width 1200–1400px (e.g. `max-w-6xl` or `max-w-7xl` already used; optionally introduce `max-w-[1200px]` or `max-w-[1400px]` if you want tighter than 7xl). Center with `mx-auto`, keep horizontal padding `px-4 sm:px-6 lg:px-8`.

### 1.2 Heading and typography

- **"O nama" (h2):** Desktop 42–48px (e.g. `text-4xl lg:text-5xl` or arbitrary `lg:text-[48px]`), font-weight 700, `text-[var(--foreground)]`. Add a **gold accent line** below: centered, 60–80px width, 3px height, `background: var(--gold)` (new element or `::after` with Tailwind/globals).
- **Paragraphs:** Increase hierarchy and readability: first paragraph ~18–20px, line-height 1.6–1.7 (`text-lg sm:text-xl leading-relaxed`); second paragraph slightly smaller or same with `text-[var(--foreground)]/80`. Ensure sufficient contrast (WCAG AA).

### 1.3 Image treatment

- **Main image** (`onama.webp`): Keep `next/image` with `fill`, `object-cover`, `sizes`. Add subtle **gold border** (e.g. 2–3px `border-2 border-[var(--gold)]/30` or similar) and **soft shadow** (e.g. `shadow-[0_10px_40px_rgba(212,175,55,0.15)]`). Keep or slightly increase `rounded-lg` (e.g. `rounded-xl`). Optional very subtle gold glow; avoid heavy effects.

### 1.4 Optional CTA

- If adding a CTA (e.g. "Saznaj više" or link to products/contact): place below paragraphs; style as secondary button (2px gold border, hover fill) consistent with Hero secondary CTA in [.cursor/plans/hero_and_navbar_design_enhancement_36365bb6.plan.md](.cursor/plans/hero_and_navbar_design_enhancement_36365bb6.plan.md) (border-amber-400/60, hover:bg-amber-400/20). Use semantic `<a>` or `<Link>` with proper focus states.

### 1.5 Section transition into Team

- Add **80–100px spacing** between the About content block and the Team subsection (e.g. `mt-20 lg:mt-24` or `pt-20` on the Team wrapper). Optionally add a **subtle divider**: centered thin line (1px, gold at low opacity, 60–80px width) or a gradient fade. Implement in About.tsx between the two `RevealOnScroll` blocks.

---

## Section 2: Team section enhancements

**Goal:** Implement layout, heading, profile images, connecting line, typography, optional card treatment, animations, responsive behavior, and a11y as specified.

### 2.1 Section container and background

- **Wrapper:** Full-width container, max-width 1200–1400px (e.g. `max-w-6xl` or `max-w-[1200px]`), centered. Padding: 100–120px top, 80–100px bottom (can be achieved by increasing the Team block’s own padding so that with the 80–100px gap from Section 1 the total feels correct). Background: keep dark `#0a0a0a` or add very subtle gradient (e.g. `bg-gradient-to-b from-transparent via-[var(--background)] to-transparent` at very low opacity) in globals or inline. Optional: honeycomb pattern at 0.02–0.03 opacity (CSS background or small repeated SVG).

### 2.2 Heading

- **"Tim koji stoji iza projekta":** Use `<h2>` for this subsection (or keep `<h3>` if the page’s only h2 is "O nama"; ensure one h1 per page and logical heading order). Font-size: 42–48px desktop, 32–36px mobile (e.g. `text-3xl sm:text-4xl lg:text-5xl`), font-weight 700, text-align center. Margin-bottom: 60–80px (e.g. `mb-16 lg:mb-20`). **Gold accent line:** centered, 60–80px width, 3px height, `var(--gold)`. Optional: small decorative element (honeycomb or bee icon, low opacity, `aria-hidden`).

### 2.3 Team grid layout

- **Layout:** Flexbox or CSS Grid. Desktop: two columns, equal width; gap 80–120px (e.g. `grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24`). Mobile: single column, gap ~60px. Center content; keep avatars and text aligned per column.

### 2.4 Profile image enhancements

- **Size:** Desktop 200–240px diameter (e.g. `w-[220px] h-[220px]` or `w-56 h-56`), mobile 180px (e.g. `w-[180px] h-[180px]`). Keep `rounded-full`, `object-cover`, `next/image` with explicit dimensions and `sizes`.
- **Border and shadow:** 4–5px solid gold `border-4 border-[var(--gold)]`; box-shadow as specified:
  - `0 0 0 4px var(--gold)` (or rely on border),
  - `0 10px 40px rgba(212, 175, 55, 0.2)`,
  - `0 0 60px rgba(212, 175, 55, 0.15)`.
- **Hover:** `transform: scale(1.05)`, brighter border (e.g. `hover:border-[var(--gold)]`), stronger glow; transition 0.3–0.4s ease. Add `@media (prefers-reduced-motion: reduce)` override to disable scale. Implement in globals as a class (e.g. `.team-avatar`) and use in About.tsx.

### 2.5 Connecting line

- **Desktop:** Decorative line between the two profile columns. Use gradient: `linear-gradient(90deg, transparent, var(--gold), var(--gold), transparent)` or gold-to-gold with opacity stops; thickness 2–3px. Optional: dotted/dashed pattern or small honeycomb/hex elements along the line (CSS or inline SVG). Optional: subtle CSS animation (e.g. gradient position or opacity) for a "flowing" effect; keep subtle and respect `prefers-reduced-motion`.
- **Mobile:** Remove horizontal line or replace with a short vertical divider between stacked cards; avoid cluttering small screens.

### 2.6 Typography and content

- **Role labels** ("OSNIVAČ", "MENADŽER"): Gold `var(--gold)`, 13–14px, letter-spacing 2–3px, font-weight 600–700, margin-bottom ~12px. Optional subtle text-shadow in globals.
- **Names:** 28–32px desktop, 24–26px mobile, font-weight 700, color `#ffffff` / `var(--foreground)`, margin-bottom 8–12px, proper line-height.
- **Description:** Increase to 16–17px, line-height 1.6, color `#c0c0c0` or `#b0b0b0` (e.g. `text-[var(--foreground)]/75`). Max-width 280–320px per person, text-align center. Expand copy to 2–3 sentences per person if content is provided (experience, years, philosophy, or key points).

### 2.7 Optional card treatment

- **Alternative:** Wrap each team member in a card: background `#0d0d0d` or `#111`, border `1px solid rgba(212, 175, 55, 0.2)`, padding 40–50px, border-radius 12–16px, box-shadow for depth. Hover: slight lift (`translateY(-4px)`) and stronger shadow. If implemented, use semantic `<article>` per member and keep layout grid/flex.

### 2.8 Scroll animations

- **Heading:** Fade in on scroll (already achieved via `reveal-timeline` and `.reveal-timeline-title`; optionally tune delay/duration).
- **Team members:** Staggered reveal: left member slide-in from left, right from right (or both fade + slide up). Add dedicated classes in globals (e.g. `.reveal-team-left`, `.reveal-team-right`) with `translateX(-40px)` / `translateX(40px)` initial state and animate to 0 when `.reveal-timeline.is-visible`; use `prefers-reduced-motion` to fall back to opacity-only or no animation.
- **Connecting line:** Optional "draw from center" animation (e.g. scaleX from 0 to 1 with transform-origin center) when timeline becomes visible. Keep short (e.g. 0.6s) and disable when `prefers-reduced-motion: reduce`.

### 2.9 Responsive behavior

- **Breakpoints:** At 768px and 1024px adjust spacing (padding, gaps) to stay within your specified ranges. Stack team vertically below a single column breakpoint; reduce avatar size to 180px on mobile; remove or change connecting line as above.
- **Touch:** Ensure tap targets for any links/buttons (e.g. 44px min height) and no hover-only critical info.

### 2.10 Accessibility

- **Semantics:** Use `<section>` for Team subsection if splitting, or keep one `<section id="o-nama">` with an `<h2>` or `<h3>` for "Tim koji stoji iza projekta" and `<article>` per team member. Heading hierarchy: one h1 (Hero), then h2 "O nama", then h2 or h3 for Team heading.
- **Images:** Descriptive `alt` for each profile image (e.g. "Osnivač Meden Srbija – Bojan Stanković", "Menadžer Meden Srbija – Bogdan Stanković").
- **Contrast:** Ensure role, name, and description meet WCAG AA on dark background; gold on #0a0a0a is acceptable for accents.
- **Focus:** Any links (e.g. LinkedIn, email) must have visible focus ring (`focus-visible:ring-2 focus-visible:ring-[var(--gold)]` or similar).
- **Reduced motion:** All scroll and hover animations must be disabled or simplified in `@media (prefers-reduced-motion: reduce)` in globals.

### 2.11 Optional additions

- **Links:** LinkedIn or email icons below descriptions with hover states; optional contact/social links.
- **Trust:** Years-in-business badge, certifications, or short testimonial quote can be added in a small row or below the grid if you have content.
- **Expandable bio:** If you want longer bios, add a "Više" control that toggles extra text (aria-expanded, focus management).

---

## Technical approach

- **Files to change:** [components/About.tsx](components/About.tsx) (structure, classes, optional CTA, Team markup, image dimensions); [app/globals.css](app/globals.css) (new utility classes for About accent line, team avatar + hover, team reveal left/right, connecting line, optional card, reduced-motion overrides).
- **RevealOnScroll:** Keep using existing [components/RevealOnScroll.tsx](components/RevealOnScroll.tsx). Optionally pass `once={true}` for About and Team so animations run once. No new observer logic required; new animations are CSS-only keyframes + classes triggered by `.is-visible`.
- **Images:** Keep `next/image`; use `sizes` appropriate to avatar and main image; lazy loading is default for below-fold images.
- **Color palette:** Use `var(--background)`, `var(--foreground)`, `var(--gold)`; card bg `#0d0d0d`; borders `rgba(212, 175, 55, 0.2)`–`0.3` as specified.

---

## Implementation order (recommended)

1. **Section 1:** Container padding and max-width; heading with gold accent line; paragraph typography; main image border and shadow; optional CTA; spacing/divider before Team.
2. **Section 2 – structure:** Team container padding and max-width; heading with gold line; switch to two-column grid with correct gaps and mobile stack.
3. **Section 2 – visuals:** Profile image size, gold border, box-shadow, and hover class in globals; connecting line (gradient, optional pattern/animation); mobile line handling.
4. **Section 2 – typography:** Role, name, and description classes and content updates.
5. **Section 2 – optional:** Card wrapper and hover; honeycomb/decorative background.
6. **Animations:** Staggered team left/right (or fade-up) keyframes and classes; connecting line draw animation; reduced-motion overrides.
7. **Responsive and a11y:** Breakpoint checks, focus states, alt text, heading hierarchy, and reduced-motion pass.

---

## Summary

| Area            | Action                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| About content   | Larger padding, constrained width, gold underline on h2, improved body typography, image border/shadow, optional CTA, 80–100px + optional divider before Team |
| Team container  | Generous padding, max-width 1200–1400px, optional subtle background                                                                                           |
| Team heading    | 42–48px / 32–36px, bold, centered, gold accent line, optional decoration                                                                                      |
| Team grid       | Two columns desktop (80–120px gap), stacked mobile (60px gap)                                                                                                 |
| Profile images  | 200–240px / 180px, 4–5px gold border, triple box-shadow, hover scale + glow, a11y alt                                                                         |
| Connecting line | Gradient/pattern, 2–3px, optional animation; hidden or vertical on mobile                                                                                     |
| Typography      | Role (gold, 13–14px, tracking), name (28–32px), description (16–17px, 280–320px max-width)                                                                    |
| Optional        | Cards, honeycomb bg, social links, trust badges, expandable bio                                                                                               |
| Animations      | Staggered team reveal (left/right or fade-up), line draw, all with reduced-motion fallback                                                                    |
| A11y            | Heading order, alt text, contrast, focus states, semantic HTML                                                                                                |

All deliverables (About block redesign, Team enhancements, transition, responsive, animations, a11y) are achievable within [components/About.tsx](components/About.tsx) and [app/globals.css](app/globals.css) without new components unless you choose to extract a reusable `AboutTeam` component for clarity.
