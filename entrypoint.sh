#!/bin/sh
set -e

# ─────────────────────────────────────────────────────────────────────────────
# Runtime env injection for NEXT_PUBLIC_* variables.
#
# Next.js bakes NEXT_PUBLIC_* into the JS bundle at build time.
# To support runtime injection, the image is built with a placeholder string.
# This script replaces that placeholder with the real value before starting.
# ─────────────────────────────────────────────────────────────────────────────

PLACEHOLDER="__NEXT_PUBLIC_SERVER_URL__"
RUNTIME_VALUE="${NEXT_PUBLIC_SERVER_URL:-}"

if [ -z "$RUNTIME_VALUE" ]; then
  echo "[entrypoint] WARNING: NEXT_PUBLIC_SERVER_URL is not set — using build placeholder"
else
  echo "[entrypoint] Injecting NEXT_PUBLIC_SERVER_URL at runtime..."
  # Replace in all JS chunks produced by Next.js standalone build
  find /app/.next -type f -name "*.js" | xargs sed -i "s|$PLACEHOLDER|$RUNTIME_VALUE|g"
  echo "[entrypoint] Done."
fi

exec "$@"

