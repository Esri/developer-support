#!/usr/bin/env bash
# Disable this Chromium build's default SwiftShader (CPU) override so it uses
# real hardware GL/ANGLE rendering. Reverses switch-to-cpu-rendering.sh.
#
# /usr/bin/chromium hardcodes `want_gles=1` *after* /etc/chromium.d/ is
# sourced, so a chromium.d flags file can't disable it - the only way is to
# patch the wrapper's default directly (or pass --no-gl-override every launch).
set -euo pipefail

CHROMIUM_BIN="/usr/bin/chromium"
BACKUP_BIN="/usr/bin/chromium.bak"

if [ -f "$BACKUP_BIN" ]; then
  echo "==> Backup already exists at $BACKUP_BIN, leaving it in place"
else
  echo "==> Backing up $CHROMIUM_BIN -> $BACKUP_BIN"
  sudo cp -a "$CHROMIUM_BIN" "$BACKUP_BIN"
fi

echo "==> Disabling the default SwiftShader override (want_gles=1 -> 0)"
sudo sed -i 's/^want_gles=1$/want_gles=0/' "$CHROMIUM_BIN"

echo "==> Restarting Chromium"
pkill -f chromium || true
sleep 1
chromium "$@" &
disown

echo "==> Done. Chromium will now use real hardware GL rendering."
