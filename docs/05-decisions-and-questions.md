# Decisions and questions

Updated September 6, 2026.

## Approval record

| Item | Status | Evidence / interpretation |
| --- | --- | --- |
| Plan first; no building yet | Confirmed | User explicitly requested planning only and documentation. |
| MVP includes scheduling | Confirmed | Explicit user requirement. |
| Future app for booking, changes, cancellation, reminders | Confirmed direction | Detailed app scope, cost, and implementation not approved. |
| SEO throughout | Confirmed | Explicit user requirement. |
| Netlify hosting; low expected traffic | Confirmed | Owner selected Netlify; no site setup or deployment authorized yet. |
| Current appointments handled manually | Confirmed | Owner response; exact manual tools, staff count, and operating rules still need discovery. |
| No online payments or deposits in MVP | Confirmed | Owner may add payment options to secure appointments in the future, but not now. |
| Budget | Undecided | Keep initial work, hosting, and booking subscription costs separate; no spending authorized. |
| White background with lots of color | Confirmed preference | Palette, typography, and visual assets remain proposals. |
| One-page concept and parallax | Explore | User suggested these; final designs await approval. |
| Research and project inspection | Authorized | User responded “sounds good, continue” to the proposed research/read-only inspection. |
| Planning files and GitHub push | Authorized within planning scope | User explicitly added “Dont forget to push into github” and supplied `zdmediacom/madisonhillnails-astra-h` and author name Leo. |
| Implementation, vendor accounts, purchases, deployment | Not authorized | Require explicit approval for the next concrete phase. |

## Proposed technical decisions

| ID | Proposal | Reason | Status |
| --- | --- | --- | --- |
| D01 | One-page main experience plus booking/policy routes | Meets visual preference and leaves room for useful SEO pages | Pending |
| D02 | Next.js + TypeScript + Tailwind | Search-friendly rendering and future integration path | Pending |
| D03 | Hosted scheduling first; Square leading candidate | Move from manual appointments to one digital calendar; preserve future API path | Pending staff/service requirements and approved evaluation |
| D04 | Basic guest appointment management and email reminders in MVP | Useful immediately through provider; native app can follow | Proposed scope addition |
| D05 | No custom DB/account system for hosted-booking MVP | Minimize duplicate customer/calendar data | Pending |
| D06 | No online payments, deposits, or card holds in MVP | Owner explicitly deferred payment integration | Confirmed scope; accepted in-person methods still need confirmation |
| D07 | Expo/React Native for future app | Shared language/contracts and iOS/Android support | Future evaluation |
| D08 | CSS/decorative parallax only | Protect readability, motion preferences, and performance | Pending design review |
| D09 | Netlify hosting; evaluate Free first | Owner choice and low expected traffic; monitor actual usage | Host confirmed; plan selection pending |

## Essential open questions

| ID | Question | Needed before |
| --- | --- | --- |
| Q01 | Address resolved by owner: 349 Main St, Madison, NJ 07940. Official phone, hours, and location/map link still need confirmation. | Final copy, schema, directions, launch |
| Q02 | Resolved: user supplied `https://github.com/zdmediacom/madisonhillnails-astra-h`; preserve existing visibility. | Remote configured |
| Q03 | Resolved: author Leo with account-ID GitHub noreply email `141753357+zdmediacom@users.noreply.github.com`; GitHub authentication and repository write access verified. | Complete |
| Q04 | Current scheduling is manual. Confirm the manual tools, staff responsible for calendar entry, service/staff capacity, and existing in-person payment methods. | Provider decision and calendar transition |
| Q05 | What are the official Instagram, Yelp, and Google Business Profile links? | Gallery/reviews/local SEO |
| Q06 | What services, prices, durations, removal/add-ons, bundles, staff qualifications, and shared resources exist? | Scheduling feasibility and service content |
| Q07 | What are staff schedules, breaks, holiday rules, booking notice/horizon, and simultaneous capacity? | Provider configuration |
| Q08 | Instant confirmation or manual approval? Technician choice? Guest booking requirement? | Booking flow approval |
| Q09 | Cancellation/reschedule cutoff, late/no-show policy, and accepted in-person payment methods? Online payments/deposits are deferred. | Policies and provider selection |
| Q10 | Are email/SMS reminders desired at launch; what timing and monthly budget? | Scope and provider plan |
| Q11 | Budget is undecided; Netlify hosting selected and low traffic expected. Confirm domain, logo/photos, launch timing, and affordable provider plan once service/staff needs are known. | Design and delivery estimates |
| Q12 | Must the owner edit the website without a developer? Who maintains calendar and content? | CMS and support decision |

