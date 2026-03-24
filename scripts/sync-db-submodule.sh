#!/usr/bin/env bash
# Force src/app/db to match origin/main; discards local edits and untracked files in the submodule.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB="$ROOT/src/app/db"
BRANCH="main"

git -C "$ROOT" submodule sync --recursive

if ! { [ -f "$DB/.git" ] || [ -d "$DB/.git" ]; }; then
  git -C "$ROOT" submodule update --init -- "$DB"
fi

git -C "$DB" fetch origin "$BRANCH"
git -C "$DB" checkout -f -B "$BRANCH" "origin/$BRANCH"
git -C "$DB" reset --hard "origin/$BRANCH"
git -C "$DB" clean -fd

echo "✓ DB submodule at $(git -C "$DB" rev-parse --short HEAD) (origin/$BRANCH)"
