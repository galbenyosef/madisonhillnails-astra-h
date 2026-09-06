#!/usr/bin/env python3
"""Reject ignored tracked files and scan staged changes or all local Git history."""

import shutil
import subprocess
import sys
from pathlib import Path


def git(*args):
    return subprocess.check_output(["git", *args])


def main():
    if sys.argv[1:] not in (["staged"], ["history"]):
        raise SystemExit("Usage: python3 scripts/check-secrets.py staged|history")
    mode = sys.argv[1]
    root = Path(git("rev-parse", "--show-toplevel").decode().strip())
    paths = set(filter(None, git("ls-files", "-z").split(b"\0")))
    if mode == "history":
        for commit in git("rev-list", "--all").decode().splitlines():
            paths.update(filter(None, git("ls-tree", "-r", "--name-only", "-z", commit).split(b"\0")))
    if paths:
        result = subprocess.run(
            ["git", "check-ignore", "--no-index", "--stdin", "-z"],
            input=b"\0".join(sorted(paths)) + b"\0", capture_output=True,
        )
        if result.returncode not in (0, 1):
            raise SystemExit("Cannot verify ignored paths; refusing to continue.")
        if result.stdout:
            print("Blocked: ignored files are tracked or appear in history:", file=sys.stderr)
            for name in filter(None, result.stdout.split(b"\0")):
                print(repr(name.decode(errors="replace")), file=sys.stderr)
            raise SystemExit(1)
    scanner = shutil.which("gitleaks")
    if not scanner:
        local = Path.home() / ".local/bin/gitleaks"
        if local.is_file():
            scanner = str(local)
    if not scanner:
        raise SystemExit("Gitleaks is required. Install it before committing or pushing; see SECURITY.md.")
    command = [
        scanner, "git", "--redact", "--no-banner", "--no-color",
        "--ignore-gitleaks-allow", "--config", str(root / ".gitleaks.toml"),
    ]
    if mode == "staged":
        command += ["--pre-commit", "--staged"]
    else:
        command += ["--log-opts=--all"]
    raise SystemExit(subprocess.run(command, cwd=root).returncode)


if __name__ == "__main__":
    main()