Ask these progressively. Repository destination, address, author name, hosting choice, manual scheduling, and no-payment MVP scope are resolved. Staff/service specifics and official profiles remain needed. Do not guess operational answers or treat silence as approval.

## Session record

- Inspected the workspace and applicable ancestor instruction-file paths; folder was empty and no applicable AGENTS.md was found in those paths.
- Checked Git/GitHub tooling without exposing credentials; Git exists, `gh` was not found, and no Git author name/email was returned.
- Researched public business listings, primary scheduling documentation/prices, SEO guidance, technology documentation, and two design references.
- Found a material address discrepancy and requested missing repository/current-system information.
- Prepared this documentation set for review. No implementation, subscriptions, listing edits, messages to third parties, or deployment performed.
- User supplied `zdmediacom/madisonhillnails-astra-h`. Verified the remote has no refs, initialized local Git on `main`, and configured `origin` using the authorized sandbox escalation flow.
- Checked all seven Markdown files for broken relative links, unclosed code fences, and trailing whitespace; checks passed.
- Owner confirmed street number 349 and commit author Leo. Public GitHub API confirmed account ID 141753357, enabling its standard ID-based noreply email.
- First planning commit created locally: `0f0eb9e` on `main`, authored by Leo with the GitHub noreply email.
- `git push -u origin main` failed: HTTPS could not obtain a GitHub username/credential in this environment. SSH fallback check stopped because GitHub's ED25519 host key is not configured; SSH authentication was not established or tested beyond that point.
- The initial push required a GitHub authentication setup; this blocker was subsequently resolved as recorded below.
- User approved GitHub CLI authentication setup. Installed the official CLI release after SHA-256 verification and initiated browser device sign-in. Installation path and repeatable sign-in instructions are recorded in the delivery plan; no credentials or temporary codes are stored in this repository.
- Browser sign-in completed as `zdmediacom`. Verified the target repository and write access; preserved its existing public visibility. Pushed the initial planning commits to `origin/main` and verified the remote commit matched local `HEAD` (`b6c21d2`). Subsequent documentation commits record this resolution and receive the same push/verification check.
- User required that environment files, secrets, and keys never be uploaded. Added ignore rules, repository instructions, Gitleaks configuration, and pre-commit/pre-push checks; activated hooks locally. Verified GitHub secret scanning and push protection were already enabled. Scanned existing history and tested blocking behavior in an isolated disposable fixture. See [SECURITY.md](../SECURITY.md) for setup, validation, and limitations. These are repository safeguards; website implementation remains unstarted.
- User asked to continue. Continued within planning: prepared structural desktop/mobile wireframes, original draft copy, content inventory, service-entry template, and booking workflow decisions in [the wireframe/content plan](07-wireframes-and-content.md). Requested current booking/POS workflow and budget. No provider choice, operating policy, new design phase, or website implementation was assumed approved.
- Owner then confirmed manual scheduling, no payment integration now, possible appointment-securing payments later, an undecided budget, and Netlify hosting with low expected traffic. Updated MVP scope, hosting/stack/cost recommendations, and the manual-to-digital calendar transition plan. Checked current official Netlify pricing and Next.js support; no account connection, subscription, or deployment performed.
