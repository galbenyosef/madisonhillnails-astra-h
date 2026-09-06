# Secrets and repository safety

The owner requires environment files, secrets, and keys to stay out of GitHub.

## Active safeguards

- `.gitignore` excludes all `.env*`, `*.env`, and `*.env.*` files at any depth, including templates, plus common credential/private-key files, authentication directories, logs, and build outputs.
- The local pre-commit hook rejects ignored paths even if they were force-staged, then scans the staged diff with Gitleaks and redacted output.
- The local pre-push hook rejects ignored paths found in any local ref's history, then scans that history with Gitleaks. A secret in an older commit still blocks a push after its latest copy is deleted.
- Checks fail closed if the scanner is missing or a check errors. Gitleaks inline allow comments are not honored.
- GitHub secret scanning and repository push protection were verified enabled on September 6, 2026. These provide an additional check for supported secret patterns. See [GitHub push protection](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/prevent-future-leaks/enable-push-protection).

Git ignore rules do not protect already tracked files by themselves. Scanner patterns cannot recognize every possible secret, and local hooks require installation on each clone and can technically be bypassed. Review every staged change, keep the checks enabled, and never override a secret warning. No tool can promise that arbitrary sensitive data is always recognizable.

## Setup on each clone

Install Python 3 and [Gitleaks](https://github.com/gitleaks/gitleaks) from its official release or a trusted package manager, then run from the repository root:

```sh
chmod +x .githooks/pre-commit .githooks/pre-push
git config --local core.hooksPath .githooks
python3 scripts/check-secrets.py history
```

This Mac uses Gitleaks 8.30.1 at `~/.local/bin/gitleaks`, installed after verifying the official release archive's SHA-256 digest. The checker also accepts `gitleaks` on PATH. Hooks are configured only for this repository.

## Validation record — September 6, 2026

Scanned the three existing planning commits with Gitleaks: no secrets detected. Confirmed no ignored credential/environment paths in their tracked trees. In an isolated temporary repository with no remote, verified that clean content passes, nested environment/key paths are ignored, a force-staged `.env` is rejected, a synthetic token in an ordinary text file is rejected, and the pre-push check rejects a synthetic token in an earlier commit even after deletion. The fixture was removed; no synthetic token was printed or uploaded. The final safeguard commit is also scanned by the active commit/push hooks.

Before each commit/push, review filenames and changes locally. Manual checks:

```sh
python3 scripts/check-secrets.py staged
python3 scripts/check-secrets.py history
```

Do not add a secret-scanner baseline or allowlist to hide findings. Review false positives and resolve their cause before publication.

## Where configuration belongs

Keep real values in local ignored environment files or approved hosting/CI secret storage. Document only variable names and empty placeholders in Markdown. Public client configuration must contain no secrets. Keep downloaded CLI binaries, login state, and secret scan reports outside this repository. GitHub CLI sign-in is managed locally; do not copy its configuration into project files.

## If a secret is found

Stop the push and describe the affected path without exposing the value. If a credential was exposed, revoke or rotate it with its provider. Determine whether it reached GitHub or any other logs/artifacts. Coordinate history cleanup with the owner when required; do not force-push or rewrite history without approval. Rescan before continuing.
