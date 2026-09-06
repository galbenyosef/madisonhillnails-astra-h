# Wireframes, content inventory, and booking decisions

Status: planning draft, September 6, 2026. These are structural wireframes and draft copy, not finished visual designs or a website implementation. The owner has not yet approved the scheduler, service menu, operating policies, or budget.

Confirmed since the first draft: manual scheduling, Netlify with low expected traffic, undecided budget, and a custom website admin dashboard. Saved-card and late-cancellation-fee controls are built in MVP but disabled initially; when enabled, save a card with no upfront charge. See the [admin/payment plan](08-admin-and-payment-controls.md) for the expanded scope.

Read alongside the [design and SEO direction](02-design-and-seo.md), [MVP requirements](01-product-plan.md), and [technology comparison](03-technology-and-booking.md).

## Recommended homepage composition

Keep white as the dominant surface. Introduce coral, lilac, citrus, and mint through small panels, photography backgrounds, and decorative shapes. Reserve berry for the primary booking action so visitors recognize it throughout the page. Use deep plum for readable text.

The homepage should answer three questions early: Where is the salon? What can I book and what does it cost? How do I make an appointment? Place service information before the extended gallery and salon story.

### Desktop wireframe

The drawing shows relative grouping, not fixed dimensions. Content width, spacing, and type sizes will be set in the approved visual design.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Madison Hill Nails       Services  Gallery  About  Visit     [ Book ] │
├──────────────────────────────────────────────────────────────────────┤
│ NAIL SALON · MADISON, NJ              ┌───────────────────────────┐   │
│                                     │                           │   │
│ A little color.                     │ Real nail photography      │   │
│ A little time for you.               │ with one offset detail    │   │
│                                     │                           │   │
│ Short local introduction            └───────────────────────────┘   │
│ [ Book an appointment ]  Services          decorative color shapes  │
│ 349 Main St, Madison, NJ                                             │
├──────────────────────────────────────────────────────────────────────┤
│ Find your next appointment.                                         │
│ ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│ │ Confirmed service group      │  │ Confirmed service group      │   │
│ │ Service / duration / price   │  │ Service / duration / price   │   │
│ │ Short inclusions + Book      │  │ Short inclusions + Book      │   │
│ └──────────────────────────────┘  └──────────────────────────────┘   │
│ Removal/add-on information and link to booking policy               │
├──────────────────────────────────────────────────────────────────────┤
│ A little inspiration for your next visit.                           │
│ ┌────────────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│ │                    │  │ Nail detail  │  │                     │    │
│ │ Featured nail set  │  ├──────────────┤  │ Featured nail set   │    │
│ │                    │  │ Nail detail  │  │                     │    │
│ └────────────────────┘  └──────────────┘  └─────────────────────┘    │
├──────────────────────────────────────────────────────────────────────┤
│ [ Actual salon interior ]        Meet Madison Hill Nails            │
│                                  Short owner-approved introduction  │
├──────────────────────────────────────────────────────────────────────┤
│ Read about our guests' experiences.                                 │
│ [ Approved review / source ] [ Approved review / source ]           │
│ Or use verified profile links until review reuse is approved        │
├──────────────────────────────────────────────────────────────────────┤
│ Visit us in Madison.                  [ Storefront / map preview ]  │
│ Address · confirmed hours · phone                                   │
│ Parking/access details if confirmed   [ Get directions ] [ Call ]    │
├──────────────────────────────────────────────────────────────────────┤
│ Before your visit: accessible FAQ rows                              │
│ Question                                                        +  │
│ Question                                                        +  │
├──────────────────────────────────────────────────────────────────────┤
│ Make time for your next visit.              [ Book an appointment ] │
│ Name · address · social links · booking policy · privacy             │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile wireframe

Use one column for core content. A two-column gallery is optional when images remain legible. The menu includes section anchors; the booking button has a text label. Keep contact actions distinct from the booking action.

```text
┌─────────────────────────────┐
│ Madison Hill Nails   [Menu] │
├─────────────────────────────┤
│ NAIL SALON · MADISON, NJ    │
│ A little color.             │
│ A little time for you.      │
│ Short introduction          │
│ [ Book an appointment ]     │
│ View services               │
│ 349 Main St, Madison, NJ    │
│ ┌─────────────────────────┐ │
│ │ One strong hero image   │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Services                    │
│ Group heading               │
│ Service            Price    │
│ Duration · inclusions       │
│ [ Book this service ]       │
│ More service rows           │
├─────────────────────────────┤
│ Gallery                     │
│ [ Image ]  [ Image ]        │
│ [ Image ]  [ Image ]        │
├─────────────────────────────┤
│ Salon photo + about         │
│ Reviews / profile links     │
│ Address + hours             │
│ [ Directions ] [ Call ]     │
│ FAQ                         │
│ Final booking invitation    │
│ Policies + social links     │
│ Bottom content padding      │
├─────────────────────────────┤
│ [ Book an appointment ]     │
│ Device safe-area spacing    │
└─────────────────────────────┘
```

