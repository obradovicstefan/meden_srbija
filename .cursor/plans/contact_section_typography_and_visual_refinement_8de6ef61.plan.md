---
name: Contact Section Typography and Visual Refinement
overview: Refine the contact section typography, spacing, form design, contact info styling, and add a contact-internal footer with brand/socials so it matches the premium dark theme and gold accents used elsewhere on the site.
todos: []
isProject: false
---

# Contact Section Typography and Visual Refinement

## Current state

- **Component:** [components/Contact.tsx](components/Contact.tsx) — single section with id `kontakt`, two-column grid (info + form), Tailwind-only styling.
- **Behavior:** Phone and email are already clickable (`tel:` / `mailto:`); form submits to `/api/contact` with `idle` / `sending` / `success` / `error` states and success/error messages.
- **Styling:** No contact-specific CSS in [app/globals.css](app/globals.css); section uses utility classes. Site uses `--gold: #d4af37` and dark theme; other sections (e.g. Awards) use gold accent lines and custom classes in `globals.css`.

## Approach

- Add all contact-section styles to **globals.css** using the class names from your spec (e.g. `contact-heading`, `contact-subtitle`, `contact-info`, `contact-item`, `contact-icon`, `contact-link`, `delivery-box`, `contact-form`, `form-group`, `form-label`, `form-input`, `form-textarea`, `form-submit`, `contact-footer`, validation/loading). Use `var(--gold)` instead of `#D4AF37` for consistency.
- Update **Contact.tsx** to use these classes and the structure you specified: semantic wrappers (e.g. `contact-section`, `contact-grid`), heading with gold accent, subtitle, contact list with icon boxes and links, delivery box, form with labels/inputs/textarea/submit, and a new **contact-internal footer** (brand title, tagline, social icons) below the grid.
- Keep existing behavior: same form submit handler, same success/error/loading handling; add optional client-side validation and apply `.error` / `.form-error-message` and `.loading` on the submit button per your Section 9.

## Implementation (by your priority phases)

### Phase 1 – Typography

- **Page heading:** In Contact.tsx, give the "Kontakt" heading a class like `contact-heading`. In globals.css add: `font-size: 56px`, `font-weight: 700`, `margin-bottom: 16px`, `position: relative`, `padding-bottom: 20px`; mobile (max-width 768px): `font-size: 40px`, `text-align: center`.
- **Subtitle:** Class `contact-subtitle` — `font-size: 18px`, `line-height: 1.7`, `color: #c0c0c0`, `margin-bottom: 48px`, `max-width: 600px`; mobile: `16px`, centered, `margin: 0 auto 40px`.
- **Form labels and input text:** Use `form-label` (gold, 14px, font-weight 600, letter-spacing) and ensure `form-input` / `form-textarea` use `font-size: 16px` and placeholder styling per Section 5.

### Phase 2 – Visual enhancement

- **Gold accent under heading:** In globals.css, `.contact-heading::after` — absolute bottom left, `width: 80px`, `height: 3px`, `background: linear-gradient(to right, var(--gold), rgba(212,175,55,0.3))`; mobile: center with `left: 50%`, `transform: translateX(-50%)`.
- **Contact icons:** Replace plain icon wrappers with `.contact-icon` (44x44px, gold-tinted background/border, rounded, flex center). Keep existing Image components inside; add `.contact-item:hover .contact-icon` (stronger gold, scale 1.05).
- **Delivery box:** Apply `delivery-box` (dark semi-transparent background, backdrop-filter, gold border, 12px radius, padding 32px 28px). `delivery-heading` — 22px, bold, gold; `delivery-text` — 16px, line-height 1.8, silver; strong in white. Mobile: reduce padding and font sizes per your Section 4.
- **Form container:** `.contact-form` — background `rgba(13,13,13,0.4)`, backdrop-filter, border `1px solid rgba(212,175,55,0.15)`, `border-radius: 16px`, `padding: 40px 36px`; mobile: `32px 24px`.

### Phase 3 – Interaction

