# Current approved build scope

Updated September 6, 2026. This document supersedes conflicting proposals in documents 01–09. It records requirements and approvals, not completed implementation.

## Accepted decisions

- The owner authorized MVP implementation after the planning phase. Continue documenting work and pushing reviewed changes to `zdmediacom/madisonhillnails-astra-h` with the active secret checks. Production deployment and paid services still require approval.
- Build the colorful, white-background website with SEO throughout, online booking, and a custom admin dashboard. Admin-created appointments and time blocks must use the same availability authority as online bookings. Customers and authorized staff can modify/cancel appointments within their permissions.
- Keep application and booking logic in our own codebase. Use Better Auth as the shared authentication library for customers and staff, with private server-enforced staff roles. Supabase provides hosted PostgreSQL; Supabase Auth is no longer the selected authentication approach.
- Use **Supabase Free only**. The owner's acceptance was conditional: “ok, as long as its free.” The owner then clarified: “All services $0; defer SMS verification.” This applies to the entire service stack. Do not upgrade plans, enable paid add-ons, provision billable resources, or permit chargeable overages without explicit approval.
- Remove card collection from the first release entirely. Do not implement Stripe, saved cards, payment holds, or automatic cancellation fees in this release. Cancellation/rescheduling rules remain relevant; the exact customer cutoff is still pending.
- Require customer login for online booking and appointment management. Staff accounts use the same login system with restricted permissions and authenticator-app two-factor authentication.
- Phone verification before the first online booking was initially accepted, then explicitly **deferred** to keep all services at $0. SMS reminders are also outside the $0 launch scope. Do not make SMS a dependency of launch or enable paid texting.
- Require verified email for online booking. Email delivery must use an approved free allowance or an existing no-additional-cost mail service; the sender/domain and provider still need configuration and validation. Collect a contact phone number without labeling it verified. Staff can create manual appointments without requiring a customer account.
- Email verification demonstrates access to an inbox, not identity or guaranteed attendance. Combine it with request/attempt limits, booking limits, and staff tools to restrict abusive accounts. Never log verification codes or commit customer data.

## Cost and operational constraints

Supabase currently lists Free at $0/month, including a 500 MB PostgreSQL database and 5 GB egress. Free projects pause after one week of inactivity, and automatic backups are not included. These restrictions need to be reflected in launch readiness and recovery procedures; small expected traffic does not guarantee uninterrupted booking availability. [Supabase pricing](https://supabase.com/pricing), checked September 6, 2026.

Before launch, document private database export/restore procedures and test recovery using non-customer fixtures. Real backups must never go into GitHub. Do not represent the Free plan as having the paid plan's backup coverage or promise it remains free under future provider changes.

Production SMS is a separate cost. As one pricing reference, Twilio Verify lists $0.05 per successful verification plus $0.0083 per US SMS. This is a comparison input, not a selected provider, a spending authorization, or a quote for our final implementation. Trial credits do not establish an ongoing free production service. [Twilio Verify pricing](https://www.twilio.com/en-us/verify/pricing), checked September 6, 2026.

The owner explicitly chose all services at $0 and deferred SMS. Use email verification within a suitable free allowance; no mail vendor has been selected or activated. Netlify, email delivery, domain costs, and future mobile distribution must be reviewed separately rather than represented as covered by Supabase Free. Use a free hosting subdomain until an existing approved domain is available; do not purchase a domain. Trials that later require payment are not an ongoing free solution.

Document each service's free quota and what happens when it is exhausted before launch. The application must report unavailable delivery/booking honestly and avoid creating unverified online bookings if email cannot be sent. Do not assume “low traffic” prevents limits from being reached or promise providers will never change their free plans.

## Implementation status and launch dependencies

The first implementation now includes the website, Better Auth integration, customer/admin booking flows, PostgreSQL migration, and email jobs. Local backend and browser checks are recorded in [validation results](12-validation.md); configuration and operating instructions are in [the build guide](11-build-and-operations.md). The earlier Supabase Auth integration has been removed. No live database, email/SMS delivery, or production deployment has been configured.

Remaining dependencies include authorized free service account setup, database/email configuration, actual service prices and durations, staff capacity and hours, cancellation rules, verified business contact/profile links, and owner-approved photography/content. Public content must not invent operating facts or customer reviews. Online booking must remain unavailable until the real schedule and required email verification delivery are configured.

Record later implementation checks and configuration status as they occur; do not infer them from a feature being accepted. Environment files, keys, credentials, authentication state, and customer data remain excluded from GitHub under [SECURITY.md](../SECURITY.md).
