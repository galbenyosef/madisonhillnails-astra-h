# Madison Hill Nails

Project repository for a colorful, mobile-friendly nail salon website with online scheduling and a future companion app.

**Status:** first MVP implementation built and locally tested, September 6, 2026. Includes the public website, authenticated customer booking, and custom staff dashboard. Live database/email setup and salon operating data are still required before accepting bookings. No hosted service, paid subscription, or production deployment has been provisioned. [Current approved scope and cost constraints](docs/10-approved-build-scope.md) supersede conflicting earlier proposals, including saved cards, guest booking, and Supabase Auth.

**GitHub delivery:** source and documentation belong on [GitHub, branch main](https://github.com/zdmediacom/madisonhillnails-astra-h/tree/main). Active commit/push hooks scan for secrets; environment files and customer data are excluded. Each push is verified against the remote commit.

## Run the website

Use Node 24, then:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The public site works without credentials; online accounts and booking remain unavailable until configured. Read [build/setup instructions](docs/11-build-and-operations.md) and [validation results](docs/12-validation.md) before enabling live booking.

## Read the plan

1. [Product scope and MVP acceptance criteria](docs/01-product-plan.md)
2. [Design direction, page structure, and SEO](docs/02-design-and-seo.md)
3. [Technology, scheduling comparison, and costs](docs/03-technology-and-booking.md)
4. [Roadmap, validation, and operating plan](docs/04-delivery-and-roadmap.md)
5. [Decisions, open questions, and approval record](docs/05-decisions-and-questions.md)
6. [Research sources and business fact checks](docs/06-research.md)
7. [Desktop/mobile wireframes, draft copy, and content checklist](docs/07-wireframes-and-content.md)
8. [Custom admin dashboard and payment/cancellation controls](docs/08-admin-and-payment-controls.md)
9. [Architecture recommendation and prioritized MVP backlog](docs/09-architecture-and-mvp-backlog.md)
10. [Current approved build scope, $0 services, and deferred SMS](docs/10-approved-build-scope.md)
11. [Implementation, private configuration, free services, and operations](docs/11-build-and-operations.md)
12. [Validation results and remaining launch checks](docs/12-validation.md)
13. [Approved editorial redesign, parallax, and image provenance](docs/13-editorial-redesign.md)

## Working agreement

- Ask before starting a new phase or taking actions outside the approved scope.
- Current authorization: build the MVP, document decisions and changes, and push reviewed work to the owner's GitHub repository.
- Obtain explicit approval before purchases, external account setup, production deployment, or work outside the approved scope. Supabase is approved only on its Free plan; no automatic paid upgrade is authorized.
- Document decisions, assumptions, costs, checks, and changes in this repository.
- Keep credentials and customer data out of GitHub.
- Follow [the secret-protection setup and checks](SECURITY.md); activate the repository hooks on every clone.

## Immediate dependencies

- Owner-confirmed address: **349 Main St, Madison, NJ 07940**. The initial street-number discrepancy is resolved; phone, hours, and official profiles still need confirmation.
- GitHub destination: [zdmediacom/madisonhillnails-astra-h](https://github.com/zdmediacom/madisonhillnails-astra-h), branch `main`. Commit author: Leo, using the account's ID-based GitHub noreply email. Git history records committed deliveries; verify remote publication for each push.
- Current scheduling is manual. Plan a staff-assisted move to one digital calendar; confirm the service menu, staffing, and official social profiles.
- Hosting: Netlify, selected by the owner; low traffic expected. Supabase PostgreSQL is approved only on Free, with Better Auth running in our application. All services must remain $0; do not activate paid upgrades or chargeable overages. Email delivery must fit a verified free allowance.
- MVP includes a custom website admin dashboard to add, modify, and cancel appointments against the same schedule used online.
- No card collection, Stripe integration, or automatic cancellation charges in the first release. This supersedes the earlier requirement to build disabled fee controls.
- Require customer login and verified email for online booking. The owner deferred SMS verification to keep all services at $0. Collecting a contact phone number does not make it verified. SMS verification and SMS reminders are future work requiring separate approval.

Earlier planning documents retain proposal history. Use the current scope document for accepted changes. Decisions marked pending must not be treated as approved requirements or verified business facts.