- **Input focus:** `.form-input:focus` / `.form-textarea:focus` — no outline, darker background, `border-color` and `box-shadow` with gold tint per Section 5.
- **Contact links and icons:** Ensure phone/email rows use a wrapper with `.contact-item`; each phone number and email remain `<a href="tel:...">` / `<a href="mailto:...">` with class `contact-link` (flex, no underline, inherit color). `.contact-link:hover .contact-text` → gold; keep/refine focus ring for accessibility.
- **Submit button:** `.form-submit` — full width (or per layout), gold background, dark text, 16px, uppercase, letter-spacing, rounded, shadow; hover: lighter gold, `translateY(-2px)`, stronger shadow; active: translate back. Disable when `status === "sending"` and add `.loading` class for spinner (Phase 5).

### Phase 4 – Spacing

- **Section and grid:** `.contact-section` — `padding: 100px 40px`, `max-width: 1400px`, `margin: 0 auto`. `.contact-grid` — `grid-template-columns: 1fr 1.2fr`, `gap: 80px`, `align-items: start`. 1024px: gap 60px; 768px: padding 60px 20px, single column, gap 48px.
- **Contact info:** `.contact-info` — `display: flex`, `flex-direction: column`, `gap: 24px`, `margin-bottom: 48px`.
- **Form fields:** `.form-group` — `margin-bottom: 28px`; mobile 24px.
- **Contact footer (in-section):** Add a block at the bottom of the contact section (inside the same section, below the two-column grid) with class `contact-footer`: `margin-top: 80px`, `padding-top: 40px`, `border-top` gold-tinted; flex layout with `footer-brand-title` (20px, gold), `footer-brand-tagline` (14px, #c0c0c0), and `social-icons` (same style as your spec — 44px icon boxes, gold border, hover lift). Reuse Instagram/Facebook URLs from [components/Footer.tsx](components/Footer.tsx) and same or similar social assets.

### Phase 5 – Accessibility and validation

- **Form markup:** Keep `aria-label="Kontakt forma"` and `aria-labelledby` for section; ensure each input has a proper `<label for="...">` and ids (`contact-name`, `contact-email`, `contact-message`); add `aria-required="true"` where required.
- **Validation states:** In globals.css add `.form-input.error`, `.form-textarea.error` (red border/tint), `.form-error-message` (red, 13px, margin-top). Optionally in Contact.tsx: on submit or blur, set per-field error state and display `.form-error-message`; clear on change or successful submit.
- **Loading state:** When `status === "sending"`, add class `loading` to the submit button; in CSS `.form-submit.loading`: opacity, cursor not-allowed, and `::after` spinner (16px border, transparent top, animation spin). Keep button text or replace with "Šaljem…" as you prefer.
- **Success/error:** Keep existing role="status" / role="alert" messages; style to match (e.g. green/red borders and background) so they remain visible with the new form styling.

## File changes summary

| File                                             | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [app/globals.css](app/globals.css)               | Add contact-section block: heading + ::after, subtitle, contact-info/contact-item/contact-icon/contact-link/contact-text/contact-text-separator, delivery-box/heading/text, contact-form/form-group/form-label/form-input/form-textarea/form-submit, contact-section/contact-grid, contact-footer/footer-brand-title/footer-brand-tagline/social-icons/social-icon, validation (.error, .form-error-message) and .form-submit.loading with @keyframes spin. Use var(--gold) and existing dark palette.                                                                                               |
| [components/Contact.tsx](components/Contact.tsx) | Replace Tailwind section/grid/heading/subtitle with semantic divs and classes (contact-section, contact-grid, contact-heading, contact-subtitle). Left column: contact-info, contact-item + contact-icon + contact-link(s) for phone (two links + separator) and email; delivery-box with delivery-heading and delivery-text. Right column: form with contact-form, form-groups, form-label, form-input, form-textarea, form-submit; add loading class when sending; optionally add error classes and form-error-message. Add contact-footer block with brand title, tagline, and social icon links. |

## Notes

- **Heading alignment:** Your spec uses a left-aligned accent line; mobile centers heading and accent. The current heading is `text-center`; the new CSS will override with left alignment on desktop and center on mobile.
- **Icons:** Contact section currently uses `/images/socials/phone.webp` and `email.webp` inside small wrappers. These stay; the new `.contact-icon` wrapper (44px, gold styling) will enclose them. Social icons in the contact footer can use the same Image components as Footer (Facebook, Instagram).
- **Footer vs contact-footer:** The site-wide [components/Footer.tsx](components/Footer.tsx) is unchanged. The new "footer" is only the block inside the Contact section (brand + tagline + socials) to give the section a premium closure and address "Footer brand text is small and disconnected" within the contact area.
