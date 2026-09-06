# Appointment administration and payment controls

Planning revision, September 6, 2026. Owner-confirmed MVP: a custom website admin dashboard plus saved-card and late-cancellation-fee controls, built but disabled initially. When enabled, customers save a card without an upfront charge. This supersedes the earlier deferred-payment implementation plan. No dashboard, payment integration, account, or live fee has been created or enabled; the project remains in planning.

## Admin area requirements

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| A01 | Secure sign-in | Private admin routes and APIs enforce authenticated staff access server-side; no customer records in public pages, caches, analytics, or Git. Support owner MFA and individual staff accounts. |
| A02 | Calendar and appointment list | Day/week views, date navigation, staff/status filters, and appointment search. Show salon-local times and distinguish booked time from blocked time. |
| A03 | Manually add appointment | Enter customer, service, technician, date/time, duration, and relevant notes. Save into the same authoritative schedule used online, including buffers and required resources. |
| A04 | Modify/reschedule | Edit service, staff, duration, and time with conflict checks; retain the original reservation if the update fails. Show customer notification and any policy/payment implications before confirmation. |
| A05 | Cancel appointment | Record who canceled, timestamp, and reason; retain a canceled record. Release capacity and update notifications. Show applicable fee, waiver, or refund separately from cancellation status. |
| A06 | Block time | Add/remove breaks, time off, and other unavailable periods without inventing customer appointments. Online availability respects these blocks. |
| A07 | Conflict prevention | Concurrent admin and online attempts at overlapping staff/resource capacity cannot both silently succeed. Check at save/confirmation, not only when displaying a time picker. |
| A08 | Roles | Owner can manage staff and payment/policy configuration. Reception/staff get explicitly assigned appointment permissions. Fee waivers/refunds require an authorized role. |
| A09 | Activity log | Record actor, source (online/admin), timestamp, and changed fields for appointments, settings, waivers, and financial actions. Store privately; avoid raw payment credentials and unnecessary personal data in logs. |
| A10 | Configuration | Manage service durations, staff availability, buffers, holidays, booking windows, and cancellation policy. Payment settings have their own effective state and owner-only permissions. |
| A11 | Reliable feedback | Display success only after the authoritative write succeeds; show stale-data/conflict/unavailable states and preserve entered form details when safe. |
| A12 | Customer communications | Confirm creation, modification, and cancellation through the agreed channel. Avoid duplicate messages and obsolete reminders; show delivery failures for staff follow-up. |

Acceptance example: staff add a 60-minute appointment at 2 PM. Online bookings cannot reserve any overlapping time for that technician, including time made unavailable by buffers. If staff move it to 3 PM, the old slot becomes available and the new interval becomes unavailable as one successful operation. Another staff member or customer competing for 3 PM gets a conflict response. Other eligible technicians stay available unless shared resource capacity is exhausted.

The admin interface must not be an independent calendar synchronized only occasionally with online booking. Refresh stale availability for browsing and always validate final writes against the authoritative schedule. Provider APIs sometimes permit staff overrides: disable accidental overbooking in our interface and prove the required behavior in a sandbox.

## Proposed admin navigation

```text
Admin
├── Calendar                 [ Today ] [ Day / Week ] [ Add appointment ]
├── Appointments             Search · date · staff · status
├── Availability             Working hours · breaks · blocked time
├── Services and staff       Duration · eligibility · capacity
├── Booking policies         Lead time · horizon · change/cancel rules
├── Payment settings         Required/off · fee rule · effective policy
└── Activity                 Appointment changes · policy changes · waivers
```

Appointment detail: service/staff/time, booking source, necessary customer contact details, private staff notes, appointment status, applicable policy version, and payment status when that feature exists. Actions: modify, reschedule, cancel, resend an approved confirmation, and authorized waiver/refund when enabled.

