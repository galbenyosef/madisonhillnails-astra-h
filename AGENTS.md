# Repository working rules

- This project is in planning only. Ask the owner before beginning a new phase; do not implement the salon website without approval.
- Never commit or push environment files, credentials, passwords, API secrets, private keys, customer data, or authentication state. This includes `.env` example/template files; document variable names with empty placeholders in Markdown instead.
- Read [SECURITY.md](SECURITY.md) before committing or pushing. Keep hooks active and run the staged/history checks. Never bypass a failed check with `--no-verify`, force-add ignored files, disable scanning, or add secret allowlists to make a push succeed.
- Keep real configuration in local ignored files or approved deployment secret storage. Never put secrets in browser-exposed variables such as `NEXT_PUBLIC_*`, logs, screenshots, documentation, or tool output.
- If a secret is detected, stop publication. Report only a redacted description and its location. Revoke/rotate an exposed credential before arranging any necessary history cleanup with the owner; deleting the latest copy is insufficient.
- Preserve the user's changes and repository history. Document changes and verify the remote commit after an authorized push.
