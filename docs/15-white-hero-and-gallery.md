# White hero and salon gallery

The owner requested a new hero with a clean white background and parallax, with the salon photographs moved into a gallery. This is the latest visual direction and supersedes the previous static photo-collage hero.

## What changed

- A white hero with the headline “A little time. All yours.”, centered service copy, a clear Book your visit action, and an Explore our work link to the gallery. The approved black, equal-width NAILS & SPA wordmark stays in place.
- Three decorative enamel shapes in lilac, cherry, and butter yellow, plus a fine outline motif, provide depth around the text. These are CSS/SVG artwork rather than photos, inventory samples, or representations of completed salon work. No new image generation, external image request, animation library, or paid service was needed.
- Parallax is limited to those decorative hero layers. Text and buttons remain stationary, and the gallery uses normal document scrolling.
- A dedicated `#gallery` presents the four existing salon photographs with descriptions and source links. The main navigation now includes Gallery. Desktop uses four staggered columns, tablet uses two, and narrow mobile uses one. Photos retain their full designs rather than using cropped banner framing.
- The color-selection section keeps its interactive CSS samples. Duplicate salon photos were removed from the hero, color section, and Main Street introduction. The Main Street section now uses a typographic address panel.
- Removed obsolete collage CSS. New hero/gallery styling lives in `app/white-hero.css`; `components/white-hero.tsx` handles motion and `components/salon-gallery.tsx` renders the server-side gallery.

## Motion and accessibility

The hero uses one passive scroll listener and requestAnimationFrame updates to CSS transforms, with bounded section-relative displacement. Decorative layers move at different rates and in opposing directions, up to 150 pixels over the full section scroll. Mobile offsets are scaled to 45%. There is no scroll hijacking, forced sequence, looping animation, or moving interactive target.

Pause motion stops the effect and can resume it. The operating system's reduced-motion setting always takes priority and is respected if changed while the page is open. In reduced-motion mode the redundant pause control is hidden; normal page content remains visible without JavaScript.

The page retains one semantic h1, keyboard-accessible navigation and booking actions, meaningful image alternatives, labeled external links, and preview noindex. NailSalon identity/address/Instagram metadata and the real salon social-preview image remain intact. No additional SEO claims, service pricing, appointments, or account configuration were introduced.

## Photo provenance

All four gallery files and their original Instagram posts remain documented in [the photography record](14-salon-photography.md). They are served locally through responsive Next/Image optimization. Gallery images use lazy loading; the image-free hero does not preload a large photograph.

## Validation

TypeScript, ESLint, and the production build passed. All ten desktop/mobile browser tests passed, including reruns of the two home-page checks after the contrast correction.

The browser suite exercises desktop and mobile layouts, image loading for every gallery photo, responsive widths down to 320px, gallery navigation, actual opposing parallax transforms, manual pause/resume, and live reduced-motion changes. Existing booking/auth fallback and public-page accessibility checks remain included. A low-contrast gallery index color found by Axe was darkened and checked again.

Screenshots remain in ignored `test-results/`. The local preview is at `http://127.0.0.1:3000` while the server is running. Live database/email setup and owner-approved production deployment remain separate launch requirements.