The owner selected custom admin within the website. Proposed routes are `/admin`, `/admin/appointments`, `/admin/availability`, and `/admin/settings`. Authentication, authorization, audit storage, and server API work belong in MVP. A provider dashboard may supplement support, but cannot substitute for the requested custom functions. Noindex is additional indexing hygiene, not access control.

## Saved card, no upfront charge

The owner selected card-on-file protection: securely save a card and obtain authorization for the agreed late-cancellation fee, without collecting a deposit or service payment at booking. Label the setting “Require a card to book” so customers understand the behavior. Booking reserves calendar capacity; it does not place an indefinite hold on bank funds.

A suitable candidate is [Stripe Setup Intents](https://docs.stripe.com/payments/setup-intents), which can prepare payment methods for future charges without creating an initial charge. Saving a card for later off-session use requires the corresponding customer agreement; later payments can still fail or require authentication. Processor choice remains subject to scheduler compatibility and owner approval. Store only provider references and limited display data, never raw card details.

[Stripe's authorization documentation](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method) describes time-limited bank authorizations. That is a different feature from the requested saved-card flow. Deposits, full prepayment, and bank-fund holds are outside the selected MVP mode.

## Owner payment and cancellation settings

| Setting | Planned behavior / pending decision |
| --- | --- |
| Card requirement | Built in MVP, initially off; owner can require card setup for future bookings |
| Collection mode | Confirmed: saved card, no upfront charge. Eligible services and any exceptions still need definition |
| Cancellation fees | Built in MVP, initially off; separate enable/disable control. Define treatment of existing fee agreements when disabling |
| Fee window | Configurable hours/days. Owner suggested approximately one week; 7 days is an example pending exact confirmation |
| Fee amount | Fixed amount or percentage; amount, calculation base, and cap not yet supplied |
| Collection action | Automatic policy-based charging versus staff-reviewed enforcement must be selected and supported by the provider |
| Rescheduling | Define whether late rescheduling also triggers a fee and how it affects the original cutoff |
| No-show | Separate rule; a late-cancellation request is not automatically a no-show |
| Waivers/exceptions | Authorized staff can waive a fee with reason and audit record; salon-initiated cancellations should not charge the customer |
| Manual appointments | Apply an agreed rule: secure card-setup link or explicit staff waiver. Never enter card details into notes |
| Effective date | Save a policy version and activation timestamp; show the new policy before confirming applicable bookings |

Turning a switch on is not enough to activate fees. Require a configured processor, tested setup/charge/refund behavior, approved amounts/cutoffs, displayed customer policy, and customer acknowledgement/authorization. Both switches start off. These are acceptance requirements for the requested feature, not permission to configure accounts or collect payments now.

Policy changes apply prospectively by default. Existing appointments retain the terms accepted when booked; no retroactive fee or payment requirement is silently added. Define what happens when an existing appointment is rescheduled under a newer policy and collect any necessary new acknowledgement. Manual legacy bookings with no authorized payment method cannot be autocharged merely because a global toggle was enabled.

## Cancellation timing and fee handling

Proposed calculation for review: store the appointment start as an absolute instant, display it in `America/New_York`, and define a configured window in elapsed hours. If “7 days” means 168 hours, the deadline is start time minus 168 hours. This differs from a same-clock-time calendar-week rule across daylight-saving changes; confirm the intended interpretation.

Example only: for an appointment on September 21, 2026 at 3 PM New York time, a 168-hour deadline is September 14 at 3 PM. Proposed boundary: cancellation received exactly at the deadline is free; later cancellation before the start falls in the fee window. The boundary, fee, and no-show behavior remain unapproved. Use the server's recorded request time, not the browser clock or delayed job execution time.

Bookings made inside the fee window must display that consequence before confirmation. Consider a policy reminder before the free-cancellation deadline, in addition to an appointment reminder; a reminder one day before the appointment would arrive after a seven-day deadline.

The cancellation screen shows the applicable rule, fee estimate, and explicit final action. Cancellation releases the slot even if fee collection fails; show payment due/failed as a separate state. Do not keep a canceled appointment active because a card declined.

Deposits are outside the chosen mode. Charge a qualifying cancellation fee at most once; provide authorized waiver/refund actions with audit records. Salon-initiated cancellations should carry no customer cancellation fee. A fee must never be collected from legacy bookings without the required agreement and payment setup.

## Reliability when payments are implemented

- Keep appointment states (pending, confirmed, canceled, completed/no-show) separate from card-setup states (not required, pending, ready, failed) and fee states (not due, due, waived, collected, failed, refunded).
- If a card is required, reserve capacity with an explicit pending expiry during card setup; abandoned attempts release that capacity. The scheduler must support the chosen mechanism. Confirm only after card setup and the authoritative booking both succeed.
- Successful card setup with failed booking must not produce a charge or confirmation. Reconcile the saved reference/consent and communicate the failed reservation; a saved card is not proof of a booking.
- If an admin manually books for a customer, block capacity immediately under the chosen confirmed/pending state. A card-setup link must have a stated expiry and release/waiver policy. Staff can bypass a required card only under approved permissions.
- Server-side validation, idempotency, verified payment webhooks, duplicate/out-of-order event handling, and a durable retry/reconciliation process prevent duplicate fees and refunds. Do not trigger financial side effects solely from a success-page visit.
- Store processor references and policy acknowledgements, never raw card numbers/CVC. Use provider-hosted or tokenized payment entry, with secrets kept out of GitHub and browser-exposed configuration.

## Provider feasibility and stack impact

Square remains a candidate for hosted booking and provider administration, but the earlier leading recommendation is conditional under this expanded scope. Its [Bookings API guide](https://developer.squareup.com/docs/bookings-api/use-the-api) says services with a non-zero `no_show_fee` cannot be booked through that API and that this fee cannot be configured through the Bookings API. This directly affects custom booking/admin/mobile promises. Do not work around it by removing an agreed customer policy without approval.

[Square's US policy documentation](https://squareup.com/help/us/en/article/5493-set-a-custom-cancellation-policy-with-square-appointments) describes configurable cancellation policies and payment/no-show protection. Dashboard support does not establish equivalent custom API support or automatic fee collection. Verify an approximately seven-day window, staff versus automatic enforcement, manual booking payment handling, and customer rescheduling with the selected mode. Acuity and any other candidate need the same end-to-end validation; no replacement has been selected.

Custom admin is confirmed: keep Next.js/TypeScript on Netlify, add authenticated server endpoints, and evaluate managed authentication plus durable private storage for roles/audit/policy data. Maintain one booking authority; build a custom scheduling engine only after an explicit scope decision. Saved-card setup and fee charging also need feasibility review and cost estimates. Low traffic reduces usage volume but not the correctness requirements of private appointments and charges.

## Required validation before approval to activate

1. Online versus manual booking race, staff edit conflicts, shared-resource limits, and blocked-time behavior.
2. Unauthorized admin/API access, staff permission limits, session expiry, and private-cache behavior.
3. Card requirement and fee collection disabled versus enabled, pending-card-setup expiry, waived manual booking, and legacy appointments without payment authorization.
4. Cancellation just before, exactly at, and just after the cutoff; bookings within the window; DST/timezone cases; late rescheduling; salon cancellation; no-show handled separately.
5. Duplicate cancellation/payment events, charge declined/customer action required, refund failure, and changed policies on existing bookings.
6. Card setup succeeds/booking fails, booking confirmed/notification fails, stale browser tabs, and provider downtime.

Resolved: custom website dashboard; card/fee controls built in MVP and disabled initially; saved card with no upfront charge. Open decisions: exact cutoff and boundary, fee amount/base/cap, automatic versus staff-reviewed enforcement, rescheduling/no-show rules, manual card-setup/waiver process, and staff permissions. Continue planning independent parts; do not activate a guessed policy.
