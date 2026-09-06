# Build and operations

September 6, 2026. Implementation follows [the approved scope](10-approved-build-scope.md). No live service has been provisioned, no paid plan has been activated, and no production deployment has been performed.

## Implemented application

| Area | Behavior |
| --- | --- |
| Public website | Colorful one-page design, mobile navigation and booking button, stationary editorial imagery and a black NAILS & SPA wordmark, interactive color inspiration, address/directions, FAQ, policies, and privacy notice. |
| SEO | Server-rendered public copy, page metadata, canonical links, social preview image, favicon, sitemap, and NailSalon structured data containing the confirmed address. Previews default to noindex; private routes always remain noindex. |
| Authentication | Better Auth email/password signup and login, email verification, password reset, secure sessions, authenticator enrollment and recovery codes. |
| Customer appointments | Verified-account booking, qualified technician/time selection, upcoming/history view, rescheduling, cancellation, and account booking restrictions. |
| Staff dashboard | Daily appointment list, manual appointment entry, modifications, cancellation, completed/no-show status, time blocks, service editing, technician eligibility and weekly hours, booking rules, account restrictions, audit events, and email queue status. |
| Calendar authority | PostgreSQL transactions and one shared reservation table for manual/online appointments and blocks. A range exclusion constraint prevents overlaps including cleanup buffers. |
| Email | Verification and reset emails through SMTP; durable appointment confirmation/change/cancellation jobs and 24-hour reminder jobs, processed by a Netlify scheduled function when explicitly enabled. |

The production catalog starts empty and booking starts closed. Placeholder service cards are editorial copy, not a price menu. No ratings, salon-work photos, staff identities, phone number, opening hours, or exact service offerings were invented. The address remains **349 Main St, Madison, NJ 07940**.

Manual appointments do not create or automatically link customer accounts by matching email. They block availability immediately and remain staff-managed. Staff may enter a notification email with the customer's permission. Online appointments belong only to their authenticated account.

## Run locally

Use Node 24 (see `.nvmrc`). On this workstation Node is available through `~/.local/bin`; other machines can use their normal Node installation.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. With no configuration, the public website works and booking/login explain that online appointments are getting ready. There is no demo admin login, authentication bypass, fabricated appointment success, or local-storage calendar.

