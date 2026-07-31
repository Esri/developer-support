#!/usr/bin/env bash
# Switch Chromium on this Debian/Raspberry Pi OS build to SwiftShader
# (CPU/software) rendering. Reversed by switch-to-gpu-rendering.sh.
#
# /usr/bin/chromium hardcodes `want_gles=1`, which unconditionally appends
# --use-angle=swiftshader --enable-unsafe-swiftshader unless overridden.
# This is the actual default on this system, so this script just makes sure
# that default is (re)enabled after switch-to-gpu-rendering.sh has run.
set -euo pipefail

CHROMIUM_BIN="/usr/bin/chromium"
BACKUP_BIN="/usr/bin/chromium.bak"

if [ -f "$BACKUP_BIN" ]; then
  echo "==> Restoring $CHROMIUM_BIN from backup ($BACKUP_BIN)"
  sudo cp -a "$BACKUP_BIN" "$CHROMIUM_BIN"
else
  echo "==> No backup found; re-enabling the default directly (want_gles=0 -> 1)"
  sudo sed -i 's/^want_gles=0$/want_gles=1/' "$CHROMIUM_BIN"
fi

echo "==> Restarting Chromium"
pkill -f chromium || true
sleep 1
chromium "$@" &
disown

echo "==> Done. Chromium is back to SwiftShader (CPU) rendering."
