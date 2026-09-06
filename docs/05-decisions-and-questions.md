# Decisions and questions

Updated September 6, 2026.

## Approval record

| Item | Status | Evidence / interpretation |
| --- | --- | --- |
| Plan first; no building yet | Confirmed | User explicitly requested planning only and documentation. |
| MVP includes scheduling | Confirmed | Explicit user requirement. |
| Future app for booking, changes, cancellation, reminders | Confirmed direction | Detailed app scope, cost, and implementation not approved. |
| SEO throughout | Confirmed | Explicit user requirement. |
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
| D03 | Hosted scheduling first; Square leading candidate | Staff operations and future API access | Pending current-system discovery and trial |
| D04 | Basic guest appointment management and email reminders in MVP | Useful immediately through provider; native app can follow | Proposed scope addition |
| D05 | No custom DB/account system for hosted-booking MVP | Minimize duplicate customer/calendar data | Pending |
| D06 | Pay at salon initially | Keep launch payment flow simple | Pending salon policy |
| D07 | Expo/React Native for future app | Shared language/contracts and iOS/Android support | Future evaluation |
| D08 | CSS/decorative parallax only | Protect readability, motion preferences, and performance | Pending design review |

## Essential open questions

| ID | Question | Needed before |
| --- | --- | --- |
| Q01 | Address resolved by owner: 349 Main St, Madison, NJ 07940. Official phone, hours, and location/map link still need confirmation. | Final copy, schema, directions, launch |
| Q02 | Resolved: user supplied `https://github.com/zdmediacom/madisonhillnails-astra-h`; preserve existing visibility. | Remote configured |
| Q03 | Resolved: author Leo with account-ID GitHub noreply email `141753357+zdmediacom@users.noreply.github.com`; GitHub authentication and repository write access verified. | Complete |
| Q04 | Does the salon use a booking or POS system today? How are phone and walk-in appointments recorded? | Provider decision |
| Q05 | What are the official Instagram, Yelp, and Google Business Profile links? | Gallery/reviews/local SEO |
| Q06 | What services, prices, durations, removal/add-ons, bundles, staff qualifications, and shared resources exist? | Scheduling feasibility and service content |
| Q07 | What are staff schedules, breaks, holiday rules, booking notice/horizon, and simultaneous capacity? | Provider configuration |
| Q08 | Instant confirmation or manual approval? Technician choice? Guest booking requirement? | Booking flow approval |
| Q09 | Cancellation/reschedule cutoff, late/no-show policy, deposits, refunds, and payment methods? | Policies and provider selection |
| Q10 | Are email/SMS reminders desired at launch; what timing and monthly budget? | Scope and provider plan |
| Q11 | What domain, logo/photos, design preferences, launch timing, and implementation/operating budgets exist? | Design and delivery estimates |
| Q12 | Must the owner edit the website without a developer? Who maintains calendar and content? | CMS and support decision |

Ask these progressively. Repository destination, address, and author name are resolved; current booking/profile information remains requested. Do not guess operational answers or treat silence as approval.

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