Verification commands:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run check:function
npm run build
```

The browser suite expects an unconfigured local application. It exercises the public UI and protected-route fallback. Backend tests use an isolated in-memory PostgreSQL engine and actual Better Auth endpoints with a test adapter and intercepted mail, without contacting customers or using real credentials.

## Configuration names only

Keep values in an ignored local environment file or approved hosting secret storage. Do not send keys in chat, commit example environment files, save customer data in test fixtures, or put database credentials in `NEXT_PUBLIC_*`. Follow [SECURITY.md](../SECURITY.md).

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Server-only Supabase PostgreSQL connection; use the transaction pooler for Netlify functions. Remote connections verify TLS certificates. |
| `DATABASE_CA_CERT` | Optional trusted database CA certificate, if required by the selected Supabase connection. Never disable certificate verification to fix a connection error. |
| `MIGRATION_DATABASE_URL` | Trusted direct/session-pooler PostgreSQL connection used only by the migration/owner CLI. Use certificate-verified TLS. Do not expose this to the browser or public APIs. |
| `BETTER_AUTH_SECRET` | Random, high-entropy secret of at least 32 characters. Generate privately; preserve it across deployments. |
| `BETTER_AUTH_URL` | Exact application origin; localhost in development, the approved HTTPS hostname after deployment. |
| `AUTH_IP_SOURCE` | Set to `netlify` in Netlify's runtime environment settings after verifying its trusted client-IP header reaches the application. Production auth fails closed without this configuration. Leave unset for local development. |
| `NEXT_PUBLIC_SITE_URL` | Public canonical website origin, without a trailing slash. This is not a credential. |
| `SITE_INDEXABLE` | Keep unset/false for previews. Set to true only on the owner-approved production site and rebuild. |
| `SMTP_HOST`, `SMTP_PORT` | Approved free SMTP relay. STARTTLS is required; port 465 uses implicit TLS. |
| `SMTP_USER`, `SMTP_PASSWORD` | Private SMTP credentials. |
| `MAIL_FROM` | Provider-authorized sender address. |
| `MAIL_DAILY_LIMIT`, `MAIL_MONTHLY_LIMIT` | Application sending caps, no higher than the chosen provider's remaining free allowance. Defaults are 80/day and 2,400/calendar month; lower values are supported. |
| `EMAIL_JOBS_ENABLED` | Keep false/unset until email delivery and the scheduled worker are approved and validated; true enables appointment email processing. |

The app's counters do not see mail sent from other applications sharing a provider account. Use a dedicated allowance/account or lower the caps accordingly. Provider-side Free limits are the final protection against charges. Do not enable auto-recharge, paid overages, or a trial that requires payment later.

Auth request limits use Netlify's overwritten `x-nf-client-connection-ip` header when `AUTH_IP_SOURCE` is set to `netlify`. Missing or invalid trusted IPs fail closed. Local development uses a shared loopback rate-limit key. Another production host requires a reviewed trusted proxy strategy. Set runtime variables through Netlify's UI, CLI, or API and redeploy; variables declared in `netlify.toml` are not available to functions at runtime, and the build-time `NETLIFY` marker is not used for this decision. See [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/).

## Free service setup, after account approval

1. Create/select a **Supabase Free** project. Use a dedicated database/project. No Supabase Auth, client Data API, paid branching, or Stripe setup is needed. PostgreSQL access stays on the server. See [Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres).
2. Configure the private migration connection and run `npm run db:migrate`. The transactional script records migration 001 and does not seed a live menu or accounts. The migration requires a role permitted to create `btree_gist`. All application/auth tables enable RLS and deny browser-facing anonymous/authenticated roles; application access uses the trusted server connection.
3. Configure a free SMTP sender and privately configure the application origin/secret. An existing approved mail service is acceptable. Resend Free is one compatible candidate: its documented allowance is 100 emails/day and 3,000/month, and it supports SMTP. A verified sender domain is needed for general delivery; owning a domain is a separate prerequisite, not something the Netlify free subdomain automatically provides. [Resend limits](https://resend.com/docs/knowledge-base/account-quotas-and-limits), [SMTP documentation](https://resend.com/docs/send-with-smtp).
4. Create an account through `/login`, verify the inbox, and sign in. Grant the intended owner using `npm run db:owner -- <verified-account-email>` from a trusted local terminal. This CLI cannot be invoked through the website. Do not place database credentials in the command arguments. Authenticator enrollment and a fresh verification are required before `/admin` opens.
5. In the dashboard, enter the actual service menu, prices/durations/buffers, technicians, qualified services, hours, and breaks. Import existing manual appointments before opening online availability. Confirm each technician represents independent capacity; shared chairs or rooms with lower capacity require additional modeling before launch.
6. Confirm notice/horizon/cancellation rules, customer-facing policy, privacy contact and retention period, sender consent, official business hours/phone/profile links, and approved visual assets. Staff must review the initial rule defaults, which are not claimed to be salon policy.
7. Validate the live integration using owner-approved test accounts and an isolated test schedule: email arrival, verification, reset, staff MFA, online/manual conflicts, changes/cancellations, and notification failures. Do not use customer bookings for tests.
8. Review the website with the owner before production deployment. Netlify settings are provided in `netlify.toml`; keep production credentials out of public deploy previews. A preview must never point at the live salon calendar.
9. Only after the owner approves opening booking, enable the reviewed schedule and email worker. The scheduled function runs every five minutes on supported Netlify deployments. Scheduling locally does not run automatically. [Netlify scheduled functions](https://docs.netlify.com/build/functions/scheduled-functions/).

## Scheduling and security details

- Every booking mutation uses a transaction and a common advisory lock for this small salon. A database exclusion constraint separately protects against overlapping reservations. Failed reschedules roll back without releasing the old appointment. Time intervals include cleanup buffers and use half-open boundaries.
- Times are stored with time zones and displayed in `America/New_York`. Weekly schedules are interpreted in salon local time. Slots use 15-minute increments and enforce duration, eligibility, working hours, lead time, booking horizon, blocks, and active services/staff.
- New customer bookings carry an idempotency key. Per-account booking caps, creation cooldown, and persistent API request limits reduce calendar abuse. The server ignores client claims about ownership, staff privileges, availability, duration, or price.
- Appointments snapshot the cancellation cutoff and policy at creation. Later rule changes affect new appointments. A reschedule retains the existing cutoff/policy snapshot; the booking screen displays it. Price/duration follow the selected service when rescheduling.
- Admin changes and customer cancellations use revision checks. Completed/no-show marks require the appointment to have started. Staff can override the online cancellation cutoff. No payment or fee is assessed by this application.
- Staff access requires both a private staff role and a verification marker tied to the current authenticated session. The marker expires after 12 hours. Staff cannot turn off MFA through the auth endpoint. Password-only sign-in of an enrolled account does not produce an authenticated session.
- Signup uses a honeypot, a small disposable-domain denylist, verified email, and Better Auth's persistent rate limiting. Email verification is not identity verification and does not guarantee attendance. Customer restrictions block new bookings/rescheduling while permitting existing bookings to be canceled within their policy.
- Remote database TLS certificates are verified; server secrets are never shipped to the browser. Private responses are not cached and carry noindex headers. The public site has no advertising trackers or embedded social feeds.

## Email delivery and failure handling

Appointment jobs are written in the same transaction as calendar changes. Rescheduling/cancellation obsoletes older jobs. The worker checks the current revision/status before sending and follows the same lock order as booking writes. It processes at most five due jobs per invocation, retries with increasing delays, and stops after five failed attempts. Staff can see status/attempts in Activity.

SMTP acceptance is not proof of inbox delivery. A worker crash after SMTP acceptance but before the database commit can result in a duplicate on retry; this implementation provides at-least-once delivery rather than promising exactly once. A hard crash can also roll back a worker's app-side sending counter, so provider-side Free limits must remain enforced. Bounce/webhook processing and provider idempotency are future work.

When the email allowance is exhausted, requests fail without claiming a message was sent. Existing verified users can still use accounts; appointment notifications may be delayed/failed. Staff should review the queue and calendar rather than assume a message arrived. Do not reset failed jobs blindly; check whether delivery occurred first.

## Budget and recovery

As checked September 6, 2026:

- Netlify Free lists 300 credits/month, shared by deployment/runtime/bandwidth/request usage. Recheck the owner's account plan and limit behavior before publishing. Use Free with no paid add-ons; reduce optional job frequency if usage requires it. [Netlify pricing](https://www.netlify.com/pricing/).
- Supabase Free lists a 500 MB database, 5 GB egress, inactivity pausing after one week, and no automatic backups. No background keepalive is introduced to evade the Free policy. [Supabase pricing](https://supabase.com/pricing).
- Better Auth is an application dependency without a hosted-auth subscription. SMS, card collection, paid monitoring, paid domains, and app-store distribution are excluded from this release's $0 service scope.

Before public booking, the owner must choose a private backup location and an acceptable recovery interval. Use PostgreSQL `pg_dump` with a protected service/password configuration, a custom-format export, and a destination outside the repository. Never put a connection string containing credentials on the command line. Protect backups as customer data; `.gitignore` additionally excludes `backups/`, `*.dump`, and `*.backup` as defense in depth.

Test restoring an export with `pg_restore` into a separate non-production database and compare appointment/reservation counts and conflict behavior. A real backup/restore has not been performed because no hosted database exists yet. After an outage or restore, keep booking closed, reconcile recent staff/online appointments, review queued notifications for duplicates, and reopen only after the calendar is confirmed correct.

## Visual asset and future work

The current homepage uses four real nail photographs from the owner-supplied Instagram account, stored as `public/images/salon-*.jpg`. See [photo provenance](14-salon-photography.md) for the exact files and original post links. The images are served locally through Next/Image, with no embedded Instagram feed, tracking script, API credentials, or runtime reliance on expiring Instagram CDN URLs. The earlier generated artwork remains unused for design history. Interactive polish samples are CSS artwork and remain labeled as inspiration. Icons come from Lucide; system fonts avoid third-party font requests. The current wordmark and static layout are documented in [the design record](13-editorial-redesign.md).

Future work: owner-approved portfolio and review/profile links, optional SMS verification/reminders with a separately approved budget, native mobile app using shared booking rules/APIs, passkeys/social login, customer linkage for manual appointments with verified consent, shared-station capacity, notification delivery webhooks, and any separately approved payment design. No saved-card or fee scaffolding is present in this release.
