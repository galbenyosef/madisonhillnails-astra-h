# Editorial redesign — September 6, 2026

The owner rejected the first visual direction, asked whether it included parallax, and approved a fashion editorial redesign before implementation. The original effect moved only the hero image by up to 35 pixels; that did not match the requested layered experience.

## Design and content

- White page with cherry red typography, mint photography, a lilac color section, and acid-yellow accents. Oversized sans-serif headlines alternate with italic serif lettering; the new opening reads “Good nails. Great energy.”
- Large manicure campaign image with an overlapping rotated detail print and circular booking link. The service section uses open typographic rows, followed by a photographic color collage, interactive polish samples, Main Street introduction, address/directions, and FAQ.
- Header and footer match the new visual identity; booking, authentication, staff permissions, scheduling logic, service data, and fee/SMS exclusions retain the approved scope.
- The real service catalog renders when configured. Without it, the page shows the owner-confirmed categories of nail care, pedicures, and spa treatments, with a notice that the detailed online menu is still being prepared. No prices, durations, specific spa treatment names, hours, ratings, or customer reviews are invented.
- NailSalon structured data, canonical configuration, private-page noindex, preview noindex, semantic headings, image alternatives, keyboard access, and navigation remain in place. No search ranking or design award is claimed.

## Current wordmark and scrolling behavior

The owner subsequently rejected the parallax design and requested a black “madison hill” wordmark with “NAILS & SPA” spanning the same width below. The current page removes the parallax controller, scroll listeners, depth transforms, and pause control. Images and lettering remain stationary while the page scrolls normally. Interactive shade selection and navigation remain available; reduced-motion preferences still disable smooth scrolling and hover transitions.

`components/brand-mark.tsx` provides one reusable, code-native SVG wordmark for the header and footer. Both text lines use a 220-unit text length so their widths match at desktop and mobile sizes. The main name and subtitle are black. A white backing keeps the footer version legible against its red background. Links retain an accessible “Madison Hill Nails & Spa home” label. This is a presentation change; no legal business-name change is assumed.

The earlier three-scene parallax implementation and its motion tests are preserved in Git history, but are no longer part of the current page.

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

Desktop and emulated mobile browser checks cover the homepage, image composition, horizontal overflow, color selection, navigation, protected-route fallback, metadata, structured data, and automated accessibility. The obsolete parallax test was removed with the controller; the remaining browser suite checks the current static layout and navigation under reduced motion.

Screenshots are generated in ignored `test-results/design-desktop.png`, `design-mobile.png`, `home-desktop.png`, and `home-mobile.png`. Additional `logo-desktop.png` and `logo-mobile.png` captures show the exact wordmark. Review the local website at `http://127.0.0.1:3000` while the development server is running.

Live integration checks and production launch approval from [the validation record](12-validation.md) still apply. This visual revision does not enable booking, deploy to Netlify, create accounts with service providers, or introduce payments or SMS.
