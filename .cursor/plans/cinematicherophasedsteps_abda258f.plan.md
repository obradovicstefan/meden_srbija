---
name: CinematicHeroPhasedSteps
overview: Detailed phased breakdown of the cinematic video hero redesign so it can be executed step by step.
todos:
  - id: phase1-fonts
    content: Implement Phase 1 font configuration steps in app/layout.tsx.
    status: pending
  - id: phase2-header-nav
    content: Implement Phase 2 header removal so hero owns top nav.
    status: pending
  - id: phase3-hero-component
    content: Implement Phase 3 hero component replacement with video background and new structure.
    status: pending
  - id: phase4-hero-styles
    content: Implement Phase 4 hero CSS in a paired stylesheet and import it.
    status: pending
  - id: phase5-video-dir
    content: Implement Phase 5 public/videos directory creation (no media committed).
    status: pending
  - id: phase6-verification
    content: "Run Phase 6 verification: build/dev, UI/animations, nav/scroll, and button styling checks."
    status: pending
isProject: false
---

### Phase 0 — Recon (already done)

- **Step 0.1**: Identify current hero component (`components/Hero.tsx`) and confirm it’s imported in `app/page.tsx`.
- **Step 0.2**: Inspect `components/Header.tsx` to see how the logo and nav are currently implemented.
- **Step 0.3**: Inspect `app/layout.tsx` to see how fonts and global layout (Header/Footer) are wired.
- **Step 0.4**: Inspect `app/globals.css` for existing hero/nav/global animation classes.
- **Step 0.5**: Inspect `public/` structure for hero images or existing videos.
- **Step 0.6**: Inspect `next.config.ts` for any media-related configuration.

### Phase 1 — Fonts (layout only)

- **Step 1.1**: In `[app/layout.tsx](app/layout.tsx)`, import `Montserrat` from `next/font/google` alongside `Inter` and `Cormorant_Garamond`.
- **Step 1.2**: Configure `Cormorant_Garamond` with:
  - `weight: ["300","400","600"]`
  - `style: ["normal","italic"]`
  - `variable: "--font-cormorant"`.
- **Step 1.3**: Configure `Montserrat` with:
  - `weight: ["300","400","500"]`
  - `subsets: ["latin","latin-ext"]`
  - `variable: "--font-montserrat"`.
- **Step 1.4**: Add `montserrat.variable` into the `<body>` `className` so the CSS variable is available.
- **Step 1.5**: Ensure `globals.css` continues to map base font variables; hero CSS will directly use `--font-montserrat` and `--font-cormorant`.

### Phase 2 — Global header vs hero nav

- **Step 2.1**: Confirm that the hero will own the top nav (your chosen option).
- **Step 2.2**: In `app/layout.tsx`, remove the `Header` import and the `<Header />` JSX from `<body>`.
- **Step 2.3**: Keep `<Footer />` and children layout unchanged so only the header disappears.

### Phase 3 — Hero component replacement

- **Step 3.1**: Open `[components/Hero.tsx](components/Hero.tsx)` and remove the existing image-based hero JSX entirely.
- **Step 3.2**: At the top of `Hero.tsx`, keep `"use client";` and import:
  - `useEffect`, `useRef` from `"react"`.
  - `Image` from `"next/image"`.
  - `Link` from `"next/link"`.
- **Step 3.3**: Keep or re-add helper functions:
  - `scrollToProducts()` that scrolls to element with `id="proizvodi"`.
  - `scrollToAbout()` that scrolls to element with `id="o-nama"`.
- **Step 3.4**: Inside `Hero` component, create `const videoRef = useRef<HTMLVideoElement | null>(null);` and use `useEffect` to call `videoRef.current?.play().catch(() => {});`.
- **Step 3.5**: Return the new section structure: `<section id="pocetna" className="hero"> ... </section>`.
- **Step 3.6**: Inside the section, add the video part plus comment:
  - `{/* Place hero.mp4 (10–15s, 1920×1080, muted) in /public/videos/ */}`.
  - `<video ref={videoRef} className="heroBg" autoPlay muted loop playsInline preload="auto">` with `<source>` tags for `/videos/hero.mp4` and `/videos/hero.webm`.
