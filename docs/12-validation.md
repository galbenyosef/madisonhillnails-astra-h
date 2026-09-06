# Validation and launch status

September 6, 2026. The local first implementation is ready for owner review. It is not a live booking launch.

## Local checks

- TypeScript type checking and ESLint passed.
- The Next.js production build compiled successfully. Protected account/admin routes explicitly render at request time even when a build has no service credentials.
- 36 backend tests passed against an isolated embedded PostgreSQL engine. Coverage includes overlapping bookings and blocks, buffers, idempotency, rollback of conflicting reschedules, cancellation release, stale revisions, ownership, staff authorization and forged privilege rejection at the HTTP boundary, booking caps/cooldowns, closed booking, technician eligibility, RLS, local time conversion, actual Better Auth signup/verification/login/MFA endpoints, durable auth rate limiting, missing production IP configuration, notification retries/obsolescence, email quotas, policy snapshots, and manual customer-detail corrections.
- The Netlify scheduled email function bundled successfully with the local Node-targeted bundling check. Actual Netlify deployment/runtime execution remains untested until an approved deployment exists.
- 10 Chromium browser tests passed across desktop and emulated iPhone viewports after the approved editorial redesign. They check page errors, local structured data, preview noindex, responsive width, color selection, reduced motion, navigation, protected-route fallback, policies, and missing pages. New motion checks measure actual opposing layer movement and verify pause/resume plus live reduced-motion changes.
- Axe checks on the tested public pages reported no violations under WCAG 2 A/AA and WCAG 2.1 AA tags. A detected paragraph contrast issue was corrected and the suite rerun.
- Desktop/mobile full-page screenshots were inspected. Generated screenshots and traces stay in ignored `test-results/`; they are not customer data or production assets.

## Practical limits of these checks

The database tests exercise real PostgreSQL SQL behavior in PGlite, which serializes its embedded connections. They do not replace a live Supabase test with independent concurrent connections. Auth tests call the application's real route handlers with an isolated test database adapter and intercepted email; they do not validate email delivery to an actual inbox.

Browser tests cover the public site and the honest unconfigured booking/auth state. Full browser flows for authenticated booking, staff editing, and account recovery must also be exercised against the approved hosted test configuration before launch. Mobile tests emulate Chromium on an iPhone-sized viewport; physical iOS Safari testing remains a launch check.

Automated accessibility checks are a useful subset, not a complete accessibility audit. No field Core Web Vitals data or search ranking is claimed. SEO indexing stays disabled until the real hostname, business facts, privacy/policy copy, and owner launch approval are in place.

## Still required before live appointments

1. Owner-approved free Supabase/email accounts and private configuration; no credentials in GitHub or chat.
2. Apply the migration and validate certificate-verified database connectivity. Bootstrap only the intended verified owner account and complete authenticator enrollment.
3. Enter actual services/prices/durations, staff eligibility/hours, capacity, closures/breaks, and existing manual appointments. Confirm the cancellation cutoff rather than accepting defaults without review.
4. Verify official business phone/hours/profile links; review site copy and the decorative artwork. Finalize a customer contact channel, data-retention procedure, and privacy notice.
5. Confirm the selected email sender can reach real recipients within its Free allowance, test delivery/recovery flows, and review all provider limits. Validate the Netlify client-IP header and rate limiting on the deployed test site.
6. Test online/manual simultaneous booking conflicts with separate live connections, staff MFA and session expiry, customer ownership, cancellation/rescheduling, email quota exhaustion, scheduled reminders, and outage recovery.
7. Perform a private backup/restore drill and calendar reconciliation. Confirm staff monitoring of the notification queue and a plan for provider pauses/limits.
8. Obtain owner approval before production deployment, indexing, or opening online booking. No paid upgrade, SMS, card collection, or automatic fee is authorized.

The application code and locally testable behavior are delivered now. These live setup and operational checks are explicitly pending, not represented as completed.
