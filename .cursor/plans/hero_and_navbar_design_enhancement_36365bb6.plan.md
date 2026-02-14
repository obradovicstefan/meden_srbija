---
name: Hero and Navbar Design Enhancement
overview: "Refine the Meden Srbija hero section and navbar per the design brief: stronger navbar visibility (blur, dark bg, gold border), more nav spacing and active state, hero background and typography improvements, CTA polish, and optional decorative/parallax touches—all within existing CSS variables, WCAG AA, and performant animations."
todos: []
isProject: false
---

# Hero section and navbar design enhancement

## Current state (brief)

- **Navbar** ([components/Header.tsx](components/Header.tsx)): `backdrop-blur-md`, `bg-[var(--background)]/80`, `border-b border-white/5`. Desktop nav `md:gap-8`, `.nav-link` with gold underline on hover/focus; no active state. Mobile links have padding but no explicit 44px min height. Logo has no hover effect.
- **Hero** ([components/Hero.tsx](components/Hero.tsx)): Background image + two overlays (linear gradient + vignette). Overline "Prirodni med iz Srbije" (small, `tracking-[0.2em]`, amber). H1 "Meden Srbija" (display font, 4xl–7xl). Tagline and two CTAs; staggered entrance in [app/globals.css](app/globals.css). Primary button has lift/shadow; secondary has thin border.
- **Globals**: `--background: #0a0a0a`, `--foreground: #ededed`. No `--gold`; amber used via Tailwind. Staggered hero animations and reduced-motion overrides already present.

---

## 1. CSS custom properties (theming)

In [app/globals.css](app/globals.css) `:root`, add optional palette variables so the brief’s colors can be used without changing existing amber usage everywhere:

- `--gold: #D4AF37` (or keep using Tailwind amber-400/500 for consistency).
- Optionally `--gold-honey: #F4A460` for accents.
- Keep `--background` and `--foreground`; ensure hero/navbar use them for contrast (WCAG AA).

If you prefer no new variables, keep using Tailwind `amber-*` and `text-[var(--foreground)]` only.

---

## 2. Navbar improvements

**2.1 Background and visibility**

- **Backdrop blur:** Current `backdrop-blur-md` is ~12px; brief asks 10px. Either keep `backdrop-blur-md` or use arbitrary value `backdrop-blur-[10px]` in [components/Header.tsx](components/Header.tsx) on the `<header>`.
- **Background:** Replace `bg-[var(--background)]/80` with a semi-transparent dark, e.g. `bg-black/60` (equivalent to rgba(0,0,0,0.6)) so it matches the brief and stays readable.
- **Bottom border:** Change `border-white/5` to a 1px gold/honey separator: e.g. `border-b border-amber-400/30` or `border-[var(--gold)]/40` if you add `--gold`. Keeps separation without heavy weight.

**2.2 Navigation links**

- **Spacing:** In Header, increase desktop gap from `md:gap-8` to `md:gap-10` or `md:gap-12` for less cramped feel.
- **Hover:** Already present (gold text + underline via `.nav-link::after`). Ensure transition is smooth (e.g. `duration-200` or `duration-300`); already on link.
- **Active state:** Not implemented. Add section-based active state:
  - Option A (hash-based): In Header, use `usePathname()` and read `window.location.hash` (or pass hash from client). For each `navLinks` item, compare `href` (e.g. `#pocetna`) to current hash and add a class like `nav-link-active` when they match. Style in globals: `.nav-link-active` with gold color and/or visible underline (e.g. `::after` always visible). Requires client-side effect to sync hash on scroll or on load.
  - Option B (simpler): Style `:target` or rely on hover/focus only and skip true “active” for now.
  - Recommended: implement Option A with a small `useEffect` that sets state from `window.location.hash` and on `hashchange`, and apply `nav-link-active` class when `href === currentHash`.
- **Touch targets (mobile):** Ensure each mobile nav link has at least 44px height: add `min-h-[44px] min-w-[44px] flex items-center justify-center` (or equivalent) to the mobile Link/button wrapper in Header, and sufficient `py-3` so tap area is at least 44px.

