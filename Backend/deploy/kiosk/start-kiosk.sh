#!/usr/bin/env bash
set -euo pipefail
SERVER_URL="${SERVER_URL:-https://127.0.0.1}"
BROWSER="${BROWSER:-chromium-browser}"
exec "$BROWSER" --kiosk --noerrdialogs --disable-session-crashed-bubble --disable-infobars "${SERVER_URL}/kiosk"