Proposed sticky-button behavior: appear after the hero booking button leaves view, and hide when the final booking button is visible. On the booking route, use the scheduler's controls instead. This avoids competing actions while keeping booking available through a long page. The static fallback remains a normal link.

### Motion placement

Limit the first motion proposal to a decorative hero swatch and one gallery frame. A small translation as each enters/leaves the viewport is enough to test the desired depth. Do not move headings, prices, buttons, or the booking interface. Native scroll position and reading order remain unchanged. Reduced-motion mode uses the complete static layout.

Approve the static desktop/mobile visual mockups before producing a motion sample. If motion weakens legibility or performance, remove the effect without changing the content hierarchy.

## Draft copy for review

These lines are original proposals. They intentionally avoid unverified services, ratings, staff facts, and offers.

| Placement | Draft |
| --- | --- |
| Page title | Madison Hill Nails \| Nail Salon in Madison, NJ |
| Search description | Plan your next visit to Madison Hill Nails at 349 Main St in Madison, NJ. Explore our services and book an appointment online. |
| Hero eyebrow | Nail salon · Madison, NJ |
| Hero headline | A little color. A little time for you. |
| Hero introduction | Welcome to Madison Hill Nails. Find us at 349 Main St in Madison, NJ, and make time for your next visit. |
| Main button | Book an appointment |
| Secondary link | View services |
| Services heading | Find your next appointment. |
| Gallery heading | A little inspiration for your next visit. |
| About heading | Meet Madison Hill Nails. |
| Visit heading | Visit us in Madison. |
| FAQ heading | Before your visit. |
| Final invitation | Make time for your next visit. |

Use the search description's online-booking claim only once scheduling is operational. Add confirmed service terms naturally to body copy and headings when the menu arrives. The salon name and location remain readable text; the expressive headline should not carry all the identifying information.

## Content inventory

The owner supplies or approves business facts. The developer organizes and formats them. Record content approval dates when assets arrive; placeholder values below must never appear as real prices or operating facts on the live site.

| Item | Needed input | Status / launch handling |
| --- | --- | --- |
| Identity | Salon name and physical address | Confirmed: Madison Hill Nails, 349 Main St, Madison, NJ 07940 |
| Logo | Existing logo/wordmark and permission to use it | Pending; propose a text wordmark if none exists |
| Phone and hours | Public phone, weekly hours, holiday handling | Owner confirmation required |
| Services | Current public menu, inclusions, prices, durations, removal and add-on rules | Required before provider evaluation and service copy approval |
| Booking operations | Current manual tools, staff eligibility, capacity, buffers, time off | Manual scheduling confirmed; specifics required before scheduler selection; document rules without customer data |
| Hero photography | One primary nail image; portrait and landscape crops if available | Owner-approved real work preferred |
| Gallery | 8–12 nail photos, service/style labels, publication permission | Launch with a smaller approved set if necessary |
| Salon imagery | Interior and storefront photos | Required for the proposed layout; owner-approved layout adjustment if unavailable |
| About | Short history/introduction and tone preferences | Pending; no invented claims |
| Reviews | Exact official profile links and any approved excerpts/reuse rights | Use verified links until excerpts are approved |
| Visit details | Parking, entrance, accessibility, map pin | Publish only confirmed details |
| Policies | Booking, lateness, cancellation, payments, communication preferences | Required before scheduling goes live |
| Domain | Preferred domain and ownership | Pending; availability/purchase not performed |
| Content maintenance | Person responsible for prices, hours, gallery, and holiday updates | Determines whether independent editing/CMS belongs in MVP |

Suggested photo brief: natural light, sharp nail detail, uncluttered backgrounds, varied skin tones and styles represented in the salon's actual work, and consistent color treatment. Obtain permission for identifiable people. Avoid screenshots of social feeds when original approved images are available.

### Service entry template

Complete one entry per bookable service or predefined bundle. Use public service labels or non-identifying operational references; do not put private staff/customer records in this public repository.

