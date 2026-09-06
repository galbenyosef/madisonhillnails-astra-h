# Delivery and roadmap

Status: sequencing proposal, not authorization to build or a delivery-date commitment.

## Phases and approval gates

| Phase | Deliverable | Completion / next gate |
| --- | --- | --- |
| 0 — Planning, current | Scope, design/SEO direction, technology comparison, source log, open questions, GitHub documentation | Owner resolves essential facts and approves scope, provider evaluation, budget, and next design work |
| 1 — Design | Content inventory, desktop/mobile wireframes, visual direction, booking screens/states, motion sample | Owner approves concrete designs and copy direction before implementation |
| 2 — Scheduling feasibility | Approved trial/sandbox tested against real staff/services and policies | Owner approves provider and any subscription; operational requirements demonstrated |
| 3 — Website implementation | Responsive homepage, policy routes, booking entry, approved content, SEO, accessibility | Reviewable preview and relevant checks pass; no automatic production launch |
| 4 — Booking integration and staff readiness | Calendar configuration, notification templates, management journeys, operating guide | Owner/staff complete sample booking, phone entry, reschedule, cancellation, time-off exercises |
| 5 — Launch | Owner-approved domain, production deployment, indexing setup, verified live journey | Explicit launch approval; rollback and support responsibilities documented |
| 6 — Improve | 30-day review of bookings, usability, performance, search visibility | Prioritize changes based on data and staff feedback |

Scheduling feasibility should precede any design promise about a fully custom booking interface. Calendar migration, if needed, requires a separate reviewed plan for data mapping, upcoming appointments, customer communications, cutover, and rollback.

## Future roadmap

| Priority | Feature | Dependency / reason to add |
| --- | --- | --- |
| Next | Dedicated service pages | Confirmed services, substantial content, and search demand |
| Next | Owner content editing | Frequent menu/gallery changes justify CMS cost and training |
| Next | SMS reminders | Provider capability, owner approval, customer communication preferences, delivery cost |
| Next | Deposits/no-show protection | Approved policy and provider-supported payment/refund behavior |
| Later | Customer account and rebooking | Secure identity-to-provider customer mapping, API rights, observed repeat usage |
| Later | Waitlist | Staff capacity workflow and provider support; avoid promising automatic allocation without validation |
| Later | Loyalty/referrals/gift cards | Owner economics, provider support, and redemption handling |
| Later | Multi-service/group bookings | Exact staff/resource allocation and pricing rules |
| App | iOS/Android booking app | Stable web booking, API feasibility, business case, app ownership and distribution accounts |
| App growth | Push, favorite technician, appointment history, saved preferences | Secure backend, consent/settings, notification lifecycle, customer demand |
| Expansion | Additional languages/locations | Approved translations and independent location schedules/policies |

## Mobile app first release

Proposed screens: welcome/sign-in, services, technician selection, date/time picker, booking review, upcoming appointments, appointment details with change/cancel, notification preferences, and salon contact/directions.

Users can book, modify, or cancel without calling when policy permits. After a change, refresh from the authoritative provider and show the confirmed result. Include empty/error/offline states; do not submit an offline reservation as if it succeeded. Preserve a failed reschedule's original appointment. Handle expired sessions and management links safely. Include sign-out and an account/data deletion workflow appropriate to the selected platform requirements, verified during app planning.

Use one shared booking backend for website custom flows and native apps. Share TypeScript contracts and validation where useful, while designing native navigation and accessibility separately. Begin with provider-managed reminders; custom push/reminders require the server workflow described in the technology plan. Native app pricing and app-store rules will be researched when that phase is approved.

## Launch acceptance and validation

- Content: owner signs off on name/address/phone/hours, services/prices/durations, photos, policies, and profile links. No fabricated review scores, staff facts, or awards.
- Booking: service, staff, date/time, competing slot, duplicate submission, provider failure, reschedule, cutoff, cancellation, confirmation, and reminder cases pass. Staff phone/walk-in entries block online availability.
- Devices: representative iPhone/Safari, Android/Chrome, and desktop browsers; narrow width and zoom; keyboard/screen reader; reduced motion; slow connection.
- SEO: rendered HTML includes core content, metadata/canonicals are correct, structured data validates, sitemap/robots agree with indexability, previews are protected, private routes cannot leak appointments.
- Performance: measure homepage and booking entry; check image sizing, font loading, layout shifts, and external script cost. Assess real-user Core Web Vitals after launch.
- Security: no secrets or customer records in Git; provider credentials server-side if integrated; individual staff access; private management flows tested for unauthorized access.
- Measurement: distinguish booking intent from provider-confirmed completion; no names, contact details, notes, or management tokens in analytics.
- Operations: owner knows how to update hours/prices, block time, handle notification failures, and contact support; fallback booking link/phone works.

Use focused automated tests for scheduling/authentication logic that we own, plus browser checks for critical journeys. Provider behavior needs sandbox/manual validation, not tests that simply assume the vendor works. This documentation-only phase needs link/format/content checks rather than application tests.

## GitHub and documentation workflow

Starting state: empty project folder, no Git repository or remote, Git installed, GitHub CLI unavailable, Git author identity unconfigured. The user subsequently supplied [zdmediacom/madisonhillnails-astra-h](https://github.com/zdmediacom/madisonhillnails-astra-h); its remote was verified empty. Local Git is initialized on `main` with that `origin`. The user supplied author name Leo; use `141753357+zdmediacom@users.noreply.github.com` based on the verified public account ID. Preserve the repository's existing visibility.

First delivery: documentation-only commit after author identity is known, push to the specified authorized repository, and verify the remote commit. If the destination already has content, inspect and reconcile its history; do not force-push. Account authentication must be established through an approved local flow, not credentials pasted into documentation or chat.

GitHub CLI setup: with user approval, installed official `gh` version 2.100.0 for Intel macOS at `~/.local/bin/gh`. Verified the downloaded archive against the SHA-256 digest in the official GitHub release metadata before installation. Use the full executable path if `~/.local/bin` is not on the shell's PATH; no shell startup files were changed. Authentication uses the CLI's browser flow: `~/.local/bin/gh auth login --hostname github.com --git-protocol https --web`. Enter the temporary code only on GitHub's device sign-in page. Never commit tokens or device codes. Reference: [GitHub CLI authentication manual](https://cli.github.com/manual/gh_auth_login).

Later work: small commits tied to approved features; reviewable branches/PRs; documentation updated with scope changes. Add build/type/lint checks and relevant tests when implementation exists. Production deployment remains a separate explicit approval even if GitHub has automatic deployment integrations.

Maintain this plan, decision record, source log, content inventory, architecture decisions, environment-variable names without values, validation evidence, launch/runbook notes, and release history. A Git push is complete only when remote verification succeeds.

## Ongoing ownership

Owner: factual content, services/staff/policies, vendor billing, customer support, production approval. Developer: approved implementation, checks, deploy/runbook, dependency updates under the agreed support arrangement. Staff: daily calendar hygiene and telephone/walk-in entry. Confirm actual responsible people and support budget before launch.

Set a review cadence for holiday hours and price changes, monthly booking/search reports, dependency maintenance, and provider export/restore capability. If custom data storage is introduced, define backup retention, restore checks, monitoring, and incident response before collecting production data.
