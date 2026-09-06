# Editorial redesign — September 6, 2026

The owner rejected the first visual direction, asked whether it included parallax, and approved a fashion editorial redesign before implementation. The original effect moved only the hero image by up to 35 pixels; that did not match the requested layered experience.

## Design and content

- White page with cherry red typography, mint photography, a lilac color section, and acid-yellow accents. Oversized sans-serif headlines alternate with italic serif lettering; the new opening reads “Good nails. Great energy.”
- Large manicure campaign image with an overlapping rotated detail print and circular booking link. The service section uses open typographic rows, followed by a photographic color collage, interactive polish samples, Main Street introduction, address/directions, and FAQ.
- Header and footer match the new visual identity; booking, authentication, staff permissions, scheduling logic, service data, and fee/SMS exclusions retain the approved scope.
- The real service catalog renders when configured. Without it, the page shows the owner-confirmed categories of nail care, pedicures, and spa treatments, with a notice that the detailed online menu is still being prepared. No prices, durations, specific spa treatment names, hours, ratings, or customer reviews are invented.
- NailSalon structured data, canonical configuration, private-page noindex, preview noindex, semantic headings, image alternatives, keyboard access, and navigation remain in place. No search ranking or design award is claimed.

## Scrolling behavior

`components/editorial-motion.tsx` drives decorative layers in three scenes: hero collage, color story, and local introduction. Images and foreground lettering/prints move at different speeds and in opposite directions based on each section's viewport position. Maximum configured offsets are 130 pixels in either direction; actual displacement depends on viewport progress. Mobile offsets are halved.

Native scrolling is preserved: no scroll hijacking, forced horizontal scrolling, pinned reading sequence, or additional animation library. A single passive scroll listener batches updates into `requestAnimationFrame`, writing transforms directly without React renders on scroll. Image frames reserve space and crop overscan. Content remains readable without JavaScript.

The visible Pause motion control stops all parallax and can resume it. The operating system's reduced-motion preference always takes priority, including when changed while the page is open; the redundant motion control is hidden in that mode. Hover transitions also respect reduced motion. Pause state is page-local; no analytics or new storage is introduced.

## Original artwork and exact prompts

Both images were generated with the built-in image-generation tool, inspected, and copied into the repository. No API key, paid external asset subscription, or third-party image hotlink was added. They are creative nail inspiration, not evidence of the salon's work. Replace with approved salon photography when supplied.

### `public/images/editorial-cherry.png`

Landscape 1536 × 1024. Exact generation prompt:

> Use case: ads-marketing. Create a premium fashion editorial macro photograph for a contemporary nail salon website, landscape 1536x1024. One anatomically correct adult woman's elegant hand with glossy deep cherry red almond nails, posed in a relaxed sculptural curve across a pale mint green sculpted satin fabric surface. Warm natural medium skin, realistic skin texture, precisely manicured nails, hard directional studio sunlight casting a sophisticated long shadow, high-end beauty campaign shot on medium format, tactile and analog rather than CGI, slightly warm film grain. The hand enters from the right and curves toward the lower center, generous pale mint negative space toward the left for a website layout. All visible fingers anatomically correct, no duplicated fingers, no jewelry, no bottles, no flowers, no text, no logos, no watermarks. Beautiful dramatic editorial art direction, red against mint, high detail, restrained refined composition. Image only, no website mockup.

### `public/images/editorial-butter.png`

Portrait 1024 × 1536. Exact generation prompt:

> Use case: ads-marketing. A premium nail beauty editorial photograph, portrait 1024x1536, extreme close-up crop of an anatomically correct adult woman's elegant hand gently curled around a glossy small bright red sculptural sphere. Four visible neatly separated fingers with beautifully manicured short almond nails painted soft buttery pastel yellow, skin is warm medium brown with natural texture, no extra fingers or distorted anatomy. Vivid pale lilac seamless studio background, crisp direct flash with soft dimensional shadows, art-directed luxury indie beauty magazine photography, bold tactile color and analog film realism, very clean composition, hand fills most of the frame. The nails are the focal point. No jewelry, no words, no logos, no branding, no watermarks, no bottle. Output only the photograph, not a website or page mockup.

Next/Image serves responsive optimized derivatives. The hero is preloaded; lower images use lazy loading. Source files remain local to the project, and the old still life is preserved without being referenced by the current page. The dynamic color samples are code-native CSS artwork, independent of the generated photography.

## Review and validation

Desktop and emulated mobile browser checks cover the homepage, image composition, horizontal overflow, color selection, navigation, protected-route fallback, metadata, structured data, and automated accessibility. A dedicated browser test measures actual transform changes in opposite directions after scrolling and verifies both manual pause/resume and live reduced-motion changes.

Screenshots are generated in ignored `test-results/design-desktop.png`, `design-mobile.png`, `home-desktop.png`, and `home-mobile.png`. These show the local preview; motion is best reviewed in the actual browser at `http://127.0.0.1:3000` while the development server is running.

Live integration checks and production launch approval from [the validation record](12-validation.md) still apply. This visual revision does not enable booking, deploy to Netlify, create accounts with service providers, or introduce payments or SMS.
