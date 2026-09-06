# Design direction and SEO

Status: proposal. [Structural desktop/mobile wireframes and draft content](07-wireframes-and-content.md) are available for planning review. No finished visual mockups or site implementation have been created.

## Creative concept: Color, close to home

A predominantly white page with vivid nail photography, generous spacing, expressive headlines, and rounded blocks of color. Aim for a welcoming neighborhood salon with a polished editorial presentation. Use one strong booking color consistently, and let secondary colors distinguish sections and gallery accents.

| Role | Proposed color | Intended use |
| --- | --- | --- |
| Canvas | White `#FFFFFF` | Main page background |
| Text | Deep plum `#2D1933` | Body text and navigation |
| Primary action | Berry `#A91D57` | Booking buttons with verified contrasting text |
| Accent | Coral `#FF765E` | Decorative swatches and photo frames |
| Accent | Lilac `#C8B6FF` | Soft service panels |
| Accent | Citrus `#F6E65B` | Small highlights with dark text |
| Accent | Mint `#BDEAD7` | Visit/FAQ accents |

Palette is exploratory. Validate every actual text/control pairing before approval. Pair a characterful display face with a highly legible sans serif; shortlist fonts and verify licensing at the design stage. Limit families and weights to control loading cost.

Real work, real salon, and permission-cleared photography are the preferred assets. Do not present stock or generated salon imagery as the actual business. Seek landscape and portrait crops for the hero, close-up nail sets, the interior, storefront, and optional team portraits.

## Main page structure

| Section | Visual treatment | Content/action |
| --- | --- | --- |
| Header | White, compact, sticky | Name/logo; Services, Gallery, About, Visit; Book |
| Hero | Large headline beside an offset image collage and a few color shapes | Draft direction: “A little color. A little time for you.” Include plain-language salon/location description and booking CTA. |
| Services | Readable menu grouped in lightly tinted panels | Confirmed prices and durations; Book action for a service when deep linking is supported |
| Gallery | Varied image sizes with stable aspect ratios | Curated examples of real work; simple enlargement if useful |
| About | Interior photo and short personal copy | Owner-approved story and service approach |
| Reviews | A small number of readable cards or simple profile links | Proper attribution; link to original sources |
| Visit | Address/hours alongside storefront or map preview | Directions, call, parking, transit/access details when confirmed |
| FAQ | Accessible disclosures | Booking and practical questions in crawlable HTML |
| Final booking invitation | Colorful accent within white space | Book action and concise policy link |
| Footer | Quiet and legible | Verified business details, social links, privacy, booking policy |

On phones: stack copy before images, show service prices without hover, keep the first booking action visible early, and use one unobtrusive sticky booking button. Avoid autoplay video and carousels that hide important content.

## Parallax and accessibility

Propose gentle movement on up to two decorative photo layers or swatches. Keep text and forms stationary and preserve native scrolling. Content must remain visible when animation or JavaScript fails. Honor `prefers-reduced-motion`; disable parallax for reduced-motion users and simplify it on mobile. Approve a static layout before approving motion.

Target WCAG 2.2 AA: visible keyboard focus, meaningful labels, clear errors, semantic landmarks, a skip link, usable zoom, sufficient contrast, and practical touch targets around 44px. Include manual keyboard and screen-reader checks, including the external scheduler. Accessibility of a vendor embed is a provider-selection criterion.

## One-page experience and route plan

| Route | Purpose | Search treatment |
| --- | --- | --- |
| `/` | Main one-page salon experience with section anchors | Primary indexable local landing page |
| `/book` | Booking introduction and provider entry/embed with fallback | Useful public entry route; indexability decided from its unique content |
| `/policies` | Booking, late arrival, cancellation, payment policies | Crawlable, unique content; final indexability set at launch |
| `/privacy` | Actual data-handling explanation | Public and linked from booking/footer |
| Provider management URLs / future account routes | Appointment details and changes | Private; no indexing, no customer data in public HTML |
| `/admin` and admin subroutes | Custom staff calendar, appointment actions, policy/payment settings | Authenticated and authorized; private responses not publicly cached; noindex and exclude from sitemap |
| Future `/services/...` | Substantive service-specific pages | Indexable after accurate content and demand justify them |

Homepage anchors such as `/#services` are navigation aids, not separate SEO landing pages. One page is suitable for launch, but service pages give future space to explain techniques, pricing, preparation, and aftercare. Avoid thin location/service pages created just for keyword coverage.

## SEO implementation requirements

1. Use the owner-confirmed address, 349 Main St, Madison, NJ 07940, and verify the business name, phone, hours, domain, and social identities. Keep the website and business profiles consistent. Listing edits require separate approval.
2. Render important business and service content in initial HTML. Do not put the only service information inside a booking iframe, image, or Instagram widget. Google documents server rendering/pre-rendering as useful for users and crawlers in its [JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
3. Draft a descriptive title such as “Madison Hill Nails | Nail Salon in Madison, NJ.” Final description must reflect confirmed services. Use one clear main heading and logical section headings.
4. Set canonical URLs, social sharing metadata, favicon, XML sitemap, and robots directives. Redirect domain variants to one HTTPS canonical domain. Exclude private/confirmation URLs; protect previews and mark them noindex. Robots rules alone do not secure private information.
5. Add accurate `NailSalon`/local business JSON-LD with confirmed name, address, phone, URL, opening hours, images, and verified profile URLs; add coordinates only after verification. Validate applicable fields using [Google's local business documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business).
6. Display only real, properly attributed reviews. Do not add self-serving aggregate-rating markup to seek stars for the salon: [Google's review rules](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) exclude that use. FAQ content is for customers; no promised rich-result treatment.
7. Use descriptive image filenames/alt text where meaningful, modern formats, responsive sizes, fixed dimensions, and below-fold lazy loading. Prioritize the hero image rather than lazy-loading it. Limit fonts and third-party scripts.
8. After deployment approval, verify Search Console ownership, submit the sitemap, inspect rendered pages, and monitor indexing. Confirm business-profile website and appointment links with the owner before updating them.
9. Review local queries and service demand after sufficient traffic. SEO is an ongoing content and operational task, not a guaranteed ranking outcome.

Performance targets: LCP at or below 2.5 seconds, INP at or below 200ms, CLS at or below 0.1 at the 75th percentile on mobile and desktop. These are [Core Web Vitals thresholds](https://web.dev/articles/vitals). Prelaunch lab checks approximate readiness; real-user data after launch determines field performance. Measure the booking integration separately as well.

## Inspiration

[Paintbox](https://paint-box.com/) provides a reference for curated nail collections and a clear studio booking path. [Olive & June](https://oliveandjune.com/) offers a reference for nail-color merchandising and approachable product storytelling. These are conceptual references from reviewed public pages, not copied designs or a completed visual audit. The proposed white canvas, palette, and parallax are original project directions awaiting visual review.