**2.3 Logo**

- **Breathing room:** Logo link already has padding from the bar; ensure no reduced padding. Optional: add `pl-0 pr-2` or similar so space between logo and first nav item is clear.
- **Hover:** Optional subtle effect on the logo `<Link>`: e.g. `transition-transform duration-200 hover:scale-[1.02]` (no new colors). Respect `prefers-reduced-motion` in globals by disabling scale on that class if needed.

---

## 3. Hero section improvements

**3.1 Background treatment**

- **Less muddy / better contrast:** Current overlays: linear `from-black/70 via-black/50 to-black/80` and radial vignette. To “brighten slightly” and improve text contrast while keeping atmosphere:
  - Slightly reduce overlay opacity (e.g. `from-black/60 via-black/40 to-black/70`) and/or add a third overlay: a low-opacity dark gradient (e.g. `bg-gradient-to-b from-black/40 via-transparent to-black/50`) so the center is a bit lighter and text pops. Avoid making the hero too bright; keep it dark and premium.
- **Vignette:** Already present; optionally tighten the radial so the center is slightly brighter (adjust stops in the existing `radial-gradient` in Hero).
- **Parallax (optional):** Add `background-attachment: fixed` to the hero section’s background so the image stays fixed on scroll (subtle parallax). In Next.js, the background is applied via `style={{ backgroundImage: ... }}`; add a class in globals (e.g. `.hero-bg-fixed { background-attachment: fixed; }`) and apply to the section, or use Tailwind `bg-fixed`. Test on mobile (some browsers ignore fixed backgrounds); provide a fallback without fixed if needed.

**3.2 Typography hierarchy**

- **Tagline (overline “Prirodni med iz Srbije”):**
  - Increase letter-spacing: e.g. `tracking-[0.25em]` or `tracking-[0.3em]`.
  - Color: already amber; optionally use a gold from the palette (`text-amber-400` or `var(--gold)`).
  - Add subtle `text-shadow`: e.g. `0 1px 2px rgba(0,0,0,0.5)` or similar for separation from background (in Hero or globals).
  - Slightly larger: e.g. `text-sm sm:text-base` (currently `text-xs sm:text-sm`).
- **Main heading (“Meden Srbija”):**
  - Larger sizes: bump Tailwind scale, e.g. `text-5xl sm:text-6xl md:text-7xl lg:text-8xl` (or use arbitrary values like `text-6xl md:text-8xl`) for stronger hero impact.
  - Keep `font-bold` (or `font-semibold`).
  - Add subtle text-shadow or glow: e.g. `drop-shadow` or custom `text-shadow` in globals for `.hero-title` (e.g. `0 2px 8px rgba(0,0,0,0.4)`). Optional: very subtle gold glow via `0 0 20px rgba(212,175,55,0.15)`.
  - Gold gradient on text (optional): use `bg-clip-text text-transparent` with a gradient; can conflict with accessibility (contrast). Prefer solid foreground + shadow for WCAG.
- **Body text (tagline paragraph):**
  - Line-height: set `leading-relaxed` (1.625) or `leading-loose` (2), or arbitrary `leading-[1.7]` (brief: 1.6–1.8).
  - Font size: ensure at least 16–18px (e.g. `text-base sm:text-lg` or `text-lg`).
  - Subtle text-shadow for contrast: same approach as overline.
  - Max-width for reading length: add `max-w-[65ch]` or similar to the tagline container so line length stays ~60–70 characters.

**3.3 Call-to-action buttons**

- **Primary (“Pogledaj proizvode”):**
  - Keep orange/gold styling.
  - Increase padding: e.g. `px-10 py-4 sm:px-12 sm:py-5` (or match secondary).
  - Hover: add `hover:scale-105` (transform) and slightly stronger shadow (e.g. `hover:shadow-[0_0_24px_rgba(251,191,36,0.2)]`). Use `transition-all duration-300 ease-out` (or `transition-transform duration-300`) and keep `btn-hover-lift` if desired.
  - Ensure no layout shift: `transform-origin: center` and possibly `will-change: transform` only on hover (or avoid will-change for simplicity).
