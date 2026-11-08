#!/usr/bin/env bash
set -euo pipefail
SERVER_URL="${SERVER_URL:-https://127.0.0.1}"
BROWSER="${BROWSER:-chromium-browser}"
exec "$BROWSER" --start-fullscreen --autoplay-policy=no-user-gesture-required --noerrdialogs "${SERVER_URL}/display"
