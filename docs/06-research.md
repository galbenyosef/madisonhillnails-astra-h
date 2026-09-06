# Research and fact checks

Research date: September 6, 2026. Prices and product entitlements can change. Public directory entries can be stale. Sources below support specific planning inputs, not an endorsement of every claim on those pages.

## Business identity

| Fact | Evidence | Treatment |
| --- | --- | --- |
| Name | User: Madison Hill Nails | Use as project name |
| Address | User initially supplied 49, then explicitly confirmed **349 Main St, Madison, NJ 07940** | Resolved; use 349 |
| Public address | [Yahoo local listing](https://local.yahoo.com/info-10865068-madison-hill-nails-madison/) and [Apple Maps result](https://maps.apple.com/place?place-id=I4290AAA8C08FC058) show 349 Main St | Corroborates owner correction |
| Phone | Both directory results show (973) 660-0001 | Candidate only; confirm before publishing |
| Hours, staff, parking, ratings | Directory material exists but is not owner verified | Do not publish as verified facts |
| Existing website | User reports none; Apple Maps search result includes an unverified external website field | Do not treat the listed website as official |
| Instagram/Yelp/Google | User says profiles exist; direct official identities not established in this pass | Request exact profile links; do not guess handles or map IDs |

Apple Maps details were visible in search results; a subsequent direct open returned an error. Yahoo's directory page was available. Neither is equivalent to owner verification. No review excerpts or reviewer identities have been copied into the proposed website content.

## Scheduling and pricing

| Source | Planning input |
| --- | --- |
| [Square Bookings API](https://developer.squareup.com/docs/bookings-api/what-it-is) | Availability and booking lifecycle; buyer/seller permission and paid-plan distinctions |
| [Square booking operations](https://developer.squareup.com/docs/bookings-api/use-the-api) | Create/manage workflow and availability checks |
| [Square booking API fee restriction](https://developer.squareup.com/docs/bookings-api/use-the-api) | Services with a non-zero `no_show_fee` cannot be booked through this API; relevant to custom admin/mobile feasibility |
| [Square cancellation/card policies](https://squareup.com/help/us/en/article/5493-set-a-custom-cancellation-policy-with-square-appointments) | Dashboard policy support does not guarantee custom API fee automation |
| [Stripe Setup Intents](https://docs.stripe.com/payments/setup-intents) | Candidate saved-card setup without an initial charge; consent and later payment recovery |
| [Stripe authorization windows](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method) | Temporary bank authorization differs from storing a card for later cancellation fees |
| [Square hosted booking](https://api.squareup.com/help/us/en/article/5355-set-up-online-booking-with-square-appointments) | Website entry links and booking integration |
| [Square pricing](https://squareup.com/us/en/appointments/pricing) | Current published plan costs/features; confirm account-specific entitlements |
| [Acuity developer hub](https://developers.acuityscheduling.com/) | Embeds and API availability |
| [Acuity API support](https://help.acuityscheduling.com/hc/en-us/articles/16676949253389-Using-custom-CSS-and-APIs) | Create, cancel, and reschedule custom integration |
| [Acuity webhooks](https://developers.acuityscheduling.com/docs/webhooks) | Appointment-change notifications |
| [Acuity pricing](https://www.acuityscheduling.com/pricing?btn=nav&entry_point=acuity) | Calendar limits, API tier, reminder channels, monthly/annual pricing |
| [Fresha pricing](https://www.fresha.com/pricing) | Staff-based subscription, marketplace fee, messaging allowances |
| [Fresha booking links](https://www.fresha.com/help-center/academy/get-booked-online/accept-online-bookings/lessons/100349) | Website/profile booking links; custom app API not verified |

## Technical and SEO sources

| Source | Planning input |
| --- | --- |
| [Next.js metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) | Metadata and sharing assets |
| [Tailwind theme variables](https://tailwindcss.com/docs/theme) | Reusable brand tokens |
| [Expo documentation](https://docs.expo.dev/) | Future cross-platform app option |
| [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) | Proposed private admin/customer-data access controls for the expanded MVP |
| [Supabase Auth](https://supabase.com/docs/guides/auth) | Proposed managed staff identity for custom admin; application authorization remains our responsibility |
| [Supabase pricing](https://supabase.com/pricing) | Database/auth cost inputs, inactivity behavior, and backup differences |
| [PostgreSQL range types](https://www.postgresql.org/docs/current/rangetypes.html) | Proposed non-overlap constraints for exclusive resource reservations |
| [Stripe webhooks](https://docs.stripe.com/webhooks) | Signature verification, event delivery behavior, and durable reconciliation requirements |
| [Netlify pricing](https://www.netlify.com/pricing/) | Owner-selected hosting; plan costs, usage limits, and account-specific plan verification |
| [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/) | OpenNext support, rendering, caching, image handling, and implementation-time compatibility checks |
| [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Rendered content and crawlability |
| [Google local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) | Business schema planning |
| [Google review structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) | Self-serving review limitation |
| [Core Web Vitals](https://web.dev/articles/vitals) | Performance targets and field measurement |

## Creative references and research limits

[Paintbox](https://paint-box.com/) and [Olive & June](https://oliveandjune.com/) were reviewed as public content references for nail collections and brand storytelling. Do not copy images, text, or layouts. A rendered visual reference board is future design work requiring approval.

Not completed: official profile ownership verification, service/staff confirmation, domain availability, vendor account/trial tests, API entitlement checks against a real salon account, detailed local keyword/competitor audit, legal-policy drafting, or native app distribution research. These are explicitly recorded dependencies, not hidden assumptions.
