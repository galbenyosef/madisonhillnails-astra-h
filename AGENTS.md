# Repository working rules

- The owner authorized MVP implementation. Follow the current scope in [docs/10-approved-build-scope.md](docs/10-approved-build-scope.md): custom booking/admin, Better Auth for customers/staff, Supabase PostgreSQL on Free only, verified accounts, and no card collection or automatic fees in the first release. All services must remain $0; SMS verification is deferred. Do not enable billing, paid upgrades, or chargeable overages. Ask before production deployment, paid services, or a new phase outside this build.
- Never commit or push environment files, credentials, passwords, API secrets, private keys, customer data, or authentication state. This includes `.env` example/template files; document variable names with empty placeholders in Markdown instead.
- Read [SECURITY.md](SECURITY.md) before committing or pushing. Keep hooks active and run the staged/history checks. Never bypass a failed check with `--no-verify`, force-add ignored files, disable scanning, or add secret allowlists to make a push succeed.
- Keep real configuration in local ignored files or approved deployment secret storage. Never put secrets in browser-exposed variables such as `NEXT_PUBLIC_*`, logs, screenshots, documentation, or tool output.
- If a secret is detected, stop publication. Report only a redacted description and its location. Revoke/rotate an exposed credential before arranging any necessary history cleanup with the owner; deleting the latest copy is insufficient.
- Preserve the user's changes and repository history. Document changes and verify the remote commit after an authorized push.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