- **Step 3.7**: Add overlay divs: `<div className="overlay" />` and `<div className="vignette" />`.
- **Step 3.8**: Add the nav bar in the hero:
  - `<nav className="nav">` with:
    - Logo on the left using existing asset (`/images/logo/logo.svg`) inside a `Link`.
    - `<ul className="navLinks">` mapping items:
      - `Početna → "#pocetna"`, `O nama → "#o-nama"`, `Proizvodi → "#proizvodi"`, `Nagrade → "#nagrade"`, `Kontakt → "#kontakt"`.
      - First item gets `className="active"`.
- **Step 3.9**: Add hero content block:
  - Wrapper `<div className="content">`.
  - `<div className="goldLine" />`.
  - Eyebrow `<p className="eyebrow">Prirodni med iz Srbije</p>`.
  - Heading `<h1 className="heading">Meden<br /><em>Srbija</em></h1>`.
  - Subtitle with two-line text in `<p className="subtitle">`.
  - CTA group with buttons wired to `scrollToProducts` and `scrollToAbout`.
- **Step 3.10**: Add bottom bar:
  - `<div className="bottom">` containing scroll hint and meta text block.
- **Step 3.11**: Add corner accent: `<div className="cornerAccent" />` at the end of the section.

### Phase 4 — Hero styles (paired CSS)

- **Step 4.1**: Create `[components/Hero.css](components/Hero.css)` (or open if it exists).
- **Step 4.2**: Add `.hero { font-family: var(--font-montserrat), 'Montserrat', sans-serif; }` and the full section layout rules.
- **Step 4.3**: Add `.heroBg`, `.overlay`, and `.vignette` with the exact gradients and positioning from your spec.
- **Step 4.4**: Add `.nav`, `.navLinks`, `.navLinks a`, and `.navLinks a.active` styles for layout, typography, and gold hover/active color.
- **Step 4.5**: Add `.content`, `.goldLine`, `.eyebrow`, `.heading`, `.heading em`, and `.subtitle` rules, including animations (`fadeUp`) and font families (`--font-cormorant` / `--font-montserrat`).
- **Step 4.6**: Add CTA styles: `.ctaGroup`, `.btnPrimary`, `.btnPrimary:hover`, `.btnSecondary`, `.btnSecondary:hover`, ensuring buttons have zero border-radius.
- **Step 4.7**: Add bottom bar styles: `.bottom`, `.scrollHint`, `.scrollHint span`, `.scrollLine`, `.meta`, `.meta p`, `.meta strong`.
- **Step 4.8**: Add `.cornerAccent` rules for the bottom-right frame.
- **Step 4.9**: Define `@keyframes fadeDown`, `@keyframes fadeUp`, and `@keyframes scrollPulse` exactly as in your original spec.
- **Step 4.10**: Import the stylesheet in `Hero.tsx` with `import "./Hero.css";`.

### Phase 5 — Video directory

- **Step 5.1**: Ensure `public/` exists at the project root.
- **Step 5.2**: Create `public/videos/` (empty, no media files committed).
- **Step 5.3**: Later, add `hero.mp4` (10–15s, 1920×1080, muted) and `hero.webm` into `public/videos/` outside of code.

### Phase 6 — Verification

- **Step 6.1**: Run `next dev` or `next build` and verify there are no TypeScript or CSS errors.
- **Step 6.2**: In the browser, confirm:
  - Only the hero nav (with logo) appears at the top.
  - The video element exists and uses the dark background when media is missing.
  - Nav links are on the right, with correct gold hover/active styling.
- **Step 6.3**: Confirm hero entrance animations play in sequence (nav, line, eyebrow, heading, subtitle, CTAs).
- **Step 6.4**: Confirm both CTA buttons have square corners and proper hover transitions.
- **Step 6.5**: Confirm scroll behavior: CTAs and nav links navigate to `#pocetna`, `#o-nama`, `#proizvodi`, `#nagrade`, and `#kontakt` correctly.