| Field | Owner input |
| --- | --- |
| Public service name and category | Pending |
| Short description and inclusions | Pending |
| Exact price, starting price, or clearly defined range | Pending |
| Customer appointment duration | Pending |
| Setup/cleanup buffer that also blocks availability | Pending |
| Removal/add-on choices and extra time/cost | Pending |
| Eligible technician roles and shared resource needs | Pending |
| Book online, predefined bundle, or consultation/contact only | Pending |
| Preparation instructions, if relevant | Pending |
| Source menu and owner approval date | Pending |

## Booking entry and customer management

Proposed `/book` layout: salon name, “Book an appointment,” a concise location/time-zone statement, provider booking experience, and an always-available direct booking link/contact fallback. Keep the marketing gallery and parallax off this route. Opening booking should not load an additional full marketing page before the customer can select a service.

The latest [architecture proposal](09-architecture-and-mvp-backlog.md) recommends a custom customer flow backed by the same API as admin. If the owner instead selects hosted scheduling, the provider controls its exact screens. The following is the experience to validate under the approved architecture; no flow has been implemented.

| Step | Customer sees | Required behavior |
| --- | --- | --- |
| Service | Names, durations, transparent prices and applicable add-ons | Correct service/variant carried forward from a homepage link where supported |
| Technician | Any eligible technician or named choice, if approved | Only staff who can perform the service are offered |
| Date/time | Available times and salon-local timezone | Account for service duration, buffers, staff calendar, and resources |
| Details | Necessary contact fields and optional notes | Accessible errors; no separate website account required in the proposed MVP |
| Review | Service, technician, date/time, price, location, and policy | Explicit confirmation. Card requirement off initially; when enabled, complete secure card setup and agree to applicable fees without an upfront charge |
| Result | Provider-confirmed appointment or clear unresolved status | A failed/uncertain submission must not show success or invite repeated blind retries |
| Manage | Secure provider link to view, reschedule, or cancel | Confirm ownership and policy eligibility before changing the appointment |

On reschedule, show the existing appointment, choose a new available time, review, then confirm the move. Do not cancel the existing reservation before a replacement succeeds. On cancellation, show the appointment and applicable policy before an explicit cancel action, then confirm the actual result.

## Operating choices still needed

The initial requirements already list these questions; this table makes the tradeoffs concrete for owner review. Custom admin and saved-card/fee controls in MVP initially off are confirmed; detailed operating rules remain pending.

| Choice | Proposed default to evaluate | What could change it |
| --- | --- | --- |
| Calendar authority | Move manual appointments into one provider calendar for online, phone, and walk-ins | Staff entry and reconciliation must be practical before online booking opens |
| Confirmation | Instant for standardized, reliably timed services | Complex nail art or staffing review may require an explicit request/approval workflow |
| Service combinations | One service or predefined bundle for initial launch | Frequent manicure/pedicure combinations or multi-staff services may require richer scheduling immediately |
| Technician preference | Any eligible technician, with optional named choice | Salon assignment/rotation practices |
| Card and fee controls | Confirmed: implement in MVP, initially off; saved card with no upfront charge | Exact fee policy, processor, and live activation need approval |
| Appointment management | Guest management through secure provider links | Provider limitations; avoid introducing an unnecessary new account |
| Reminder | Provider-managed email; evaluate a 24-hour reminder | Owner preference, appointments booked at short notice, supported channels and costs |
| Cancellation cutoff | No number selected yet | Owner must define policy before customer-facing copy is written |
| Booking notice/horizon | No time window selected yet | Staffing lead time and demand |
| Walk-ins | Staff immediately enter bookings or block capacity | If staff cannot maintain the calendar, real-time online availability is unreliable |

Test a real daily workflow before selection: an online booking arrives, a staff member records a telephone appointment, a walk-in needs the same technician, and an existing customer requests a move. The schedule must remain consistent through each change. If chairs or other resources limit capacity independently of staff, that constraint must be represented too.

## Next review gate

Current scheduling is manual, hosting is Netlify, and budget is undecided. Next obtain the service menu, bookable staff count, and operational rules, then compare the least expensive provider plans that meet those needs. Keep hosting and booking costs separate and obtain approval before spending.

The next proposed design deliverable is a static desktop/mobile visual mockup of the homepage using this structure and the existing palette. Obtain explicit approval before beginning that design phase. Provider account setup, paid tools, website implementation, and production deployment remain separate approval gates. No new subscriptions or dates are committed by this wireframe draft.