- **Secondary (“O nama”):**
  - Border: change to 2px and gold, e.g. `border-2 border-amber-400/60` (or `border-[var(--gold)]`).
  - Hover: filled background with transition, e.g. `hover:bg-amber-400/20` (or `hover:bg-amber-400/30`) and `hover:text-amber-300`; keep transition duration 0.3s.
  - Match padding to primary (same `px-* py-*` classes).
  - Spacing between buttons: already `gap-3 sm:gap-4`; keep or increase to `gap-4 sm:gap-5`.

**3.4 Spacing and layout**

- Increase vertical spacing between hero blocks: e.g. `space-y-8 sm:space-y-10` → `space-y-10 sm:space-y-12` (or add more to the CTA wrapper’s `pt-*`).
- Ensure responsive padding: hero already has `py-24 sm:py-28 lg:py-32`; keep or slightly increase if needed.

**3.5 Polish and details**

- **Fade-in / stagger:** Already implemented (`.hero-overline`, `.hero-title`, `.hero-tagline`, `.hero-cta` with delays). No change unless you want to tune delays or duration.
- **Decorative element (optional):** Add a small honeycomb or bee SVG as a decorative element (e.g. absolute positioned, low opacity `opacity-20` or `opacity-10`, behind or beside content). Place in Hero as an extra element; keep it subtle and non-interactive; ensure it doesn’t affect accessibility (e.g. `aria-hidden`).
- **Smooth scroll:** Already set on `html` in globals; no change.
- **Focus states:** Buttons and links already have `focus-visible:ring-*`; verify all interactive elements have visible focus and sufficient contrast (WCAG AA).

---

## 4. Technical requirements

- **Responsive:** All changes use Tailwind breakpoints (sm, md, lg) and existing patterns; no fixed pixel widths that break layout.
- **Accessibility:** Keep contrast ratios (foreground on dark, gold on dark); avoid gold-on-white for body text. Focus rings remain. Reduced-motion: existing hero and nav animation overrides stay; add override for any new logo hover scale if added.
- **Performance:** Use `transform` and `opacity` for animations; avoid animating `box-shadow` on every frame if possible (short hover transition is fine). Parallax with `background-attachment: fixed` is CSS-only and performant.

---

## 5. Files to touch

| File                                           | Changes                                                                                                                                                                                                                                                                          |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [app/globals.css](app/globals.css)             | Optional `--gold` (and similar) in `:root`. Nav: `.nav-link-active` styles; optional logo hover + reduced-motion override. Hero: optional `.hero-title` / `.hero-overline` text-shadow classes; `.hero-bg-fixed` if using parallax. Button: any shared CTA classes if extracted. |
| [components/Header.tsx](components/Header.tsx) | Navbar: background/blur/border classes; `md:gap-10` or `md:gap-12`; active state (hash + class); mobile min-h-[44px] and padding; optional logo hover class.                                                                                                                     |
| [components/Hero.tsx](components/Hero.tsx)     | Overlays (lighter or extra gradient); overline/tagline/heading typography (size, tracking, shadow, max-width); body line-height and size; primary/secondary button classes; spacing; optional decorative SVG; optional `hero-bg-fixed` class.                                    |

---

## 6. Suggested implementation order

1. **Globals:** Add optional CSS variables; add `.nav-link-active` and any hero/button utility classes.
2. **Header:** Background, border, nav spacing, active state (hash + effect), mobile touch targets, optional logo hover.
3. **Hero:** Background overlays and optional parallax; then typography (overline, title, body); then CTAs; then spacing and optional decoration.
4. **Pass:** Check contrast and focus states; run reduced-motion and mobile tests.

This keeps the existing structure and dark theme, aligns with the brief’s wording, and leaves optional items (parallax, gold gradient on text, honeycomb) as clearly optional so you can skip or add them without breaking the rest.
